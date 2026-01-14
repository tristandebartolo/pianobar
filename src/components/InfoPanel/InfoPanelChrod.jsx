import React from 'react';
import { useAppContext } from '../../context/AppContext.js';
import ChordsTab from './ChordsTab.jsx';

function InfoPanelChrod() {
  const { state } = useAppContext();
  const { selectedKey } = state;

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
  
  return (
    <div className="info-panel">
      <div className="info-panel__content">
        <ChordsTab keyData={selectedKey} />
      </div>
    </div>
  );
}

export default InfoPanelChrod;
