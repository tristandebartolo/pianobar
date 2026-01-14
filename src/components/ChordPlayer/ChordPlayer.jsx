import React, { useState, useRef, useEffect, useCallback } from "react";
import { audioSystem } from "../../utils/audioSystem.js";
import { getChordNotes, getNoteColor } from "../../utils/musicTheory.js";
import ChordEditModal from "./ChordEditModal.jsx";

// Générer un ID unique
const generateId = () => Math.random().toString(36).substr(2, 9);

// Clé localStorage
const STORAGE_KEY = "chord-player-playlists";

// Progressions disponibles avec noms et descriptions
const PROGRESSIONS = [
  {
    name: "I-V-vi-IV",
    label: "Pop (Axis)",
    chords: ["C", "G", "Am", "F"],
    description: "La progression la plus utilisée en pop",
  },
  {
    name: "vi-IV-I-V",
    label: "Ballade",
    chords: ["Am", "F", "C", "G"],
    description: "Version émotionnelle de l'Axis",
  },
  {
    name: "I-vi-IV-V",
    label: "50s Doo-wop",
    chords: ["C", "Am", "F", "G"],
    description: "Classique des années 50",
  },
  {
    name: "ii-V-I",
    label: "Jazz ii-V-I",
    chords: ["Dm7", "G7", "Cmaj7"],
    description: "La cadence jazz fondamentale",
  },
  {
    name: "I-IV-V-I",
    label: "Blues/Rock",
    chords: ["C", "F", "G", "C"],
    description: "Base du blues et rock",
  },
  {
    name: "i-iv-V-i",
    label: "Mineur classique",
    chords: ["Am", "Dm", "E", "Am"],
    description: "Progression mineure dramatique",
  },
  {
    name: "I-V-vi-iii-IV",
    label: "Canon Pachelbel",
    chords: ["C", "G", "Am", "Em", "F"],
    description: "Inspiré du Canon de Pachelbel",
  },
  {
    name: "i-VII-VI-V",
    label: "Andalouse",
    chords: ["Am", "G", "F", "E"],
    description: "Cadence flamenco/andalouse",
  },
  {
    name: "I-bVII-IV-I",
    label: "Rock modal",
    chords: ["C", "Bb", "F", "C"],
    description: "Rock classique avec bVII",
  },
  {
    name: "vi-V-IV-III",
    label: "Epic",
    chords: ["Am", "G", "F", "E"],
    description: "Progression épique cinématique",
  },
  {
    name: "I-IV-vi-V",
    label: "Moderne",
    chords: ["C", "F", "Am", "G"],
    description: "Pop contemporaine",
  },
  {
    name: "i-VI-III-VII",
    label: "Mineur pop",
    chords: ["Am", "F", "C", "G"],
    description: "Mineur accessible",
  },
  {
    name: "ii-V-I-VI",
    label: "Rhythm Changes",
    chords: ["Dm7", "G7", "Cmaj7", "A7"],
    description: "Variation jazz",
  },
  {
    name: "I-iii-IV-V",
    label: "Romantique",
    chords: ["C", "Em", "F", "G"],
    description: "Doux et romantique",
  },
  {
    name: "i-i-iv-V",
    label: "12 Bar Minor",
    chords: ["Am", "Am", "Dm", "E"],
    description: "Blues mineur simplifié",
  },
];

const BEATS_PER_SECTION = 16;
const BEATS_PER_MEASURE = 4;

function ChordPlayer() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState([{ id: generateId(), chords: [] }]);
  const [selectedChord, setSelectedChord] = useState(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragState, setDragState] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [showProgressionMenu, setShowProgressionMenu] = useState(null); // sectionIndex ou null

  const playIntervalRef = useRef(null);
  const timelineRefs = useRef([]);
  const bpmRef = useRef(bpm);
  const sectionsRef = useRef(sections);
  const globalBeatRef = useRef(0);

  // Synchroniser les refs avec les states
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  // Charger les playlists depuis localStorage au montage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPlaylists(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erreur de chargement des playlists:", e);
    }
  }, []);

  // Sauvegarder les playlists dans localStorage
  const savePlaylists = useCallback((newPlaylists) => {
    setPlaylists(newPlaylists);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlaylists));
    } catch (e) {
      console.error("Erreur de sauvegarde des playlists:", e);
    }
  }, []);

  // Nettoyer le timeout lors du démontage
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearTimeout(playIntervalRef.current);
      }
    };
  }, []);

  // Nombre total de beats
  const totalBeats = sections.length * BEATS_PER_SECTION;

  // Lecture des accords avec BPM dynamique
  const playChords = useCallback(() => {
    if (isPlaying) {
      clearTimeout(playIntervalRef.current);
      setIsPlaying(false);
      setCurrentBeat(-1);
      setCurrentSection(0);
      globalBeatRef.current = 0;
      return;
    }

    audioSystem.init();
    setIsPlaying(true);
    globalBeatRef.current = 0;

    const playBeat = () => {
      const currentSections = sectionsRef.current;
      const currentBpm = bpmRef.current;
      const totalBeatsNow = currentSections.length * BEATS_PER_SECTION;

      const sectionIndex = Math.floor(
        globalBeatRef.current / BEATS_PER_SECTION
      );
      const beatInSection = globalBeatRef.current % BEATS_PER_SECTION;

      setCurrentSection(sectionIndex);
      setCurrentBeat(beatInSection);

      // Trouver l'accord dans la section courante
      const section = currentSections[sectionIndex];
      if (section) {
        const chord = section.chords.find((c) => c.startBeat === beatInSection);
        if (chord) {
          const notes = getChordNotes(chord.name);
          const chordDuration = (chord.duration * 60) / currentBpm;
          audioSystem.playChord(notes, 0.7, chordDuration);
        }
      }

      globalBeatRef.current++;
      if (globalBeatRef.current >= totalBeatsNow) {
        globalBeatRef.current = 0;
      }

      // Utiliser setTimeout avec le BPM actuel pour permettre les changements dynamiques
      const beatDuration = (60 / currentBpm) * 1000;
      playIntervalRef.current = setTimeout(playBeat, beatDuration);
    };

    playBeat();
  }, [isPlaying]);

  // Arrêter la lecture
  const stopPlayback = useCallback(() => {
    if (playIntervalRef.current) {
      clearTimeout(playIntervalRef.current);
    }
    setIsPlaying(false);
    setCurrentBeat(-1);
    setCurrentSection(0);
    globalBeatRef.current = 0;
  }, []);

  // Ajouter une nouvelle section
  const addSection = useCallback(() => {
    setSections([...sections, { id: generateId(), chords: [] }]);
  }, [sections]);

  // Supprimer une section
  const removeSection = useCallback(
    (sectionIndex) => {
      if (sections.length <= 1) return;
      stopPlayback();
      setSections(sections.filter((_, i) => i !== sectionIndex));
    },
    [sections, stopPlayback]
  );

  // Dupliquer une section
  const duplicateSection = useCallback(
    (sectionIndex) => {
      const sectionToCopy = sections[sectionIndex];
      const newSection = {
        id: generateId(),
        chords: sectionToCopy.chords.map((chord) => ({
          ...chord,
          id: generateId(),
        })),
      };
      const newSections = [...sections];
      newSections.splice(sectionIndex + 1, 0, newSection);
      setSections(newSections);
    },
    [sections]
  );

  // Mélanger les accords d'une section
  const shuffleSectionChords = useCallback(
    (sectionIndex) => {
      const section = sections[sectionIndex];
      if (section.chords.length === 0) return;

      const positions = section.chords.map((chord) => chord.startBeat);
      const durations = section.chords.map((chord) => chord.duration);
      const names = section.chords.map((chord) => chord.name);
      const shuffledNames = [...names].sort(() => Math.random() - 0.5);

      const shuffledChords = section.chords.map((chord, i) => ({
        ...chord,
        name: shuffledNames[i],
      }));

      setSections(
        sections.map((s, i) =>
          i === sectionIndex ? { ...s, chords: shuffledChords } : s
        )
      );
    },
    [sections]
  );

  // Copier une section dans le presse-papier
  const copySection = useCallback(
    (sectionIndex) => {
      const sectionToCopy = sections[sectionIndex];
      setClipboard({
        chords: sectionToCopy.chords.map((chord) => ({ ...chord })),
      });
    },
    [sections]
  );

  // Coller le contenu du presse-papier dans une section
  const pasteSection = useCallback(
    (sectionIndex) => {
      if (!clipboard) return;

      const newChords = clipboard.chords.map((chord) => ({
        ...chord,
        id: generateId(),
      }));

      setSections(
        sections.map((section, i) =>
          i === sectionIndex ? { ...section, chords: newChords } : section
        )
      );
    },
    [clipboard, sections]
  );

  // Sauvegarder la session actuelle comme playlist
  const saveAsPlaylist = useCallback(
    (name) => {
      if (!name.trim()) return;

      const newPlaylist = {
        id: generateId(),
        name: name.trim(),
        bpm,
        sections: sections.map((section) => ({
          id: generateId(),
          chords: section.chords.map((chord) => ({ ...chord })),
        })),
        createdAt: new Date().toISOString(),
      };

      const updatedPlaylists = [...playlists, newPlaylist];
      savePlaylists(updatedPlaylists);
      setNewPlaylistName("");
      setShowPlaylistModal(false);
    },
    [bpm, sections, playlists, savePlaylists]
  );

  // Charger une playlist
  const loadPlaylist = useCallback(
    (playlistId) => {
      const playlist = playlists.find((p) => p.id === playlistId);
      if (!playlist) return;

      stopPlayback();
      setBpm(playlist.bpm);
      setSections(
        playlist.sections.map((section) => ({
          id: generateId(),
          chords: section.chords.map((chord) => ({
            ...chord,
            id: generateId(),
          })),
        }))
      );
      setShowPlaylistModal(false);
    },
    [playlists, stopPlayback]
  );

  // Mettre à jour une playlist existante
  const updatePlaylist = useCallback(
    (playlistId) => {
      const updatedPlaylists = playlists.map((p) =>
        p.id === playlistId
          ? {
              ...p,
              bpm,
              sections: sections.map((section) => ({
                id: generateId(),
                chords: section.chords.map((chord) => ({ ...chord })),
              })),
              updatedAt: new Date().toISOString(),
            }
          : p
      );
      savePlaylists(updatedPlaylists);
      setEditingPlaylistId(null);
    },
    [bpm, sections, playlists, savePlaylists]
  );

  // Supprimer une playlist
  const deletePlaylist = useCallback(
    (playlistId) => {
      const updatedPlaylists = playlists.filter((p) => p.id !== playlistId);
      savePlaylists(updatedPlaylists);
    },
    [playlists, savePlaylists]
  );

  // Appliquer une progression à une section
  const applyProgression = useCallback(
    (sectionIndex, progression) => {
      stopPlayback();
      const chordCount = progression.chords.length;
      const beatsPerChord = Math.floor(BEATS_PER_SECTION / chordCount);

      const newChords = progression.chords.map((chord, index) => ({
        id: generateId(),
        name: chord,
        startBeat: index * beatsPerChord,
        duration: beatsPerChord,
      }));

      setSections(
        sections.map((section, i) =>
          i === sectionIndex ? { ...section, chords: newChords } : section
        )
      );
      setShowProgressionMenu(null);
    },
    [stopPlayback, sections]
  );

  // Générer une progression aléatoire (pour compatibilité)
  const generateChords = useCallback(
    (sectionIndex = 0) => {
      const randomProgression =
        PROGRESSIONS[Math.floor(Math.random() * PROGRESSIONS.length)];
      applyProgression(sectionIndex, randomProgression);
    },
    [applyProgression]
  );

  // Ajouter un accord à un beat dans une section
  const addChord = useCallback(
    (sectionIndex, beat) => {
      const section = sections[sectionIndex];
      const existingChord = section.chords.find(
        (c) => beat >= c.startBeat && beat < c.startBeat + c.duration
      );

      if (existingChord) {
        setSelectedChord(existingChord);
        setSelectedSectionIndex(sectionIndex);
        setIsModalOpen(true);
        return;
      }

      const newChord = {
        id: generateId(),
        name: "C",
        startBeat: beat,
        duration: 1,
      };

      setSections(
        sections.map((s, i) =>
          i === sectionIndex ? { ...s, chords: [...s.chords, newChord] } : s
        )
      );
      setSelectedChord(newChord);
      setSelectedSectionIndex(sectionIndex);
      setIsModalOpen(true);
    },
    [sections]
  );

  // Mettre à jour un accord
  const updateChord = useCallback(
    (updatedChord) => {
      if (selectedSectionIndex === null) return;

      setSections(
        sections.map((section, i) =>
          i === selectedSectionIndex
            ? {
                ...section,
                chords: section.chords.map((c) =>
                  c.id === updatedChord.id ? updatedChord : c
                ),
              }
            : section
        )
      );
      setIsModalOpen(false);
      setSelectedChord(null);
      setSelectedSectionIndex(null);
    },
    [sections, selectedSectionIndex]
  );

  // Supprimer un accord
  const deleteChord = useCallback(
    (chordId) => {
      if (selectedSectionIndex === null) return;

      setSections(
        sections.map((section, i) =>
          i === selectedSectionIndex
            ? {
                ...section,
                chords: section.chords.filter((c) => c.id !== chordId),
              }
            : section
        )
      );
      setIsModalOpen(false);
      setSelectedChord(null);
      setSelectedSectionIndex(null);
    },
    [sections, selectedSectionIndex]
  );

  // Gestion du drag pour redimensionner
  const handleMouseDown = useCallback((e, sectionIndex, chord, edge) => {
    e.stopPropagation();
    setDragState({
      sectionIndex,
      chordId: chord.id,
      edge,
      startX: e.clientX,
      originalStart: chord.startBeat,
      originalDuration: chord.duration,
    });
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragState) return;

      const timelineRef = timelineRefs.current[dragState.sectionIndex];
      if (!timelineRef) return;

      const timelineRect = timelineRef.getBoundingClientRect();
      const beatWidth = timelineRect.width / BEATS_PER_SECTION;
      const deltaBeats = Math.round((e.clientX - dragState.startX) / beatWidth);

      setSections((prevSections) =>
        prevSections.map((section, sIndex) => {
          if (sIndex !== dragState.sectionIndex) return section;

          return {
            ...section,
            chords: section.chords.map((chord) => {
              if (chord.id !== dragState.chordId) return chord;

              if (dragState.edge === "right") {
                const newDuration = Math.max(
                  1,
                  Math.min(
                    BEATS_PER_SECTION - chord.startBeat,
                    dragState.originalDuration + deltaBeats
                  )
                );
                return { ...chord, duration: newDuration };
              } else if (dragState.edge === "left") {
                const newStart = Math.max(
                  0,
                  Math.min(
                    dragState.originalStart + dragState.originalDuration - 1,
                    dragState.originalStart + deltaBeats
                  )
                );
                const newDuration =
                  dragState.originalDuration -
                  (newStart - dragState.originalStart);
                return { ...chord, startBeat: newStart, duration: newDuration };
              }
              return chord;
            }),
          };
        })
      );
    },
    [dragState]
  );

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  useEffect(() => {
    if (dragState) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  // Export MIDI (toutes les sections)
  const exportMidi = useCallback(() => {
    const allChords = sections.flatMap((section, sectionIndex) =>
      section.chords.map((chord) => ({
        ...chord,
        startBeat: chord.startBeat + sectionIndex * BEATS_PER_SECTION,
      }))
    );

    const midiData = generateMidiData(allChords, bpm);
    const blob = new Blob([midiData], { type: "audio/midi" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chord-progression.mid";
    a.click();
    URL.revokeObjectURL(url);
  }, [sections, bpm]);

  // Obtenir la couleur d'un accord
  const getChordColor = (chordName) => {
    // Extraire la note racine (avec altération éventuelle)
    const match = chordName.match(/^([A-G][#b]?)/);
    const root = match ? match[1] : chordName;
    const colorInfo = getNoteColor(root);
    return colorInfo?.color || "hsl(245, 100%, 69%)";
  };

  // Vérifier si des accords existent
  const hasChords = sections.some((s) => s.chords.length > 0);

  return (
    <div className="chord-player">
      <div className="chord-player__header">
        <h3 className="chord-player__title">Chord Player</h3>
        <span className="chord-player__section-count">
          {sections.length} section{sections.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Contrôles */}
      <div className="chord-player__controls">
        <div className="chord-player__control-group">
          <label className="chord-player__label">BPM</label>
          <input
            type="range"
            min="60"
            max="200"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="chord-player__slider"
          />
          <span className="chord-player__bpm-value">{bpm}</span>
        </div>

        <div className="chord-player__buttons">
          <button
            className={`chord-player__btn chord-player__btn--play ${isPlaying ? "chord-player__btn--active" : ""}`}
            onClick={playChords}
          >
            {isPlaying ? "⏹ Stop" : "▶ Play"}
          </button>
          <button
            className="chord-player__btn chord-player__btn--generate"
            onClick={() => generateChords(0)}
          >
            🎲 Generate
          </button>
          <button
            className="chord-player__btn chord-player__btn--export"
            onClick={exportMidi}
            disabled={!hasChords}
          >
            📥 Export MIDI
          </button>
          <button
            className="chord-player__btn chord-player__btn--add-section"
            onClick={addSection}
          >
            + Section
          </button>
          <button
            className="chord-player__btn chord-player__btn--playlist"
            onClick={() => setShowPlaylistModal(true)}
          >
            💾 Playlists
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="chord-player__sections">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className={`chord-player__section ${currentSection === sectionIndex && isPlaying ? "chord-player__section--active" : ""}`}
          >
            {/* En-tête de section */}
            <div className="chord-player__section-header">
              <span className="chord-player__section-title">
                Section {sectionIndex + 1}
              </span>
              <div className="chord-player__section-actions">
                <div className="chord-player__progression-selector">
                  <button
                    className="chord-player__section-btn"
                    onClick={() =>
                      setShowProgressionMenu(
                        showProgressionMenu === sectionIndex
                          ? null
                          : sectionIndex
                      )
                    }
                    title="Choisir une progression"
                  >
                    🎲
                  </button>
                  {showProgressionMenu === sectionIndex && (
                    <div className="chord-player__progression-menu">
                      <div className="chord-player__progression-menu-header">
                        <span>Choisir une progression</span>
                        <button onClick={() => setShowProgressionMenu(null)}>
                          ×
                        </button>
                      </div>
                      <div className="chord-player__progression-list">
                        {PROGRESSIONS.map((prog, idx) => (
                          <button
                            key={idx}
                            className="chord-player__progression-item"
                            onClick={() => applyProgression(sectionIndex, prog)}
                            title={prog.description}
                          >
                            <span className="chord-player__progression-name">
                              {prog.label}
                            </span>
                            <span className="chord-player__progression-chords">
                              {prog.chords.join(" - ")}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {section.chords.length > 0 && (
                  <button
                    className="chord-player__section-btn"
                    onClick={() => shuffleSectionChords(sectionIndex)}
                    title="Mélanger les accords"
                  >
                    🔀
                  </button>
                )}
                <button
                  className="chord-player__section-btn"
                  onClick={() => copySection(sectionIndex)}
                  title="Copier la section"
                >
                  📄
                </button>
                <button
                  className={`chord-player__section-btn ${!clipboard ? "chord-player__section-btn--disabled" : ""}`}
                  onClick={() => pasteSection(sectionIndex)}
                  disabled={!clipboard}
                  title="Coller dans la section"
                >
                  📥
                </button>
                <button
                  className="chord-player__section-btn"
                  onClick={() => duplicateSection(sectionIndex)}
                  title="Dupliquer la section"
                >
                  📋
                </button>
                {sections.length > 1 && (
                  <button
                    className="chord-player__section-btn chord-player__section-btn--delete"
                    onClick={() => removeSection(sectionIndex)}
                    title="Supprimer la section"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Timeline de la section */}
            <div className="chord-player__timeline-container">
              {/* Indicateurs de mesure */}
              <div className="chord-player__measures">
                {[...Array(BEATS_PER_SECTION / BEATS_PER_MEASURE)].map(
                  (_, i) => (
                    <div key={i} className="chord-player__measure">
                      Mesure {i + 1}
                    </div>
                  )
                )}
              </div>

              {/* Indicateurs de temps */}
              <div className="chord-player__beat-markers">
                {[...Array(BEATS_PER_SECTION)].map((_, i) => (
                  <div
                    key={i}
                    className={`chord-player__beat-marker ${i % BEATS_PER_MEASURE === 0 ? "chord-player__beat-marker--strong" : ""}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Grille de timeline */}
              <div
                ref={(el) => (timelineRefs.current[sectionIndex] = el)}
                className="chord-player__timeline"
                onClick={(e) => {
                  if (
                    e.target === e.currentTarget ||
                    e.target.classList.contains("chord-player__beat")
                  ) {
                    const rect =
                      timelineRefs.current[
                        sectionIndex
                      ].getBoundingClientRect();
                    const beat = Math.floor(
                      (e.clientX - rect.left) / (rect.width / BEATS_PER_SECTION)
                    );
                    addChord(sectionIndex, beat);
                  }
                }}
              >
                {/* Grille des beats */}
                {[...Array(BEATS_PER_SECTION)].map((_, i) => (
                  <div
                    key={i}
                    className={`chord-player__beat ${
                      i % BEATS_PER_MEASURE === 0
                        ? "chord-player__beat--measure"
                        : ""
                    } ${currentSection === sectionIndex && currentBeat === i ? "chord-player__beat--current" : ""}`}
                  />
                ))}

                {/* Accords placés */}
                {section.chords.map((chord) => (
                  <div
                    key={chord.id}
                    className={`chord-player__chord ${
                      currentSection === sectionIndex &&
                      currentBeat >= chord.startBeat &&
                      currentBeat < chord.startBeat + chord.duration
                        ? "chord-player__chord--playing"
                        : ""
                    }`}
                    style={{
                      left: `${(chord.startBeat / BEATS_PER_SECTION) * 100}%`,
                      width: `${(chord.duration / BEATS_PER_SECTION) * 100}%`,
                      backgroundColor: getChordColor(chord.name),
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="chord-player__chord-handle chord-player__chord-handle--left"
                      onMouseDown={(e) =>
                        handleMouseDown(e, sectionIndex, chord, "left")
                      }
                    />

                    <div className="chord-player__chord-content">
                      <span className="chord-player__chord-name">
                        {chord.name}
                      </span>
                      <span className="chord-player__chord-duration">
                        {chord.duration}t
                      </span>
                    </div>

                    <button
                      className="chord-player__chord-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChord(chord);
                        setSelectedSectionIndex(sectionIndex);
                        setIsModalOpen(true);
                      }}
                      title="Modifier l'accord"
                    >
                      ✎
                    </button>

                    <div
                      className="chord-player__chord-handle chord-player__chord-handle--right"
                      onMouseDown={(e) =>
                        handleMouseDown(e, sectionIndex, chord, "right")
                      }
                    />
                  </div>
                ))}

                {/* Indicateur de position */}
                {currentSection === sectionIndex && currentBeat >= 0 && (
                  <div
                    className="chord-player__playhead"
                    style={{
                      left: `${(currentBeat / BEATS_PER_SECTION) * 100}%`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="chord-player__instructions">
        <p>
          Cliquez sur la timeline pour ajouter un accord. Glissez les bords pour
          ajuster la durée. Utilisez "+ Section" pour ajouter plus de mesures.
        </p>
      </div>

      {/* Modal d'édition */}
      {isModalOpen && selectedChord && (
        <ChordEditModal
          chord={selectedChord}
          onUpdate={updateChord}
          onDelete={deleteChord}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedChord(null);
            setSelectedSectionIndex(null);
          }}
        />
      )}

      {/* Modal de gestion des playlists */}
      {showPlaylistModal && (
        <div
          className="playlist-modal-overlay"
          onClick={() => setShowPlaylistModal(false)}
        >
          <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="playlist-modal__header">
              <h3>Gestion des Playlists</h3>
              <button
                className="playlist-modal__close"
                onClick={() => setShowPlaylistModal(false)}
              >
                ×
              </button>
            </div>

            <div className="playlist-modal__content">
              {/* Formulaire de nouvelle playlist */}
              <div className="playlist-modal__new">
                <input
                  type="text"
                  placeholder="Nom de la nouvelle playlist..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="playlist-modal__input"
                  onKeyDown={(e) =>
                    e.key === "Enter" && saveAsPlaylist(newPlaylistName)
                  }
                />
                <button
                  className="playlist-modal__save-btn"
                  onClick={() => saveAsPlaylist(newPlaylistName)}
                  disabled={!newPlaylistName.trim()}
                >
                  💾 Sauvegarder
                </button>
              </div>

              {/* Liste des playlists */}
              <div className="playlist-modal__list">
                {playlists.length === 0 ? (
                  <p className="playlist-modal__empty">
                    Aucune playlist sauvegardée
                  </p>
                ) : (
                  playlists.map((playlist) => (
                    <div key={playlist.id} className="playlist-modal__item">
                      <div className="playlist-modal__item-info">
                        <span className="playlist-modal__item-name">
                          {playlist.name}
                        </span>
                        <span className="playlist-modal__item-meta">
                          {playlist.bpm} BPM • {playlist.sections.length}{" "}
                          section{playlist.sections.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="playlist-modal__item-actions">
                        <button
                          className="playlist-modal__item-btn playlist-modal__item-btn--load"
                          onClick={() => loadPlaylist(playlist.id)}
                          title="Charger"
                        >
                          📂
                        </button>
                        {editingPlaylistId === playlist.id ? (
                          <button
                            className="playlist-modal__item-btn playlist-modal__item-btn--confirm"
                            onClick={() => updatePlaylist(playlist.id)}
                            title="Confirmer la mise à jour"
                          >
                            ✓
                          </button>
                        ) : (
                          <button
                            className="playlist-modal__item-btn playlist-modal__item-btn--update"
                            onClick={() => setEditingPlaylistId(playlist.id)}
                            title="Mettre à jour avec la session actuelle"
                          >
                            🔄
                          </button>
                        )}
                        <button
                          className="playlist-modal__item-btn playlist-modal__item-btn--delete"
                          onClick={() => deletePlaylist(playlist.id)}
                          title="Supprimer"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Génération de données MIDI
function generateMidiData(chords, bpm) {
  const ticksPerBeat = 480;
  const microsecondsPerBeat = Math.round(60000000 / bpm);

  const header = new Uint8Array([
    0x4d,
    0x54,
    0x68,
    0x64,
    0x00,
    0x00,
    0x00,
    0x06,
    0x00,
    0x00,
    0x00,
    0x01,
    (ticksPerBeat >> 8) & 0xff,
    ticksPerBeat & 0xff,
  ]);

  const events = [];

  events.push([
    0x00,
    0xff,
    0x51,
    0x03,
    (microsecondsPerBeat >> 16) & 0xff,
    (microsecondsPerBeat >> 8) & 0xff,
    microsecondsPerBeat & 0xff,
  ]);

  const noteToMidi = {
    C: 60,
    "C#": 61,
    Db: 61,
    D: 62,
    "D#": 63,
    Eb: 63,
    E: 64,
    F: 65,
    "F#": 66,
    Gb: 66,
    G: 67,
    "G#": 68,
    Ab: 68,
    A: 69,
    "A#": 70,
    Bb: 70,
    B: 71,
  };

  let currentTick = 0;

  const sortedChords = [...chords].sort((a, b) => a.startBeat - b.startBeat);

  sortedChords.forEach((chord) => {
    const notes = getChordNotes(chord.name);
    const startTick = chord.startBeat * ticksPerBeat;
    const duration = chord.duration * ticksPerBeat;

    const delta = startTick - currentTick;

    notes.forEach((note, i) => {
      const midiNote = noteToMidi[note] || 60;
      events.push([
        ...(i === 0 ? encodeVariableLength(delta) : [0x00]),
        0x90,
        midiNote,
        0x64,
      ]);
    });

    notes.forEach((note, i) => {
      const midiNote = noteToMidi[note] || 60;
      events.push([
        ...(i === 0 ? encodeVariableLength(duration) : [0x00]),
        0x80,
        midiNote,
        0x00,
      ]);
    });

    currentTick = startTick + duration;
  });

  events.push([0x00, 0xff, 0x2f, 0x00]);

  const trackData = events.flat();

  const trackHeader = new Uint8Array([
    0x4d,
    0x54,
    0x72,
    0x6b,
    (trackData.length >> 24) & 0xff,
    (trackData.length >> 16) & 0xff,
    (trackData.length >> 8) & 0xff,
    trackData.length & 0xff,
  ]);

  const result = new Uint8Array(
    header.length + trackHeader.length + trackData.length
  );
  result.set(header, 0);
  result.set(trackHeader, header.length);
  result.set(new Uint8Array(trackData), header.length + trackHeader.length);

  return result;
}

function encodeVariableLength(value) {
  if (value < 128) return [value];
  const bytes = [];
  bytes.push(value & 0x7f);
  value >>= 7;
  while (value > 0) {
    bytes.unshift((value & 0x7f) | 0x80);
    value >>= 7;
  }
  return bytes;
}

export default ChordPlayer;
