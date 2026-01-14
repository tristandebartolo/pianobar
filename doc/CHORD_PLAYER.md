# Documentation du ChordPlayer

## Vue d'ensemble

Le **ChordPlayer** est un composant React qui permet de créer, modifier et lire des progressions d'accords. Il offre une interface visuelle pour manipuler des sections de 16 temps chacune, avec un système de lecture polyvalent incluant la lecture globale et par section.

## Architecture

### Fichiers

```
src/components/ChordPlayer/
├── ChordPlayer.jsx      # Composant principal
├── ChordEditModal.jsx   # Modal d'édition d'accords
└── index.js             # Point d'export
```

### Dépendances

- **React** : hooks (useState, useRef, useCallback, useEffect)
- **audioSystem** : Utilitaire pour la lecture audio des accords
- **musicTheory** : Utilitaire pour les notes et couleurs
- **Styles** : `_chord-player.scss`

## Structure des données

### Section

```javascript
{
  id: string,           // Identifiant unique
  chords: Chord[]       // Liste des accords
}
```

### Chord

```javascript
{
  id: string,       // Identifiant unique
  name: string,     // Nom de l'accord (ex: "C", "Am7", "F#m")
  startBeat: number,// Beat de début (0-15)
  duration: number  // Durée en beats (1-16)
}
```

### Progression

```javascript
{
  name: string,     // Nom technique
  label: string,    // Nom affiché
  chords: string[], // Liste des accords
  description: string
}
```

## Fonctionnalités

### 1. Gestion des sections

- **Ajouter** une section avec le bouton "+ Section"
- **Dupliquer** une section existante
- **Supprimer** une section (minimum 1 requise)
- **Copier/Coller** le contenu d'une section

### 2. Édition des accords

- **Ajouter** : Cliquer sur la timeline à l'emplacement desired
- **Modifier** : Cliquer sur l'icône ✎ d'un accord
- **Redimensionner** : Glisser les bords gauche/droit
- **Supprimer** : Via le modal d'édition

### 3. Lecture

#### Bouton Play principal

| État     | Action                                     |
| -------- | ------------------------------------------ |
| Arrêté   | Démarre la lecture globale depuis le début |
| En cours | Arrête toute lecture                       |

#### Boutons Play de section

| Clic                                      | Comportement                                                     |
| ----------------------------------------- | ---------------------------------------------------------------- |
| 1er clic                                  | Démarre la lecture depuis cette section                          |
| 2nd clic (même section)                   | Active la boucle sur cette section                               |
| 3ème clic                                 | Désactive la boucle, continue vers section suivante              |
| Clic sur section active (mode boucle)     | Désactive la boucle                                              |
| Clic sur autre section (lecture en cours) | Met en attente, passe à cette section en fin de section courante |
| Clic sur bouton en attente                | Annule l'attente                                                 |

#### États des boutons de section

| État    | Apparence           | Signification                      |
| ------- | ------------------- | ---------------------------------- |
| Inactif | Gris (▶)            | Aucune lecture                     |
| Playing | Orange (▶ + pulse)  | Lecture en cours sur cette section |
| Boucle  | Bleu (⟲ + pulse)    | Section en boucle                  |
| Attente | Violet (⏳ + pulse) | En attente de prise en compte      |

#### Flux de lecture

```
Section demandée → Lit toute la timeline → Boucle ou passe à la section suivante
                  → Dernière section → Revient à la première
```

### 4. Progressions prédéfinies

15 progressions disponibles :

- I-V-vi-IV (Pop)
- vi-IV-I-V (Ballade)
- I-vi-IV-V (50s Doo-wop)
- ii-V-I (Jazz)
- I-IV-V-I (Blues/Rock)
- i-iv-V-i (Mineur)
- I-V-vi-iii-IV (Canon)
- i-VII-VI-V (Andalouse)
- I-bVII-IV-I (Rock modal)
- vi-V-IV-III (Epic)
- I-IV-vi-V (Moderne)
- i-VI-III-VII (Mineur pop)
- ii-V-I-VI (Rhythm Changes)
- I-iii-IV-V (Romantique)
- i-i-iv-V (12 Bar Minor)

### 5. Playlists

- **Sauvegarder** la configuration actuelle
- **Charger** une playlist existante
- **Mettre à jour** une playlist avec la configuration actuelle
- **Supprimer** une playlist

Stockage dans localStorage sous la clé `chord-player-playlists`.

### 6. Mélange des accords

Le bouton 🔀 mélange les noms d'accords tout en conservant leurs positions d'origine (startBeat et duration).

### 7. Export MIDI

Export de la progression complète en fichier MIDI.

## Utilisation de l'audio

### Système de lecture

```javascript
audioSystem.init();
const notes = getChordNotes(chordName);
audioSystem.playChord(notes, volume, duration);
```

### Couleurs des notes

Chaque note a une couleur assignée via `getNoteColor()` :

- C : Orange
- G : Vert
- F : Bleu
- etc.

## Paramètres

### BPM (Beats Per Minute)

- Plage : 60 - 200
- Valeur par défaut : 120
- Modifiable en temps réel pendant la lecture

### Structure temporelle

- **BEATS_PER_SECTION** : 16 temps par section
- **BEATS_PER_MEASURE** : 4 temps par mesure (4 mesures par section)

## Raccourcis et interactions

| Action            | Souris                                  |
| ----------------- | --------------------------------------- |
| Ajouter accord    | Clic sur timeline                       |
| Modifier accord   | Clic sur ✎                              |
| Redimensionner    | Glisser bord gauche/droit               |
| Dupliquer section | Clic sur 📋                             |
| Copier section    | Clic sur 📄                             |
| Coller section    | Clic sur 📥 (si presse-papier non vide) |
| Mélanger accords  | Clic sur 🔀 (si accords présents)       |

## Navigation au clavier

- Navigation dans les progressions avec les flèches
- Entrée pour valider
- Escape pour fermer les modals

## States React

```javascript
// Lecture
const [isPlaying, setIsPlaying] = useState(false);
const [currentBeat, setCurrentBeat] = useState(-1);
const [currentSection, setCurrentSection] = useState(0);

// Sections
const [sections, setSections] = useState([{ id: generateId(), chords: [] }]);
const [activeSectionIndex, setActiveSectionIndex] = useState(null);
const [sectionPlayMode, setSectionPlayMode] = useState(0);
const [currentPlayingSection, setCurrentPlayingSection] = useState(null);
const [waitingSectionIndex, setWaitingSectionIndex] = useState(null);

// Modal édition
const [selectedChord, setSelectedChord] = useState(null);
const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

// Drag & Drop
const [dragState, setDragState] = useState(null);

// Presses-papier
const [clipboard, setClipboard] = useState(null);

// Playlists
const [playlists, setPlaylists] = useState([]);
const [showPlaylistModal, setShowPlaylistModal] = useState(false);
const [editingPlaylistId, setEditingPlaylistId] = useState(null);

// Progression
const [showProgressionMenu, setShowProgressionMenu] = useState(null);
```

## Gestion des références

```javascript
const playIntervalRef = useRef(null); // Timer de lecture
const timelineRefs = useRef([]); // Références DOM des timelines
const bpmRef = useRef(bpm); // BPM actuel (pour les closures)
const sectionsRef = useRef(sections); // Sections actuelles
const globalBeatRef = useRef(0); // Beat global de lecture
const isLoopingRef = useRef(false); // Mode boucle
const isSectionModeRef = useRef(false); // Mode section activé
```

## Nettoyage

```javascript
useEffect(() => {
  return () => {
    if (playIntervalRef.current) {
      clearTimeout(playIntervalRef.current);
    }
  };
}, []);
```

## Utilisation recommandée

1. **Pour débutants** : Utiliser "Generate" pour créer une progression aléatoire
2. **Pour compositeurs** : Créer manuellement, utiliser les progressions prédéfinies
3. **Pour pratiquants** : Utiliser les boutons de section pour travailler des passages spécifiques
4. **Pour production** : Exporter en MIDI pour utiliser dans un DAW

## Limites

- Maximum de sections : Illimité (limité par les performances)
- Durée maximum d'un accord : 16 temps
- BPM minimum : 60
- BPM maximum : 200

## Améliorations futures suggérées

- Support des signatures de temps自定义 (3/4, 6/8, etc.)
- Ancrage automatique des accords sur les temps forts
- Mode d'enregistrement live
- Support des voicings personnalisés
- Export Audio (WAV/MP3)
- Collaboration en temps réel
- Modèles de song structure (AABA, ABAB, etc.)
