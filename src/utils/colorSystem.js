import { getKeyData } from './musicTheory.js';

export function getKeyColor(keyId, type = 'primary') {
  const keyData = getKeyData(keyId);
  if (!keyData) return type === 'primary' ? 'hsl(245, 100%, 69%)' : 'hsl(122, 39%, 49%)';
  return keyData.color[type];
}

export function getRelationshipColor(relationType) {
  const colors = {
    dominant: 'hsl(38, 100%, 65%)',       // Amber
    subdominant: 'hsl(122, 39%, 49%)',    // Green
    relative: 'hsl(245, 100%, 69%)',      // Purple
    parallel: 'hsl(185, 100%, 69%)',      // Cyan
    neighbor: 'hsl(335, 100%, 69%)'       // Pink
  };

  return colors[relationType] || 'hsl(0, 0%, 70%)';
}

export function generateGradient(keyId, direction = 'to bottom') {
  const primary = getKeyColor(keyId, 'primary');
  const secondary = getKeyColor(keyId, 'secondary');

  return `linear-gradient(${direction}, ${primary}, ${secondary})`;
}

export function adjustBrightness(hslColor, amount) {
  const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hslColor;

  const [, h, s, l] = match;
  const newL = Math.max(0, Math.min(100, parseInt(l) + amount));

  return `hsl(${h}, ${s}%, ${newL}%)`;
}

export function adjustSaturation(hslColor, amount) {
  const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hslColor;

  const [, h, s, l] = match;
  const newS = Math.max(0, Math.min(100, parseInt(s) + amount));

  return `hsl(${h}, ${newS}%, ${l}%)`;
}

export function getColorWithOpacity(hslColor, opacity) {
  const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hslColor;

  const [, h, s, l] = match;
  return `hsla(${h}, ${s}%, ${l}%, ${opacity})`;
}
