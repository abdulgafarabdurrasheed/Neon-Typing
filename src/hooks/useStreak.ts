import { useState, useEffect, useCallback } from 'react';

const STREAK_KEY = "neontype_streak";
const LAST_PLAYED_KEY = "neontype_last_played";

export function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);
    const currentStreak = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);

    if (lastPlayed === today) {
      setStreak(currentStreak);
    } else if (lastPlayed) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastPlayed === yesterday.toDateString()) {
        setStreak(currentStreak);
      } else {
        setStreak(0);
        localStorage.setItem(STREAK_KEY, "0");
      }
    }
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);
    
    if (lastPlayed !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = 1;
      if (lastPlayed === yesterday.toDateString()) {
        newStreak = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10) + 1;
      }
      
      setStreak(newStreak);
      localStorage.setItem(STREAK_KEY, newStreak.toString());
      localStorage.setItem(LAST_PLAYED_KEY, today);
    }
  }, []);

  return { streak, updateStreak };
}