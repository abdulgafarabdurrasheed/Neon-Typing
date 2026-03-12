import { useState, useCallback, useRef, useEffect } from "react";
import paragraphs, { type Difficulty, type Theme } from "../data/paragraphs";

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
  difficulty: Difficulty;
  theme: Theme;
}

const INITIAL_HEALTH = 100;
const INITIAL_FALLING_SPEED = 3000;
const COMBO_FILL_PER_WORD = 8;
const SUPER_SAIYAN_DURATION = 5000;

const DIFFICULTY_CONFIG = {
  easy: { healthDrain: 2, healthRestore: 3, comboDrain: 25, errorPenalty: 0 },
  medium: { healthDrain: 3, healthRestore: 2.5, comboDrain: 30, errorPenalty: 0 },
  hard: { healthDrain: 4, healthRestore: 2, comboDrain: 35, errorPenalty: 1 },
};

function pickParagraph(difficulty: Difficulty, theme: Theme): string[] {
  const pool = paragraphs[theme][difficulty];
  return [...pool[Math.floor(Math.random() * pool.length)]];
}

export function useGameEngine() {
  const [state, setState] = useState<GameState>({
    status: "idle",
    difficulty: "easy",
    theme: "cyberpunk",
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

  const onKeyCorrectRef = useRef<(() => void) | undefined>(undefined);
  const onKeyErrorRef = useRef<(() => void) | undefined>(undefined);
  const onWordCompleteRef = useRef<((word: string) => void) | undefined>(undefined);
  const onComboMaxRef = useRef<(() => void) | undefined>(undefined);
  const onComboMilestoneRef = useRef<((combo: number) => void) | undefined>(
    undefined,
  );
  const onGameOverRef = useRef<(() => void) | undefined>(undefined);

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
    onGameOverRef.current?.();
  }, [stopTimers]);

  const startGame = useCallback((difficulty: Difficulty = "easy", theme: Theme = 'cyberpunk') => {
    stopTimers();
    const words = pickParagraph(difficulty, theme);
    const now = Date.now();

    setState({
      status: "playing",
      difficulty,
      theme,
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
        const config = DIFFICULTY_CONFIG[prev.difficulty];
        const drain = config.healthDrain + (prev.level - 1) * 0.5;
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

  const handleInput = useCallback((input: string, spacePressed = false) => {
    setState((prev) => {
      if (prev.status !== "playing") return prev;

      const currentWord = prev.words[prev.currentWordIndex];
      if (!currentWord) return prev;

      const newTypedChars = input;
      const totalChars = prev.totalChars + 1;

      const lastCharIndex = newTypedChars.length - 1;
      const isCorrect =
        lastCharIndex >= 0 &&
        newTypedChars[lastCharIndex] === currentWord[lastCharIndex];

      let correctChars = prev.correctChars;
      let errors = prev.errors;
      let combo = prev.combo;
      let maxCombo = prev.maxCombo;
      let comboMeter = prev.comboMeter;
      let isSuperSaiyan = prev.isSuperSaiyan;

      if (isCorrect) {
        correctChars++;
        combo++;
        maxCombo = Math.max(maxCombo, combo);
        onKeyCorrectRef.current?.();

        if (combo > 0 && combo % 50 === 0) {
          onComboMilestoneRef.current?.(combo);
        }
      } else if (newTypedChars.length > 0) {
        const config = DIFFICULTY_CONFIG[prev.difficulty];
        errors++;
        combo = 0;
        comboMeter = Math.max(0, comboMeter - config.comboDrain);
        isSuperSaiyan = false;
        onKeyErrorRef.current?.();
      }

      const requireSpace = prev.difficulty !== "easy";
      if (newTypedChars === currentWord && (!requireSpace || spacePressed)) {
        const nextIndex = prev.currentWordIndex + 1;
        const wordsCompleted = prev.wordsCompleted + 1;
        const newComboMeter = Math.min(100, comboMeter + COMBO_FILL_PER_WORD);
        const cfg = DIFFICULTY_CONFIG[prev.difficulty];
        const health = Math.min(100, prev.health + cfg.healthRestore);
        const level = Math.floor(wordsCompleted / 10) + 1;
        onWordCompleteRef.current?.(currentWord);

        let newSuperSaiyan = isSuperSaiyan;
        if (newComboMeter >= 100 && !isSuperSaiyan) {
          newSuperSaiyan = true;
          onComboMaxRef.current?.();

          if (superSaiyanTimerRef.current)
            clearTimeout(superSaiyanTimerRef.current);
          superSaiyanTimerRef.current = setTimeout(() => {
            setState((p) => ({ ...p, isSuperSaiyan: false, comboMeter: 50 }));
          }, SUPER_SAIYAN_DURATION);
        }

        let words = prev.words;
        let currentWordIndex = nextIndex;
        if (nextIndex >= prev.words.length) {
          words = pickParagraph(prev.difficulty, prev.theme);
          currentWordIndex = 0;
        }
        return {
          ...prev,
          words,
          currentWordIndex,
          typedChars: "",
          correctChars,
          totalChars,
          errors,
          combo,
          maxCombo,
          comboMeter: newComboMeter,
          isSuperSaiyan: newSuperSaiyan,
          health,
          wordsCompleted,
          level,
          fallingSpeed: Math.max(800, INITIAL_FALLING_SPEED - level * 200),
        };
      }

      return {
        ...prev,
        typedChars: newTypedChars,
        correctChars,
        totalChars,
        errors,
        combo,
        maxCombo,
        comboMeter,
        isSuperSaiyan,
      };
    });
  }, []);

  useEffect(() => () => stopTimers(), [stopTimers]);

  return { 
    state,
    startGame,
    endGame,
    handleInput,
    onKeyCorrectRef,
    onKeyErrorRef,
    onWordCompleteRef,
    onComboMaxRef,
    onComboMilestoneRef,
    onGameOverRef,
   };
}
