# NEON TYPE

> A cyberpunk survival typing game built with React, TypeScript, and Vite. Type to survive. Build combos. Go MAXIMUM OVERDRIVE.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?logo=framer&logoColor=white)

---

## What Is This?

**Neon Type** is a high-intensity typing game with a neon-soaked cyberpunk aesthetic. Your health drains constantly, type words to stay alive. Chain correct keystrokes to build combos, fill the combo meter, and unlock **MAXIMUM OVERDRIVE** mode with visual and audio transformations. All sounds are procedurally generated using the Web Audio API, no audio files needed.

The game ends when your health hits zero, revealing a ranked results screen with personal best tracking via `localStorage`.

---

## Features

- **Survival Mechanics**: Health drains every 1.5 seconds; completing words restores HP. Higher levels drain faster.
- **Combo System**: Chain correct keystrokes without errors. Every mistake resets your combo to zero.;
- **MAXIMUM OVERDRIVE**: Fill the combo meter to 100% to trigger a 5-second power-up with pink neon visuals and a rising synth power-up sound.
- **Procedural Audio**: All sound effects (key clicks, errors, word completion chimes, power-up sweeps, game over descent) are synthesized in real-time with the Web Audio API.
- **Speech Callouts**: Hit combo milestones (50, 100, 150, 200, 250, 300, 400, 500) to hear announcements like *"one hundred combo! UNSTOPPABLE"* via the SpeechSynthesis API.
- **Per-Character Feedback**: Correct characters glow neon green, wrong characters flash red with a shake animation, and a blinking cursor marks your position.
- **Particle Explosions**: Completed words burst into character particles that fly outward with physics-based motion.
- **Ranking System**: End-of-game ranks from N00B (<40 WPM) to CYBERDEMON (120+ WPM) with percentile estimates.
- **Personal Best Tracking**: High scores persist in `localStorage` with a "NEW BEST" badge on the end screen.
- **Progressive Difficulty**: Levels increase every 10 words, speeding up health drain.
- **CRT Aesthetic**: Scanline overlay, vignette, Matrix-style Katakana rain on the intro screen, and floating neon particles.
- **Onboarding Intro**: A 4-step interactive tutorial guides new players through the mechanics.

---



## Game Mechanics

### Health

| Parameter | Value |
|---|---|
| Starting health | 100 HP |
| Drain interval | Every 1.5 seconds |
| Drain per tick | 2 + (level - 1) × 0.5 |
| Restore per word | +3 HP |
| Game over | Health reaches 0 |

### Combos

| Parameter | Value |
|---|---|
| Correct keystroke | Combo +1 |
| Error | Combo reset to 0, meter −25 |
| Word completed | Meter +8 |
| Meter max | 100 (triggers MAXIMUM OVERDRIVE) |
| Overdrive duration | 5 seconds, then meter resets to 50 |

### Levels

- Level up every **10 words** completed.
- Each level increases health drain rate.
- Formula: `level = floor(wordsCompleted / 10) + 1`

### WPM & Accuracy

- **WPM** = `(correctChars / 5) / elapsedMinutes` — standard 5-characters-per-word formula.
- **Accuracy** = `correctChars / totalChars × 100`
- Updated every 500ms during gameplay.


## Sound Design

All sounds are procedurally generated using the Web Audio API — zero audio files.

| Sound | Trigger | Description |
|---|---|---|
| **Thock** | Correct key | Noise burst through bandpass filter + sine sweep (150→50Hz). ~40ms. Mimics a mechanical key click. |
| **Error** | Wrong key | Sawtooth wave (90→70Hz) + noise burst. ~150ms. Low buzzy error tone. |
| **Word Complete** | Word finished | Three ascending sine notes — C5, E5, G5 (major chord arpeggio). ~60ms apart. |
| **Super Saiyan** | Overdrive activates | Rising sawtooth sweep (100→800Hz) + square wave (200→1600Hz). ~500ms. Power-up sound. |
| **Game Over** | Health reaches 0 | Descending sawtooth (400→40Hz) over 1.5s + long noise decay. |
| **Combo Callout** | Every 50 combo | SpeechSynthesis announcement (rate 1.3, pitch 0.6). Milestones: 50, 100, 150, 200, 250, 300, 400, 500. |

### Combo Callout Lines

| Combo | Announcement |
|---|---|
| 50 | *"fifty combo!"* |
| 100 | *"one hundred combo! UNSTOPPABLE"* |
| 150 | *"one fifty! GODLIKE"* |
| 200 | *"two hundred! INHUMAN"* |
| 250 | *"two fifty! SUPER SAIYAN"* |
| 300 | *"three hundred! ULTRA INSTINCT"* |
| 400 | *"four hundred! DIVINE INTERVENTION"* |
| 500 | *"five hundred! LEGENDARY"* |

---
#

### CRT Effects

- **Scanlines** — Repeating 2px transparent/dark gradient overlay
- **Vignette** — Radial gradient darkening the edges
- **Screen shake** — 10-step keyframe animation triggered on typing errors
- **Matrix rain** — Katakana characters falling in columns on the intro screen
- **Floating particles** — 60 neon-colored dots drifting across the background canvas

### MAXIMUM OVERDRIVE Mode

When active, the app visually transforms:
- Background shifts to a deep purple radial gradient
- Word display border glows neon pink
- Correct characters turn pink instead of green
- Combo bar cycles through rainbow colors
- A pulsing **"⚡ MAXIMUM OVERDRIVE ⚡"** label appears
- Input display border glows pink

---

### Visual Layer Order (z-index)

| Layer | z-index |
|---|---|
| Background canvas (BackgroundFX) | 1 |
| Game container | 10 |
| Particle canvas | 500 |
| End screen overlay | 800 |
| Vignette | 900 |
| Scanlines | 901 |
| Intro overlay | 999 |

---