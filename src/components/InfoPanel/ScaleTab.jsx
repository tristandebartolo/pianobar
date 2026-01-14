import React, { useState, useRef } from "react";
import {
  getIntervalName,
  getModalScale,
  getModeInfo,
} from "../../utils/musicTheory.js";
import { audioSystem } from "../../utils/audioSystem.js";
import PianoKeys from "../shared/PianoKeys.jsx";

function ScaleTab({ keyData, isMinor = false }) {
  const [selectedMode, setSelectedMode] = useState(isMinor ? "minor" : "major");
  const [isPlayingScale, setIsPlayingScale] = useState(false);
  const pianoKeysRef = useRef(null);

  const handleNoteClick = (note) => {
    audioSystem.playNote(note, 0.5);
  };

  const handlePlayScale = (scale) => {
    setIsPlayingScale(true);

    scale.forEach((note, index) => {
      setTimeout(() => {
        audioSystem.playNote(note, 0.3);
        // Animer la touche du piano
        if (pianoKeysRef.current) {
          pianoKeysRef.current.animateKey(note);
        }
      }, index * 200);
    });

    // Désactiver l'animation après la durée totale de la gamme
    const totalDuration = scale.length * 200;
    setTimeout(() => {
      setIsPlayingScale(false);
    }, totalDuration);
  };

  const modeCategories = [
    {
      name: "Gammes courantes",
      modes: [
        { id: "major", color: "#6C63FF" },
        { id: "minor", color: "#4CAF50" },
        { id: "pentatonic-major", color: "#00BCD4" },
        { id: "pentatonic-minor", color: "#FF9800" },
      ],
    },
    {
      name: "Modes grecs",
      modes: [
        { id: "dorian", color: "#FF6B6B" },
        { id: "phrygian", color: "#FFB74D" },
        { id: "lydian", color: "#4DD0E1" },
        { id: "mixolydian", color: "#9C27B0" },
        { id: "locrian", color: "#F06292" },
      ],
    },
    {
      name: "Gammes mineures",
      modes: [
        { id: "harmonic-minor", color: "#E91E63" },
        { id: "melodic-minor", color: "#9C27B0" },
      ],
    },
    {
      name: "Blues",
      modes: [
        { id: "blues-major", color: "#2196F3" },
        { id: "blues-minor", color: "#FF5722" },
      ],
    },
    {
      name: "Gammes exotiques",
      modes: [
        { id: "phrygian-dominant", color: "#D32F2F" },
        { id: "hungarian-minor", color: "#7B1FA2" },
        { id: "double-harmonic", color: "#FF6F00" },
      ],
    },
    {
      name: "Gammes japonnaise",
      modes: [
        { id: "hirajoshi", color: "#C2185B" },
        { id: "in-sen", color: "#00838F" },
        { id: "iwato", color: "#C2185B" },
        { id: "kumoi", color: "#00838F" },
      ],
    },
    {
      name: "Gammes symétriques",
      modes: [
        { id: "whole-tone", color: "#00897B" },
        { id: "diminished", color: "#6A1B9A" },
        { id: "augmented", color: "#F57C00" },
        { id: "chromatic", color: "#455A64" },
      ],
    },
  ];

  const allModes = modeCategories.flatMap((cat) => cat.modes);

  const currentScale = getModalScale(keyData.id, selectedMode);
  const modeInfo = getModeInfo(selectedMode);

  const intervals = [
    { semitones: 0, degree: "I" },
    { semitones: 2, degree: "II" },
    { semitones: 4, degree: "III" },
    { semitones: 5, degree: "IV" },
    { semitones: 7, degree: "V" },
    { semitones: 9, degree: "VI" },
    { semitones: 11, degree: "VII" },
  ];

  const minorIntervals = [
    { semitones: 0, degree: "I" },
    { semitones: 2, degree: "II" },
    { semitones: 3, degree: "III" },
    { semitones: 5, degree: "IV" },
    { semitones: 7, degree: "V" },
    { semitones: 8, degree: "VI" },
    { semitones: 10, degree: "VII" },
  ];

  const currentModeColor =
    allModes.find((m) => m.id === selectedMode)?.color || "#6C63FF";

  return (
    <div className="scale-tab">
      {/* Info du mode sélectionné */}
      <div className="mode-info" style={{ borderLeftColor: currentModeColor }}>
        <h3 className="mode-info__name" style={{ color: currentModeColor }}>
          {modeInfo.name}
        </h3>
        <p className="mode-info__description">{modeInfo.description}</p>
        <div className="mode-info__details">
          <span>
            <strong>Structure:</strong> {modeInfo.pattern}
          </span>
          <span>
            <strong>Caractère:</strong> {modeInfo.character}
          </span>
          <span>
            <strong>Usage:</strong> {modeInfo.usage}
          </span>
        </div>
      </div>

      {/* Clavier de piano avec toutes les notes de la gamme */}
      <div className="scale-piano">
        <div className="scale-piano__header">
          <h4>Touches du piano</h4>
          <button
            className={`scale-piano__play-btn ${isPlayingScale ? "scale-piano__play-btn--active" : ""}`}
            onClick={() => handlePlayScale(currentScale)}
            style={{ backgroundColor: currentModeColor }}
          >
            ▶ Jouer la gamme
          </button>
        </div>
        <PianoKeys
          ref={pianoKeysRef}
          notes={currentScale}
          highlightColor={currentModeColor}
        />
      </div>
      {/* Sélecteur de modes par catégorie */}
      <div className="mode-selector">
        <h3 className="mode-selector__title">Choisir une gamme:</h3>
        {modeCategories.map((category) => (
          <div key={category.name} className="mode-category">
            <h4 className="mode-category__title">{category.name}</h4>
            <div className="mode-selector__buttons">
              {category.modes.map((mode) => (
                <button
                  key={mode.id}
                  className={`mode-selector__button ${selectedMode === mode.id ? "mode-selector__button--active" : ""}`}
                  onClick={() => setSelectedMode(mode.id)}
                  style={{
                    borderColor:
                      selectedMode === mode.id ? mode.color : "transparent",
                    backgroundColor:
                      selectedMode === mode.id
                        ? `${mode.color}20`
                        : "transparent",
                  }}
                >
                  {getModeInfo(mode.id).name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes de la gamme */}
      <div className="scale-section">
        <h3 className="scale-section__title">Notes de la gamme</h3>
        <div className="scale-notes">
          {currentScale.map((note, index) => (
            <div
              key={`scale-${index}`}
              className="scale-note scale-note--clickable"
              onClick={() => handleNoteClick(note)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && handleNoteClick(note)}
              style={{ borderColor: currentModeColor }}
            >
              <div className="scale-note__degree">
                {["I", "II", "III", "IV", "V", "VI", "VII"][index]}
              </div>
              <div className="scale-note__name">{note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScaleTab;
