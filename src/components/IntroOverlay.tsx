import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Props {
  onDismiss: () => void;
}

const steps = [
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

export default function IntroOverlay({ onDismiss }: Props) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (step < steps.length - 1) setStep((s) => s + 1);
        else {
          setShow(false);
          setTimeout(onDismiss, 500);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, onDismiss]);

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
                <span className="intro-step-icon">{steps[step].icon}</span>
                <h2 className="intro-step-title">{steps[step].title}</h2>
                <p className="intro-step-desc">{steps[step].desc}</p>
              </motion.div>
            </AnimatePresence>

            <div className="intro-dots">
              {steps.map((_, i) => (
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
              {step < steps.length - 1
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
