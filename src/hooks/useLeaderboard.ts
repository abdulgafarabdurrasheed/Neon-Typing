import { useState, useEffect, useCallback } from "react";

export interface LeaderboardEntry {
  rank: number;
  nickname: string;
  wpm: number;
  accuracy: number;
  maxCombo: number;
  difficulty: string;
  theme: string;
  uuid: string;
}

function getOrCreateUUID(): string {
  let uuid = localStorage.getItem("neontype-uid");
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem("neontype-uid", uuid);
  }
  return uuid;
}

export function getNickname(): string {
  const uuid = getOrCreateUUID().replace(/-/g, "").substring(0, 10).toUpperCase();
  return localStorage.getItem("neontype-nickname") || `ANON${uuid}`;
}

export async function setNickname(name: string, uuid: string) {
  const safeName = name.slice(0, 16);
  localStorage.setItem("neontype-nickname", safeName);
  try {
    await fetch("/.netlify/functions/update-name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid, nickname: safeName }),
    });
  } catch (error) {
    console.error("Failed to update nickname in DB", error);
  }
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const uuid = getOrCreateUUID();

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.leaderboard || []);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, []);
  const submitScore = useCallback(async (score: {
    wpm: number;
    accuracy: number;
    maxCombo: number;
    wordsCompleted: number;
    difficulty: string;
    theme: string;
  }) => {
    setSubmitting(true);
    try {
      await fetch("/.netlify/functions/submit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid,
          nickname: getNickname(),
          ...score,
        }),
      });
      await fetchLeaderboard();
    } catch {
        //
    } finally {
      setSubmitting(false);
    }
  }, [uuid, fetchLeaderboard]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    entries,
    loading,
    submitting,
    uuid,
    submitScore,
    fetchLeaderboard,
  };
}
