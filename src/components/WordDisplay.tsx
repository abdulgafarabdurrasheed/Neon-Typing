import { motion, AnimatePresence } from "framer-motion";
import type { GameState } from "../hooks/useGameEngine";
import { useEffect, useRef } from "react";

interface Props {
  state: GameState;
}

export default function WordDisplay({ state }: Props) {
  const { words, currentWordIndex, typedChars, isSuperSaiyan } = state;
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (
      state.status !== "playing" ||
      !state.startTime ||
      !state.ghostData ||
      state.ghostData.length === 0
    ) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = () => {
      const now = Date.now();
      const currentElapsed = now - state.startTime!;

      let nextGhostIdx = state.ghostData.findIndex((g) => g.t > currentElapsed);
      let ghostFrame = null;

      if (nextGhostIdx === -1) {
        ghostFrame = state.ghostData[state.ghostData.length - 1];
      } else if (nextGhostIdx > 0) {
        ghostFrame = state.ghostData[nextGhostIdx - 1];
      }

      const previousGhosts = document.querySelectorAll('.char.ghost');
      previousGhosts.forEach(el => el.classList.remove('ghost'));

      const radarEl = document.getElementById("ghost-radar");

      if (ghostFrame) {
        if (ghostFrame.p === state.paragraphCount) {
          const currentGhostEl = document.querySelector(`span[data-char-index="${ghostFrame.c}"]`);
          if (currentGhostEl) {
            currentGhostEl.classList.add('ghost')
          }
          if (radarEl) radarEl.style.opacity = "0";
        } else {
            if (radarEl) {
              radarEl.style.opacity = "1";
              if (ghostFrame.p > state.paragraphCount) {
                radarEl.innerText = `👻 Ghost is ${ghostFrame.p - state.paragraphCount} paragraph(s) ahead`;
              } else {
                radarEl.innerText = `👻 Ghost is ${state.paragraphCount - ghostFrame.p} paragraph(s) behind`;
              }
            }
          }
      }

      requestRef.current = requestAnimationFrame(animate)
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, [state.status, state.startTime, state.ghostData, state.paragraphCount]);

  const windowStart = Math.max(0, currentWordIndex - 1);
  const windowEnd = Math.min(words.length, currentWordIndex + 8);
  const visibleWords = words.slice(windowStart, windowEnd);
  const charsBeforeWIndow = words
    .slice(0, windowStart)
    .reduce((acc, w) => acc + w.length + 1, 0);
  return (
    <div className={`word-display ${isSuperSaiyan ? "super-saiyan-bg" : ""}`}>
      <div id="ghost-radar" style={{ opacity: 0, transition: "opacity 0.3s", position: "absolute", top: "10px", right: "20px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: "bold" }}></div>
      <div className="words-container">
        <AnimatePresence mode="popLayout">
          {(() => {
            let runningCharIndex = charsBeforeWIndow;
            return visibleWords.map((word, i) => {
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
                    opacity: isCurrent ? 1 : isFuture ? 0.6 : 0.3,
                    y: 0,
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -30,
                    scale: 0.5,
                    filter: "blur(10px)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  layout
                >
                  {(word + " ").split("").map((char, ci) => {
                    const absoluteIndex = runningCharIndex++;

                    const isTyped = isCurrent && ci < typedChars.length;
                    const isCorrect = isTyped && typedChars[ci] === char;
                    const isWrong = isTyped && typedChars[ci] !== char;
                    const isCursor = isCurrent && ci === typedChars.length;

                    return (
                      <span
                        key={ci}
                        data-char-index={absoluteIndex}
                        className={`char ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""} ${isCursor ? "cursor" : ""}`}
                      >
                        {char === " " && isWrong
                          ? typedChars[ci]
                          : char === " "
                            ? "\u00A0"
                            : char}
                      </span>
                    );
                  })}
                </motion.span>
              );
            });
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}
