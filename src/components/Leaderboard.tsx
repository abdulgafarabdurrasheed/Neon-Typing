import { motion } from "framer-motion";
import type { LeaderboardEntry } from "../hooks/useLeaderboard";

interface Props {
    entries: LeaderboardEntry[];
    loading: boolean;
    currentUuid: string;
}

export default function Leaderboard({ entries, loading, currentUuid }: Props) {
    if (loading) {
        return (
            <div className="leaderboard-loading">
                <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                >
                    LOADING LEADERBOARD...
                </motion.span>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="leaderboard-empty">
                No scores yet. Be the first!
            </div>
        );
    }

    return (
        <div className="leaderboard">
            <h3 className="leaderboard-title">GLOBAL LEADERBOARD</h3>
            <div className="leaderboard-table">
            <div className="leaderboard-header">
                <span className="lb-rank">#</span>
                <span className="lb-name">NAME</span>
                <span className="lb-wpm">WPM</span>
                <span className="lb-acc">ACC</span>
                <span className="lb-diff">MODE</span>
            </div>
            {entries.slice(0, 20).map((entry) => {
                const isYou = entry.uuid === currentUuid;
                return (
                <motion.div
                    key={entry.uuid}
                    className={`leaderboard-row ${isYou ? "you" : ""} ${entry.rank <= 3 ? "top3" : ""}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: entry.rank * 0.03 }}
                >
                    <span className="lb-rank">
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                    </span>
                    <span className="lb-name">
                    {entry.nickname}
                    {isYou && <span className="lb-you-badge">YOU</span>}
                    </span>
                    <span className="lb-wpm">{entry.wpm}</span>
                    <span className="lb-acc">{entry.accuracy}%</span>
                    <span className="lb-diff">{entry.difficulty.toUpperCase()}</span>
                </motion.div>
                );
            })}
            </div>
        </div>
  );
}