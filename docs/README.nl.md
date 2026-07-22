# NZXT-ESC

### Geavanceerde editor voor schermindeling en aanpassing voor NZXT Kraken AIO

Maak volledig bewerkbare NZXT Kraken LCD-indelingen met versleepbare sensoroverlays, aangepaste lettertypen, afbeeldingen, GIF’s, MP4-video, klokken, grafieken, Now Playing-gegevens en geluidsreactieve visuals die live worden weergegeven via **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Openen in NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Webeditor openen](https://nzxt-esc.pages.dev/)
· [Functies](#features)
· [Snel starten](#quick-start)
· [Veelgestelde vragen](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESC versleepbare editor voor NZXT Kraken LCD-indelingen"
       width="70%" />

> [!NOTE]
> **NZXT-ESC is een onafhankelijk communityproject.** Het is niet verbonden met, gesponsord door of goedgekeurd door NZXT.

## NZXT Kraken LCD aanpassen zonder vaste indelingen

NZXT-ESC verandert het NZXT Kraken-display in een vrij canvas. Bouw een eigen LCD-scherm door elke sensor, grafiek, klok, afbeelding of media-element precies te plaatsen waar je wilt. Vergroot, verklein, roteer, herschik, hernoem, vergrendel en style elementen terwijl je het resultaat live via NZXT CAM ziet bijwerken.

De hoofdeditor vereist **geen account** en **geen afzonderlijke installatie voor eindgebruikers**. Presets en lokale media blijven in de browseropslag. Optionele muziekoverlays gebruiken de lokale Windows-companionapp [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="quick-start"></a>
## Snel starten

### Rechtstreeks openen in NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Klik op **Open NZXT-ESC in NZXT CAM**.
2. Sta toe dat je browser NZXT CAM opent.
3. Bevestig **Load Web Integration**.
4. Open de nieuwe Web Integration-kaart en selecteer **Configure**.
5. Maak je indeling; wijzigingen worden gesynchroniseerd met het Kraken-display.

<details>
<summary><strong>Handmatige configuratie in NZXT CAM</strong></summary>

1. Open **NZXT CAM**.
2. Ga naar **Lighting → Kraken → LCD Display**.
3. Selecteer **Web Integration**.
4. Open de instellingen van **Custom Web Integration**.
5. Voer in:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Selecteer **Apply** en daarna **Add as Card**.
7. Open de nieuwe kaart en selecteer **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Configuratiescherm van NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="NZXT-ESC toevoegen als NZXT CAM Web Integration-kaart"
       width="48%" />
</p>

</details>

## Bekijk het in actie

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Aangepaste NZXT Kraken LCD-preset gemaakt met NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Geanimeerde NZXT Kraken-display-indeling in NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Live NZXT CAM-sensoroverlay op een Kraken LCD"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Aangepast geanimeerd Kraken LCD-scherm via NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Functies

| Mogelijkheid | Wat je eraan hebt |
|---|---|
| **Vrije indelingseditor** | Versleep, schaal, roteer, rangschik in lagen, vergrendel, hernoem en positioneer elk element nauwkeurig. |
| **Live NZXT CAM-sensordata** | Maak aangepaste weergaven voor CPU, GPU, RAM, vloeistoftemperatuur, vermogen, frequentie en ventilatorsnelheid. |
| **Geavanceerde grafieken** | Combineer radiale, lineaire, cirkelvormige en historische sensorgrafieken in één indeling. |
| **Geanimeerde achtergronden** | Gebruik kleuren, verlopen, lokale afbeeldingen, GIF’s, MP4-video, directe media-URL’s, YouTube en Pinterest. |
| **Now Playing-integratie** | Toon albumillustraties, nummerinformatie en geluidsreactieve visuals vanuit een lokale Windows-client. |
| **Explore en Library** | Importeer communitypresets, bewerk elk onderdeel, organiseer favorieten en beheer je eigen lokale collectie. |
| **Lokale opslag voorop** | Presets gebruiken LocalStorage; lokale media gebruiken IndexedDB en blijven op je apparaat. |
| **Meertalige editor** | Gebruik de interface in 18 ondersteunde talen. |

### Overlay-elementen

De huidige editor groepeert overlay-elementen in vier duidelijke categorieën:

| Inhoud | Gegevens | Tijd | Audio |
|---|---|---|---|
| Tekst | Sensor | Digitale klok | Albumhoes |
| Vorm | Radiale grafiek | Analoge klok | Now Playing-tekst |
| Pictogram | Lineaire grafiek | Datum | Audiovisualizer |
| Sticker | Cirkelgrafiek |  |  |
| Afbeelding | Sensorgrafiek |  |  |

Waar mogelijk gebruiken alle elementen dezelfde visuele workflow: selecteer het element in de preview of lagenlijst en pas daarna positie, grootte, rotatie, volgorde, stijl en typespecifieke instellingen aan.

### Hardwaremonitoring

Maak live-indelingen met beschikbare NZXT CAM-monitoringgegevens, waaronder:

`CPU-temperatuur` · `CPU-belasting` · `CPU-frequentie` · `CPU-vermogen` · `CPU-ventilatorsnelheid` · `GPU-temperatuur` · `GPU-belasting` · `GPU-frequentie` · `GPU-vermogen` · `GPU-ventilatorsnelheid` · `RAM-gebruik` · `vloeistoftemperatuur`

Systemen met meerdere GPU’s kunnen automatisch de actieve GPU selecteren of een specifieke GPU gebruiken. De browsereditor toont ook voorbeeldwaarden wanneer de NZXT CAM API niet beschikbaar is, zodat indelingen nog steeds kunnen worden ontworpen en bekeken.

### Achtergronden en media

Gebruik een effen kleur of verloop als basis en voeg vervolgens media toe uit:

- Lokale PNG-, JPG-, GIF-, WebP- of MP4-bestanden
- Directe afbeeldings- en video-URL’s
- YouTube-video’s
- Pinterest-medialinks

Achtergrondmedia kunnen worden gepositioneerd, geschaald, passend gemaakt en gecombineerd met elke overlay-indeling. Lokale bestanden worden opgeslagen in IndexedDB en niet door NZXT-ESC geüpload.

### Presets, Explore en Library

- Sla maximaal **20 aangepaste presets** op en organiseer ze in de lokale Library.
- Bouw elke preset met maximaal **40 overlay-elementen**.
- Importeer en exporteer bewerkbare presetbestanden voor back-up of delen.
- Blader door door de community gemaakte indelingen via **Explore**.
- Voeg een Explore-preset toe aan de Library, pas hem aan en maak hem eigen.
- Houd bewerking en Kraken-rendering gesynchroniseerd tussen de twee NZXT CAM-weergaven.

## Now Playing en audiovisualizer

De optionele Windows-client [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) draait lokaal en stuurt mediasessie- en audiospectrumgegevens via een lokale WebSocket-verbinding naar NZXT-ESC.

Gebruik deze om toe te voegen:

- **Albumhoes** huidige illustratie met instellingen voor grootte, rand en hoeken
- **Now Playing-tekst** titel, artiest of album met scrollen voor lange tekst
- **Audiovisualizer** aanpasbare realtime spectrum- en golfvormvisualisaties

De integratie is niet beperkt tot Spotify. De companionapp leest ondersteunde Windows-mediasessies en systeemgeluid uit browsers, mediaspelers en andere apps.

<a id="languages"></a>
## Talen

De editor ondersteunt momenteel:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**Vertaalde documentatie:**
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

## Privacy en lokale opslag

NZXT-ESC is ontworpen rond lokale browseropslag:

- Presetconfiguratie wordt opgeslagen in **LocalStorage**.
- Lokale afbeeldingen en video’s worden opgeslagen in **IndexedDB**.
- NZXT CAM-sensorwaarden en door gebruikers gemaakte presets worden niet naar analytics gestuurd.
- De app verzamelt niet bewust persoonlijk identificeerbare informatie.

De productiewebsite gebruikt **Google Tag Manager** en **Google Analytics 4** voor anonieme productanalyse. **CookieYes** beheert toestemming waar dat nodig is, en optionele analysecookies worden ingeschakeld volgens de keuze van de gebruiker. Ontwikkelbuilds vereisen geen productie-analysediensten.

## Ontwikkeling

### Lokaal uitvoeren

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. De editor gebruikt gesimuleerde hardwaregegevens wanneer NZXT CAM niet beschikbaar is.

```bash
npm run build   # Typecontrole uitvoeren en een productiebuild maken
npm test        # i18n-controles en de Vitest-testsuite uitvoeren
```

### Architectuur

<details>
<summary><strong>Projectstructuur en ontwerpprincipes</strong></summary>

```text
src/
├─ core/       Domeincontracten voor presets, overlays, elementen en achtergronden
├─ render/     Gedeelde engine van preset naar rendermodel
├─ storage/    LocalStorage-status, import/export en IndexedDB-media
├─ platform/   Adapters voor NZXT CAM en lokale companionapp
├─ sync/       Synchronisatie tussen editor en runtime
├─ i18n/       Getypeerde taalberichten en vertaalhulpmiddelen
└─ ui/
   ├─ config/  Versleepbare configuratie-editor
   ├─ kraken/  Lichtgewicht runtime voor het Kraken-display
   └─ shared/  Herbruikbare interfacecomponenten
```

De preview van de editor en de Kraken-runtime gebruiken dezelfde canonieke renderpipeline. Deze gedeelde engine houdt indeling, stijl en transformaties consistent tussen wat de gebruiker ontwerpt en wat op het fysieke scherm verschijnt.

Presetgegevens worden voor opslag genormaliseerd, import/export is geversioneerd en editorupdates worden gesynchroniseerd via `BroadcastChannel`, met `localStorage` als terugvaloptie.

</details>

### Bijdragen

Bijdragen en gerichte pull requests zijn welkom. Lees vóór architectuurwijzigingen:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Gedragscode](../CODE_OF_CONDUCT.md)
- [Beveiligingsbeleid](../SECURITY.md)

<a id="faq"></a>
## Veelgestelde vragen

<details>
<summary><strong>Moet ik NZXT-ESC installeren?</strong></summary>

De hoofdeditor vereist geen aparte installatie. Open hem via NZXT CAM Web Integration. Alleen de optionele muziekoverlays vereisen de lokale Windows-client NowPlaying.WebSocket.

</details>

<details>
<summary><strong>Werkt NZXT-ESC zonder NZXT CAM?</strong></summary>

De editor kan in een gewone browser worden geopend en gebruikt gesimuleerde sensorwaarden voor het ontwerpen. Live hardwaremonitoring en uitvoer op het Kraken-display vereisen NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Welke NZXT Kraken-modellen worden ondersteund?</strong></summary>

NZXT-ESC is ontworpen voor NZXT Kraken-apparaten die de weergavemodus NZXT CAM Web Integration ondersteunen. Beschikbare schermgrootte en -vorm worden via de NZXT CAM API bepaald.

</details>

<details>
<summary><strong>Waar worden presets en lokale media opgeslagen?</strong></summary>

Presets worden opgeslagen in LocalStorage van de browser. Lokale afbeeldingen en video’s worden opgeslagen in IndexedDB. Exporteer belangrijke presets regelmatig wanneer je van browser, Windows-installatie of computer wisselt.

</details>

<details>
<summary><strong>Vereist Now Playing Spotify?</strong></summary>

Nee. NowPlaying.WebSocket gebruikt ondersteunde Windows-mediasessies en systeemgeluid en kan daardoor met browsers en andere compatibele media-apps werken.

</details>

<details>
<summary><strong>Kunnen communitypresets worden bewerkt?</strong></summary>

Ja. Presets die vanuit Explore zijn geïmporteerd, zijn volledig bewerkbaar nadat ze aan de Library zijn toegevoegd.

</details>

<a id="license"></a>
## Licentie

NZXT-ESC wordt uitgebracht onder een **licentie voor persoonlijk gebruik**.

**Toegestaan:** persoonlijk gebruik, persoonlijke aanpassingen en herdistributie met duidelijke vermelding van het oorspronkelijke project.

**Commercieel gebruik:** verkopen, bundelen, verhuren, integreren in een betaald product of ander gebruik waarmee inkomsten worden verdiend vereist voorafgaande schriftelijke toestemming van de projecteigenaar.
Bekijk [LICENSE voor de volledige voorwaarden](../LICENSE).

## Ondersteuning en links

- **Website:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **Nieuwste release:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Bugmeldingen en ideeën:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **Companionapp:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

<div align="center">

Als NZXT-ESC je setup heeft verbeterd, kun je de verdere ontwikkeling ondersteunen:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Gebouwd door **Gökhan AKGÜL (mRGogo)** — aangedreven door koffie en twijfelachtige slaapschema’s.

</div>
