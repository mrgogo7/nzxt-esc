# NZXT-ESC

### Éditeur avancé de disposition et de personnalisation d’écran pour NZXT Kraken AIO

Créez des dispositions LCD NZXT Kraken entièrement modifiables avec des capteurs en glisser-déposer, des polices personnalisées, des images, des GIF, des vidéos MP4, des horloges, des graphiques, des données de lecture et des animations réactives au son, affichées en direct via **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Ouvrir dans NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Ouvrir l’éditeur web](https://nzxt-esc.pages.dev/)
· [Fonctionnalités](#features)
· [Démarrage rapide](#quick-start)
· [FAQ](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Éditeur de disposition LCD NZXT Kraken par glisser-déposer de NZXT-ESC"
       width="70%" />

> [!NOTE]
> **NZXT-ESC est un projet communautaire indépendant.** Il n’est ni affilié, ni sponsorisé, ni approuvé par NZXT.

Si NZXT-ESC a amélioré votre configuration, vous pouvez soutenir la poursuite de son développement :

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## Personnalisation de l’écran LCD NZXT Kraken sans dispositions fixes

NZXT-ESC transforme l’écran NZXT Kraken en une zone de création libre. Composez un écran LCD personnalisé en plaçant chaque capteur, graphique, horloge, image ou élément multimédia exactement où vous le souhaitez. Redimensionnez, faites pivoter, réorganisez, renommez, verrouillez et stylisez les éléments tout en observant le résultat se mettre à jour en direct via NZXT CAM.

L’éditeur principal ne nécessite **aucun compte** et **aucune installation distincte pour l’utilisateur final**. Les presets et médias locaux restent dans le stockage du navigateur. Les overlays musicaux facultatifs utilisent l’application Windows locale [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="quick-start"></a>
## Démarrage rapide

### Ouvrir directement dans NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Cliquez sur **Open NZXT-ESC in NZXT CAM**.
2. Autorisez votre navigateur à ouvrir NZXT CAM.
3. Confirmez **Load Web Integration**.
4. Ouvrez la nouvelle carte Web Integration et sélectionnez **Configure**.
5. Créez votre disposition ; les changements sont synchronisés avec l’écran Kraken.

<details>
<summary><strong>Configuration manuelle dans NZXT CAM</strong></summary>

1. Ouvrez **NZXT CAM**.
2. Accédez à **Lighting → Kraken → LCD Display**.
3. Sélectionnez **Web Integration**.
4. Ouvrez les paramètres de **Custom Web Integration**.
5. Saisissez :

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Sélectionnez **Apply**, puis **Add as Card**.
7. Ouvrez la nouvelle carte et sélectionnez **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Écran de configuration de NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Ajouter NZXT-ESC comme carte NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Voir le résultat en action

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Preset LCD NZXT Kraken personnalisé créé avec NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Disposition animée de l’écran NZXT Kraken dans NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Overlay de capteurs NZXT CAM en direct sur un LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Écran LCD Kraken animé et personnalisé exécuté via NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Fonctionnalités

| Fonction | Ce qu’elle vous apporte |
|---|---|
| **Éditeur de disposition libre** | Déplacez, redimensionnez, faites pivoter, superposez, verrouillez, renommez et positionnez précisément chaque élément. |
| **Données de capteurs NZXT CAM en direct** | Créez des affichages personnalisés pour le CPU, le GPU, la RAM, la température du liquide, la puissance, la fréquence et la vitesse des ventilateurs. |
| **Graphiques avancés** | Combinez des graphiques de capteurs radiaux, linéaires, circulaires et historiques dans une seule disposition. |
| **Arrière-plans animés** | Utilisez des couleurs, dégradés, images locales, GIF, vidéos MP4, URL multimédias directes, YouTube et Pinterest. |
| **Intégration Now Playing** | Affichez la pochette d’album, les informations de piste et des animations réactives au son depuis un client Windows local. |
| **Explore et Library** | Importez des presets communautaires, modifiez chaque détail, organisez vos favoris et gérez votre propre collection locale. |
| **Stockage local en priorité** | Les presets utilisent LocalStorage ; les médias locaux utilisent IndexedDB et restent sur votre appareil. |
| **Éditeur multilingue** | Utilisez l’interface dans 18 langues prises en charge. |

### Éléments d’overlay

L’éditeur actuel regroupe les éléments d’overlay en quatre catégories claires :

| Contenu | Données | Temps | Audio |
|---|---|---|---|
| Texte | Capteur | Horloge numérique | Pochette d’album |
| Forme | Graphique radial | Horloge analogique | Texte Now Playing |
| Icône | Graphique linéaire | Date | Visualiseur audio |
| Autocollant | Graphique circulaire |  |  |
| Image | Graphique de capteur |  |  |

Dans la mesure du possible, tous les éléments suivent le même flux visuel : sélectionnez-les dans l’aperçu ou la liste des calques, puis ajustez leur position, taille, rotation, ordre, style et paramètres propres au type.

### Surveillance du matériel

Créez des dispositions en direct à partir des données de surveillance disponibles dans NZXT CAM, notamment :

`température CPU` · `charge CPU` · `fréquence CPU` · `puissance CPU` · `vitesse du ventilateur CPU` · `température GPU` · `charge GPU` · `fréquence GPU` · `puissance GPU` · `vitesse du ventilateur GPU` · `utilisation RAM` · `température du liquide`

Les systèmes multi-GPU peuvent sélectionner automatiquement le GPU actif ou utiliser un GPU précis. L’éditeur web fournit également des valeurs simulées lorsque l’API NZXT CAM n’est pas disponible, afin de continuer à concevoir et prévisualiser les dispositions.

### Arrière-plans et médias

Utilisez une couleur unie ou un dégradé comme base, puis ajoutez des médias depuis :

- Des fichiers locaux PNG, JPG, GIF, WebP ou MP4
- Des URL directes d’images et de vidéos
- Des vidéos YouTube
- Des liens multimédias Pinterest

Les médias d’arrière-plan peuvent être positionnés, redimensionnés, ajustés et combinés avec n’importe quelle disposition d’overlay. Les fichiers locaux sont stockés dans IndexedDB et ne sont pas téléversés par NZXT-ESC.

### Presets, Explore et Library

- Enregistrez et organisez jusqu’à **20 presets personnalisés** dans la Library locale.
- Créez chaque preset avec jusqu’à **40 éléments d’overlay**.
- Importez et exportez des fichiers de preset modifiables pour les sauvegarder ou les partager.
- Parcourez les dispositions créées par la communauté dans **Explore**.
- Ajoutez un preset Explore à la Library, personnalisez-le et appropriez-vous-le.
- Maintenez l’édition et le rendu Kraken synchronisés entre les deux vues de NZXT CAM.

## Now Playing et visualiseur audio

Le client Windows facultatif [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) s’exécute localement et envoie les données de session multimédia et de spectre audio à NZXT-ESC via une connexion WebSocket locale.

Utilisez-le pour ajouter :

- **Pochette d’album** illustration actuelle avec réglages de taille, bordure et coins
- **Texte Now Playing** titre, artiste ou album avec défilement des textes longs
- **Visualiseur audio** spectres et formes d’onde en temps réel personnalisables

L’intégration ne se limite pas à Spotify. L’application complémentaire lit les sessions multimédias Windows compatibles et la sortie audio système des navigateurs, lecteurs multimédias et autres applications.

<a id="languages"></a>
## Langues

L’éditeur prend actuellement en charge :

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**Documentation traduite :**
[English](../README.md) ·
[Türkçe](README.tr.md) ·
[Español](README.es.md) ·
[Deutsch](README.de.md) ·
[Português-BR](README.pt-BR.md) ·
[Français](README.fr.md) ·
[Italiano](README.it.md) ·
[日本語](README.ja.md) ·
[ไทย](README.th.md) ·
[Polski](README.pl.md) ·
[Svenska](README.sv.md) ·
[Nederlands](README.nl.md) ·
[한국어](README.ko.md) ·
[Русский](README.ru.md) ·
[हिन्दी](README.hi.md) ·
[Bahasa Indonesia](README.id.md) ·
[Čeština](README.cs.md) ·
[Filipino](README.fil.md)

## Confidentialité et stockage local

NZXT-ESC est conçu autour du stockage local du navigateur :

- La configuration des presets est enregistrée dans **LocalStorage**.
- Les images et vidéos locales sont enregistrées dans **IndexedDB**.
- Les relevés de capteurs NZXT CAM et les presets créés par l’utilisateur ne sont pas envoyés aux services d’analyse.
- Aucune information permettant d’identifier personnellement l’utilisateur n’est volontairement collectée par l’application.

Le site de production utilise **Google Tag Manager** et **Google Analytics 4** pour des analyses produit anonymes. **CookieYes** gère le consentement lorsque cela est requis, et les cookies d’analyse facultatifs sont activés selon les choix de l’utilisateur. Les versions de développement n’ont pas besoin des services d’analyse de production.

## Développement

### Exécuter en local

```bash
npm install
npm run dev
```

Ouvrez `http://localhost:5173`. L’éditeur utilise des données matérielles simulées lorsque NZXT CAM n’est pas disponible.

```bash
npm run build   # Vérifier les types et créer une version de production
npm test        # Exécuter les contrôles i18n et la suite Vitest
```

### Architecture

<details>
<summary><strong>Structure du projet et principes de conception</strong></summary>

```text
src/
├─ core/       Contrats de domaine pour les presets, overlays, éléments et arrière-plans
├─ render/     Moteur partagé de conversion preset-vers-modèle-de-rendu
├─ storage/    État LocalStorage, import/export et médias IndexedDB
├─ platform/   Adaptateurs pour NZXT CAM et l’application locale
├─ sync/       Synchronisation entre l’éditeur et l’exécution
├─ i18n/       Messages de langue typés et utilitaires de traduction
└─ ui/
   ├─ config/  Éditeur de configuration par glisser-déposer
   ├─ kraken/  Runtime léger pour l’écran Kraken
   └─ shared/  Composants d’interface réutilisables
```

L’aperçu de l’éditeur et le runtime Kraken utilisent le même pipeline de rendu canonique. Ce moteur partagé maintient la cohérence de la disposition, du style et des transformations entre ce que l’utilisateur conçoit et ce qui apparaît sur l’écran physique.

Les données des presets sont normalisées avant stockage, l’import/export est versionné et les mises à jour de l’éditeur sont synchronisées via `BroadcastChannel`, avec `localStorage` comme solution de secours.

</details>

### Contribuer

Les contributions et pull requests ciblées sont les bienvenues. Avant toute modification architecturale, consultez :

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Code de conduite](../CODE_OF_CONDUCT.md)
- [Politique de sécurité](../SECURITY.md)

<a id="faq"></a>
## FAQ

<details>
<summary><strong>Dois-je installer NZXT-ESC ?</strong></summary>

L’éditeur principal ne nécessite aucune installation distincte. Ouvrez-le via NZXT CAM Web Integration. Seuls les overlays musicaux facultatifs nécessitent le client Windows local NowPlaying.WebSocket.

</details>

<details>
<summary><strong>NZXT-ESC fonctionne-t-il sans NZXT CAM ?</strong></summary>

L’éditeur peut être ouvert dans un navigateur classique et utilise des valeurs de capteurs simulées pour la conception. La surveillance matérielle en direct et l’affichage sur l’écran Kraken nécessitent NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Quels modèles NZXT Kraken sont pris en charge ?</strong></summary>

NZXT-ESC est conçu pour les appareils NZXT Kraken compatibles avec le mode d’affichage NZXT CAM Web Integration. La taille et la forme d’écran disponibles sont déterminées via l’API NZXT CAM.

</details>

<details>
<summary><strong>Où sont stockés les presets et les médias locaux ?</strong></summary>

Les presets sont stockés dans LocalStorage du navigateur. Les images et vidéos locales sont stockées dans IndexedDB. Exportez régulièrement les presets importants lorsque vous changez de navigateur, d’installation Windows ou d’ordinateur.

</details>

<details>
<summary><strong>Now Playing nécessite-t-il Spotify ?</strong></summary>

Non. NowPlaying.WebSocket utilise les sessions multimédias Windows compatibles et l’audio système ; il peut donc fonctionner avec les navigateurs et d’autres applications multimédias compatibles.

</details>

<details>
<summary><strong>Les presets communautaires peuvent-ils être modifiés ?</strong></summary>

Oui. Les presets importés depuis Explore sont entièrement modifiables après leur ajout à la Library.

</details>

<a id="license"></a>
## Licence

NZXT-ESC est distribué sous une **Licence d’utilisation personnelle**.

**Autorisé:** utilisation personnelle, modifications personnelles et redistribution avec une attribution claire au projet d’origine.

**Utilisation commerciale:** la vente, l’intégration dans un lot, la location, l’intégration à un produit payant ou toute autre utilisation monétisée nécessitent l’autorisation écrite préalable du propriétaire du projet.
Consultez [LICENSE pour les conditions complètes](../LICENSE).

## Assistance et liens

- **Site web:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **Dernière version:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Bugs et idées:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **Application complémentaire:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

Si NZXT-ESC a amélioré votre configuration, vous pouvez soutenir la poursuite de son développement :

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Créé par **Gökhan AKGÜL (mRGogo)** alimenté par du café et des horaires de sommeil discutables.
