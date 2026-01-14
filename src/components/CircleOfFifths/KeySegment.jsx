import React from 'react';

function KeySegment({ keyData, isOuter, isSelected, isHighlighted, degree, onClick }) {
  const radius = isOuter ? 200 : 140;
  const innerRadius = isOuter ? 140 : 80;
  const angle = 30; // 360 / 12
  const startAngle = keyData.position * angle - 90; // -90 pour commencer en haut

  // Convertir en radians
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = ((startAngle + angle) * Math.PI) / 180;

  // Calculer les points du path
  const x1 = radius * Math.cos(startRad);
  const y1 = radius * Math.sin(startRad);
  const x2 = radius * Math.cos(endRad);
  const y2 = radius * Math.sin(endRad);
  const x3 = innerRadius * Math.cos(endRad);
  const y3 = innerRadius * Math.sin(endRad);
  const x4 = innerRadius * Math.cos(startRad);
  const y4 = innerRadius * Math.sin(startRad);

  // Créer le path
  const pathData = `
    M ${x1},${y1}
    A ${radius},${radius} 0 0,1 ${x2},${y2}
    L ${x3},${y3}
    A ${innerRadius},${innerRadius} 0 0,0 ${x4},${y4}
    Z
  `;

  // Position du texte (au milieu du segment)
  const midAngle = startAngle + angle / 2;
  const midRad = (midAngle * Math.PI) / 180;
  const textRadius = (radius + innerRadius) / 2;
  const textX = textRadius * Math.cos(midRad);
  const textY = textRadius * Math.sin(midRad);

  // Couleur
  const color = isOuter ? keyData.color.primary : keyData.color.secondary;
  let fillColor = color;
  let strokeColor = "rgba(255, 255, 255, 0.1)";
  let strokeWidth = 1;

  if (isSelected) {
    strokeColor = '#FFD700';
    strokeWidth = 4;
  } else if (isHighlighted) {
    strokeColor = '#FFFFFF';
    strokeWidth = 2;
  }

  const label = isOuter ? keyData.majorKey : keyData.minorKey;
  const textColor = '#FFFFFF';

  // Calcul de la position du degré (légèrement décalé)
  const degreeOffsetY = isOuter ? -12 : -8;
  const labelOffsetY = degree ? 4 : 0;

  return (
    <g
      className={`key-segment ${isSelected ? 'key-segment--selected' : ''} ${
        isHighlighted ? 'key-segment--highlighted' : ''
      }`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }}}
      tabIndex={0}
      role="button"
      aria-label={`${label} ${isOuter ? 'majeur' : 'mineur'}${isSelected ? ', sélectionné' : ''}${degree ? `, degré ${degree}` : ''}`}
      aria-pressed={isSelected}
      style={{ cursor: 'pointer' }}
    >
      <path
        d={pathData}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className="key-segment__path"
      />

      {/* Affichage du degré (I, II, III, etc.) si la note est dans la gamme */}
      {degree && (
        <text
          x={textX}
          y={textY + degreeOffsetY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#FFD700"
          fontSize={isOuter ? "12" : "10"}
          fontWeight="700"
          className="key-segment__degree"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {degree}
        </text>
      )}

      {/* Nom de la note */}
      <text
        x={textX}
        y={textY + labelOffsetY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize={isSelected ? "18" : "16"}
        fontWeight={isSelected ? "700" : "600"}
        className="key-segment__label"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {label}
      </text>

      {/* Affichage des altérations pour le cercle externe (seulement si pas de degré affiché) */}
      {isOuter && keyData.accidentals.count > 0 && !degree && (
        <text
          x={textX}
          y={textY + 18}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255, 255, 255, 0.7)"
          fontSize="10"
          className="key-segment__accidentals"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {keyData.accidentals.count}{keyData.accidentals.type === 'sharp' ? '♯' : '♭'}
        </text>
      )}
    </g>
  );
}

export default KeySegment;
