import React from 'react';
import { getRomanNumeral, getChordProgression, getChordNotes, getNoteColor } from '../../utils/musicTheory.js';
import { audioSystem } from '../../utils/audioSystem.js';
import PianoKeys from '../shared/PianoKeys.jsx';

// Créer un objet de couleurs pour les notes d'un accord basé sur le cercle des quintes
const getChordNoteColors = (notes) => {
  const colors = {};
  notes.forEach(note => {
    const colorInfo = getNoteColor(note);
    if (colorInfo && colorInfo.color) {
      colors[note] = colorInfo.color;
    }
  });
  return colors;
};

function ChordsTab({ keyData, isMinor = false }) {
  const handleChordClick = (chordName) => {
    const notes = getChordNotes(chordName);
    audioSystem.playChord(notes, 0.8);
  };

  // Utiliser les accords appropriés selon le mode
  const chords = isMinor ? keyData.minorChords : keyData.majorChords;
  const keyName = isMinor ? keyData.minorKey : keyData.majorKey;
  const modeName = isMinor ? 'mineur' : 'majeur';

  const progressions = [
    { name: 'I-IV-V', type: 'I-IV-V', description: 'Progression classique' },
    { name: 'I-V-vi-IV', type: 'I-V-vi-IV', description: 'Pop moderne' },
    { name: 'ii-V-I', type: 'ii-V-I', description: 'Jazz standard' },
    { name: 'I-vi-IV-V', type: 'I-vi-IV-V', description: 'Doo-wop' }
  ];

  return (
    <div className="chords-tab">
      <div className="chords-section">
        <h3 className="chords-section__title">Accords diatoniques en {keyName} {modeName}</h3>
        <div className="chords-list">
          {chords.map((chord, index) => {
            const notes = getChordNotes(chord);
            return (
              <div
                key={`chord-${index}`}
                className="chord-item chord-item--clickable"
                onClick={() => handleChordClick(chord)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleChordClick(chord)}
              >
                <div className="chord-item__numeral">{getRomanNumeral(index + 1, isMinor)}</div>
                <div className="chord-item__name">{chord}</div>
                <div className="chord-item__notes">{notes.join(' - ')}</div>
                <div className="chord-item__piano">
                  <PianoKeys notes={notes} noteColors={getChordNoteColors(notes)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="progressions-section">
        <h3 className="progressions-section__title">Progressions communes</h3>
        {progressions.map((prog) => {
          const progChords = getChordProgression(keyData.id, prog.type);
          return (
            <div key={prog.type} className="progression-item">
              <div className="progression-item__header">
                <span className="progression-item__name">{prog.name}</span>
                <span className="progression-item__description">{prog.description}</span>
              </div>
              <div className="progression-item__chords">
                {progChords.join(' - ')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChordsTab;
