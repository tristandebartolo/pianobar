import React from 'react';
import { useAppContext } from '../../context/AppContext.js';

function Controls() {
  const { state, dispatch } = useAppContext();
  const { rotation, zoom, showRelationships, mode } = state;

  const handleRotateLeft = () => {
    dispatch({ type: 'ROTATE_CIRCLE', payload: -30 });
  };

  const handleRotateRight = () => {
    dispatch({ type: 'ROTATE_CIRCLE', payload: 30 });
  };

  const handleZoomChange = (e) => {
    dispatch({ type: 'SET_ZOOM', payload: parseFloat(e.target.value) });
  };

  const handleResetView = () => {
    dispatch({ type: 'RESET_VIEW' });
  };

  const handleToggleRelationships = () => {
    dispatch({ type: 'TOGGLE_RELATIONSHIPS' });
  };

  const handleToggleMode = () => {
    dispatch({ type: 'TOGGLE_MODE' });
  };

  return (
    <div className="controls">
      <div className="controls__section">
        <h3 className="controls__title">Rotation</h3>
        <div className="controls__buttons">
          <button
            className="controls__button"
            onClick={handleRotateLeft}
            aria-label="Rotate left"
          >
            ↺
          </button>
          <button
            className="controls__button controls__button--reset"
            onClick={handleResetView}
            aria-label="Reset view"
          >
            ⟲
          </button>
          <button
            className="controls__button"
            onClick={handleRotateRight}
            aria-label="Rotate right"
          >
            ↻
          </button>
        </div>
        <div className="controls__info">
          {rotation}°
        </div>
      </div>

      <div className="controls__section">
        <h3 className="controls__title">Zoom</h3>
        <div className="controls__zoom">
          <span className="controls__zoom-label">-</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={handleZoomChange}
            className="controls__slider"
            aria-label="Zoom level"
          />
          <span className="controls__zoom-label">+</span>
        </div>
        <div className="controls__info">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      <div className="controls__section">
        <button
          className={`controls__toggle ${showRelationships ? 'controls__toggle--active' : ''}`}
          onClick={handleToggleRelationships}
          aria-pressed={showRelationships}
          aria-label={`Afficher les relations harmoniques${showRelationships ? ', activé' : ', désactivé'}`}
        >
          {showRelationships ? '✓' : '○'} Relations
        </button>
      </div>

      <div className="controls__section">
        <button
          className={`controls__mode-button ${mode === 'quiz' ? 'controls__mode-button--quiz' : ''}`}
          onClick={handleToggleMode}
          aria-label={mode === 'explore' ? 'Passer en mode Quiz' : 'Passer en mode Exploration'}
        >
          {mode === 'explore' ? '🎮 Mode Quiz' : '🔍 Mode Exploration'}
        </button>
      </div>
    </div>
  );
}

export default Controls;
