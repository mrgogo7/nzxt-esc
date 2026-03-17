> ⚠️ This document is an automatically translated version of the main English README.
> Technical terms, code blocks, filenames, and project terminology are intentionally kept in their original form.

# NZXT Elite Screen Customizer (NZXT-ESC) v5.12 (Build 08)

Un éditeur moderne de médias et d'overlays basé sur navigateur pour les écrans LCD NZXT Kraken Elite.

Créez des arrière-plans animés personnalisés, des overlays de métriques, des couches de texte, des lignes de séparation et des mises en page entièrement personnalisées — le tout synchronisé en direct dans NZXT CAM.

Gratuit uniquement pour un usage personnel — l'usage commercial est strictement interdit.

![License](https://img.shields.io/badge/License-Personal%20Use%20Only-red) ![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-purple) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Vite](https://img.shields.io/badge/Vite-Bundler-purple) ![GitHub release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc)

<p align="center">
  <img src="https://raw.githubusercontent.com/mrgogo7/nzxt-esc/refs/heads/main/docs/Demo-Preview1.png" width="400"/>
  <img src="https://raw.githubusercontent.com/mrgogo7/nzxt-esc/refs/heads/main/docs/Demo-Preview2.png" width="400"/>
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif" width="400"/>
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif" width="400"/>
</p>

---
## 📋 CONTENU

- [🚀 Démarrage Rapide](#-démarrage-rapide)
  - [Méthode 1 — Lancement Direct (Recommandé)](#méthode-1--lancement-direct-recommandé)
  - [Méthode 2 — Installation Manuelle (Dans NZXT CAM)](#méthode-2--installation-manuelle-dans-nzxt-cam)
  - [Recommandé : Renommer la Carte d'Intégration](#recommandé--renommer-la-carte-dintégration)
- [🎛 Utilisation de l'Éditeur (Bouton Configurer)](#-utilisation-de-léditeur-bouton-configurer)
- [💡 Qu'est-ce qui Rend NZXT-ESC Spécial ?](#-quest-ce-qui-rend-nzxt-esc-spécial)
  - [1. Expérience d'Édition Orientée Design](#1-expérience-dédition-orientée-design)
  - [2. Moteur d'Overlay Complet Basé sur les Éléments](#2-moteur-doverlay-complet-basé-sur-les-éléments)
  - [3. Synchronisation LCD en Temps Réel](#3-synchronisation-lcd-en-temps-réel)
  - [4. Moteur de Médias Avancé](#4-moteur-de-médias-avancé)
  - [5. Système de Presets (Accès Anticipé)](#5-système-de-presets-accès-anticipé)
- [🌍 Langues Supportées](#-langues-supportées)
- [🧪 Détails Techniques](#-détails-techniques)
- [🔧 Informations pour les Développeurs](#-informations-pour-les-développeurs)
- [🕛 Historique des Versions](#-historique-des-versions)
- [🔗 Liens](#-liens)
- [📜 Licence](#-licence)

---
### 🚀 DÉMARRAGE RAPIDE

NZXT-ESC fonctionne DANS NZXT CAM en utilisant la fonctionnalité "Web Integration". Il existe deux façons de l'installer :

#### MÉTHODE 1 — LANCEMENT DIRECT (RECOMMANDÉ)

1. Copiez ceci dans la barre d'adresse de votre navigateur :
   ```text
   nzxt-cam://action/load-web-integration?url=https://mrgogo7.github.io/nzxt-esc/
   ```
2. Appuyez sur Entrée.
3. Votre navigateur affichera une question : "Ouvrir le lien nzxt-cam avec NZXT CAM ?" → Approuver / Autoriser
4. NZXT CAM sera lancé automatiquement.
5. Vous verrez une fenêtre de confirmation : Charger Web Integration ? Êtes-vous sûr de vouloir charger l'intégration web suivante ?
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
      or Beta Version Now Available
   ```text
   https://nzxt-esc.pages.dev/
   ```
6. Appuyez sur "Charger".
7. Après le chargement, ouvrez la carte "Custom Web Integration".

#### MÉTHODE 2 — INSTALLATION MANUELLE (DANS NZXT CAM)

1. Ouvrez NZXT CAM.
2. Allez à : Lighting → Kraken Elite V2 → LCD Display
3. Changez le mode d'affichage en : Web Integration
4. Trouvez la carte nommée : Custom Web Integration
5. Cliquez sur "Settings".
6. Entrez l'URL :
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
7. Appuyez sur "Apply".
8. Ensuite, appuyez sur : Add as Card
9. Une nouvelle carte Web Integration appelée "My Web Integration" apparaîtra.
10. Sélectionnez "My Web Integration".
11. Appuyez sur "Configure" pour ouvrir l'éditeur NZXT-ESC.

#### RECOMMANDÉ : RENOMMER LA CARTE D'INTÉGRATION

NZXT CAM attribue le nom par défaut "My Web Integration". Pour renommer :
1. Sélectionnez "My Web Integration".
2. Appuyez sur "Edit".
3. Changez les champs en : Title :
   ```text
   Elite Screen Customizer
   ```
   Description :
   ```text
   NZXT Elite Screen Customizer (NZXT-ESC)
   ```
Cela aide à distinguer l'intégration des autres.

---
### 🎛 UTILISATION DE L'ÉDITEUR (BOUTON CONFIGURER)

Toute l'édition est effectuée DANS NZXT CAM via le bouton "Configure".

Dans l'éditeur, vous pouvez :

- Ajouter / supprimer des éléments de métriques, texte et séparateurs (jusqu'à 20 éléments par overlay)
- Ajuster la position, la rotation, l'échelle, l'opacité et la couleur
- Choisir des médias d'arrière-plan MP4 / GIF / PNG / JPG
- Utiliser des fichiers Local Media stockés dans le navigateur via IndexedDB
- Gérer les presets (Import, Export, Duplicate, Delete, Rename, Apply)
- Utiliser des modèles d'overlay preset (mises en page Single, Dual, Triple, Quadruple InfoGraphic)
- Importer des overlay presets avec les options Replace ou Append
- Basculer rapidement entre les presets favoris via le menu déroulant Quick Favorites
- Prévisualiser tous les changements en temps réel sur votre Kraken Elite LCD

Aucune URL externe ou config.html n'est plus nécessaire.

---
### 💡 QU'EST-CE QUI REND NZXT-ESC SPÉCIAL ?

NZXT-ESC n'est pas un pack de thèmes — c'est un **éditeur de mise en page complet orienté design** construit spécifiquement pour le Kraken Elite LCD.

Il offre une liberté créative complète bien au-delà de ce que NZXT CAM prend en charge nativement.

NZXT CAM **ne permet pas** :
- Le positionnement libre d'éléments  
- L'échelle ou la rotation d'éléments  
- Les overlays de texte personnalisés  
- Les couleurs transparentes  
- Les arrière-plans MP4  
- Les arrière-plans YouTube  
- Les URLs Pinterest  
- Les combinaisons de médias mixtes + overlay  

NZXT-ESC **active tout cela**.

#### 1. EXPÉRIENCE D'ÉDITION ORIENTÉE DESIGN

- Placement libre par glisser-déposer
- Rotation et échelle par élément
- Poignées de transformation autour de l'aperçu LCD circulaire
- Ajustements micro avec les touches fléchées
- Interface minimaliste et sans distraction
- Aperçu circulaire précis correspondant au matériel réel

#### 2. MOTEUR D'OVERLAY COMPLET BASÉ SUR LES ÉLÉMENTS

Les modes Legacy Single/Dual/Triple ont été complètement supprimés.

Vous pouvez maintenant ajouter librement :

- Des éléments de métriques
- Des éléments de texte
- Des éléments séparateurs

Chaque élément prend en charge :

- Position X/Y
- Rotation
- Échelle
- Couleur et opacité
- Mise en surbrillance de sélection

**Système d'Overlay Preset**

Appliquez rapidement des mises en page préconfigurées en utilisant le modal de sélection de modèles. Choisissez parmi les modèles Single, Dual, Triple ou Quadruple InfoGraphic, chacun avec un positionnement et un style optimisés. Les modèles peuvent être importés avec les modes Replace (remplace les éléments existants) ou Append (ajoute aux éléments existants). Lors de l'ajout, les valeurs zIndex sont automatiquement normalisées pour éviter les conflits de rendu. Le système prend en charge jusqu'à 20 éléments d'overlay par configuration.

#### 3. SYNCHRONISATION LCD EN TEMPS RÉEL

- Mises à jour avec throttle de ~100ms pour la stabilité
- Aucune actualisation manuelle nécessaire
- L'écran LCD se met à jour instantanément pendant que vous éditez

#### 4. MOTEUR DE MÉDIAS AVANCÉ

Le moteur de médias prend en charge :

- Vidéo MP4 (lecture complète dans le LCD)
- Animations GIF
- Images PNG / JPG
- Fichiers Local Media (IndexedDB) : Images et vidéos en pleine résolution chargées directement depuis votre ordinateur
- **URLs Pinterest → résolues automatiquement en médias directs**
- **URLs YouTube (lecture LCD)**


##### **🆕 Support Local Media (NOUVEAU)**

NZXT-ESC inclut maintenant un système intégré pour charger **des images ou vidéos locales** directement dans l'éditeur.  
Les fichiers sont stockés en toute sécurité dans **IndexedDB** et ne quittent jamais votre appareil.

Types de fichiers pris en charge :
- JPG / PNG / GIF  
- Vidéo MP4  
- Taille maximale : **150 MB**

Fonctionnalités clés :
- Utilisation entièrement hors ligne — aucun hébergement externe requis  
- Fonctionne avec rotation, échelle, fit/align et tous les outils de transformation  
- Synchronisation LCD en temps réel identique aux médias distants  
- Chaque preset peut contenir une référence de média local  
- Les médias locaux **ne sont pas inclus** dans les fichiers de preset exportés  
- Lors de l'importation, les presets qui utilisaient des médias locaux afficheront un avertissement et permettront une nouvelle sélection

Ce système permet des arrière-plans véritablement hors ligne et respectueux de la vie privée tout en restant 100% compatible avec le moteur de transformation de l'éditeur.


**Points Forts de l'Intégration YouTube :**

- Les vidéos YouTube **se lisent sur le LCD réel** (autoplay/mute/loop pris en charge)
- L'Aperçu de l'éditeur ne peut pas lire les vidéos YouTube en raison des restrictions du lecteur intégré  
- À la place, un **placeholder rouge déplaçable** est affiché  
- Les utilisateurs peuvent :
  - Positionner la vidéo YouTube  
  - Mettre à l'échelle la vidéo  
  - Appliquer les paramètres align/fit  
  - Placer n'importe quel élément d'overlay par-dessus  
- Le LCD reflète toujours le résultat final en temps réel  
- Tous les outils d'arrière-plan standard fonctionnent parfaitement avec YouTube

Modes d'ajustement :

- **Cover** — remplit tout l'affichage  
- **Contain** — maintient le ratio d'aspect complet  
- **Fill** — étire pour s'adapter (optionnel)  

Cela fait de NZXT-ESC le premier éditeur LCD entièrement compatible YouTube pour NZXT CAM.

#### 5. SYSTÈME DE PRESETS (ACCÈS ANTICIPÉ)

Actions disponibles :

- Import
- Export
- Delete
- Duplicate
- Rename
- Apply

Les presets stockent la mise en page complète en JSON.

**Import/Export d'Overlay Preset**

Exportez vos configurations d'éléments d'overlay en tant que fichiers `.nzxt-esc-overlay-preset` pour sauvegarde ou partage. Importez des overlay presets avec validation et gestion d'erreurs. Lors de l'importation, choisissez le mode Replace pour remplacer les éléments existants ou le mode Append pour ajouter de nouveaux éléments tout en préservant les actuels. Le système d'importation inclut la génération automatique d'ID pour les éléments de modèle et la normalisation zIndex pour le contenu ajouté.

**Menu Déroulant Quick Favorites**

En survolant le bouton Preset Manager, un menu déroulant compact est révélé listant jusqu'à 10 presets favoris (marqués avec ★). Chaque entrée affiche le nom du preset, le statut favori et un indicateur "actif" pour le preset actuellement appliqué. En sélectionnant un élément, ce preset est appliqué immédiatement en utilisant la même logique de fusion atomique et de sauvegarde automatique que le gestionnaire complet. Le menu déroulant présente des animations fluides de fade-in/fade-out et inclut un lien direct pour ouvrir l'interface complète du Preset Manager. Cela fournit un flux de travail extrêmement rapide pour les utilisateurs qui basculent fréquemment entre un petit ensemble de presets préférés.

##### **Local Media & Presets**
- Les fichiers de preset exportés **ne contiennent pas** le binaire de média local  
- L'importation d'un preset qui utilisait auparavant des médias locaux affiche un avertissement guidé  
- Les utilisateurs peuvent re-sélectionner le fichier via le nouveau modal **Browse**  
- Toutes les fonctions de preset existantes (Apply, Duplicate, Rename, Delete) prennent entièrement en charge les références de médias locaux  
- Le changement de preset charge automatiquement les médias locaux appropriés depuis IndexedDB (si disponibles)

---
### 🌍 LANGUES SUPPORTÉES

NZXT-ESC prend en charge plusieurs langues pour une expérience utilisateur localisée. Basculez entre les langues en utilisant le sélecteur de langue dans l'en-tête de l'éditeur.

| Language | Code | File |
|----------|------|------|
| 🇬🇧 English | `en` | [i18n.ts](./src/i18n.ts) |
| 🇹🇷 Turkish | `tr` | [i18n.ts](./src/i18n.ts) |
| 🇪🇸 Spanish | `es` | [i18n.ts](./src/i18n.ts) |
| 🇩🇪 German | `de` | [i18n.ts](./src/i18n.ts) |
| 🇧🇷 Portuguese (BR) | `pt-BR` | [i18n.ts](./src/i18n.ts) |
| 🇫🇷 French | `fr` | [i18n.ts](./src/i18n.ts) |
| 🇮🇹 Italian | `it` | [i18n.ts](./src/i18n.ts) |
| 🇯🇵 Japanese | `ja` | [i18n.ts](./src/i18n.ts) |

Toutes les traductions sont maintenues dans un seul fichier TypeScript pour une gestion et des mises à jour faciles.

---
### 🧪 DÉTAILS TECHNIQUES

- React 18
- TypeScript
- Vite bundler
- Synchronisation LocalStorage + diffusion d'événements
- Moteur de rendu conscient du LCD circulaire
- Mathématiques de transformation AABB + rotation
- Système d'overlay preset avec génération d'éléments basée sur des modèles
- Attribution automatique d'ID et normalisation zIndex
- Support UI multilingue (English, Turkish, Spanish, German, Portuguese, French, Italian, Japanese)

---
### 🔧 INFORMATIONS POUR LES DÉVELOPPEURS

Cloner et Installer :

```bash
git clone https://github.com/mrgogo7/nzxt-esc
cd nzxt-esc
npm install
```

Démarrer le Serveur de Développement :

```bash
npm run dev
```

Exposer sur LAN pour les tests NZXT CAM :

```bash
npm run dev -- --host
```

Construire :

```bash
npm run build
```

Aperçu de la construction :

```bash
npm run preview
```

**Contributing:**

- Ouvrez une Issue avant de commencer des changements majeurs
- Gardez les PRs petits et ciblés
- Utilisez des messages de commit clairs
- Suivez la structure du projet

---
### 🕛 HISTORIQUE DES VERSIONS

#### 5.11.261 — Support Local Media + Améliorations de l'Éditeur (NOUVEAU)

**Date de Publication :** 2025-11-26

##### 🆕 NOUVELLES FONCTIONNALITÉS
- **Arrière-plans Local Media (IndexedDB)**
  - Importez JPG, PNG, GIF ou MP4 directement depuis votre ordinateur  
  - Fichiers stockés en toute sécurité via IndexedDB  
  - Fonctionne hors ligne  
  - Compatible avec tous les modes de transformation fit/scale/align  
  - Entièrement synchronisé avec le Kraken LCD en temps réel  
  - Le champ URL affiche `Local: filename.ext` en format multilingue  

##### 💡 Améliorations du Système de Presets
- L'exportation de presets contenant des médias locaux déclenche un avertissement (médias non inclus)  
- L'importation de tels presets affiche un message de re-sélection  
- Le changement de preset charge automatiquement les médias locaux s'ils sont disponibles  

##### 🖥 AMÉLIORATIONS UI
- Nouveau modal Browse pour sélectionner les médias locaux  
- Support multilingue complet pour tous les messages de médias locaux  
- Nouvelle icône de bouton + style mis à jour  

##### 🧩 AMÉLIORATIONS DE STABILITÉ
- Pipeline de résolution de médias amélioré  
- Révocation de Blob + nettoyage pour prévenir les fuites  
- Meilleure gestion des erreurs et couverture i18n  

#### 5.11.26 — Refonte de la Synchronisation LCD Kraken en Temps Réel et Améliorations de Stabilité d'Overlay

**Note Additionnelle :**  
- **Support d'arrière-plan YouTube** (lecture LCD) introduit avec alignement complet de positionnement/échelle utilisant le nouveau système d'Aperçu basé sur placeholder.  
- Les mathématiques de transformation unifiées assurent un alignement proportionnel Aperçu ↔ LCD.

#### 5.11.241 — Refonte de la Synchronisation LCD Kraken en Temps Réel et Améliorations de Stabilité d'Overlay

**Date de Publication :** 2025-11-24

##### 🔧 Améliorations Majeures du Système

- **Refonte de la Synchronisation LCD Kraken en Temps Réel**  
  La synchronisation LCD en temps réel n'a pas été nouvellement introduite, mais tout le système interne a été reconstruit. L'implémentation précédente reposait sur des cycles de rechargement de preset et causait des retards, des mises à jour manquées et des comportements de retour en arrière. La nouvelle architecture de synchronisation entre onglets basée sur BroadcastChannel fournit un flux de mise à jour stable, à faible latence et synchronisé avec les trames.

##### 🛠 Améliorations

- **Améliorations de fiabilité du rendu d'overlay**  
  Lorsque l'état d'overlay en temps d'exécution est vide, le système revient maintenant en toute sécurité aux données d'overlay de preset stockées.

- **Mise à niveau de stabilité arrière-plan/médias**  
  Retour de transformation supprimé lors des changements d'entrée.

- **Optimisation du visualiseur KrakenOverlay**  
  Ne recharge plus les presets ; écoute maintenant directement les changements en temps d'exécution pour des mises à jour instantanées.

##### 🐞 Corrections de Bugs

- Mises à jour LCD retardées corrigées (mises à jour précédemment uniquement après la fin du glissement).

- Overlays manquants dans la vue Kraken après actualisation corrigés.

- Avertissements de clé React dupliqués lors de l'ajout d'overlay presets corrigés.

- Paramètres de médias/arrière-plan qui revenaient en arrière lors des ajustements corrigés.

##### ⚙ Changements d'Architecture

- Module dédié `runtimeBroadcast.ts` introduit pour la communication entre onglets.

- `setElementsForPresetSilent()` ajouté pour des mises à jour en temps d'exécution sécurisées sans boucles de diffusion.

- `useOverlayConfig()` mis à jour pour gérer correctement krakenMode + fallback de stockage.

- Toutes les sources de mise à jour d'overlay unifiées en un seul pipeline piloté par le temps d'exécution.

##### 📁 Notes pour les Développeurs

- BroadcastChannel revient gracieusement s'il n'est pas pris en charge.

- Les mises à jour en temps d'exécution sont clonées en profondeur avant la synchronisation pour éviter les problèmes de mutation.

- Cette version remplace l'ancienne architecture de synchronisation par un pipeline moderne, stable et en temps réel.

#### v5.11.24

- Pack d'Amélioration de Qualité Overlay & Preset Manager
- Nouveau Modal d'Exportation d'Overlay : Export demande maintenant un nom de fichier en utilisant un modal propre (prend en charge la touche ENTER)
- Nouveau Bouton Preset : Crée instantanément un preset vide tout neuf avec des valeurs par défaut
- UI Preset Manager Améliorée : Boutons d'action de preset réorganisés : Delete → Favorite → Duplicate → Rename → Apply
- Gestion d'Overlay Améliorée :
  - "Clear All Overlay Elements" utilise maintenant un modal de confirmation
  - La touche Delete supprime l'élément sélectionné (avec modal de confirmation)
  - Support de tooltip ajouté pour tous les boutons de suppression
- Améliorations d'Utilisabilité Modal Global : Tous les modals prennent maintenant en charge la confirmation via la touche ENTER
- Correction de Collision d'ID pour Append d'Overlay Preset : Problème de clé React dupliquée complètement résolu en régénérant les IDs d'éléments lors de l'ajout
- Améliorations Générales de Stabilité : Architecture en temps d'exécution préservée, règles d'autosave respectées et toutes les contraintes FAZ-9 restent intactes

#### v5.11.23

- Système d'overlay preset avec modal de sélection de modèles
- Modèles Single, Dual, Triple et Quadruple InfoGraphic
- Import/export d'overlay preset avec modes Replace et Append
- Limite d'éléments augmentée à 20 par overlay
- Normalisation automatique de zIndex pour les modèles ajoutés
- Génération de liste de modèles dynamique à partir des définitions de modèles
- Notifications d'erreur améliorées pour les opérations d'import/export
- Améliorations de positionnement de menu conscient de la fenêtre d'affichage

#### v5.11.21

- Moteur de mise en page basé sur les éléments
- Système de transformation de rotation et d'échelle
- Mise en surbrillance de sélection
- Mouvement avec les touches fléchées
- Modes legacy supprimés
- Gestionnaire de preset complet (Import/Export/Duplicate/Delete/Rename/Apply)
- Menu déroulant Quick Favorites pour changement instantané de preset
- Améliorations UX et stabilité

Voir GitHub Releases pour les versions antérieures.

---
### 🔗 LIENS

Repository: https://github.com/mrgogo7/nzxt-esc/

Support: [GitHub Sponsors](https://github.com/sponsors/mrgogo7) • [Patreon](https://www.patreon.com/mRGogo7) • [Buy Me a Coffee](https://www.buymeacoffee.com/mrgogo)

Issues:

https://github.com/mrgogo7/nzxt-esc/issues

---
### 📜 LICENCE

Licence d'Usage Personnel

**Autorisé :** Usage personnel • Modifications personnelles • Redistribution avec crédit

**Non Autorisé :** Usage commercial • Vente, regroupement, location ou monétisation sous quelque forme que ce soit

NZXT-ESC est un projet de passe-temps et communautaire destiné uniquement à un usage personnel.

<details>
<summary><strong>📁 Index Complet de Mots-clés SEO (Cliquez pour Développer)</strong></summary>

**nzxt kraken elite lcd editor, nzxt cam customization, nzxt web integration custom, nzxt animated lcd background, mp4 lcd background nzxt, youtube kraken elite lcd, nzxt gif overlay, nzxt overlay editor, custom lcd screen nzxt, nzxt cam alternatives, nzxt cam limitations, kraken elite custom display, nzxt lcd text editor, nzxt lcd metrics overlay, nzxt lcd mods, nzxt pinterest background, nzxt lcd media engine, nzxt-esc project, nzxt cam modding, nzxt kraken elite youtube support, custom nzxt layouts, nzxt cam web integration presets, nzxt overlay templates, nzxt custom ui editor, nzxt lcd graphics editor, nzxt real-time lcd sync, kraken elite advanced customization, nzxt cam mp4 support, nzxt cam gif support, nzxt cam youtube embed, nzxt cam background editor**

</details>

