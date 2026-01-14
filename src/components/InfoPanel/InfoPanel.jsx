import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.js';
import ScaleTab from './ScaleTab.jsx';
import ChordsTab from './ChordsTab.jsx';
import RelationshipsTab from './RelationshipsTab.jsx';
import MagicNotesTab from './MagicNotesTab.jsx';
import ProgressionsTab from './ProgressionsTab.jsx';

function InfoPanel() {
  const { state } = useAppContext();
  const { selectedKey } = state;
  const [activeTab, setActiveTab] = useState('magic');

  if (!selectedKey) {
    return (
      <div className="info-panel info-panel--empty">
        <div className="info-panel__placeholder">
          <h3>Sélectionnez une tonalité</h3>
          <p>Cliquez sur une section du cercle pour afficher ses informations</p>
        </div>
      </div>
    );
  }

  const isMinor = selectedKey.selectedMode === 'minor';
  const currentKeyName = isMinor ? selectedKey.minorKey : selectedKey.majorKey;
  const modeLabel = isMinor ? 'mineur' : 'Majeur';

  const tabs = [
    { id: 'magic', label: '✨ Notes Magiques' },
    { id: 'scale', label: 'Gammes' },
    { id: 'chords', label: 'Accords' },
    { id: 'progressions', label: 'Progressions' },
    { id: 'relationships', label: 'Relations' }
  ];

  return (
    <div className="info-panel">
      <div className="info-panel__header">
        <h2 className="info-panel__title">
          {currentKeyName} {modeLabel}
        </h2>
        {selectedKey.accidentals.count > 0 && (
          <p className="info-panel__accidentals">
            {selectedKey.accidentals.count}{' '}
            {selectedKey.accidentals.type === 'sharp' ? 'dièses' : 'bémols'}
          </p>
        )}
        {selectedKey.accidentals.count === 0 && (
          <p className="info-panel__accidentals">Aucune altération</p>
        )}
      </div>

      <div className="info-panel__tabs" role="tablist" aria-label="Informations sur la tonalité">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`info-panel__tab ${
              activeTab === tab.id ? 'info-panel__tab--active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="info-panel__content" role="tabpanel" id={`tabpanel-${activeTab}`}>
        {activeTab === 'magic' && <MagicNotesTab keyData={selectedKey} isMinor={isMinor} />}
        {activeTab === 'scale' && <ScaleTab keyData={selectedKey} isMinor={isMinor} />}
        {activeTab === 'chords' && <ChordsTab keyData={selectedKey} isMinor={isMinor} />}
        {activeTab === 'progressions' && <ProgressionsTab keyData={selectedKey} isMinor={isMinor} />}
        {activeTab === 'relationships' && <RelationshipsTab keyData={selectedKey} isMinor={isMinor} />}
      </div>
    </div>
  );
}

export default InfoPanel;
