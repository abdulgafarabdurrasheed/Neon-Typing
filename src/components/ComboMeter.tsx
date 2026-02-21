import { motion, AnimatePresence } from "framer-motion";
import type { GameState } from "../hooks/useGameEngine";

interface Props {
  state: GameState;
}

export default function ComboMeter({ state }: Props) {
  const { combo, comboMeter, isSuperSaiyan, level } = state;

  return (
    <div className="combo-meter-container">
      <div className="combo-info">
        <span className="combo-label">COMBO</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={combo}
            className={`combo-number ${combo >= 10 ? "hot" : ""} ${combo >= 25 ? "fire" : ""}`}
            initial={{ scale: 1.8, y: -10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {combo}x
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="combo-bar-track">
        <motion.div
          className={`combo-bar-fill ${isSuperSaiyan ? "super-saiyan" : ""}`}
          animate={{
            width: `${comboMeter}%`,
            backgroundColor: isSuperSaiyan
              ? [
                  "#ff006e",
                  "#f5f520",
                  "#39ff14",
                  "#00f0ff",
                  "#bf00ff",
                  "#ff006e",
                ]
              : comboMeter > 75
                ? "#ff006e"
                : comboMeter > 50
                  ? "#f5f520"
                  : "#39ff14",
          }}
          transition={
            isSuperSaiyan
              ? {
                  backgroundColor: { duration: 0.8, repeat: Infinity },
                  width: { duration: 0.3 },
                }
              : { duration: 0.3 }
          }
        />
        {isSuperSaiyan && (
          <motion.div
            className="super-saiyan-label"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.1, 1], opacity: 1 }}
            transition={{
              duration: 0.5,
              scale: { repeat: Infinity, duration: 0.6 },
            }}
          >
            ⚡ MAXIMUM OVERDRIVE ⚡
          </motion.div>
        )}
      </div>

      <div className="level-badge">
        <span className="level-label">LVL</span>
        <motion.span
          key={level}
          className="level-number"
          initial={{ scale: 2, color: "#ff006e" }}
          animate={{ scale: 1, color: "#39ff14" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {level}
        </motion.span>
      </div>
    </div>
  );
}