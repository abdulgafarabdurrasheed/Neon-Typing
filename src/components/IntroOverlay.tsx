import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { Difficulty, Theme } from "../data/paragraphs"
import { THEMES } from "../data/paragraphs"; 

interface Props {
  onDismiss: (difficulty: Difficulty, theme: Theme) => void;
  initialStep?: number;
}

const tutorialSteps = [
  {
    icon: "⌨️",
    title: "TYPE TO SURVIVE",
    desc: "Words are coming for you. Type them before your health runs out.",
  },
  {
    icon: "💀",
    title: "DON'T STOP",
    desc: "Your health drains constantly. Every word you type restores it.",
  },
  {
    icon: "⚡",
    title: "BUILD COMBOS",
    desc: "Chain words without errors. Fill the meter to go MAXIMUM OVERDRIVE.",
  },
  {
    icon: "🔊",
    title: "TURN YOUR SOUND UP",
    desc: "This experience is best with audio. Trust us.",
  },
];

const TOTAL_STEPS = tutorialSteps.length + 2; // +1 for theme, +1 for difficulty
const THEME_STEP = tutorialSteps.length;      // index 4
const DIFFICULTY_STEP = tutorialSteps.length + 1; // index 5

export default function IntroOverlay({ onDismiss, initialStep = 0 }: Props) {
  const [step, setStep] = useState(initialStep);
  const [show, setShow] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [theme, setTheme] = useState<Theme>("cyberpunk");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
        else {
          setShow(false);
          setTimeout(() => onDismiss(difficulty, theme), 500);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, onDismiss, difficulty, theme]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="intro-content">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <h1 className="neon-title">
                <span className="neon-green">NEON</span>
                <span className="neon-pink">TYPE</span>
              </h1>
              <p className="tagline">// type to survive</p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                className="intro-step"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {step < tutorialSteps.length && (
                  <>
                    <span className="intro-step-icon">{tutorialSteps[step].icon}</span>
                    <h2 className="intro-step-title">{tutorialSteps[step].title}</h2>
                    <p className="intro-step-desc">{tutorialSteps[step].desc}</p>
                  </>
                )}

                {step === THEME_STEP && (
                  <>
                    <span className="intro-step-icon">🎨</span>
                    <h2 className="intro-step-title">CHOOSE YOUR WORLD</h2>
                    <p className="intro-step-desc">Pick a theme to change the vibe.</p>
                    <div className="theme-buttons">
                      {THEMES.map((t) => (
                        <button
                          key={t.id}
                          className={`theme-btn theme-${t.id} ${theme === t.id ? "selected" : ""}`}
                          onClick={() => setTheme(t.id)}
                        >
                          <span className="theme-emoji">{t.emoji}</span>
                          <span className="theme-name">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === DIFFICULTY_STEP && (
                  <>
                    <span className="intro-step-icon">🎯</span>
                    <h2 className="intro-step-title">SELECT DIFFICULTY</h2>
                    <p className="intro-step-desc">How hard do you want it?</p>
                    <div className="difficulty-buttons">
                      {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                        <button
                          key={d}
                          className={`difficulty-btn ${d} ${difficulty === d ? "selected" : ""}`}
                          onClick={() => setDifficulty(d)}
                        >
                          <span className="diff-name">{d.toUpperCase()}</span>
                          <span className="diff-desc">
                            {d === "easy" && "Lowercase only"}
                            {d === "medium" && "Mixed case, longer words"}
                            {d === "hard" && "Special characters & symbols"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="intro-dots">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={`intro-dot ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
                />
              ))}
            </div>
            <motion.p
              className="intro-prompt"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {step < TOTAL_STEPS - 1
                ? "Press SPACE to continue"
                : "Press SPACE to begin"}
            </motion.p>
          </div>

          <div className="matrix-rain">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="matrix-column"
                style={{
                  left: `${(i / 20) * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 4}s`,
                }}
              >
                {Array.from({ length: 30 }).map((_, j) => (
                  <span key={j} style={{ opacity: Math.random() * 0.3 }}>
                    {String.fromCharCode(0x30a0 + Math.random() * 96)}
                  </span>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
