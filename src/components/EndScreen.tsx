import { motion } from "framer-motion";

interface Props {
  wpm: number;
  accuracy: number;
  combo: number;
  wordsCompleted: number;
  elapsed: number;
  onRestart: () => void;
}

function getPercentile(wpm: number): number {
  if (wpm >= 120) return 1;
  if (wpm >= 100) return 2;
  if (wpm >= 80) return 5;
  if (wpm >= 70) return 10;
  if (wpm >= 60) return 20;
  if (wpm >= 50) return 35;
  if (wpm >= 40) return 50;
  if (wpm >= 30) return 70;
  return 85;
}

function getRank(wpm: number): { name: string; color: string; emoji: string } {
  if (wpm >= 120) return { name: "CYBERDEMON", color: "#ff006e", emoji: "👾" };
  if (wpm >= 100)
    return { name: "NEURAL HACKER", color: "#bf00ff", emoji: "🧠" };
  if (wpm >= 80) return { name: "CODE NINJA", color: "#00f0ff", emoji: "⚡" };
  if (wpm >= 60)
    return { name: "SCRIPT KIDDIE+", color: "#39ff14", emoji: "💻" };
  if (wpm >= 40)
    return { name: "SCRIPT KIDDIE", color: "#f5f520", emoji: "🔰" };
  return { name: "N00B", color: "#666", emoji: "🐣" };
}

export default function EndScreen({
  wpm,
  accuracy,
  combo,
  wordsCompleted,
  elapsed,
  onRestart,
}: Props) {
  const percentile = getPercentile(wpm);
  const rank = getRank(wpm);
  const best = JSON.parse(localStorage.getItem("neontype-best") || "{}");
  const isNewBest = wpm >= (best.wpm || 0);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="end-screen-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="end-screen-card"
        initial={{ scale: 0.5, y: 100, rotateX: 45 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="end-title">SYSTEM OFFLINE</h1>
          {isNewBest && (
            <motion.div
              className="new-best-badge"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.8 }}
            >
              ⭐ NEW PERSONAL BEST ⭐
            </motion.div>
          )}
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
