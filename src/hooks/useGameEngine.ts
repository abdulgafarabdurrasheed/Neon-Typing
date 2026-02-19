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

  return { state, startGame: () => {}, handleInput: (_s: string) => {} };

}  