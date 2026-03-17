import { useEffect, useRef, useState } from "react";

interface Props {
    history: { time: number; wpm: number; accuracy: number }[];
    errorLog: { time: number; expected: string; typed: string }[];
    totalTime: number;
}

export default function AccuracyGraph({ history, errorLog, totalTime }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [hoveredError, setHoveredError] = useState<{
        x: number;
        y: number;
        expected: string;
        typed: string;
    } | null>(null);

    const errorCoordinates = useRef<{ x: number; y: number; data: any }[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        errorCoordinates.current = [];

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        if (history.length === 0) return;

        const paddingY = 20;
        const graphHeight = height - paddingY * 2;

        const getX = (t: number) => (t / totalTime) * width;
        const minAcc = Math.min(80, ...history.map((h) => h.accuracy)) - 5
        const maxAcc = 100;
        const getY = (acc: number) => {
            const ratio = (acc - minAcc) / (maxAcc - minAcc);
            return paddingY + graphHeight - ratio * graphHeight;
        }

        ctx.beginPath();
        history.forEach((point, index) => {
            const x = getX(point.time);
            const y = getY(point.accuracy);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.strokeStyle = "#4df3ff";
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#4df3ff";
        ctx.lineJoin = "round";
        ctx.stroke();

        ctx.shadowBlur = 0;
        errorLog.forEach((err) => {
                const x = getX(err.time);
                const nearestHistory = history.reduce((prev, curr) =>
                    Math.abs(curr.time - err.time) < Math.abs(prev.time - err.time) ? curr : prev
                );
                const y = getY(nearestHistory.accuracy);

                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#ff4d4d';
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.stroke();

                errorCoordinates.current.push({ x, y, data: err });
        });
    }, [history, errorLog, totalTime]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;

            const HIT_RADIUS = 15;
            let hovered = null;

            for (const dot of errorCoordinates.current) {
                const distance = Math.sqrt((Math.pow(mouseX - dot.x, 2) + Math.pow(mouseY - dot.y, 2)));

                if (distance <= HIT_RADIUS) {
                    hovered = {
                        x: dot.x / scaleX,
                        y: dot.y / scaleY,
                        expected: dot.data.expected,
                        typed: dot.data.typed,
                    };
                    break;
                }
            };
            setHoveredError(hovered);
        };

        return (
            <div style={{ position: "relative", width: "100%", marginTop: "20px" }}>
                <h3 style={{ color: "var(--neon-blue)", opacity: 0.8, fontSize: "1rem", marginBottom: "10px" }}>ACCURACY TIMELINE</h3>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={300}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredError(null)}
                    style={{
                    width: "100%",
                    height: "auto",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(77, 243, 255, 0.2)",
                    borderRadius: "8px",
                    cursor: "crosshair"
                    }}
                />
                {hoveredError && (
                    <div 
                        style={{
                            position: "absolute",
                            left: hoveredError.x,
                            top: hoveredError.y - 45,
                            transform: "translateX(-50%)",
                            background: "rgba(20,20,20,0.95)",
                            border: "1px solid #ff4d4d",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            color: "fff",
                            fontFamily: "monospace",
                            pointerEvents: "none",
                            zIndex: 10,
                            whiteSpace: "nowrap"
                        }}
                    >
                        <span style={{color: "#888"}}>Expected:</span> <strong style={{color: "#4df3ff"}}>{hoveredError.expected === ' ' ? 'SPACE' : hoveredError.expected}</strong><br/>
                        <span style={{color: "#888"}}>Typed:</span> <strong style={{color: "#ff4d4d"}}>{hoveredError.typed === ' ' ? 'SPACE' : hoveredError.typed}</strong>
                    </div>
                )}
            </div>
        );
}