/**
 * Ultra-light Web Audio API based sound effects (no external files needed!)
 * Works across all modern browsers without needing to load audio files.
 */

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08) {
  const ctx = getAudioCtx();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio ctx is suspended or unavailable
  }
}

export const sounds = {
  /** Short positive "ding" - for copy, likes, selections */
  ding: () => {
    playTone(880, 0.12, 'sine', 0.06);
    setTimeout(() => playTone(1100, 0.1, 'sine', 0.04), 80);
  },

  /** Rewarding "level up" chime */
  levelUp: () => {
    playTone(523, 0.1, 'sine', 0.07);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.07), 100);
    setTimeout(() => playTone(784, 0.1, 'sine', 0.07), 200);
    setTimeout(() => playTone(1047, 0.3, 'sine', 0.08), 300);
  },

  /** Soft "pop" click for interactions */
  pop: () => {
    playTone(800, 0.05, 'triangle', 0.05);
  },

  /** Error low buzz */
  error: () => {
    playTone(200, 0.15, 'sawtooth', 0.04);
    setTimeout(() => playTone(150, 0.15, 'sawtooth', 0.04), 120);
  },

  /** Daily reward coin gain */
  coin: () => {
    playTone(988, 0.08, 'sine', 0.07);
    setTimeout(() => playTone(1319, 0.08, 'sine', 0.07), 80);
    setTimeout(() => playTone(1568, 0.08, 'sine', 0.07), 160);
    setTimeout(() => playTone(1976, 0.2, 'sine', 0.08), 240);
  },
};
