import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameEngine } from "./hooks/useGameEngine";
import WordDisplay from "./components/WordDisplay";
import ComboMeter from "./components/ComboMeter";
import HealthBar from "./components/HealthBar";
import StatsBar from "./components/StatsBar";
import EndScreen from "./components/EndScreen";
import IntroOverlay from "./components/IntroOverlay";
import "./App.css";
import BackgroundFX from "./components/BackgroundFX";
import ParticleEmitter from "./components/ParticleCanvas";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordDisplayRef = useRef<HTMLDivElement>(null);
  const emitterRef = useRef<ParticleEmitter | null>(null);

  const {
    state,
    startGame,
    handleInput,
    onKeyCorrect,
    onKeyError,
    onWordComplete,
    onComboMax,
    onComboMilestone,
    onGameOver,
  } = useGameEngine();

  useEffect(() => {
    onKeyError.current = () => {
      setShake(true);
      setTimeout(() => setShake(false), 200);
    };
  });

  useEffect(() => {
    emitterRef.current = ParticleEmitter.getInstance();
  }, []);

  useEffect(() => {
    onWordComplete.current = (word: string) => {
      const wordEl = wordDisplayRef.current?.querySelector(".word.current");
      if (wordEl && emitterRef.current) {
        const rect = wordEl.getBoundingClientRect();
        emitterRef.current.explode(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          word,
          state.isSuperSaiyan,
        );
      }
    };
  });

  useEffect(() => {
    if (state.status === "playing") inputRef.current?.focus();
  }, [state.status]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state.status === "gameover" && e.key === "Enter") startGame();
      if (state.status === "playing") inputRef.current?.focus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.status, startGame]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val.endsWith(" ")) {
        handleInput(val.trimEnd());
        return;
      }
      handleInput(val);
    },
    [handleInput],
  );

  const handleDismissIntro = useCallback(() => {
    setShowIntro(false);
    startGame();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [startGame]);

  return (
    <div
      className={`app ${shake ? "shake" : ""} ${state.isSuperSaiyan ? "super-saiyan-mode" : ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      <AnimatePresence>
        {showIntro && <IntroOverlay onDismiss={handleDismissIntro} />}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          className="game-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="game-header">
            <h1 className="logo">
              <span className="neon-green">NEON</span>
              <span className="neon-pink">TYPE</span>
            </h1>
            <StatsBar state={state} />
          </header>

          <HealthBar health={state.health} />
          <div ref={wordDisplayRef}>
            <WordDisplay state={state} />
          </div>

          <input
            ref={inputRef}
            className="hidden-input"
            type="text"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            onChange={onInputChange}
            value={state.typedChars}
            disabled={state.status !== "playing"}
          />

          <ComboMeter state={state} />

          <div className="input-display">
            <span className="input-prefix">&gt;_</span>
            <span className="input-text">{state.typedChars}</span>
            <motion.span
              className="input-cursor"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              █
            </motion.span>
          </div>

          <AnimatePresence>
            {state.status === "gameover" && (
              <EndScreen
                wpm={state.wpm}
                accuracy={state.accuracy}
                combo={state.maxCombo}
                wordsCompleted={state.wordsCompleted}
                elapsed={state.elapsed}
                onRestart={startGame}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="vignette" />
      <div className="scanlines" />

      {!showIntro && <BackgroundFX />}
    </div>
  );
}

export default App;
