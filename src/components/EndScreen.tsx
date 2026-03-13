import { motion } from "framer-motion";
import type { Difficulty, Theme } from "../data/paragraphs";
import { THEMES } from "../data/paragraphs";
import { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";
import { getNickname, setNickname } from "../hooks/useLeaderboard";
import type { LeaderboardEntry } from "../hooks/useLeaderboard";

interface Props {
  wpm: number;
  accuracy: number;
  combo: number;
  wordsCompleted: number;
  elapsed: number;
  difficulty: Difficulty;
  onRestart: (difficulty: Difficulty, theme: Theme) => void;
  onChangeTheme: () => void;
  theme: Theme;
  leaderboardEntries: LeaderboardEntry[];
  leaderboardLoading: boolean;
  currentUuid: string;
  onNicknameUpdate?: () => void;
  onPollLeaderboard?: () => void;
}

function getPercentile(wpm: number): number {
  if (wpm >= 120) return 1;
  if (wpm >= 100) return 2;
  if (wpm >= 80) return 5;
  if (wpm >= 70) return 10;
  if (wpm >= 60) return 20;
  if (wpm >= 50) return 35;
  if (wpm >= 40) return 50;
  if (wpm >= 30) return 70;
  return 85;
}

function getRank(wpm: number): { name: string; color: string; emoji: string } {
  if (wpm >= 120) return { name: "CYBERDEMON", color: "#ff006e", emoji: "👾" };
  if (wpm >= 100)
    return { name: "NEURAL HACKER", color: "#bf00ff", emoji: "🧠" };
  if (wpm >= 80) return { name: "CODE NINJA", color: "#00f0ff", emoji: "⚡" };
  if (wpm >= 60)
    return { name: "SCRIPT KIDDIE+", color: "#39ff14", emoji: "💻" };
  if (wpm >= 40)
    return { name: "SCRIPT KIDDIE", color: "#f5f520", emoji: "🔰" };
  return { name: "N00B", color: "#666", emoji: "🐣" };
}

export default function EndScreen({
  wpm,
  accuracy,
  combo,
  wordsCompleted,
  elapsed,
  difficulty,
  onRestart,
  onChangeTheme,
  theme,
  leaderboardEntries,
  leaderboardLoading,
  currentUuid,
  onNicknameUpdate,
  onPollLeaderboard,
}: Props) {
  const percentile = getPercentile(wpm);
  const rank = getRank(wpm);
  const best = JSON.parse(localStorage.getItem("neontype-best") || "{}");
  const isNewBest = wpm >= (best.wpm || 0);
  const [nickname, setLocalNickname] = useState(getNickname());
  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    if (!onPollLeaderboard) return;
    const interval = setInterval(() => {
      onPollLeaderboard();
    }, 15000);
    return () => clearInterval(interval);
  }, [onPollLeaderboard]);

  const handleNicknameSubmit = async () => {
    await setNickname(nickname, currentUuid);
    setEditingName(false);
    if (onNicknameUpdate) onNicknameUpdate();
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const themeConfig = THEMES.find(t => t.id === theme)!;

  return (
    <motion.div
      className="end-screen-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="end-screen-card"
        initial={{ scale: 0.5, y: 100, rotateX: 45 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="end-title">{themeConfig.gameOverTitle}</h1>
          {isNewBest && (
            <motion.div
              className="new-best-badge"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.8 }}
            >
              ⭐ NEW PERSONAL BEST ⭐
            </motion.div>
          )}

          <div className="end-stats">
            <div className="stat">
              <span className="stat-label">WPM</span>
              <span className="stat-value">{wpm}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{accuracy}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Max Combo</span>
              <span className="stat-value">{combo}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Words Completed</span>
              <span className="stat-value">{wordsCompleted}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Time Elapsed</span>
              <span className="stat-value">{formatTime(elapsed)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Percentile</span>
              <span className="stat-value">{percentile}th</span>
            </div>
            <div className="stat">
              <span className="stat-label">Rank</span>
              <span className="stat-value" style={{ color: rank.color }}>
                {rank.emoji} {rank.name}
              </span>
            </div>
          </div>

          <div className="nickname-section">
            <span className="nickname-label">YOUR NAME:</span>
            {editingName ? (
              <div className="nickname-edit">
                <input
                  className="nickname-input"
                  type="text"
                  value={nickname}
                  onChange={(e) => setLocalNickname(e.target.value.slice(0, 16))}
                  onKeyDown={(e) => e.key === "Enter" && handleNicknameSubmit()}
                  maxLength={16}
                  autoFocus
                />
                <button className="nickname-save-btn" onClick={handleNicknameSubmit}>
                  SAVE
                </button>
              </div>
            ) : (
              <div className="nickname-display">
                <span className="nickname-value">{nickname}</span>
                <button className="nickname-edit-btn" onClick={() => setEditingName(true)}>
                  ✏️
                </button>
              </div>
            )}
          </div>

          <div className="end-actions">
            <button className="restart-btn" onClick={() => onRestart(difficulty, theme)}>
              RESTART [ENTER]
            </button>
            <div className="difficulty-buttons">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  className={`difficulty-btn ${d} ${difficulty === d ? "selected" : ""}`}
                  onClick={() => onRestart(d, theme)}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="change-theme-btn" onClick={onChangeTheme}>
              CHANGE THEME
            </button>
          </div>
          <Leaderboard
            entries={leaderboardEntries}
            loading={leaderboardLoading}
            currentUuid={currentUuid}
          />
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
