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
