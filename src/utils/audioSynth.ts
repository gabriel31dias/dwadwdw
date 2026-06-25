/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class RomanticSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private currentStep = 0;

  // Romantic progression chords: Cmaj9 - Am9 - Fmaj9 - G6/9
  // Frequencies in Hz for chord voices (bass + melody notes)
  private chords = [
    { name: "Cmaj9", bass: 65.41, notes: [130.81, 196.00, 246.94, 293.66, 392.00, 493.88] }, // C2 + C3, G3, B3, D4, G4, B4
    { name: "Am9", bass: 55.00, notes: [110.00, 164.81, 220.00, 261.63, 329.63, 392.00] },  // A1 + A2, E3, A3, C4, E4, G4
    { name: "Fmaj9", bass: 43.65, notes: [87.31, 130.81, 174.61, 218.27, 261.63, 349.23] }, // F1 + F2, C3, F3, A3, C4, F4
    { name: "G6/9", bass: 49.00, notes: [98.00, 146.83, 196.00, 246.94, 293.66, 392.00] }   // G1 + G2, D3, G3, B3, D4, G4
  ];

  constructor() {
    // Audio Context is initialized lazily on user interaction
  }

  private init() {
    if (this.ctx) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master volume
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime); // Gentle low volume by default

    // Reverb / Delay feedback loop
    this.delayNode = this.ctx.createDelay(2.0);
    this.delayNode.delayTime.setValueAtTime(0.6, this.ctx.currentTime); // 600ms delay

    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.setValueAtTime(0.4, this.ctx.currentTime); // feedback amount

    // Connect feedback path
    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);

    // Connect to destination
    this.masterGain.connect(this.ctx.destination);
    this.delayNode.connect(this.masterGain);
    this.masterGain.connect(this.delayNode); // feed master into delay for echoes
  }

  public setVolume(volume: number) {
    if (!this.ctx) this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, volume)) * 0.18, // scaled for ear comfort
        this.ctx.currentTime + 0.1
      );
    }
  }

  public start() {
    if (this.isPlaying) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.currentStep = 0;
    
    // Play first note immediately
    this.playNextStep();

    // Loop steps every 400ms for arpeggiations
    this.intervalId = window.setInterval(() => {
      this.playNextStep();
    }, 450);
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPlaying = false;
  }

  private playNextStep() {
    if (!this.ctx || !this.masterGain) return;

    const time = this.ctx.currentTime;
    const chordIndex = Math.floor(this.currentStep / 16) % this.chords.length;
    const noteIndex = this.currentStep % 16;
    const chord = this.chords[chordIndex];

    // Trigger base pad on the first beat of each chord (every 16 steps)
    if (noteIndex === 0) {
      this.playPad(chord.bass, time, 6.0); // Deep rich bass drone
      this.playPad(chord.notes[1], time + 0.05, 5.0); // Warm support interval
    }

    // Play a gentle arpeggiated melody note
    // Let's make an interesting, romantic pattern
    const pattern = [0, 2, 4, 3, 1, 5, 2, 4, 1, 3, 5, 2, 4, 3, 1, 5];
    const targetNoteOfChord = chord.notes[pattern[noteIndex % pattern.length] % chord.notes.length];

    // Sometimes we skip a note to make the rhythm sound organic and less robotic
    const shouldSkip = (noteIndex % 4 === 3) && Math.random() > 0.4;
    
    if (!shouldSkip) {
      this.playMelodyNote(targetNoteOfChord, time);
    }

    this.currentStep++;
  }

  private playMelodyNote(freq: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Create main sweet triangle wave (analog piano sound)
    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);

    // Create subtle sine harmonic (glassy chime sound)
    const chime = this.ctx.createOscillator();
    chime.type = "sine";
    chime.frequency.setValueAtTime(freq * 2, time); // 1 octave above

    const noteGain = this.ctx.createGain();
    const chimeGain = this.ctx.createGain();

    // Lowpass filter to keep it super cozy and warm (removes digital harshness)
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, time);

    // Envelope for melody note (gentle bell curve)
    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(0.12, time + 0.08); // soft attack
    noteGain.gain.exponentialRampToValueAtTime(0.001, time + 2.0); // slow natural ring out

    // Envelope for glassy chime
    chimeGain.gain.setValueAtTime(0, time);
    chimeGain.gain.linearRampToValueAtTime(0.03, time + 0.02); // sharp chime attack
    chimeGain.gain.exponentialRampToValueAtTime(0.001, time + 0.8); // fast chime decay

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    chime.connect(chimeGain);
    chimeGain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 2.1);

    chime.start(time);
    chime.stop(time + 0.9);
  }

  private playPad(freq: number, time: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    // Rich warm pad uses a gentle sine wave mixed with a soft triangle wave
    const osc1 = this.ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, time);

    const osc2 = this.ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 1.5, time); // fifth interval drone

    const padGain = this.ctx.createGain();
    const padFilter = this.ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.setValueAtTime(400, time); // super dark filter

    // Slow cinematic swelling envelope
    padGain.gain.setValueAtTime(0, time);
    padGain.gain.linearRampToValueAtTime(0.08, time + 1.5); // long slow swell
    padGain.gain.setValueAtTime(0.08, time + duration - 2.0);
    padGain.gain.exponentialRampToValueAtTime(0.001, time + duration); // slow fade out

    osc1.connect(padFilter);
    osc2.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(this.masterGain);

    osc1.start(time);
    osc1.stop(time + duration + 0.1);

    osc2.start(time);
    osc2.stop(time + duration + 0.1);
  }

  public triggerHeartSound() {
    if (!this.ctx) this.init();
    if (!this.ctx || !this.masterGain) return;

    // Trigger a beautiful, high-pitched double sparkle chime when a heart or quiz-correct is unlocked!
    const time = this.ctx.currentTime;
    
    // Quick success arpeggio: C5 - E5 - G5 - C6
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, index) => {
      const chimeTime = time + index * 0.08;
      
      const osc = this.ctx!.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, chimeTime);

      const gainNode = this.ctx!.createGain();
      gainNode.gain.setValueAtTime(0, chimeTime);
      gainNode.gain.linearRampToValueAtTime(0.08, chimeTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, chimeTime + 0.6);

      osc.connect(gainNode);
      gainNode.connect(this.masterGain!);

      osc.start(chimeTime);
      osc.stop(chimeTime + 0.7);
    });
  }

  public triggerConfettiExplosion() {
    if (!this.ctx) this.init();
    if (!this.ctx || !this.masterGain) return;

    // Trigger a majestic crescendo chord sequence to mark the proposal acceptance!
    const time = this.ctx.currentTime;
    const root = 130.81; // C3
    
    // Play C Major chord swelling loudly with high-pitch chiming sparkles
    const notes = [root, root * 1.25, root * 1.5, root * 1.875, root * 2.0, root * 2.5, root * 3.0]; // C, E, G, B, C, E, G
    
    notes.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, time + idx * 0.1);

      const gainNode = this.ctx!.createGain();
      gainNode.gain.setValueAtTime(0, time + idx * 0.1);
      gainNode.gain.linearRampToValueAtTime(0.12, time + idx * 0.1 + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 4.0);

      osc.connect(gainNode);
      gainNode.connect(this.masterGain!);

      osc.start(time + idx * 0.1);
      osc.stop(time + 4.5);
    });
  }
}

export const romanticSynth = new RomanticSynth();
export default romanticSynth;
