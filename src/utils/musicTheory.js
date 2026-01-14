import { CIRCLE_DATA, SCALE_DEGREES } from "../data/circleData.js";

export function getKeyData(keyId) {
  return CIRCLE_DATA.find(
    (key) =>
      key.id === keyId || key.majorKey === keyId || key.minorKey === keyId
  );
}

// Retourne les degrés de la gamme avec leurs informations
export function getScaleDegreesInfo(keyId, isMajor = true) {
  const keyData = getKeyData(keyId);
  if (!keyData) return [];

  const scale = isMajor ? keyData.majorScale : keyData.minorScale;

  const degreeNames = isMajor
    ? ['tonic', 'supertonic', 'mediant', 'subdominant', 'dominant', 'submediant', 'leadingTone']
    : ['tonic', 'supertonic', 'mediant', 'subdominant', 'dominant', 'submediant', 'subtonic'];

  const romanNumerals = isMajor
    ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    : ['i', 'ii', 'III', 'iv', 'v', 'VI', 'VII'];

  const romanNumeralsFr = isMajor
    ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    : ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

  return scale.map((note, index) => ({
    note,
    degree: index + 1,
    roman: romanNumerals[index],
    romanFr: romanNumeralsFr[index],
    name: degreeNames[index],
    nameFr: SCALE_DEGREES[romanNumerals[index].toUpperCase()]?.nameFr || degreeNames[index],
  }));
}

export function getCercle(note, isMajor) {
  if (isMajor) {
    const keyDataMajor = CIRCLE_DATA.find((key) => key.id === note);
    return keyDataMajor ? keyDataMajor.majorKey : null;
  }else {
    const keyDataMinor = CIRCLE_DATA.find((key) => key.minorKey === note);
    return keyDataMinor ? keyDataMinor.minorKey : null;
  }
}

export function getRelativeMinor(majorKey) {
  const keyData = CIRCLE_DATA.find((key) => key.majorKey === majorKey);
  return keyData ? keyData.minorKey : null;
}

export function getNoteColor(noteColor) {

  const keyDataMajor = CIRCLE_DATA.find((key) => key.id === noteColor);
  if (keyDataMajor) {
    return {
      color: keyDataMajor.color.primary,
      tone: 'major'
    };
  }

  const keyDataMinor = CIRCLE_DATA.find((key) => key.minorKey === noteColor);

  if (keyDataMinor) {
    console.log('keyDataMinor', keyDataMinor)
    return {
      color: keyDataMinor.color.secondary,
      tone: 'minor'
    } 
  }

  const keyData = CIRCLE_DATA.find((key) => key.id === noteColor || key.minorKey === noteColor);
  return keyData ? keyData.color : null;
}

export function getRelativeMajor(minorKey) {
  const keyData = CIRCLE_DATA.find((key) => key.minorKey === minorKey);
  return keyData ? keyData.majorKey : null;
}

export function getDominant(keyId) {
  const keyData = getKeyData(keyId);
  return keyData ? keyData.relationships.dominant : null;
}

export function getSubdominant(keyId) {
  const keyData = getKeyData(keyId);
  return keyData ? keyData.relationships.subdominant : null;
}

export function getParallel(keyId) {
  const keyData = getKeyData(keyId);
  return keyData ? keyData.relationships.parallel : null;
}

export function getNeighbors(keyId) {
  const keyData = getKeyData(keyId);
  return keyData ? keyData.relationships.neighbors : [];
}

export function getKeySignature(keyId) {
  const keyData = getKeyData(keyId);
  if (!keyData) return { type: null, count: 0 };
  return keyData.accidentals;
}

export function getChordProgression(keyId, progressionType = "I-IV-V") {
  const keyData = getKeyData(keyId);
  if (!keyData) return [];

  const chords = keyData.majorChords;

  const progressions = {
    "I-IV-V": [chords[0], chords[3], chords[4]],
    "I-V-vi-IV": [chords[0], chords[4], chords[5], chords[3]],
    "ii-V-I": [chords[1], chords[4], chords[0]],
    "I-vi-IV-V": [chords[0], chords[5], chords[3], chords[4]],
    "I-IV-vi-V": [chords[0], chords[3], chords[5], chords[4]],
  };

  return progressions[progressionType] || progressions["I-IV-V"];
}

export function getDiatonicChords(keyId, isMinor = false) {
  const keyData = getKeyData(keyId);
  if (!keyData) return [];

  return isMinor ? keyData.minorChords : keyData.majorChords;
}

export function getScale(keyId, isMinor = false) {
  const keyData = getKeyData(keyId);
  if (!keyData) return [];

  return isMinor ? keyData.minorScale : keyData.majorScale;
}

export function getScaleDegree(keyId, degree, isMinor = false) {
  const scale = getScale(keyId, isMinor);
  if (degree < 1 || degree > scale.length) return null;
  return scale[degree - 1];
}

export function getRomanNumeral(degree, isMinor = false) {
  const majorNumerals = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
  const minorNumerals = ["i", "ii°", "III", "iv", "v", "VI", "VII"];

  const numerals = isMinor ? minorNumerals : majorNumerals;
  return degree >= 1 && degree <= 7 ? numerals[degree - 1] : "";
}

export function getIntervalName(semitones) {
  const intervals = {
    0: "Unisson",
    1: "Seconde mineure",
    2: "Seconde majeure",
    3: "Tierce mineure",
    4: "Tierce majeure",
    5: "Quarte juste",
    6: "Triton",
    7: "Quinte juste",
    8: "Sixte mineure",
    9: "Sixte majeure",
    10: "Septième mineure",
    11: "Septième majeure",
    12: "Octave",
  };

  return intervals[semitones] || "Intervalle inconnu";
}

export function getAllKeys() {
  return CIRCLE_DATA;
}

// Retourne les accords diatoniques avec leurs degrés pour le highlight sur le cercle
export function getDiatonicChordsWithDegrees(keyId, isMajor = true) {
  const keyData = getKeyData(keyId);
  if (!keyData) return [];

  const chords = isMajor ? keyData.majorChords : keyData.minorChords;

  // Chiffres romains pour les degrés (différents en majeur et mineur)
  const romanNumerals = isMajor
    ? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
    : ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

  return chords.map((chord, index) => {
    // Extraire la note racine de l'accord (C, Dm -> D, Em -> E, etc.)
    const root = getChordRoot(chord);
    // Déterminer si l'accord est mineur
    const isMinorChord = chord.includes('m') && !chord.includes('dim');
    // Déterminer si l'accord est diminué
    const isDimChord = chord.includes('dim') || chord.includes('°');

    return {
      chord,
      root,
      degree: romanNumerals[index],
      index: index + 1,
      isMinorChord,
      isDimChord,
    };
  });
}

// Retourne les relations harmoniques entre tonalités (pour l'onglet Relations)
export function getKeyRelationships(keyId, isMajor = true) {
  const keyData = getKeyData(keyId);
  if (!keyData) return [];

  if (isMajor) {
    return [
      {
        type: "relative",
        key: keyData.keyRelationships.relative,
        label: "Relatif mineur",
        color: getNoteColor(keyData.keyRelationships.relative)
      },
      {
        type: "parallel",
        key: keyData.keyRelationships.parallel,
        label: "Parallèle mineur",
        color: getNoteColor(keyData.keyRelationships.parallel)
      },
    ];
  } else {
    // Relations pour la tonalité mineure
    const relativeMajor = keyData.majorKey;
    const minorRoot = keyData.minorKey.replace("m", "");

    return [
      { type: "relative", key: relativeMajor, label: "Relatif majeur" },
      { type: "parallel", key: minorRoot, label: "Parallèle majeur" },
    ];
  }
}

// Retourne les accords diatoniques pour le highlight sur le cercle
export function getRelatedKeys(keyId, isMajor = true) {
  const chordsInfo = getDiatonicChordsWithDegrees(keyId, isMajor);

  return chordsInfo.map(({ chord, root, degree, isMinorChord, isDimChord }) => {
    // Déterminer la clé pour le matching sur le cercle:
    // - Accords mineurs (Dm, Em, Am): utiliser le nom complet pour matcher le cercle interne
    // - Accords diminués (Bdim, C#dim): les afficher sur le cercle interne (ajouter "m" à la racine)
    // - Accords majeurs (C, F, G): utiliser la racine pour matcher le cercle externe
    let key;
    if (isMinorChord) {
      key = chord; // ex: "Dm" -> "Dm"
    } else if (isDimChord) {
      key = root + "m"; // ex: "Bdim" -> "Bm" pour matcher le cercle interne
    } else {
      key = root; // ex: "C" -> "C"
    }

    return {
      key,
      chord,
      degree,
      type: "diatonicChord",
      label: degree,
      isMinorChord,
      isDimChord,
      // Pour le cercle: les accords mineurs ET diminués vont sur le cercle interne
      isInnerCircle: isMinorChord || isDimChord,
    };
  });
}

// Extraire la note fondamentale d'un accord (ex: "Dm" -> "D", "Bdim" -> "B")
export function getChordRoot(chordName) {
  // Extraire juste la partie note (C, C#, Db, etc.)
  const match = chordName.match(/^[A-G][#b♯♭]?/);
  return match ? match[0] : chordName;
}

// Construire les notes d'un accord (triade basique)
export function getChordNotes(chordName) {
  const root = getChordRoot(chordName);

  // Toutes les notes chromatiques (dièses et bémols)
  const allNotes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
    "Db",
    "Eb",
    "Gb",
    "Ab",
    "Bb",
  ];

  // Table de conversion pour normaliser les notes
  const normalizeNote = (note) => {
    const map = {
      Db: "C#",
      "D♭": "C#",
      Eb: "D#",
      "E♭": "D#",
      Gb: "F#",
      "G♭": "F#",
      Ab: "G#",
      "A♭": "G#",
      Bb: "A#",
      "B♭": "A#",
      "C♯": "C#",
      "D♯": "D#",
      "F♯": "F#",
      "G♯": "G#",
      "A♯": "A#",
    };
    return map[note] || note;
  };

  // Chromatic scale en dièses
  const chromaticScale = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  // Normaliser la note racine pour trouver son index
  const normalizedRoot = normalizeNote(root);
  const rootIndex = chromaticScale.indexOf(normalizedRoot);

  if (rootIndex === -1) {
    console.warn(
      `Note racine non trouvée: ${chordName} (root: ${root}, normalized: ${normalizedRoot})`
    );
    return [root, root, root]; // Fallback
  }

  // Déterminer le type d'accord
  const isMinor = chordName.includes("m") && !chordName.includes("dim");
  const isDim = chordName.includes("dim") || chordName.includes("°");

  // Intervalles en demi-tons
  const thirdInterval = isMinor || isDim ? 3 : 4; // tierce mineure ou majeure
  const fifthInterval = isDim ? 6 : 7; // quinte diminuée ou juste

  // Construire la triade en utilisant la note originale pour la racine
  const triad = [
    root, // Note racine originale (peut être bémol)
    chromaticScale[(rootIndex + thirdInterval) % 12], // Tierce
    chromaticScale[(rootIndex + fifthInterval) % 12], // Quinte
  ];

  // console.log(
  //   `getChordNotes(${chordName}): root=${root}, normalized=${normalizedRoot}, index=${rootIndex}, triad=[${triad.join(", ")}]`
  // );

  return triad;
}

// Générer une gamme modale à partir d'une tonalité et d'un mode
export function getModalScale(keyId, mode = "major") {
  const keyData = getKeyData(keyId);
  if (!keyData) return [];

  const rootNote = keyData.majorKey;
  const chromaticScale = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  // Normaliser la note racine
  const normalizeNote = (note) => {
    const map = {
      Db: "C#",
      Eb: "D#",
      Gb: "F#",
      Ab: "G#",
      Bb: "A#",
    };
    return map[note] || note;
  };

  const rootIndex = chromaticScale.indexOf(normalizeNote(rootNote));
  if (rootIndex === -1) return [];

  // Intervalles en demi-tons pour chaque mode
  const modeIntervals = {
    // Modes grecs (7 notes)
    major: [0, 2, 4, 5, 7, 9, 11], // Ionien (Majeur)
    minor: [0, 2, 3, 5, 7, 8, 10], // Aeolien (Mineur naturel)
    dorian: [0, 2, 3, 5, 7, 9, 10], // Dorien
    phrygian: [0, 1, 3, 5, 7, 8, 10], // Phrygien
    lydian: [0, 2, 4, 6, 7, 9, 11], // Lydien
    mixolydian: [0, 2, 4, 5, 7, 9, 10], // Mixolydien
    locrian: [0, 1, 3, 5, 6, 8, 10], // Locrien

    // Gammes mineures (7 notes)
    "harmonic-minor": [0, 2, 3, 5, 7, 8, 11], // Mineur harmonique
    "melodic-minor": [0, 2, 3, 5, 7, 9, 11], // Mineur mélodique

    // Gammes pentatoniques (5 notes)
    "pentatonic-major": [0, 2, 4, 7, 9], // Pentatonique majeure
    "pentatonic-minor": [0, 3, 5, 7, 10], // Pentatonique mineure

    // Gammes blues (6 notes)
    "blues-major": [0, 2, 3, 4, 7, 9], // Blues majeure
    "blues-minor": [0, 3, 5, 6, 7, 10], // Blues mineure

    // Gammes exotiques (7-8 notes)
    "phrygian-dominant": [0, 1, 4, 5, 7, 8, 10], // Phrygien dominant (Espagnol)
    "hungarian-minor": [0, 2, 3, 6, 7, 8, 11], // Mineur hongrois
    "double-harmonic": [0, 1, 4, 5, 7, 8, 11], // Double harmonique (Arabe)
    "whole-tone": [0, 2, 4, 6, 8, 10], // Tons entiers
    diminished: [0, 2, 3, 5, 6, 8, 9, 11], // Diminuée (octatonique)
    augmented: [0, 3, 4, 7, 8, 11], // Augmentée (hexatonique)

    // Gammes japonaises (5 notes)
    hirajoshi: [0, 2, 3, 7, 8], // Hirajōshi
    "in-sen": [0, 1, 5, 7, 10], // In Sen
    iwato: [0, 1, 5, 6, 10],
    kumoi: [0, 2, 3, 7, 9],

    // Gamme chromatique (12 notes)
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Chromatique
  };

  const intervals = modeIntervals[mode] || modeIntervals["major"];

  return intervals.map(
    (interval) => chromaticScale[(rootIndex + interval) % 12]
  );
}

// Obtenir les informations d'un mode
export function getModeInfo(modeName) {
  const modes = {
    // Modes grecs
    major: {
      name: "Majeur",
      description: "Gamme joyeuse et brillante, base de la musique occidentale",
      pattern: "T-T-½-T-T-T-½",
      character: "Joyeux, stable",
      usage: "Pop, rock, classique",
    },
    minor: {
      name: "Mineur naturel",
      description: "Gamme triste et mélancolique",
      pattern: "T-½-T-T-½-T-T",
      character: "Triste, mélancolique",
      usage: "Ballade, folk",
    },
    dorian: {
      name: "Dorien",
      description: "Mineure avec 6te majeure, jazz et funk",
      pattern: "T-½-T-T-T-½-T",
      character: "Groovy, jazzy",
      usage: "Jazz, funk, folk",
    },
    phrygian: {
      name: "Phrygien",
      description: "Sonorité espagnole avec 2de mineure",
      pattern: "½-T-T-T-½-T-T",
      character: "Exotique, flamenco",
      usage: "Flamenco, metal",
    },
    lydian: {
      name: "Lydien",
      description: "Majeur avec 4te augmentée, rêveur",
      pattern: "T-T-T-½-T-T-½",
      character: "Rêveur, aérien",
      usage: "Film, fusion jazz",
    },
    mixolydian: {
      name: "Mixolydien",
      description: "Majeur avec 7e mineure, rock et blues",
      pattern: "T-T-½-T-T-½-T",
      character: "Rock, bluesy",
      usage: "Rock, country, blues",
    },
    locrian: {
      name: "Locrien",
      description: "Le plus instable, très dissonant",
      pattern: "½-T-T-½-T-T-T",
      character: "Instable, tendu",
      usage: "Metal, expérimental",
    },

    // Gammes mineures
    "harmonic-minor": {
      name: "Mineur harmonique",
      description: "Mineur avec 7e majeure, très dramatique",
      pattern: "T-½-T-T-½-T½-½",
      character: "Dramatique, oriental",
      usage: "Classique, néoclassique",
    },
    "melodic-minor": {
      name: "Mineur mélodique",
      description: "Mineur avec 6te et 7e majeures ascendantes",
      pattern: "T-½-T-T-T-T-½",
      character: "Fluide, expressif",
      usage: "Jazz, classique",
    },

    // Pentatoniques
    "pentatonic-major": {
      name: "Pentatonique majeure",
      description: "Gamme simple à 5 notes, universelle",
      pattern: "T-T-T½-T-T½",
      character: "Simple, universel",
      usage: "Rock, pop, folk, world",
    },
    "pentatonic-minor": {
      name: "Pentatonique mineure",
      description: "Gamme à 5 notes, base du blues et rock",
      pattern: "T½-T-T-T½-T",
      character: "Bluesy, rock",
      usage: "Blues, rock, metal",
    },

    // Blues
    "blues-major": {
      name: "Blues majeur",
      description: "Pentatonique majeure avec blue note",
      pattern: "T-½-½-T½-T-T½",
      character: "Joyeux, bluesy",
      usage: "Blues, boogie",
    },
    "blues-minor": {
      name: "Blues mineur",
      description: "Pentatonique mineure avec blue note",
      pattern: "T½-T-½-½-T½-T",
      character: "Authentique blues",
      usage: "Blues classique",
    },

    // Exotiques
    "phrygian-dominant": {
      name: "Phrygien dominant",
      description: "Mode espagnol/arabe dramatique",
      pattern: "½-T½-½-T-½-T-T",
      character: "Flamenco, arabe",
      usage: "Flamenco, métal, musique orientale",
    },
    "hungarian-minor": {
      name: "Mineur hongrois",
      description: "Gamme gitane avec 4te augmentée",
      pattern: "T-½-T½-½-½-T½-½",
      character: "Gitane, dramatique",
      usage: "Musique tzigane, métal",
    },
    "double-harmonic": {
      name: "Double harmonique",
      description: "Gamme arabe/byzantine très exotique",
      pattern: "½-T½-½-T-½-T½-½",
      character: "Mystique, arabe",
      usage: "Musique orientale, Byzantine",
    },
    "whole-tone": {
      name: "Tons entiers",
      description: "Gamme ambiguë à intervalles égaux",
      pattern: "T-T-T-T-T-T",
      character: "Rêveur, flottant",
      usage: "Impressionnisme, film",
    },
    diminished: {
      name: "Diminuée",
      description: "Gamme symétrique à 8 notes",
      pattern: "T-½-T-½-T-½-T-½",
      character: "Tendu, jazz",
      usage: "Jazz, musique contemporaine",
    },
    augmented: {
      name: "Augmentée",
      description: "Gamme hexatonique symétrique",
      pattern: "T½-½-T½-½-T½-½",
      character: "Mystérieux, moderne",
      usage: "Jazz moderne, contemporain",
    },

    // Japonaises
    hirajoshi: {
      name: "Hirajōshi",
      description: "Gamme japonaise traditionnelle",
      pattern: "T-½-T½+½-½-T½+½",
      character: "Zen, japonais",
      usage: "Musique japonaise",
    },
    "in-sen": {
      name: "In Sen",
      description: "Gamme japonaise contemplative",
      pattern: "½-T½+½-T-T½-T",
      character: "Méditatif, oriental",
      usage: "Musique asiatique",
    },
    iwato: {
      name: "Iwato",
      pattern: "½-T½-½-T½-T",
      description: "Gamme japonaise",
      character: "Sombre, inquiétant",
      usage: "Métal japonais, ambiance",
    },
    kumoi: {
      name: "Kumoi (Dorian pentatonic)",
      description: "Gamme japonaise",
      pattern: "T-½-T½-T-T",
      character: "Exotique, doux-amer",
      usage: "Fusion, japonais moderne, jazz",
    },

    // Chromatique
    chromatic: {
      name: "Chromatique",
      description: "Toutes les 12 notes, extrême tension",
      pattern: "½-½-½-½-½-½-½-½-½-½-½-½",
      character: "Atonal, dissonant",
      usage: "Passage, ornement, jazz",
    },
  };

  return modes[modeName] || modes["major"];
}
