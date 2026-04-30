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
 * Play cartoon monkey sound.
 * Tries to load /sounds/monkey.mp3 first (real sound file).
 * Falls back to synthesized cartoon sound if file not found.
 */
export function playMonkeySound() {
  // Try real audio file first
  if (typeof window !== 'undefined') {
    const audio = new Audio('/sounds/monkey.mp3');
    audio.volume = 0.8;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // File not found or blocked - fall back to synthesized sound
        playMonkeySoundSynthesized();
      });
    }
    return;
  }
  playMonkeySoundSynthesized();
}

/**
 * Synthesized cartoon monkey sound fallback.
 * Uses layered oscillators + noise + rapid pitch hops for a
 * more cartoon-like "eek eek chatter" effect.
 */
function playMonkeySoundSynthesized() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Master gain
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    // ── Chatter bursts: rapid high-pitched squeaks ──
    // Cartoon monkeys have fast, high, erratic calls
    const chatters = [
      { freq: 900,  time: 0.00, dur: 0.07 },
      { freq: 1100, time: 0.09, dur: 0.07 },
      { freq: 800,  time: 0.18, dur: 0.07 },
      { freq: 1050, time: 0.27, dur: 0.07 },
      { freq: 950,  time: 0.36, dur: 0.07 },
      // "aa aa" lower calls
      { freq: 480,  time: 0.50, dur: 0.14 },
      { freq: 380,  time: 0.67, dur: 0.14 },
      { freq: 520,  time: 0.84, dur: 0.14 },
    ];

    chatters.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // LFO for wobble
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 12;
      lfoGain.gain.value = freq * 0.08; // 8% pitch wobble
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(gain);
      gain.connect(master);
      osc.type = 'sine';

      // Pitch slide up then down (cartoon bounce)
      osc.frequency.setValueAtTime(freq * 0.85, ctx.currentTime + time);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, ctx.currentTime + time + dur * 0.4);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.9, ctx.currentTime + time + dur);

      // Sharp attack, quick decay
      gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

      lfo.start(ctx.currentTime + time);
      osc.start(ctx.currentTime + time);
      lfo.stop(ctx.currentTime + time + dur + 0.01);
      osc.stop(ctx.currentTime + time + dur + 0.01);
    });

    // ── Breath/noise layer for texture ──
    const bufferSize = ctx.sampleRate * 1.2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 800;
    bandpass.Q.value = 3;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 1.0);

  } catch (e) {
    console.warn('Error playing monkey sound', e);
  }
}
