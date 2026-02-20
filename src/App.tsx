import { useState, useRef, useEffect, useCallback } from "react";
import { useGameEngine } from "./hooks/useGameEngine";
import "./App.css";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { state, startGame, handleInput } = useGameEngine();

  useEffect(() => {
    if (state.status === "playing") {
      inputRef.current?.focus();
    }
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

  return (
    <div className="app" onClick={() => inputRef.current?.focus()}>
      <h1>NeonType</h1>
      <p>
        Status: {state.status} | Health: {Math.round(state.health)}%
      </p>
      <p>
        Word: {state.words[state.currentWordIndex]} | Typed: {state.typedChars}
      </p>
      <p>
        WPM: {state.wpm} | Combo: {state.combo}x | Level: {state.level}
      </p>
      <button
        onClick={() => {
          setShowIntro(false);
          startGame();
        }}
      >
        Start Game
      </button>
      <input
        ref={inputRef}
        type="text"
        onChange={onInputChange}
        value={state.typedChars}
        disabled={state.status !== "playing"}
      />
    </div>
  );
}

export default App;
