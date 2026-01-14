import React from 'react';
import { useAppContext } from '../../context/AppContext.js';
import { CIRCLE_DATA } from '../../data/circleData.js';
import KeySegment from './KeySegment.jsx';
import { getRelatedKeys } from '../../utils/musicTheory.js';
import { playKeyNote } from '../../utils/audioSystem.js';

function CircleOfFifths() {
  const { state, dispatch } = useAppContext();
  const { selectedKey, highlightedKeys } = state;

  const handleKeyClick = (keyData, isMajor) => {
    // Jouer la note de piano (majeure ou mineure)
    playKeyNote(keyData, isMajor);
    // Stocker la sélection avec l'info majeur/mineur
    dispatch({ type: 'SELECT_KEY', payload: { ...keyData, selectedMode: isMajor ? 'major' : 'minor' } });
    // Highlight les accords diatoniques avec leurs degrés
    const related = getRelatedKeys(keyData.id, isMajor);
    dispatch({ type: 'HIGHLIGHT_KEYS', payload: related });
  };

  // Fonction pour trouver un accord dans les highlightedKeys
  // isOuter = true: cercle externe (majeur)
  // isOuter = false: cercle interne (mineur)
  const findChordInfo = (note, isOuter) => {
    if (!Array.isArray(highlightedKeys)) return null;

    if (isOuter) {
      // Cercle externe: chercher les accords qui ne sont PAS sur le cercle interne
      // (accords majeurs uniquement)
      return highlightedKeys.find(h => !h.isInnerCircle && h.key === note);
    } else {
      // Cercle interne: chercher les accords qui SONT sur le cercle interne
      // (accords mineurs ET diminués)
      return highlightedKeys.find(h => h.isInnerCircle && h.key === note);
    }
  };

  // Fonction pour obtenir le degré d'une note si elle est dans les highlightedKeys
  const getDegreeForNote = (note, isOuter) => {
    const chordInfo = findChordInfo(note, isOuter);
    return chordInfo ? chordInfo.degree : null;
  };

  // Vérifie si une note est highlighted
  const isNoteHighlighted = (note, isOuter) => {
    return findChordInfo(note, isOuter) !== null;
  };

  return (
    <div className="circle-of-fifths">
      <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        className="circle-of-fifths__svg"
        role="img"
        aria-label="Cercle des quintes interactif avec tonalités majeures et mineures"
      >
        <g transform="translate(250, 250)">
          {/* Cercle central */}
          <circle
            cx="0"
            cy="0"
            r="80"
            fill="rgba(45, 46, 66, 0.9)"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
            className="circle-of-fifths__center"
          />

          {/* Logo ou titre au centre */}
          <text
            x="0"
            y="-10"
            textAnchor="middle"
            fill="#E0E0E0"
            fontSize="18"
            fontWeight="700"
            style={{ userSelect: 'none' }}
          >
            Cercle
          </text>
          <text
            x="0"
            y="10"
            textAnchor="middle"
            fill="#E0E0E0"
            fontSize="18"
            fontWeight="700"
            style={{ userSelect: 'none' }}
          >
            des
          </text>
          <text
            x="0"
            y="30"
            textAnchor="middle"
            fill="#E0E0E0"
            fontSize="18"
            fontWeight="700"
            style={{ userSelect: 'none' }}
          >
            Quintes
          </text>

          {/* Cercle interne - Tonalités mineures */}
          <g className="circle-of-fifths__minor-keys">
            {CIRCLE_DATA.map((keyData) => (
              <KeySegment
                key={`minor-${keyData.id}`}
                keyData={keyData}
                isOuter={false}
                isSelected={selectedKey?.id === keyData.id && selectedKey?.selectedMode === 'minor'}
                isHighlighted={isNoteHighlighted(keyData.minorKey, false)}
                degree={getDegreeForNote(keyData.minorKey, false)}
                onClick={() => handleKeyClick(keyData, false)}
              />
            ))}
          </g>

          {/* Cercle externe - Tonalités majeures */}
          <g className="circle-of-fifths__major-keys">
            {CIRCLE_DATA.map((keyData) => (
              <KeySegment
                key={`major-${keyData.id}`}
                keyData={keyData}
                isOuter={true}
                isSelected={selectedKey?.id === keyData.id && selectedKey?.selectedMode === 'major'}
                isHighlighted={isNoteHighlighted(keyData.majorKey, true)}
                degree={getDegreeForNote(keyData.majorKey, true)}
                onClick={() => handleKeyClick(keyData, true)}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}

export default CircleOfFifths;
