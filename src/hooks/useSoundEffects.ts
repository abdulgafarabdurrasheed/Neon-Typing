import { useRef, useCallback } from "react";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  private getMaster(): GainNode {
    this.getCtx();
    return this.masterGain!;
  }

  playThock() {
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 800 + Math.random() * 400;
    bandpass.Q.value = 1.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(bandpass).connect(noiseGain).connect(this.getMaster());
    noise.start(now);
    noise.stop(now + 0.04);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(oscGain).connect(this.getMaster());
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playError() {
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.15);

    const errGain = ctx.createGain();
    errGain.gain.setValueAtTime(0.06, now);
    errGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    const noiseLen = ctx.sampleRate * 0.1;
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuf;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.04, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(errGain).connect(this.getMaster());
    noiseNode.connect(noiseGain).connect(this.getMaster());
    osc.start(now);
    osc.stop(now + 0.15);
    noiseNode.start(now);
    noiseNode.stop(now + 0.1);
  }

  playWordComplete() {
    const ctx = this.getCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const noteGain = ctx.createGain();
      const start = now + i * 0.06;
      noteGain.gain.setValueAtTime(0, start);
      noteGain.gain.linearRampToValueAtTime(0.08, start + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

      osc.connect(noteGain).connect(this.getMaster());
      osc.start(start);
      osc.stop(start + 0.15);
    });
  }

  playSuperSaiyan() {
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain).connect(this.getMaster());
    osc.start(now);
    osc.stop(now + 0.6);

    const osc2 = ctx.createOscillator();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(200, now);
    osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.5);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.02, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc2.connect(gain2).connect(this.getMaster());
    osc2.start(now);
    osc2.stop(now + 0.5);
  }

  playGameOver() {
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 1.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain).connect(this.getMaster());
    osc.start(now);
    osc.stop(now + 1.5);

    const noiseLen = ctx.sampleRate * 1.2;
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      d[i] = (Math.random() * 2 - 1) * (1 - i / noiseLen) * 0.5;
    }
    const ns = ctx.createBufferSource();
    ns.buffer = noiseBuf;

    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.04, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    ns.connect(ng).connect(this.getMaster());
    ns.start(now);
    ns.stop(now + 1.2);
  }

  playComboCallout(combo: number) {
    const milestones: Record<number, string> = {
        50: "fifty combo!",
        100: "one hundred combo! UNSTOPPABLE",
        150: "one fifty! GODLIKE",
        200: "two hundred! INHUMAN",
        250: "two fifty! SUPER SAIYAN",
        300: "three hundred! ULTRA INSTINCT",
        400: "four hundred! DIVINE INTERVENTION",
        500: "five hundred! LEGENDARY"
    };

    const callout = milestones[combo];
    if (!callout) return;

    const utterance = new SpeechSynthesisUtterance(callout);
    utterance.rate = 1.3;
    utterance.pitch = 0.6;
    utterance.volume = 0.7;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
}


export function useSoundEffects() {
    const engineRef = useRef<SoundEngine | null>(null);

    const getEngine = useCallback(() => {
        if (!engineRef.current) engineRef.current = new SoundEngine();
        return engineRef.current;
    }, []);

    return {
        playThock: useCallback(() => getEngine().playThock(), [getEngine]),
        playError: useCallback(() => getEngine().playError(), [getEngine]),
        playWordComplete: useCallback(() => getEngine().playWordComplete(), [getEngine]),
        playSuperSaiyan: useCallback(() => getEngine().playSuperSaiyan(), [getEngine]),
        playGameOver: useCallback(() => getEngine().playGameOver(), [getEngine]),
        playComboCallout: useCallback((c: number) => getEngine().playComboCallout(c), [getEngine]),
    };
}