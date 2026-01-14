import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext.js';
import CircleOfFifths from './components/CircleOfFifths/CircleOfFifths.jsx';
import InfoPanel from './components/InfoPanel/InfoPanel.jsx';
import InfoPanelChrod from './components/InfoPanel/InfoPanelChrod.jsx';
import QuizMode from './components/QuizMode/QuizMode.jsx';
import { ChordPlayer } from './components/ChordPlayer/index.js';

function AppContent() {
  const { state, dispatch } = useAppContext();
  const { mode } = state;

  const handleToggleMode = () => {
    dispatch({ type: 'TOGGLE_MODE' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__content">
          <div>
            <h1 className="app-header__title">Cercle des Quintes</h1>
            <p className="app-header__subtitle">
              {mode === 'quiz' ? 'Mode Quiz - Testez vos connaissances!' : 'Apprenez la théorie musicale de façon interactive'}
            </p>
          </div>
          <button
            className="app-header__quiz-button"
            onClick={handleToggleMode}
            aria-label={mode === 'explore' ? 'Passer en mode Quiz' : 'Passer en mode Exploration'}
          >
            {mode === 'explore' ? 'Mode Quiz' : 'Mode Exploration'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {mode === 'explore' ? (
          <>
            <div className="app-content">
              <CircleOfFifths />
            </div>
            <div>
              <InfoPanel />
              <InfoPanelChrod />
              <ChordPlayer />
            </div>
          </>
        ) : (
          <QuizMode />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;