import { motion } from "framer-motion";
import type { Difficulty, Theme } from "../data/paragraphs";
import { THEMES } from "../data/paragraphs";
import { useState, useEffect, useRef } from "react";
import { toBlob } from "html-to-image";
import Leaderboard from "./Leaderboard";
import { getNickname, setNickname } from "../hooks/useLeaderboard";
import type { LeaderboardEntry } from "../hooks/useLeaderboard";
import Heatmap from "./Heatmap"
import AccuracyGraph from "./AccuracyGraph";

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
  heatmap: Record<string, { hits: number; misses: number }>;
  history: { time: number; wpm: number; accuracy: number }[];
  errorLog: { time: number; expected: string; typed: string }[];
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
  heatmap,
  history,
  errorLog,
}: Props) {
  const percentile = getPercentile(wpm);
  const rank = getRank(wpm);
  const best = JSON.parse(localStorage.getItem("neontype-best") || "{}");
  const isNewBest = wpm >= (best.wpm || 0);
  const [nickname, setLocalNickname] = useState(getNickname());
  const [editingName, setEditingName] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewState, setViewState] = useState<"stats" | "leaderboard" | "heatmap">("stats");

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    setIsCopying(true);
    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);

        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      }
    } catch (err) {
      console.error("Failed to copy image:", err);
      alert("Sorry, copying the image failed. Please try again.");
    } finally {
      setIsCopying(false);
    }
  };

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
  const themeConfig = THEMES.find((t) => t.id === theme)!;

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
          {viewState === "stats" && (
            <>
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

              <AccuracyGraph history={history} errorLog={errorLog} totalTime={elapsed}/>

              <div className="nickname-section">
                <span className="nickname-label">YOUR NAME:</span>
                {editingName ? (
                  <div className="nickname-edit">
                    <input
                      className="nickname-input"
                      type="text"
                      value={nickname}
                      onChange={(e) =>
                        setLocalNickname(e.target.value.slice(0, 16))
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleNicknameSubmit()}
                      maxLength={16}
                      autoFocus
                    />
                    <button
                      className="nickname-save-btn"
                      onClick={handleNicknameSubmit}
                    >
                      SAVE
                    </button>
                  </div>
                ) : (
                  <div className="nickname-display">
                    <span className="nickname-value">{nickname}</span>
                    <button
                      className="nickname-edit-btn"
                      onClick={() => setEditingName(true)}
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>

              <div className="end-actions">
                <button
                  className="restart-btn"
                  onClick={() => onRestart(difficulty, theme)}
                >
                  RESTART [ENTER]
                </button>

                <button
                  className={`share-btn ${copySuccess ? "success" : ""}`}
                  onClick={handleCopyImage}
                  disabled={isCopying}
                >
                  {isCopying
                    ? "COPYING..."
                    : copySuccess
                      ? "COPIED TO CLIPBOARD"
                      : "COPY STAT CARD"}
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
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button className="share-btn" onClick={() => setViewState("leaderboard")}>
                    VIEW LEADERBOARD
                  </button>
                  <button className="share-btn" onClick={() => setViewState("heatmap")}>
                    VIEW HEATMAP
                  </button>
                </div>
              </div>
            </>
          )}

          {viewState === "leaderboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", width: "100%" }}>
              <button className="restart-btn" onClick={() => setViewState("stats")}>
                BACK TO STATS
              </button>
              <Leaderboard
                entries={leaderboardEntries}
                loading={leaderboardLoading}
                currentUuid={currentUuid}
              />
            </div>
          )}

          {viewState === "heatmap" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", width: "100%" }}>
              <button className="restart-btn" onClick={() => setViewState("stats")}>
                BACK TO STATS
              </button>
              <div style={{ marginTop: "1rem" }}>
                <Heatmap heatmap={heatmap} />
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      <div className="share-card-wrapper">
        <div ref={cardRef} className={`share-card theme-${theme}`}>
          <div className="share-card-inner">
            <div className="card-header">
              <h2>
                <span className="neon-green">NEON</span>
                <span className="neon-pink">TYPE</span>
              </h2>
              <span className="card-theme-badge">{themeConfig.name}</span>
            </div>

            <div className="card-rank">
              <span className="card-rank-emoji">{rank.emoji}</span>
              <span className="card-rank-name" style={{ color: rank.color }}>
                {rank.name}
              </span>
            </div>

            <div className="card-stats">
              <div className="card-stat">
                <span className="card-label">WPM</span>
                <span className="card-value neon-cyan">{wpm}</span>
              </div>
              <div className="card-stat">
                <span className="card-label">ACCURACY</span>
                <span className="card-value">{accuracy}%</span>
              </div>
              <div className="card-stat">
                <span className="card-label">COMBO</span>
                <span className="card-value">{combo}</span>
              </div>
            </div>

            <Heatmap heatmap={heatmap} />

            <div className="card-footer">
              play now at neon-type1.netlify.com{" "}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
