import { motion } from "framer-motion";

interface Props {
  heatmap: Record<string, { hits: number; misses: number }>;
}

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

export default function Heatmap({ heatmap }: Props) {
  const getKeyColor = (char: string) => {
    const stats = heatmap[char];
    if (!stats || (stats.hits === 0 && stats.misses === 0))
      return "rgba(255, 255, 255, 0.05)";

    const accuracy = stats.hits / (stats.hits + stats.misses);

    if (accuracy > 0.9) return "rgba(57, 255, 20, 0.5)";
    if (accuracy > 0.7) return "rgba(245, 245, 32, 0.5)";
    if (accuracy > 0.5) return "rgba(255, 94, 0, 0.5)";
    return "rgba(255, 0, 64, 0.7)";
  };

  return (
    <div className="keyboard-heatmap">
      <p className="heatmap-title">KEY ACCURACY RADAR</p>
      <div className="keyboard-grid">
        {ROWS.map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.map((char) => (
              <motion.div
                key={char}
                className="heatmap-key"
                style={{ backgroundColor: getKeyColor(char) }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {char.toUpperCase()}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
