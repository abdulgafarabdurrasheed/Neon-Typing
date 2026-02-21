import { motion, AnimatePresence } from "framer-motion";
import type { GameState } from "../hooks/useGameEngine";

interface Props {
  state: GameState;
}

export default function WordDisplay({ state }: Props) {
  const { words, currentWordIndex, typedChars, isSuperSaiyan } = state;
  const windowStart = Math.max(0, currentWordIndex - 1);
  const windowEnd = Math.min(words.length, currentWordIndex + 8);
  const visibleWords = words.slice(windowStart, windowEnd);
  return (
    <div className={`word-display ${isSuperSaiyan ? "super-saiyan-bg" : ""}`}>
      <div className="words-container">
        <AnimatePresence mode="popLayout">
          {visibleWords.map((word, i) => {
            const actualIndex = windowStart + i;
            const isCurrent = actualIndex === currentWordIndex;
            const isPast = actualIndex < currentWordIndex;
            const isFuture = actualIndex > currentWordIndex;

            return (
              <motion.span
                key={`${actualIndex}-${word}`}
                className={`word ${isCurrent ? "current" : ""}
                  ${isPast ? "past" : ""} ${isFuture ? "future" : ""}`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{
                  opacity: isCurrent ? 1 : isFuture ? 0.4 : 0.2,
                  y: 0,
                  scale: isCurrent ? 1.1 : 1,
                }}
                exit={{ opacity: 0, y: -30, scale: 0.5, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                layout
              >
                {isCurrent ? (
                  <>
                    {word.split("").map((char, ci) => {
                      const isTyped = ci < typedChars.length;
                      const isCorrect = isTyped && typedChars[ci] === char;
                      const isWrong = isTyped && typedChars[ci] !== char;
                      const isCursor = ci === typedChars.length;

                      return (
                        <span
                          key={ci}
                          className={`char
                          ${isCorrect ? "correct" : ""}
                          ${isWrong ? "wrong" : ""}
                          ${isCursor ? "cursor" : ""}`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </>
                ) : (
                  word
                )}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}