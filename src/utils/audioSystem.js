// Système audio pour jouer des notes de piano
class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
  }

  // Initialiser le contexte audio (doit être appelé après interaction utilisateur)
  init() {
    if (!this.initialized) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    }
  }

  // Fréquences des notes (en Hz) - Octave 4
  getNoteFrequency(note) {
    const frequencies = {
      'C': 261.63,
      'C#': 277.18,
      'Db': 277.18,
      'D': 293.66,
      'D#': 311.13,
      'Eb': 311.13,
      'E': 329.63,
      'F': 349.23,
      'F#': 369.99,
      'Gb': 369.99,
      'G': 392.00,
      'G#': 415.30,
      'Ab': 415.30,
      'A': 440.00,
      'A#': 466.16,
      'Bb': 466.16,
      'B': 493.88
    };

    // Extraire la note sans le 'm' (mineur)
    const cleanNote = note.replace('m', '');
    return frequencies[cleanNote] || 440;
  }

  // Jouer une note de piano avec ADSR envelope
  playNote(noteName, duration = 0.5) {
    if (!this.initialized) {
      this.init();
    }

    const now = this.audioContext.currentTime;
    const frequency = this.getNoteFrequency(noteName);

    // Créer l'oscillateur (son de base)
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine'; // Son plus doux, proche du piano

    // Créer un deuxième oscillateur pour enrichir le son
    const oscillator2 = this.audioContext.createOscillator();
    oscillator2.type = 'triangle';
    oscillator2.frequency.value = frequency * 2; // Une octave au-dessus

    // Créer les gains pour le contrôle du volume
    const gainNode = this.audioContext.createGain();
    const gainNode2 = this.audioContext.createGain();
    const masterGain = this.audioContext.createGain();

    // Connecter les oscillateurs
    oscillator.connect(gainNode);
    oscillator2.connect(gainNode2);
    gainNode.connect(masterGain);
    gainNode2.connect(masterGain);
    masterGain.connect(this.audioContext.destination);

    // Régler les fréquences
    oscillator.frequency.value = frequency;

    // Envelope ADSR pour un son plus naturel
    const attackTime = 0.01;
    const decayTime = 0.1;
    const sustainLevel = 0.3;
    const releaseTime = 0.3;

    // Volume initial
    gainNode.gain.setValueAtTime(0, now);
    gainNode2.gain.setValueAtTime(0, now);
    masterGain.gain.setValueAtTime(0.3, now); // Volume global

    // Attack
    gainNode.gain.linearRampToValueAtTime(0.8, now + attackTime);
    gainNode2.gain.linearRampToValueAtTime(0.2, now + attackTime);

    // Decay
    gainNode.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
    gainNode2.gain.linearRampToValueAtTime(sustainLevel * 0.3, now + attackTime + decayTime);

    // Sustain (maintenu pendant la durée)
    const sustainTime = duration - attackTime - decayTime - releaseTime;

    // Release
    gainNode.gain.linearRampToValueAtTime(0, now + attackTime + decayTime + sustainTime + releaseTime);
    gainNode2.gain.linearRampToValueAtTime(0, now + attackTime + decayTime + sustainTime + releaseTime);

    // Démarrer et arrêter les oscillateurs
    oscillator.start(now);
    oscillator2.start(now);
    oscillator.stop(now + duration);
    oscillator2.stop(now + duration);

    // Nettoyer après la fin
    setTimeout(() => {
      oscillator.disconnect();
      oscillator2.disconnect();
      gainNode.disconnect();
      gainNode2.disconnect();
      masterGain.disconnect();
    }, duration * 1000 + 100);
  }

  // Jouer un accord (plusieurs notes ensemble)
  playChord(notes, duration = 0.8) {
    notes.forEach((note) => {
      this.playNote(note, duration);
    });
  }
}

// Export une instance unique
export const audioSystem = new AudioSystem();

// Helper pour jouer la note d'une tonalité
export function playKeyNote(keyData, isMajor = true) {
  // Jouer la note majeure ou mineure selon le paramètre
  const note = isMajor ? keyData.majorKey : keyData.minorKey;
  audioSystem.playNote(note, 0.5);
}

// Helper pour jouer un accord
export function playKeyChord(keyData) {
  // Jouer l'accord majeur (I-III-V)
  const rootNote = keyData.majorKey;
  const thirdNote = keyData.majorScale[2]; // Tierce
  const fifthNote = keyData.majorScale[4]; // Quinte

  audioSystem.playChord([rootNote, thirdNote, fifthNote], 0.8);
}

// Helper pour jouer un son de clic subtil pour les boutons
export function playClickSound() {
  if (!audioSystem.initialized) {
    audioSystem.init();
  }

  const now = audioSystem.audioContext.currentTime;
  const oscillator = audioSystem.audioContext.createOscillator();
  const gainNode = audioSystem.audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioSystem.audioContext.destination);

  // Son très court et aigu pour un clic
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  // Envelope très rapide
  gainNode.gain.setValueAtTime(0.15, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

  oscillator.start(now);
  oscillator.stop(now + 0.05);

  setTimeout(() => {
    oscillator.disconnect();
    gainNode.disconnect();
  }, 100);
}
