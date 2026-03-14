import React from 'react';
import { motion } from 'framer-motion';

interface WpmBarProps {
    currentWpm: number;
    personalBestWpm: number;
    globalBestWpm: number;
    lastWpm?: number;
}

export const WpmBar: React.FC<WpmBarProps> = ({ currentWpm, personalBestWpm, globalBestWpm, lastWpm = 0 }) => {
    const isUserNumberOne = personalBestWpm >= globalBestWpm && globalBestWpm > 0;
    const activeGlobal = isUserNumberOne ? 0 : globalBestWpm;

    const highestActiveWpm = Math.max(currentWpm, personalBestWpm, activeGlobal, lastWpm, 15);
    const scaleMax = highestActiveWpm / 0.95;
    
    const currentPercentage = Math.min((currentWpm / scaleMax) * 100, 100);
    const pbPercentage = Math.min((personalBestWpm / scaleMax) * 100, 100);
    const lastPercentage = Math.min((lastWpm / scaleMax) * 100, 100);
    const globalPercentage = Math.min((globalBestWpm / scaleMax) * 100, 100);

    const beatLast = currentWpm >= lastWpm && lastWpm > 0;
    const beatPB = currentWpm >= personalBestWpm && personalBestWpm > 0;
    const beatGlobal = currentWpm >= globalBestWpm && globalBestWpm > 0;

    const draggedLabels = [];
    if (beatLast && lastWpm !== personalBestWpm) draggedLabels.push("LAST");
    if (beatPB) draggedLabels.push("PB");

    if (isUserNumberOne) {
        if (beatPB) draggedLabels.push("#1");
    } else {
        if (beatGlobal) draggedLabels.push("#1");
    }
    const followText = draggedLabels.join(" + ");

    let fillStatusClass = 'normal';
    if (beatGlobal) fillStatusClass = 'beat-global';
    else if (beatPB) fillStatusClass = 'beat-pb';
    else if (beatLast) fillStatusClass = 'beat-last';

    return (
        <div className="wpm-bar-container">
            <div className="wpm-bar-track">
                
                <motion.div 
                    className={`wpm-bar-fill ${fillStatusClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${currentPercentage}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                />

                <motion.div 
                    className="wpm-marker current-marker"
                    animate={{ left: `${currentPercentage}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                >
                    <span className="marker-label">NOW</span>

                    {followText && (
                      <span 
                          className="marker-label follow-label" 
                          style={{ top: '-28px', color: '#fff', textShadow: '0 0 8px #fff', whiteSpace: 'nowrap' }}
                      >
                          {followText}
                      </span>
                  )}
                    
                    {beatGlobal && !isUserNumberOne && (
                        <span 
                            className="marker-label follow-label" 
                            style={{ top: '-28px', color: '#fff', textShadow: '0 0 8px #fff' }}
                        >
                            #1
                        </span>
                    )}
                </motion.div>

                {lastWpm > 0 && lastWpm !== personalBestWpm && (
                    <div className={`wpm-marker last-marker ${beatLast ? 'passed' : ''}`} style={{ left: `${lastPercentage}%` }}>
                        <div className="marker-line" />
                        {!beatLast && <span className="marker-label">LAST</span>}
                    </div>
                )}

                {personalBestWpm > 0 && (
                    <div className={`wpm-marker pb-marker ${beatPB ? 'passed' : ''}`} style={{ left: `${pbPercentage}%` }}>
                        <div className="marker-line" />
                        {!beatPB && <span className="marker-label">PB</span>}
                    </div>
                )}

                {globalBestWpm > 0 && !isUserNumberOne && (
                    <div className={`wpm-marker global-marker ${beatGlobal ? 'passed' : ''}`} style={{ left: `${globalPercentage}%` }}>
                        <div className="marker-line" />

                        {!beatGlobal && <span className="marker-label">#1</span>}
                    </div>
                )}
            </div>
        </div>
    );
};