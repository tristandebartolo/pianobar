import React from 'react';
import { getChordNotes } from '../../utils/musicTheory.js';
import { audioSystem } from '../../utils/audioSystem.js';
import PianoKeys from '../shared/PianoKeys.jsx';

function ProgressionsTab({ keyData, isMinor = false }) {
  const handleChordClick = (chordName) => {
    const notes = getChordNotes(chordName);
    audioSystem.playChord(notes, 0.8);
  };

  const handlePlayProgression = (chords) => {
    chords.forEach((chord, index) => {
      setTimeout(() => {
        const notes = getChordNotes(chord);
        audioSystem.playChord(notes, 0.6);
      }, index * 600);
    });
  };

  // Accords disponibles
  const majorChords = keyData.majorChords;
  const minorChords = keyData.minorChords;
  const chords = isMinor ? minorChords : majorChords;

  // Progressions pour mode majeur
  const majorProgressions = [
    {
      name: 'I - IV - V',
      description: 'Progression classique du rock et blues',
      genre: 'Rock, Blues, Country',
      degrees: [0, 3, 4],
      color: '#6C63FF'
    },
    {
      name: 'I - V - vi - IV',
      description: 'La progression pop par excellence',
      genre: 'Pop, Rock',
      degrees: [0, 4, 5, 3],
      color: '#4CAF50'
    },
    {
      name: 'I - vi - IV - V',
      description: 'Progression doo-wop des années 50',
      genre: 'Doo-wop, Pop',
      degrees: [0, 5, 3, 4],
      color: '#FF9800'
    },
    {
      name: 'ii - V - I',
      description: 'Cadence jazz fondamentale',
      genre: 'Jazz, Bossa Nova',
      degrees: [1, 4, 0],
      color: '#9C27B0'
    },
    {
      name: 'I - IV - vi - V',
      description: 'Variation pop moderne',
      genre: 'Pop, Dance',
      degrees: [0, 3, 5, 4],
      color: '#00BCD4'
    },
    {
      name: 'vi - IV - I - V',
      description: 'Progression émotionnelle (commence sur le relatif mineur)',
      genre: 'Pop, Ballade',
      degrees: [5, 3, 0, 4],
      color: '#E91E63'
    },
    {
      name: 'I - iii - IV - V',
      description: 'Progression douce et mélodique',
      genre: 'Pop, Folk',
      degrees: [0, 2, 3, 4],
      color: '#3F51B5'
    },
    {
      name: 'I - V - vi - iii - IV - I - IV - V',
      description: 'Canon de Pachelbel',
      genre: 'Classique, Pop',
      degrees: [0, 4, 5, 2, 3, 0, 3, 4],
      color: '#795548'
    },
    {
      name: 'I - IV - I - V',
      description: '12 Bar Blues simplifié',
      genre: 'Blues',
      degrees: [0, 3, 0, 4],
      color: '#607D8B'
    },
    {
      name: 'I - bVII - IV - I',
      description: 'Progression rock avec accord emprunté',
      genre: 'Rock',
      degrees: [0, 6, 3, 0],
      color: '#FF5722'
    }
  ];

  // Progressions pour mode mineur
  const minorProgressions = [
    {
      name: 'i - iv - v',
      description: 'Progression mineure basique',
      genre: 'Rock, Metal',
      degrees: [0, 3, 4],
      color: '#4CAF50'
    },
    {
      name: 'i - VI - III - VII',
      description: 'Progression andalouse / Flamenco',
      genre: 'Flamenco, Latin',
      degrees: [0, 5, 2, 6],
      color: '#FF5722'
    },
    {
      name: 'i - iv - VII - III',
      description: 'Progression pop mineure moderne',
      genre: 'Pop, R&B',
      degrees: [0, 3, 6, 2],
      color: '#9C27B0'
    },
    {
      name: 'i - VII - VI - VII',
      description: 'Progression rock mineure',
      genre: 'Rock, Grunge',
      degrees: [0, 6, 5, 6],
      color: '#607D8B'
    },
    {
      name: 'i - VI - iv - V',
      description: 'Progression mineure dramatique (avec V majeur)',
      genre: 'Classique, Film',
      degrees: [0, 5, 3, 4],
      color: '#E91E63'
    },
    {
      name: 'i - iv - i - V',
      description: 'Cadence mineure classique',
      genre: 'Classique',
      degrees: [0, 3, 0, 4],
      color: '#3F51B5'
    },
    {
      name: 'i - VII - VI - V',
      description: 'Descente par tons (ligne de basse)',
      genre: 'Pop, Rock',
      degrees: [0, 6, 5, 4],
      color: '#00BCD4'
    },
    {
      name: 'i - III - VII - IV',
      description: 'Progression épique',
      genre: 'Epic, Film',
      degrees: [0, 2, 6, 3],
      color: '#795548'
    }
  ];

  const progressions = isMinor ? minorProgressions : majorProgressions;
  const keyName = isMinor ? keyData.minorKey : keyData.majorKey;
  const modeName = isMinor ? 'mineur' : 'majeur';

  return (
    <div className="progressions-tab">
      <div className="progressions-intro">
        <h3>Progressions en {keyName} {modeName}</h3>
        <p>
          Cliquez sur un accord pour l'entendre, ou sur le bouton play pour écouter la progression complète.
        </p>
      </div>

      <div className="progressions-list">
        {progressions.map((prog, index) => {
          const progChords = prog.degrees.map(degree => chords[degree]);

          return (
            <div
              key={index}
              className="progression-card"
              style={{ borderLeftColor: prog.color }}
            >
              <div className="progression-card__header">
                <h4 className="progression-card__name" style={{ color: prog.color }}>
                  {prog.name}
                </h4>
                <button
                  className="progression-card__play-btn"
                  onClick={() => handlePlayProgression(progChords)}
                  style={{ backgroundColor: prog.color }}
                  aria-label={`Jouer la progression ${prog.name}`}
                >
                  ▶ Play
                </button>
              </div>

              <p className="progression-card__description">{prog.description}</p>
              <span className="progression-card__genre">{prog.genre}</span>

              <div className="progression-card__chords">
                {progChords.map((chord, chordIndex) => {
                  const notes = getChordNotes(chord);
                  return (
                    <div
                      key={chordIndex}
                      className="progression-chord"
                      onClick={() => handleChordClick(chord)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && handleChordClick(chord)}
                    >
                      <div className="progression-chord__name">{chord}</div>
                      <div className="progression-chord__piano">
                        <PianoKeys notes={notes} highlightColor={prog.color} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressionsTab;
