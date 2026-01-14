import React from 'react';
import { audioSystem } from '../../utils/audioSystem.js';
import { getNoteColor } from '../../utils/musicTheory.js';

// Obtenir la couleur d'une note depuis le cercle des quintes
const getCircleColor = (note) => {
  const colorInfo = getNoteColor(note);
  if (colorInfo && colorInfo.color) {
    return colorInfo.color;
  }
  return '#6C63FF'; // Couleur par défaut
};

function MagicNotesTab({ keyData, isMinor = false }) {
  // Utiliser la gamme appropriée selon le mode
  const scale = isMinor ? keyData.minorScale : keyData.majorScale;

  // Notes magiques avec leurs rôles harmoniques et couleurs dynamiques du cercle
  const magicNotes = [
    {
      name: 'Tonique',
      note: scale[0],
      degree: isMinor ? 'i' : 'I',
      description: 'La note fondamentale, le centre tonal',
      icon: '🎯'
    },
    {
      name: 'Tierce',
      note: scale[2],
      degree: isMinor ? 'III' : 'III',
      description: isMinor ? 'Tierce mineure, donne le caractère triste' : 'Tierce majeure, donne le caractère joyeux',
      icon: '✨'
    },
    {
      name: 'Quinte',
      note: scale[4],
      degree: isMinor ? 'v' : 'V',
      description: 'La plus consonante, crée la stabilité',
      icon: '⭐'
    },
    {
      name: 'Septième',
      note: scale[6],
      degree: isMinor ? 'VII' : 'VII',
      description: isMinor ? 'Septième mineure, ton entier sous la tonique' : 'Sensible, demi-ton sous la tonique',
      icon: '⚡'
    },
    {
      name: 'Sous-dominante',
      note: scale[3],
      degree: isMinor ? 'iv' : 'IV',
      description: 'Prépare le mouvement vers la dominante',
      icon: '🌙'
    },
    {
      name: 'Sixte',
      note: scale[5],
      degree: isMinor ? 'VI' : 'VI',
      description: isMinor ? 'Sixte mineure, caractéristique du mode mineur' : 'Sixte majeure, départ de la relative mineure',
      icon: '💫'
    }
  ].map(magic => ({
    ...magic,
    color: getCircleColor(magic.note)
  }));

  const handlePlayNote = (note) => {
    audioSystem.init();
    audioSystem.playNote(note, 0.8);
  };

  const handlePlayAllNotes = () => {
    audioSystem.init();
    magicNotes.forEach((magic, index) => {
      setTimeout(() => {
        audioSystem.playNote(magic.note, 0.6);
      }, index * 300);
    });
  };

  const handlePlayTriad = () => {
    audioSystem.init();
    // Jouer l'accord majeur (Tonique + Tierce + Quinte)
    const triad = [magicNotes[0].note, magicNotes[1].note, magicNotes[2].note];
    triad.forEach(note => audioSystem.playNote(note, 1.0));
  };

  return (
    <div className="magic-notes-tab">
      <div className="magic-notes-header">
        <p className="magic-notes-intro">
          Les notes magiques sont les degrés qui définissent le caractère harmonique
          de la tonalité. Cliquez sur une note pour l'entendre!
        </p>
        <div className="magic-notes-actions">
          <button className="magic-notes-play-btn" onClick={handlePlayAllNotes}>
            🎵 Jouer la séquence
          </button>
          <button className="magic-notes-play-btn magic-notes-play-btn--secondary" onClick={handlePlayTriad}>
            🎹 Jouer l'accord (I-III-V)
          </button>
        </div>
      </div>

      <div className="magic-notes-grid">
        {magicNotes.map((magic, index) => (
          <div
            key={index}
            className="magic-note-card"
            style={{ borderColor: magic.color }}
            onClick={() => handlePlayNote(magic.note)}
          >
            <div className="magic-note-card__icon" style={{ color: magic.color }}>
              {magic.icon}
            </div>
            <div className="magic-note-card__header">
              <span className="magic-note-card__degree" style={{ color: magic.color }}>
                {magic.degree}
              </span>
              <span className="magic-note-card__name">{magic.name}</span>
            </div>
            <div className="magic-note-card__note" style={{ color: magic.color }}>
              {magic.note}
            </div>
            <p className="magic-note-card__description">{magic.description}</p>
            <button
              className="magic-note-card__play"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayNote(magic.note);
              }}
              style={{ backgroundColor: magic.color }}
            >
              ▶
            </button>
          </div>
        ))}
      </div>

      <div className="magic-notes-theory">
        <h4>🎼 Fonctions harmoniques</h4>
        <div className="magic-notes-functions">
          <div className="function-item">
            <span className="function-item__label">Fonction Tonique</span>
            <span className="function-item__notes">I - VI</span>
            <span className="function-item__desc">Repos, stabilité</span>
          </div>
          <div className="function-item">
            <span className="function-item__label">Fonction Dominante</span>
            <span className="function-item__notes">V - VII</span>
            <span className="function-item__desc">Tension, mouvement</span>
          </div>
          <div className="function-item">
            <span className="function-item__label">Fonction Sous-dominante</span>
            <span className="function-item__notes">IV</span>
            <span className="function-item__desc">Préparation, transition</span>
          </div>
        </div>
      </div>

      <div className="magic-notes-tips">
        <h4>💡 Astuce de composition</h4>
        <p>
          Pour créer une mélodie harmonieuse, privilégiez les notes magiques (surtout I, III, V).
          La septième (VII) crée une forte tension qui "veut" résoudre vers la tonique.
        </p>
        <p>
          L'accord parfait majeur (I-III-V) est la base de toute harmonie occidentale!
        </p>
      </div>
    </div>
  );
}

export default MagicNotesTab;
