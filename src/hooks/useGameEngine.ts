import { useState, useCallback, useRef, useEffect } from "react";
import paragraphs from "../data/paragraphs";

export interface GameState {
  status: "idle" | "playing" | "gameover";
  words: string[];
  currentWordIndex: number;
  typedChars: string;
  correctChars: number;
  totalChars: number;
  errors: number;
  combo: number;
  maxCombo: number;
  comboMeter: number;
  isSuperSaiyan: boolean;
  wpm: number;
  accuracy: number;
  startTime: number | null;
  elapsed: number;
  health: number;
  wordsCompleted: number;
  level: number;
  fallingSpeed: number;
}

const INITIAL_HEALTH = 100;
const INITIAL_FALLING_SPEED = 3000;
const COMBO_FILL_PER_WORD = 8;
const COMBO_DRAIN_ON_ERROR = 25;
const HEALTH_DRAIN_PER_TICK = 2;
const HEALTH_RESTORE_PER_WORD = 3;
const SUPER_SAIYAN_DURATION = 5000;

function pickParagraph(): string[] {
  return [...paragraphs[Math.floor(Math.random() * paragraphs.length)]];
}

export function useGameEngine() {
  const [state, setState] = useState<GameState>({
    status: "idle",
    words: [],
    currentWordIndex: 0,
    typedChars: "",
    correctChars: 0,
    totalChars: 0,
    errors: 0,
    combo: 0,
    maxCombo: 0,
    comboMeter: 0,
    isSuperSaiyan: false,
    wpm: 0,
    accuracy: 100,
    startTime: null,
    elapsed: 0,
    health: INITIAL_HEALTH,
    wordsCompleted: 0,
    level: 1,
    fallingSpeed: INITIAL_FALLING_SPEED,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const healthTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const superSaiyanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  const onKeyCorrect = useRef<(() => void) | undefined>(undefined);
  const onKeyError = useRef<(() => void) | undefined>(undefined);
  const onWordComplete = useRef<(() => void) | undefined>(undefined);
  const onComboMax = useRef<(() => void) | undefined>(undefined);
  const onComboMilestone = useRef<((combo: number) => void) | undefined>(
    undefined,
  );
  const onGameOver = useRef<(() => void) | undefined>(undefined);

  const stopTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (healthTimerRef.current) clearInterval(healthTimerRef.current);
    if (superSaiyanTimerRef.current) clearTimeout(superSaiyanTimerRef.current);
    timerRef.current = null;
    healthTimerRef.current = null;
    superSaiyanTimerRef.current = null;
  }, []);

  const endGame = useCallback(() => {
    stopTimers();
    setState((prev) => {
      const elapsed = prev.startTime ? (Date.now() - prev.startTime) / 1000 : 0;
      const minutes = elapsed / 60;
      const wpm = minutes > 0 ? Math.round(prev.correctChars / 5 / minutes) : 0;
      const accuracy =
        prev.totalChars > 0
          ? Math.round((prev.correctChars / prev.totalChars) * 100)
          : 100;

      const best = JSON.parse(localStorage.getItem("neontype-best") || "{}");
      if (!best.wpm || wpm > best.wpm) {
        localStorage.setItem(
          "neontype-best",
          JSON.stringify({
            wpm,
            accuracy,
            combo: prev.maxCombo,
            words: prev.wordsCompleted,
          }),
        );
      }

      return { ...prev, status: "gameover", wpm, accuracy, elapsed };
    });
    onGameOver.current?.();
  }, [stopTimers]);

  const startGame = useCallback(() => {
    stopTimers();
    const words = pickParagraph();
    const now = Date.now();

    setState({
      status: "playing",
      words,
      currentWordIndex: 0,
      typedChars: "",
      correctChars: 0,
      totalChars: 0,
      errors: 0,
      combo: 0,
      maxCombo: 0,
      comboMeter: 0,
      isSuperSaiyan: false,
      wpm: 0,
      accuracy: 100,
      startTime: now,
      elapsed: 0,
      health: INITIAL_HEALTH,
      wordsCompleted: 0,
      level: 1,
      fallingSpeed: INITIAL_FALLING_SPEED,
    });

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.status !== "playing" || !prev.startTime) return prev;
        const elapsed = (Date.now() - prev.startTime) / 1000;
        const minutes = elapsed / 60;
        const wpm =
          minutes > 0 ? Math.round(prev.correctChars / 5 / minutes) : 0;

        return { ...prev, elapsed, wpm };
      });
    }, 500);

    healthTimerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.status !== "playing") return prev;
        const drain = HEALTH_DRAIN_PER_TICK + (prev.level - 1) * 0.5;
        const newHealth = Math.max(0, prev.health - drain);
        if (newHealth <= 0) return { ...prev, health: 0 };
        return { ...prev, health: newHealth };
      });

      setTimeout(() => {
        if (
          stateRef.current.health <= 0 &&
          stateRef.current.status === "playing"
        ) {
          endGame();
        }
      }, 0);
    }, 1500);
  }, [stopTimers, endGame]);

  return { state, startGame: () => {}, handleInput: (_s: string) => {} };
}
