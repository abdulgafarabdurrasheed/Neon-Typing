import { motion } from 'framer-motion';

interface Props {
    health: number;
}

export default function HealthBar ({ health }: Props) {
    const isLow = health < 30;
    const isCritical = health < 15;

    return (
        <div className="health-bar-container">
            <div className="health-label">
                <span className="health-icon">
                    {isCritical ? "💀" : isLow ? "⚠️" : "❤️"}
                </span>
                <span className="health-text">HEALTH</span>
            </div>
            <div className="health-bar-track">
                <motion.div
                    className={`health-bar-fill ${isLow ? "low" : ""} ${isCritical ? "critical" : ""}`}
                    animate={{
                        width: `${health}%`,
                        backgroundColor: isCritical
                        ? ["#ff0040", "#ff4444", "#ff0040"]
                        : isLow ? "#ff4400"
                        : health > 70 ? "#39ff14" : "#f5f520",
                    }}
                    transition={
                        isCritical
                        ? { backgroundColor: { duration: 0.3, repeat: Infinity }, width: { duration: 0.5 } }
                        : { duration: 0.5 }
                    }
                />
            </div>
            <span className={`health-number ${isLow ? "low" : ""}`}>
                {Math.round(health)}%
            </span>
        </div>
    );
}