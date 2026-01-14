import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { audioSystem } from '../../utils/audioSystem.js';

// noteColors: objet optionnel qui mappe chaque note à sa couleur { 'C': '#6C63FF', 'E': '#4CAF50', ... }
const PianoKeys = forwardRef(({ notes, highlightColor = '#6C63FF', noteColors = null }, ref) => {
  const [activeKey, setActiveKey] = useState(null);

  // Exposer la méthode animateKey pour que le parent puisse déclencher l'animation
  useImperativeHandle(ref, () => ({
    animateKey: (note) => {
      setActiveKey(note);
      setTimeout(() => setActiveKey(null), 300);
    }
  }));

  const handleKeyClick = (note) => {
    console.log(`Piano key clicked: ${note}`);
    audioSystem.playNote(note, 0.5);

    // Activer l'animation
    setActiveKey(note);
    setTimeout(() => setActiveKey(null), 300);
  };

  // Octave de piano (C à B)
  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeys = [
    { note: 'C#', position: 0.7 },  // Entre C et D
    { note: 'D#', position: 1.7 },  // Entre D et E
    { note: 'F#', position: 3.7 },  // Entre F et G
    { note: 'G#', position: 4.7 },  // Entre G et A
    { note: 'A#', position: 5.7 }   // Entre A et B
  ];

  // Normaliser les notes pour la comparaison
  const normalizeNote = (note) => {
    const map = {
      'Db': 'C#', 'D♭': 'C#',
      'Eb': 'D#', 'E♭': 'D#',
      'Gb': 'F#', 'G♭': 'F#',
      'Ab': 'G#', 'A♭': 'G#',
      'Bb': 'A#', 'B♭': 'A#',
      'C♯': 'C#', 'D♯': 'D#', 'F♯': 'F#', 'G♯': 'G#', 'A♯': 'A#'
    };
    return map[note] || note;
  };

  const normalizedNotes = notes.map(normalizeNote);

  // Créer un mapping normalisé des couleurs si noteColors est fourni
  const normalizedNoteColors = noteColors ? Object.entries(noteColors).reduce((acc, [note, color]) => {
    acc[normalizeNote(note)] = color;
    return acc;
  }, {}) : null;

  const isHighlighted = (note) => normalizedNotes.includes(note);

  // Obtenir la couleur pour une note (utilise noteColors si disponible, sinon highlightColor)
  const getColorForNote = (note) => {
    if (normalizedNoteColors && normalizedNoteColors[note]) {
      return normalizedNoteColors[note];
    }
    return highlightColor;
  };

  return (
    <div className="piano-keys">
      <svg viewBox="0 0 70 30" className="piano-keys__svg">
        {/* Touches blanches */}
        {whiteKeys.map((note, index) => (
          <rect
            key={`white-${note}`}
            x={index * 10}
            y="0"
            width="9.5"
            height="30"
            className={`piano-key piano-key--white ${
              isHighlighted(note) ? 'piano-key--highlighted' : ''
            } ${activeKey === note ? 'piano-key--active' : ''}`}
            stroke="#2D2E42"
            strokeWidth="0.5"
            fill={isHighlighted(note) ? getColorForNote(note) : '#E0E0E0'}
            onClick={() => handleKeyClick(note)}
            style={{ cursor: 'pointer' }}
          />
        ))}

        {/* Touches noires */}
        {blackKeys.map(({ note, position }) => (
          <rect
            key={`black-${note}`}
            x={position * 10 - 2.5}
            y="0"
            width="5"
            height="18"
            className={`piano-key piano-key--black ${
              isHighlighted(note) ? 'piano-key--highlighted' : ''
            } ${activeKey === note ? 'piano-key--active' : ''}`}
            fill={isHighlighted(note) ? getColorForNote(note) : '#2D2E42'}
            onClick={() => handleKeyClick(note)}
            style={{ cursor: 'pointer' }}
          />
        ))}

        {/* Labels pour les touches surlignées */}
        {whiteKeys.map((note, index) => {
          if (isHighlighted(note)) {
            return (
              <text
                key={`label-white-${note}`}
                x={index * 10 + 4.75}
                y="26"
                textAnchor="middle"
                className="piano-key__label"
                fill="white"
                fontSize="3"
                fontWeight="bold"
                pointerEvents="none"
              >
                {note}
              </text>
            );
          }
          return null;
        })}

        {blackKeys.map(({ note, position }) => {
          if (isHighlighted(note)) {
            return (
              <text
                key={`label-black-${note}`}
                x={position * 10}
                y="14"
                textAnchor="middle"
                className="piano-key__label"
                fill="white"
                fontSize="2.5"
                fontWeight="bold"
                pointerEvents="none"
              >
                {note}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
});

PianoKeys.displayName = 'PianoKeys';

export default PianoKeys;
