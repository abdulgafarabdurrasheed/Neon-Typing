import { useEffect, useRef } from "react"

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    radius: number;
    opacity: number;
    color: string;
}

export default function BackgroundFX() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        let animId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const colors = ["#39ff14", "#00f0ff", "#ff006e", "#bf00ff", "#f5f520"];
        const particles: Particle[] = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.15 + 0.05,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));

        let scanY = 0;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            }

            ctx.globalAlpha = 0.03;
            ctx.fillStyle = "#39ff14";
            ctx.fillRect(0, scanY, canvas.width, 2);
            scanY = (scanY + 0.5) % canvas.height;

            ctx.globalAlpha = 1;
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas ref={canvasRef} style={{
            position: "fixed", top: 0, left: 0,
            width: "100%", height: "100%",
            pointerEvents: "none", zIndex: 1,
        }} />
    );
}