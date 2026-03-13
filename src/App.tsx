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
import { useSoundEffects } from "./hooks/useSoundEffects";
import confetti from "canvas-confetti";
import type { Difficulty, Theme } from "./data/paragraphs"
import { useLeaderboard } from "./hooks/useLeaderboard";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordDisplayRef = useRef<HTMLDivElement>(null);
  const emitterRef = useRef<ParticleEmitter | null>(null);
  
  const {
    entries: leaderboardEntries,
    loading: leaderboardLoading,
    uuid: currentUuid,
    submitScore,
    fetchLeaderboard,
  } = useLeaderboard();

  const {
    state,
    startGame,
    handleInput,
    onKeyCorrectRef,
    onKeyErrorRef,
    onWordCompleteRef,
    onComboMaxRef,
    onComboMilestoneRef,
    onGameOverRef,
  } = useGameEngine();

  useEffect(() => {
    emitterRef.current = ParticleEmitter.getInstance();
  }, []);

  useEffect(() => {
    if (state.status === "playing") inputRef.current?.focus();
  }, [state.status]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state.status === "gameover" && e.key === "Enter") startGame(state.difficulty, state.theme);
      if (state.status === "playing") inputRef.current?.focus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.status, state.difficulty, state.theme, startGame]);

  const sound = useSoundEffects();

  useEffect(() => {
    if (state.status === "gameover" && state.wpm > 0) {
      submitScore({
        wpm: state.wpm,
        accuracy: state.accuracy,
        maxCombo: state.maxCombo,
        wordsCompleted: state.wordsCompleted,
        difficulty: state.difficulty,
        theme: state.theme,
      });
    }
  }, [state.status, state.wpm, state.accuracy, state.maxCombo, state.wordsCompleted, state.difficulty, state.theme, submitScore]);

  useEffect(() => {
    onKeyCorrectRef.current = () => sound.playThock();
    onKeyErrorRef.current = () => {
      sound.playError();
      setShake(true);
      setTimeout(() => setShake(false), 200);
    };
    onWordCompleteRef.current = (word: string) => {
      sound.playWordComplete();
      confetti({
        particleCount: 8,
        spread: 40,
        origin: { y: 0.6 },
        colors: ["#39ff14", "#00f0ff", "#f5f520"],
        gravity: 1.5,
        ticks: 80,
        scalar: 0.6,
        disableForReducedMotion: true,
      });
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

    onComboMaxRef.current = () => {
      sound.playSuperSaiyan();
      const duration = 1000;
      const end = Date.now() + duration;
      const interval = setInterval(() => {
        confetti({
          particleCount: 30,
          angle: 60 + Math.random() * 60,
          spread: 80,
          origin: { x: Math.random(), y: Math.random() * 0.5 },
          colors: ["#ff006e", "#bf00ff", "#f5f520", "#00f0ff"],
        });
        if (Date.now() > end) clearInterval(interval);
      }, 100);
    }

    onComboMilestoneRef.current = (c: number) => sound.playComboCallout(c);
    onGameOverRef.current = () => {
      sound.playGameOver();
    }
  });

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val.endsWith(" ")) {
        const trimmed = val.trimEnd();
        if (trimmed.length === 0) return
        handleInput(trimmed, true);
        return;
      }
      handleInput(val, false);
    },
    [handleInput],
  );

  const handleDismissIntro = useCallback((difficulty: Difficulty, theme: Theme) => {
    setShowIntro(false);
    startGame(difficulty, theme);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [startGame]);

  return (
    <div
      className={`app theme-${state.theme} ${shake ? "shake" : ""} ${state.isSuperSaiyan ? "super-saiyan-mode" : ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      <AnimatePresence>
        {showIntro && (
          <IntroOverlay
            onDismiss={handleDismissIntro}
            initialStep={state.status === "gameover" ? 4 : 0}
          />
        )}
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
                difficulty={state.difficulty}
                theme={state.theme}
                onRestart={(d, t) => startGame(d, t)}
                onChangeTheme={() => setShowIntro(true)}
                leaderboardEntries={leaderboardEntries}
                leaderboardLoading={leaderboardLoading}
                currentUuid={currentUuid}
                onNicknameUpdate={fetchLeaderboard}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="vignette" />
      <div className="scanlines" />

      {!showIntro && <BackgroundFX theme={state.theme} />}
    </div>
  );
}

export default App;
