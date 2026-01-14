import React from "react";
import { getKeyRelationships, getScaleDegreesInfo } from "../../utils/musicTheory.js";

function RelationshipsTab({ keyData, isMinor = false }) {
  const keyRelationships = getKeyRelationships(keyData.id, !isMinor);
  const scaleDegreesInfo = getScaleDegreesInfo(keyData.id, !isMinor);

  const relationshipDescriptions = {
    relative: "Partage la même armure (mêmes altérations)",
    parallel: "Même tonique, mode différent",
  };

  // Grouper par type
  const groupedRelations = keyRelationships.reduce((acc, rel) => {
    if (!acc[rel.type]) {
      acc[rel.type] = [];
    }
    acc[rel.type].push(rel);
    return acc;
  }, {});

  return (
    <div className="relationships-tab">
      <div className="relationships-intro">
        <p>
          Les relations entre tonalités sont essentielles pour comprendre les
          modulations et les progressions harmoniques.
        </p>
      </div>

      {/* Degrés de la gamme */}
      <div className="scale-degrees-section">
        <h4>Degrés de la gamme</h4>
        <div className="scale-degrees-grid">
          {scaleDegreesInfo.map((degree, index) => (
            <div key={index} className="scale-degree-item">
              <span className="scale-degree-item__roman">{degree.roman}</span>
              <span className="scale-degree-item__note">{degree.note}</span>
              <span className="scale-degree-item__name">{degree.nameFr}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Relations entre tonalités */}
      <div className="relationships-list">
        <h4>Relations entre tonalités</h4>
        {Object.entries(groupedRelations).map(([type, relations]) => (
          <div key={type} className="relationship-group">
            <h5 className="relationship-group__type">{relations[0].label}</h5>
            <p className="relationship-group__description">
              {relationshipDescriptions[type]}
            </p>
            <div className="relationship-group__keys">
              {relations.map((rel, index) => (
                <span key={index} className="relationship-key">
                  {rel.key}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="relationships-theory">
        <h4>Le Cercle des Quintes</h4>
        <p>
          Le cercle des quintes organise les 12 tonalités en fonction de leurs
          relations harmoniques. Chaque étape dans le sens horaire ajoute un
          dièse (ou retire un bémol), tandis que dans le sens anti-horaire, on
          ajoute un bémol (ou retire un dièse).
        </p>
        <p>
          Les tonalités voisines sur le cercle partagent 6 notes sur 7, ce qui
          facilite les modulations et crée des transitions harmoniques
          naturelles.
        </p>
      </div>
    </div>
  );
}

export default RelationshipsTab;
