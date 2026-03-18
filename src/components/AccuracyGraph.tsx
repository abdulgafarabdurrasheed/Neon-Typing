import { useEffect, useRef, useState } from "react";

interface Props {
    accuracyHistory: { charIndex: number; accuracy: number }[];
    errorLog: { charIndex: number; expected: string; typed: string }[];
    totalChars: number;
}

export default function AccuracyGraph({ accuracyHistory, errorLog, totalChars }: Props) {
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

        if (accuracyHistory.length === 0) return;

        const paddingX = 40;
        const paddingY = 20;
        const paddingBottom = 30;

        const graphWidth = width - paddingX;
        const graphHeight = height - paddingY - paddingBottom;

        const getX = (charCount: number) => paddingX + (charCount / Math.max(1, totalChars)) * graphWidth;
        const lowest = Math.min(...accuracyHistory.map((h) => h.accuracy));
        const minAcc = Math.max(0, Math.min(95, lowest - 2));
        const maxAcc = 100;
        const getY = (acc: number) => {
            const ratio = (acc - minAcc) / Math.max(1, maxAcc - minAcc);
            return paddingY + graphHeight - ratio * graphHeight;
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "12px var(--font-mono, monospace)";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    
    ctx.fillText("100%", paddingX - 10, getY(100));
    ctx.fillText(`${Math.round((100 + minAcc) / 2)}%`, paddingX - 10, getY((100 + minAcc) / 2));
    ctx.fillText(`${minAcc}%`, paddingX - 10, getY(minAcc));

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("0", paddingX, height - paddingBottom + 10);
    ctx.fillText(`${Math.round(totalChars / 2)}`, paddingX + graphWidth / 2, height - paddingBottom + 10);
    ctx.fillText(`${totalChars}`, paddingX + graphWidth, height - paddingBottom + 10);

    ctx.beginPath();
    ctx.moveTo(paddingX, height - paddingBottom);
    ctx.lineTo(width, height - paddingBottom);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    accuracyHistory.forEach((point, index) => {
      const x = getX(point.charIndex);
      const y = getY(point.accuracy);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#4df3ff";
    ctx.lineWidth = 6;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#4df3ff";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.shadowBlur = 0; 

    errorLog.forEach((err) => {
      const x = getX(err.charIndex);
      
      const matchingPoint = accuracyHistory.find(h => h.charIndex === err.charIndex);
      if (!matchingPoint) return;
      
      const y = getY(matchingPoint.accuracy);

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ff4d4d"; 
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();

      errorCoordinates.current.push({ x, y, data: err });
    });
  }, [accuracyHistory, errorLog, totalChars]);

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
      const distance = Math.sqrt(Math.pow(mouseX - dot.x, 2) + Math.pow(mouseY - dot.y, 2));
      if (distance <= HIT_RADIUS) {
        hovered = { 
          x: dot.x / scaleX, 
          y: dot.y / scaleY, 
          expected: dot.data.expected, 
          typed: dot.data.typed 
        };
        break;
      }
    }
    setHoveredError(hovered);
  };

  return (
    <div style={{ position: "relative", width: "100%", marginTop: "20px" }}>
      <h3 style={{ color: "var(--neon-blue)", opacity: 0.8, fontSize: "1rem", marginBottom: "10px" }}>
        ACCURACY TIMELINE (KEYSTROKES)
      </h3>
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          paddingBottom: "10px",
          borderRadius: "8px",
          border: "1px solid rgba(77, 243, 255, 0.2)",
          background: "rgba(0,0,0,0.3)"
        }}
      >
        <canvas
        ref={canvasRef}
        width={800}
        height={400}
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
      </div>

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
            color: "#fff",
            fontFamily: "var(--font-mono, monospace)",
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