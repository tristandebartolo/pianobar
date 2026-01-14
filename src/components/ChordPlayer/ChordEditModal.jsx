import React, { useState } from 'react';
import { getNoteColor, getChordNotes } from '../../utils/musicTheory.js';
import { audioSystem } from '../../utils/audioSystem.js';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ACCIDENTALS = ['', '#', 'b'];

// Types d'accords organisés par catégorie
const QUALITY_CATEGORIES = [
  {
    name: 'Triades',
    qualities: [
      { value: '', label: 'Maj' },
      { value: 'm', label: 'min' },
      { value: 'dim', label: 'dim' },
      { value: 'aug', label: 'aug' },
    ],
  },
  {
    name: 'Suspendus',
    qualities: [
      { value: 'sus2', label: 'sus2' },
      { value: 'sus4', label: 'sus4' },
    ],
  },
  {
    name: 'Septièmes',
    qualities: [
      { value: '7', label: '7' },
      { value: 'maj7', label: 'maj7' },
      { value: 'm7', label: 'm7' },
      { value: 'mMaj7', label: 'm(maj7)' },
      { value: 'dim7', label: 'dim7' },
      { value: 'm7b5', label: 'm7b5' },
      { value: '7sus4', label: '7sus4' },
    ],
  },
  {
    name: 'Extensions',
    qualities: [
      { value: 'add9', label: 'add9' },
      { value: '6', label: '6' },
      { value: 'm6', label: 'm6' },
      { value: '9', label: '9' },
      { value: 'maj9', label: 'maj9' },
      { value: 'm9', label: 'm9' },
      { value: '11', label: '11' },
      { value: '13', label: '13' },
    ],
  },
  {
    name: 'Altérés',
    qualities: [
      { value: '7b5', label: '7b5' },
      { value: '7#5', label: '7#5' },
      { value: '7b9', label: '7b9' },
      { value: '7#9', label: '7#9' },
      { value: '7#11', label: '7#11' },
    ],
  },
  {
    name: 'Power',
    qualities: [
      { value: '5', label: '5 (power)' },
    ],
  },
];

function ChordEditModal({ chord, onUpdate, onDelete, onClose }) {
  // Parser le nom de l'accord existant
  const parseChordName = (name) => {
    const match = name.match(/^([A-G])([#b]?)(.*)$/);
    if (match) {
      return {
        root: match[1],
        accidental: match[2],
        quality: match[3],
      };
    }
    return { root: 'C', accidental: '', quality: '' };
  };

  const parsed = parseChordName(chord.name);
  const [root, setRoot] = useState(parsed.root);
  const [accidental, setAccidental] = useState(parsed.accidental);
  const [quality, setQuality] = useState(parsed.quality);
  const [duration, setDuration] = useState(chord.duration);

  const chordName = `${root}${accidental}${quality}`;

  // Obtenir la couleur de l'accord
  const getChordColor = () => {
    const noteKey = `${root}${accidental}`;
    const colorInfo = getNoteColor(noteKey) || getNoteColor(root);
    return colorInfo?.color || 'hsl(245, 100%, 69%)';
  };

  // Jouer l'aperçu de l'accord
  const playPreview = () => {
    audioSystem.init();
    const notes = getChordNotes(chordName);
    audioSystem.playChord(notes, 0.7, 1);
  };

  // Sauvegarder les modifications
  const handleSave = () => {
    onUpdate({
      ...chord,
      name: chordName,
      duration,
    });
  };

  // Supprimer l'accord
  const handleDelete = () => {
    onDelete(chord.id);
  };

  return (
    <div className="chord-edit-modal-overlay" onClick={onClose}>
      <div className="chord-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chord-edit-modal__header">
          <h3>Modifier l'accord</h3>
          <button className="chord-edit-modal__close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="chord-edit-modal__content">
          {/* Aperçu de l'accord */}
          <div
            className="chord-edit-modal__preview"
            style={{ borderColor: getChordColor() }}
          >
            <span
              className="chord-edit-modal__chord-name"
              style={{ color: getChordColor() }}
            >
              {chordName}
            </span>
            <button
              className="chord-edit-modal__play-btn"
              onClick={playPreview}
              style={{ backgroundColor: getChordColor() }}
            >
              ▶ Écouter
            </button>
          </div>

          {/* Sélection de la note */}
          <div className="chord-edit-modal__section">
            <label className="chord-edit-modal__label">Note</label>
            <div className="chord-edit-modal__note-grid">
              {NOTES.map((note) => (
                <button
                  key={note}
                  className={`chord-edit-modal__note-btn ${root === note ? 'chord-edit-modal__note-btn--active' : ''}`}
                  onClick={() => setRoot(note)}
                  style={root === note ? { backgroundColor: getNoteColor(note)?.color } : {}}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Sélection de l'altération */}
          <div className="chord-edit-modal__section">
            <label className="chord-edit-modal__label">Altération</label>
            <div className="chord-edit-modal__accidental-grid">
              {ACCIDENTALS.map((acc) => (
                <button
                  key={acc || 'natural'}
                  className={`chord-edit-modal__accidental-btn ${accidental === acc ? 'chord-edit-modal__accidental-btn--active' : ''}`}
                  onClick={() => setAccidental(acc)}
                >
                  {acc === '' ? '♮' : acc === '#' ? '♯' : '♭'}
                </button>
              ))}
            </div>
          </div>

          {/* Sélection de la qualité par catégorie */}
          <div className="chord-edit-modal__section">
            <label className="chord-edit-modal__label">Type d'accord</label>
            <div className="chord-edit-modal__quality-categories">
              {QUALITY_CATEGORIES.map((category) => (
                <div key={category.name} className="chord-edit-modal__quality-category">
                  <span className="chord-edit-modal__category-name">{category.name}</span>
                  <div className="chord-edit-modal__quality-grid">
                    {category.qualities.map((q) => (
                      <button
                        key={q.value || 'major'}
                        className={`chord-edit-modal__quality-btn ${quality === q.value ? 'chord-edit-modal__quality-btn--active' : ''}`}
                        onClick={() => setQuality(q.value)}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Durée */}
          <div className="chord-edit-modal__section">
            <label className="chord-edit-modal__label">
              Durée: {duration} temps
            </label>
            <input
              type="range"
              min="1"
              max="16"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="chord-edit-modal__duration-slider"
            />
            <div className="chord-edit-modal__duration-marks">
              <span>1</span>
              <span>4</span>
              <span>8</span>
              <span>12</span>
              <span>16</span>
            </div>
          </div>
        </div>

        <div className="chord-edit-modal__actions">
          <button
            className="chord-edit-modal__btn chord-edit-modal__btn--delete"
            onClick={handleDelete}
          >
            Supprimer
          </button>
          <button
            className="chord-edit-modal__btn chord-edit-modal__btn--cancel"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="chord-edit-modal__btn chord-edit-modal__btn--save"
            onClick={handleSave}
            style={{ backgroundColor: getChordColor() }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChordEditModal;
