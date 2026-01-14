# Fonctionnalité : Boutons Play de Section

## Description

Ajouter des boutons de lecture individuels sur chaque section du Chord Player pour permettre aux utilisateurs de démarrer la lecture depuis n'importe quelle section avec deux modes distincts.

## Contexte

Actuellement, le Chord Player ne permet qu'une seule lecture globale depuis le début.
Cette fonctionnalité répond aux besoins des musiciens qui veulent :

- Lecture des sections spécifiques en boucle
- Démarrer depuis une section donnée et continuer vers les suivantes
- Naviguer rapidement dans leur composition

## Spécifications Fonctionnelles

### Interface Utilisateur

- **Position** : Bouton ▶ à gauche de chaque titre "Section X"
- **États visuels** :
  - Gris : Inactif (▶)
  - orange : En cours de lecture (▶)
  - bleu : Lecture en boucle (⟲)
  - violet : Lecture en attente (⏳)

### Comportements

#### Bouton Play Principal (en haut)

- **1er clic** : Lecture de TOUTES les sections depuis le début
- **2ème clic** : Arrête tout et réinitialise

#### Bouton Play de Section

##### La lecture est à l'arrêt

- **1er clic** : Démarre la lecture de la timeline a partir de cette section (ex: `SECTION 1`)
- **2er clic** : Sur la même section (`SECTION 1`) : active la lecture en boucle de le `SECTION 1` SEULEMENT.
- **2er clic** : Sur une autre section (ex: `SECTION 3`), met la lecture de la `SECTION 1` en attente. Lorsque la lecture de la `SECTION 1` se termine, la lecture `SECTION 3` commence. Lorsque la lecture de la section `SECTION 3` se termine, la lecture passe a la section suivante ou a la premiere sectionn si la lecture de la section courante est la dernière.
- **3er clic** : Si la section est en attente, l'attente est annulé

##### Si la lecture est en court

- **1er clic** : La lecture est en court sur la même section (`SECTION 1`) : active la lecture en boucle de le `SECTION 1` SEULEMENT.
- **1er clic** : La lecture est en court sur une autre section (ex: `SECTION 3`), met la lecture de la `SECTION 1` en attente. Lorsque la lecture de la `SECTION 3` se termine, la lecture `SECTION 1` commence. Lorsque la lecture de la section `SECTION 1` se termine, la lecture passe a la section suivante. Lorsque la lecture arrive a la dernière section, la lecture passe à la premiere sectionn.
- **2er clic** : La lecture est en attente (`SECTION 2`) : On annule l'attente de lecture pour la section..

### Gestion des États

- **Priorité** : Lecture globale > Lecture de section
- **Arrêt propre** : Nettoyage des timeouts et réinitialisation des états
- **Coordination** : Les boutons sont synchronisés pour éviter les conflits

## Spécifications Techniques

### Architecture

- **Coordination** : Boutons principaux et de section utilisent le même système de lecture
- **Nettoyage** : Arrêt complet avant chaque nouveau démarrage

### Sécurité

- **Pas de conflits** : Un seul timer actif à la fois
- **Arrêt propre** : Nettoyage des ressources
- **Gestion d'erreurs** : Try-catch et réinitialisation

## Résultat Attendu

Les utilisateurs peuvent maintenant pratiquer efficacement en isolant des sections spécifiques ou en démarrant depuis n'importe quel point de leur composition, avec une interface intuitive et des contrôles coordonnés.
