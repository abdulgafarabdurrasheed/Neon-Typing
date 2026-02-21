import { motion, AnimatePresence } from "framer-motion";
import type { GameState } from '../hooks/useGameEngine';

interface Props {
    state: GameState
}

export default function StatsBar({ state }: Props) {
    const { wpm, accuracy, wordsCompleted, elapsed } = state;

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = Math.floor(s % 60);
        return `${mins}:${secs.toString().padStart(1, "0")}`;
    };

    return (
        <div className="stats-bar">
            <div className="stat">
                <span className="stat-label">WPM</span>
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={wpm}
                        className="stat-value wpm"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.15 }} 
                    > {wpm} </motion.span>
                </AnimatePresence>
            </div>

            <div className="stat">
                <span className="stat-label">ACCURACY</span>
                <span className={`stat-value ${accuracy < 80 ? "bad" : accuracy < 95 ? "ok" : "good"}`}>
                    {accuracy}%
                </span>
            </div>

            <div className="stat">
                <span className="stat-label">WORDS</span>
                <span className="stat-value"> {wordsCompleted} </span>
            </div>

            <div className="stat">
                <span className="stat-label">TIME</span>
                <span className="stat-value">{formatTime(elapsed)}</span>
            </div>
        </div>
    );
}