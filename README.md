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



## Performance & Architecture Optimizations

During V2 development, the game encountered a catastrophic performance leak that exhausted the browser's memory and rapidly depleted the backend serverless quota. Here is how the engine was re-architected for speed and stability.

### The Initial Memory & Quota Leak
- **The Quota Drain:** Originally, the end-game screen used a `setInterval` to periodically poll the leaderboard database every 15 seconds. This aggressive background fetching quickly burned through the initial Netlify serverless API quota, forcing a full migration to a new account.
- **The V8 Integer Overflow:** In an attempt to pause the background polling indefinitely and protect the new account, a massive delay was appended to the `setInterval`. Unfortunately, the value exceeded JavaScript's 32-bit signed integer limit (2,147,483,647 ms). The V8 engine overflowed this value, defaulting the interval to 1 millisecond. This commanded the browser to fire 1,000 requests per second.
- **The React Lifecycle Loop:** Simultaneously, a state-feedback loop in the `useEffect` hook caused the game's `submitScore` function to trap the parent component in an infinite re-render cycle upon game over.
- **The Impact:** The client fired thousands of requests in seconds, resulting in Chrome kernel panics, local memory exhaustion, and 502 Bad Gateway / 429 Too Many Requests errors from the backend.

### The Fixes & Optimizations
- **Manual Polling UX (Network Optimization):** The automated `setInterval` polling was ripped out entirely and replaced with a deliberate "Refresh Leaderboard" UI button. This prevents unnecessary background fetching while a user is simply reviewing their telemetry and heatmaps, completely eliminating the passive background drain.
- **Client-Side State Padlocking (Memory Optimization):** The end-game component lifecycle was fully re-architected. Using a strict boolean `hasSubmitted` lock inside the `useEffect` dependency array, the infinite re-render spiral was broken. This optimization instantly dropped network bandwidth from 4,000+ requests per second down to exactly 1 request per game.
- **Backend Rate-Limiting (Infrastructure Optimization):** Engineered a server-side shield using Upstash Redis to protect the Netlify environment. The serverless function now checks a `ratelimit:{uuid}` key and enforces a strict 10-second cooldown window, ensuring the API cannot be spammed even if the client is compromised.
- **Compiler Cleanup:** Stripped unused TypeScript interfaces and unnecessary prop drilling to drastically reduce the final Vite build size and unblock strict deployment pipelines.

### The Result
A perfectly stable, lightweight typing engine that runs flawlessly even on a low-end 4GB RAM machine. Network requests are reduced by 99%, the external API quotas are shielded, and the React UI remains buttery smooth—even when rendering hundreds of physics-based 2D particle explosions on top of the DOM.

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