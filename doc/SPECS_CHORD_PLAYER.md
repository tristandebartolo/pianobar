# Spécifications du Composant ChordPlayer

## Présentation Générale

Le ChordPlayer est un composant interactif permettant de créer, modifier et lire des progressions d'accords musicaux. Il s'adresse aux musiciens souhaitant composer, pratiquer ou expérimenter avec des enchaînements d'accords dans un environnement visuel intuitif.

L'interface propose une timeline où chaque section représente 16 temps (4 mesures de 4 temps). Les accords sont placés sur cette timeline et peuvent être modifiés via une interface dédiée.

## Structure des Données

### Section

Une section représente un bloc de 16 temps contenant une liste d'accords. Chaque section possède un identifiant unique généré aléatoirement et une collection d'accords. Les sections peuvent être ajoutées, dupliquées, supprimées et copiées-collées entre elles.

### Accord

Un accord est défini par quatre propriétés essentielles : un identifiant unique, un nom (notation musicale standard comme C, Am7, F#m), une position de départ sur la timeline (de 0 à 15), et une durée en temps (de 1 à 16). Le nom de l'accord suit la convention racine-altération-qualitée (ex: D#m7 = Ré dièse mineur 7).

### Progression

Une progression est un modèle prédéfini d'enchaînement d'accords. Elle contient un nom technique, un label affiché, la liste des accords, et une description. Le système inclut 15 progressions populaires couvrant différents styles : pop, jazz, blues, rock, flamenco et others.

## Fonctionnalités Principales

### Gestion des Sections

L'utilisateur peut ajouter de nouvelles sections via un bouton dédié. Chaque section peut être dupliquée pour créer des variations rapides. La suppression est autorisée tant qu'il reste au moins une section dans la composition. Le système permet également de copier le contenu d'une section dans un presse-papier et de le coller dans une autre section.

### Édition des Accords

L'ajout d'un accord s'effectue en cliquant sur la timeline à l'emplacement souhaité. La modification se fait en cliquant sur l'icône d'édition d'un accord existant, ce qui ouvre une fenêtre modale permettant de choisir la note racine, l'altération, le type d'accord et la durée. Le redimensionnement s'effectue en glissant les poignées gauche ou droite de l'accord.

### Système de Lecture

Le lecteur propose deux modes complémentaires : une lecture globale depuis le début via le bouton Play principal, et une lecture segmentée via les boutons individuels de chaque section. La lecture globale parcourt toutes les sections en boucle. La lecture par section permet de démarrer depuis un point précis et offre des fonctionnalités avancées de boucle et d'attente.

### Progressions Prédéfines

Le système intègre un menu permettant d'appliquer rapidement une progression à une section. Les progressions sont organisées par style musical avec des descriptions explicatives. L'utilisateur peut également générer une progression aléatoire.

### Playlists

Les compositions peuvent être sauvegardées sous forme de playlists. Chaque playlist contient le nom, le BPM, les sections complètes et un horodatage de création. Les playlists sont persistées dans le stockage local du navigateur.

### Fonctionnalités Avancées

Le bouton de mélange permet de réorganiser aléatoirement les noms d'accords d'une section tout en conservant leurs positions d'origine. L'export MIDI permet de télécharger la progression complète au format MIDI standard.

## Comportement de Lecture

### Bouton Play Principal

Lorsque la lecture est arrêtée, un clic sur le bouton Play démarre la lecture globale depuis le début de la première section. La lecture parcourt toutes les sections en boucle. Un second clic sur le bouton (pendant la lecture) arrête complètement la lecture et réinitialise tous les états.

### Boutons Play de Section

Chaque section dispose d'un bouton de lecture individuel avec quatre états visuels distincts. L'état inactif (gris avec symbole ▶) indique qu'aucune lecture n'est en cours sur cette section. L'état playing (orange avec animation pulse) signale que la lecture est actuellement active sur cette section. L'état boucle (bleu avec symbole ⟲ et animation pulse) indique que la section est en répétition infinie. L'état attente (violet avec symbole ⏳ et animation pulse) montre que la section est en file d'attente.

### Scénarios d'Interaction

**Scénario 1 - Démarrage depuis l'arrêt :**
Un clic sur le bouton de lecture d'une section démarre la lecture depuis cette section. Le bouton passe à l'état playing (orange). La lecture parcourt toutes les sections en boucle. Si l'utilisateur clique à nouveau sur le même bouton, la section passe en état boucle (bleu) et répète indéfiniment. Un troisième clic désactive la boucle (orange) mais la lecture continue vers les sections suivantes. À la dernière section, la lecture revient au début.

**Scénario 2 - Changement de section pendant la lecture :**
Si la lecture est active sur une section et que l'utilisateur clique sur le bouton d'une autre section, le bouton de la nouvelle section passe à l'état attente (violet). La lecture de la section courante continue jusqu'à son terme, puis passe automatiquement à la section en attente. Le bouton de cette section devient playing (orange) et la lecture continue son cycle normal.

**Scénario 3 - Annulation d'attente :**
Si une section est en état attente et que l'utilisateur clique à nouveau sur son bouton, l'attente est annulée et le bouton retourne à l'état inactif.

**Scénario 4 - Gestion de la boucle avec attente :**
Si une section est en état boucle et qu'une autre section est mise en attente, la boucle est temporairement suspendue. La lecture termine la section courante, puis passe à la section en attente. La boucle est réinitialisée et la lecture continue normalement.

### Flux de Lecture Standard

La lecture suit un cycle continu : section demandée → toutes les sections suivantes → première section → toutes les sections suivantes → etc. Lorsqu'une section est en boucle, la lecture reste figée sur cette section jusqu'à ce que l'utilisateur désactive la boucle ou qu'une nouvelle section soit demandée en attente.

## Interface Utilisateur

### En-tête de Section

Chaque section affiche un en-tête contenant le bouton de lecture, le titre (Section 1, Section 2, etc.), et une barre d'actions. Le bouton de lecture est positionné à gauche du titre, accessible d'un clic.

### Barre d'Actions

La barre d'actions contient plusieurs boutons organisés de gauche à droite : le sélecteur de progression (désactivé si aucun accord), le bouton de mélange (visible uniquement si la section contient des accords), les boutons de copie, collage, duplication et suppression.

### Timeline

La timeline est une zone rectangulaire de 16 colonnes représentant les 16 temps. Les temps forts (1, 5, 9, 13) sont visuellement différenciés. Les accords apparaissent sous forme de blocs colorés positionnés selon leur startBeat et leur durée. Un indicateur de position (playhead) rouge montre le beat actuel. Un effet visuel highlight les accords en cours de lecture.

### Contrôles Globaux

Les contrôles globaux comprennent un curseur de BPM (60 à 200, défaut 120), le bouton Play principal, le bouton de génération aléatoire, le bouton d'export MIDI (désactivé si aucun accord), le bouton d'ajout de section, et le bouton d'accès aux playlists.

## Modales

### Modal d'Édition d'Accord

Cette fenêtre modale permet de modifier tous les aspects d'un accord. Elle affiche un aperçu du nom de l'accord avec sa couleur caractéristique. L'utilisateur peut sélectionner la note racine parmi les 7 notes naturelles, l'altération (bémol, dièse ou bécarre), la qualité de l'accord organisée en catégories (triades, suspendus, septièmes, extensions, altérations, power chord), et la durée via un slider. Un bouton permet d'écouter un aperçu de l'accord. Les actions disponibles sont supprimer, annuler et enregistrer.

### Modal de Gestion des Playlists

Cette fenêtre liste toutes les playlists sauvegardées avec leur nom, BPM et nombre de sections. Elle permet de créer une nouvelle playlist, charger une playlist existante, mettre à jour une playlist avec la configuration actuelle, et supprimer une playlist.

## Gestion Audio

### Initialisation

Le système audio est initialisé avant chaque lecture via la méthode init() de l'utilitaire audioSystem. Cette préparation garantit un fonctionnement optimal des sons.

### Lecture des Accords

Chaque accord est joué en utilisant la méthode playChord de l'utilitaire audioSystem, qui prend en paramètres les notes de l'accord, le volume et la durée. Les notes sont calculées via la fonction getChordNotes qui convertit le nom de l'accord en fréquences.

### Couleurs des Notes

Chaque note musicale possède une couleur associée pour un repérage visuel rapide. Cette couleur est utilisée pour l'affichage des accords sur la timeline et dans le modal d'édition.

## Persistance

### Stockage Local

Les playlists sont sauvegardées dans le localStorage sous la clé « chord-player-playlists ». Les données sont sérialisées en JSON. En cas d'erreur de lecture, une console affiche un message d'avertissement.

## Paramètres Système

### Structure Temporelle

Chaque section contient exactement 16 temps. La structure de mesure par défaut est 4/4, soit 4 mesures de 4 temps par section. Le BPM peut être ajusté de 60 à 200 en temps réel pendant la lecture.

### Nettoyage et Lifecycle

Lors du démontage du composant ou de l'arrêt de la lecture, tous les timers sont proprement décommissionnés via clearTimeout pour éviter les fuites de mémoire.

## Règles de Conception

### Expérience Utilisateur

L'interface doit être intuitive avec un feedback visuel clair sur l'état de lecture. Les actions doivent être réversibles et les erreurs évitées par design (boutons désactivés quand inappropriés).

### Performance

Les lectures utilisent setTimeout pour permettre l'ajustement dynamique du BPM. Les références (refs) sont utilisées pour maintenir les valeurs actuelles dans les callbacks sans créer de stale closures.

### Accessibilité

Chaque bouton interactif possède un attribut title décrivant son action. Les couleurs sont accompagnées d'indicateurs complémentaires (symboles, animations).

## Cas d'Usage Typiques

### Composition

L'utilisateur crée une progression en ajoutant des sections et en plaçant des accords manuellement ou via les modèles prédéfinis. Il peut dupliquer des sections pour créer des variations et sauvegarder son travail en playlist.

### Pratique

Le musicien travaille un passage difficile en utilisant la lecture par section. Il active la boucle sur une section spécifique pour la répéter. Il peut programmer une suite de sections à travailler en utilisant le système d'attente.

### Découverte

L'utilisateur génère des progressions aléatoires pour s'inspirer de nouveaux enchaînements. Il teste différentes variations en mélangeant les accords d'une section.

## Comportements Non-Définis

Les comportements suivants ne sont pas spécifiés et devront être clarifiés lors d'une future itération : le support des signatures de temps personnalisées, l'ancrage automatique sur les temps forts, le mode d'enregistrement live, les voicings personnalisés, l'export audio, la collaboration temps réel, et les modèles de structure de chanson.
