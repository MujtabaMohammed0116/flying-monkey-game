/**
 * Sound effects utility using Web Audio API
 * Creates simple beep sounds without requiring audio files
 */

let audioContext: AudioContext | null = null;

/**
 * Initialize audio context (must be called after user interaction)
 */
function getAudioContext(): AudioContext | null {
  if (!audioContext && typeof window !== 'undefined') {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
      return null;
    }
  }
  return audioContext;
}

/**
 * Play a simple beep sound
 */
function playBeep(frequency: number, duration: number, volume: number = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Error playing sound', e);
  }
}

/**
 * Play sound when passing through an obstacle
 */
export function playPassSound() {
  playBeep(523.25, 0.1, 0.2); // C5 note, short duration, low volume
}

/**
 * Play sound when collecting a bonus item
 */
export function playCollectSound() {
  playBeep(783.99, 0.15, 0.25); // G5 note, slightly longer, medium volume
}

/**
 * Play sound on game over
 */
export function playGameOverSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Descending tone for game over
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
    oscillator.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3); // A3
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.warn('Error playing sound', e);
  }
}

/**
 * Play monkey "oo oo aa aa" sound using frequency modulation
 * Synthesizes a primate call with vibrato and pitch bends
 */
export function playMonkeySound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Each "syllable": [startFreq, endFreq, startTime, duration]
    const syllables = [
      { start: 380, end: 520, time: 0.0,  dur: 0.18 }, // "oo"
      { start: 520, end: 360, time: 0.22, dur: 0.18 }, // "oo"
      { start: 420, end: 620, time: 0.48, dur: 0.20 }, // "aa"
      { start: 620, end: 380, time: 0.72, dur: 0.20 }, // "aa"
    ];

    syllables.forEach(({ start, end, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // LFO for vibrato (makes it sound more animal-like)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 8;       // 8Hz vibrato rate
      lfoGain.gain.value = 18;       // vibrato depth in Hz
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";

      // Pitch bend from start to end frequency
      osc.frequency.setValueAtTime(start, ctx.currentTime + time);
      osc.frequency.exponentialRampToValueAtTime(end, ctx.currentTime + time + dur);

      // Volume envelope: quick attack, sustain, quick release
      gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + time + 0.04);
      gain.gain.setValueAtTime(0.28, ctx.currentTime + time + dur - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

      lfo.start(ctx.currentTime + time);
      osc.start(ctx.currentTime + time);
      lfo.stop(ctx.currentTime + time + dur);
      osc.stop(ctx.currentTime + time + dur);
    });
  } catch (e) {
    console.warn("Error playing monkey sound", e);
  }
}
