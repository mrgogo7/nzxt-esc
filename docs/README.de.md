# NZXT-ESC

### Erweiterter Layout-Editor zur Bildschirm­anpassung für NZXT Kraken AIO

Erstelle vollständig bearbeitbare NZXT-Kraken-LCD-Layouts mit Drag-and-drop-Sensor-Overlays, eigenen Schriftarten, Bildern, GIFs, MP4-Videos, Uhren, Diagrammen, Now-Playing-Daten und soundreaktiven Visualisierungen, die über **NZXT CAM Web Integration** live dargestellt werden.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[In NZXT CAM öffnen](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Web-Editor öffnen](https://nzxt-esc.pages.dev/)
· [Funktionen](#features)
· [Schnellstart](#quick-start)
· [FAQ](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESC Drag-and-drop-Layout-Editor für NZXT-Kraken-LCDs"
       width="70%" />

> [!NOTE]
> **NZXT-ESC ist ein unabhängiges Community-Projekt.** Es ist weder mit NZXT verbunden noch von NZXT gesponsert oder empfohlen.

Wenn NZXT-ESC dein Setup verbessert hat, kannst du die weitere Entwicklung unterstützen:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## NZXT-Kraken-LCD-Anpassung ohne feste Layouts

NZXT-ESC verwandelt das NZXT-Kraken-Display in eine frei gestaltbare Arbeitsfläche. Erstelle einen eigenen LCD-Bildschirm, indem du jeden Sensor, jede Grafik, Uhr, jedes Bild oder Medienelement genau dort platzierst, wo du es möchtest. Ändere Größe und Drehung, sortiere, benenne um, sperre und gestalte Elemente, während das Ergebnis über NZXT CAM live aktualisiert wird.

Der Haupteditor erfordert **kein Konto** und **keine separate Installation für Endnutzer**. Presets und lokale Medien bleiben im Browser-Speicher. Optionale Musik-Overlays verwenden die lokale Windows-Begleitanwendung [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="quick-start"></a>
## Schnellstart

### Direkt in NZXT CAM öffnen

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Klicke auf **Open NZXT-ESC in NZXT CAM**.
2. Erlaube deinem Browser, NZXT CAM zu öffnen.
3. Bestätige **Load Web Integration**.
4. Öffne die neue Web-Integration-Karte und wähle **Configure**.
5. Erstelle dein Layout; Änderungen werden mit dem Kraken-Display synchronisiert.

<details>
<summary><strong>Manuelle Einrichtung in NZXT CAM</strong></summary>

1. Öffne **NZXT CAM**.
2. Gehe zu **Lighting → Kraken → LCD Display**.
3. Wähle **Web Integration**.
4. Öffne die Einstellungen von **Custom Web Integration**.
5. Gib Folgendes ein:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Wähle **Apply** und anschließend **Add as Card**.
7. Öffne die neue Karte und wähle **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Einrichtungsbildschirm der NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="NZXT-ESC als NZXT-CAM-Web-Integration-Karte hinzufügen"
       width="48%" />
</p>

</details>

## In Aktion ansehen

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Mit NZXT-ESC erstelltes benutzerdefiniertes NZXT-Kraken-LCD-Preset"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Animiertes NZXT-Kraken-Display-Layout in NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Live-Sensor-Overlay von NZXT CAM auf einem Kraken-LCD"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Benutzerdefinierter animierter Kraken-LCD-Bildschirm über NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Funktionen

| Funktion | Dein Vorteil |
|---|---|
| **Frei gestaltbarer Layout-Editor** | Verschiebe, skaliere, drehe, schichte, sperre, benenne um und positioniere jedes Element präzise. |
| **Live-Sensordaten aus NZXT CAM** | Erstelle eigene Anzeigen für CPU, GPU, RAM, Flüssigkeitstemperatur, Leistung, Frequenz und Lüfterdrehzahl. |
| **Erweiterte Grafiken** | Kombiniere radiale, lineare, kreisförmige und historische Sensorgrafiken in einem Layout. |
| **Animierte Hintergründe** | Nutze Farben, Verläufe, lokale Bilder, GIFs, MP4-Videos, direkte Medien-URLs sowie YouTube- und Pinterest-Quellen. |
| **Now-Playing-Integration** | Zeige Albumcover, Titelinformationen und soundreaktive Visualisierungen von einem lokalen Windows-Client an. |
| **Explore und Library** | Importiere Community-Presets, bearbeite jedes Detail, organisiere Favoriten und verwalte deine lokale Preset-Sammlung. |
| **Lokale Speicherung zuerst** | Presets verwenden LocalStorage; lokale Medien werden in IndexedDB gespeichert und bleiben auf deinem Gerät. |
| **Mehrsprachiger Editor** | Nutze die Oberfläche in 18 unterstützten Sprachen. |

### Overlay-Elemente

Der aktuelle Editor gruppiert Overlay-Elemente in vier übersichtliche Kategorien:

| Inhalt | Daten | Zeit | Audio |
|---|---|---|---|
| Text | Sensor | Digitaluhr | Albumcover |
| Form | Radialgrafik | Analoguhr | Now-Playing-Text |
| Symbol | Lineargrafik | Datum | Audio-Visualizer |
| Sticker | Kreisgrafik |  |  |
| Bild | Sensorverlauf |  |  |

Wo immer möglich, verwenden alle Elemente denselben visuellen Arbeitsablauf: Wähle ein Element in der Vorschau oder Ebenenliste aus und passe anschließend Position, Größe, Drehung, Reihenfolge, Stil und typspezifische Einstellungen an.

### Hardware-Überwachung

Erstelle Live-Layouts mit den verfügbaren Überwachungsdaten von NZXT CAM, darunter:

`CPU-Temperatur` · `CPU-Auslastung` · `CPU-Frequenz` · `CPU-Leistung` · `CPU-Lüfterdrehzahl` · `GPU-Temperatur` · `GPU-Auslastung` · `GPU-Frequenz` · `GPU-Leistung` · `GPU-Lüfterdrehzahl` · `RAM-Auslastung` · `Flüssigkeitstemperatur`

Systeme mit mehreren GPUs können automatisch die aktive GPU auswählen oder eine bestimmte GPU verwenden. Wenn die NZXT-CAM-API nicht verfügbar ist, stellt der Browser-Editor außerdem Beispieldaten bereit, sodass Layouts weiterhin entworfen und in der Vorschau angezeigt werden können.

### Hintergründe und Medien

Nutze eine Vollfarbe oder einen Verlauf als Basis und füge Medien aus folgenden Quellen hinzu:

- Lokale PNG-, JPG-, GIF-, WebP- oder MP4-Dateien
- Direkte Bild- und Video-URLs
- YouTube-Videos
- Pinterest-Medienlinks

Hintergrundmedien können positioniert, skaliert, angepasst und mit jedem Overlay-Layout kombiniert werden. Lokale Dateien werden in IndexedDB gespeichert und nicht von NZXT-ESC hochgeladen.

### Presets, Explore und Library

- Speichere und organisiere bis zu **20 eigene Presets** in der lokalen Library.
- Erstelle jedes Preset mit bis zu **40 Overlay-Elementen**.
- Importiere und exportiere bearbeitbare Preset-Dateien zur Sicherung oder zum Teilen.
- Durchsuche von der Community erstellte Layouts über **Explore**.
- Füge ein Explore-Preset zur Library hinzu, passe es an und mache es zu deinem eigenen.
- Halte Bearbeitung und Kraken-Rendering zwischen den beiden NZXT-CAM-Ansichten synchron.

## Now Playing und Audio-Visualizer

Der optionale Windows-Client [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) läuft lokal und sendet Medien­sitzungs- sowie Audio­spektrumdaten über eine lokale WebSocket-Verbindung an NZXT-ESC.

Damit kannst du Folgendes hinzufügen:

- **Albumcover** aktuelles Coverbild mit Größen-, Rahmen- und Eckensteuerung
- **Now-Playing-Text** Titel, Künstler oder Album mit Lauftext für lange Inhalte
- **Audio-Visualizer** anpassbare Echtzeit-Spektrum- und Wellenformvisualisierungen

Die Integration ist nicht auf Spotify beschränkt. Die Begleitanwendung liest unterstützte Windows-Mediensitzungen und die Systemaudioausgabe von Browsern, Mediaplayern und anderen Apps.

<a id="languages"></a>
## Sprachen

Der Editor unterstützt derzeit:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**Übersetzte Dokumentation:**
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

## Datenschutz und lokale Speicherung

NZXT-ESC ist auf lokale Browser-Speicherung ausgelegt:

- Die Preset-Konfiguration wird in **LocalStorage** gespeichert.
- Lokale Bilder und Videos werden in **IndexedDB** gespeichert.
- NZXT-CAM-Sensordaten und von Nutzern erstellte Presets werden nicht an Analysedienste gesendet.
- Die Anwendung sammelt nicht absichtlich personenbezogene Daten.

Die Produktionswebsite verwendet **Google Tag Manager** und **Google Analytics 4** für anonyme Produktanalysen. **CookieYes** verwaltet die Einwilligung, sofern erforderlich; optionale Analyse-Cookies werden entsprechend den Einwilligungsentscheidungen des Nutzers aktiviert. Entwicklungs-Builds benötigen keine Produktions-Analysedienste.

## Entwicklung

### Lokal ausführen

```bash
npm install
npm run dev
```

Öffne `http://localhost:5173`. Der Editor verwendet Beispiel-Hardwaredaten, wenn NZXT CAM nicht verfügbar ist.

```bash
npm run build   # Typen prüfen und Produktions-Build erstellen
npm test        # i18n-Prüfungen und Vitest-Testpaket ausführen
```

### Architektur

<details>
<summary><strong>Projektstruktur und Designprinzipien</strong></summary>

```text
src/
├─ core/       Domänenverträge für Presets, Overlays, Elemente und Hintergründe
├─ render/     Gemeinsame Engine vom Preset zum Render-Modell
├─ storage/    LocalStorage-Status, Import/Export und IndexedDB-Medien
├─ platform/   Adapter für NZXT CAM und lokale Begleitanwendungen
├─ sync/       Synchronisierung zwischen Editor und Laufzeit
├─ i18n/       Typisierte Sprachtexte und Übersetzungswerkzeuge
└─ ui/
   ├─ config/  Drag-and-drop-Konfigurationseditor
   ├─ kraken/  Leichtgewichtige Kraken-Display-Laufzeit
   └─ shared/  Wiederverwendbare UI-Komponenten
```

Die Editor-Vorschau und die Kraken-Laufzeit verwenden dieselbe kanonische Render-Pipeline. Diese gemeinsame Engine sorgt dafür, dass Layout, Stil und Transformationsverhalten zwischen dem Entwurf des Nutzers und der physischen Anzeige übereinstimmen.

Preset-Daten werden vor dem Speichern normalisiert, Import und Export sind versioniert und Editor-Aktualisierungen werden über `BroadcastChannel` mit einem `localStorage`-Fallback synchronisiert.

</details>

### Mitwirken

Beiträge und fokussierte Pull Requests sind willkommen. Lies vor Architekturänderungen bitte:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Verhaltenskodex](../CODE_OF_CONDUCT.md)
- [Sicherheitsrichtlinie](../SECURITY.md)

<a id="faq"></a>
## FAQ

<details>
<summary><strong>Muss ich NZXT-ESC installieren?</strong></summary>

Der Haupteditor benötigt keine separate Installation. Öffne ihn über NZXT CAM Web Integration. Nur die optionalen Musik-Overlays benötigen den lokalen Windows-Client NowPlaying.WebSocket.

</details>

<details>
<summary><strong>Funktioniert NZXT-ESC ohne NZXT CAM?</strong></summary>

Der Editor kann in einem normalen Browser geöffnet werden und verwendet Beispielsensordaten für das Design. Live-Hardwareüberwachung und die Ausgabe auf dem Kraken-Display erfordern NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Welche NZXT-Kraken-Modelle werden unterstützt?</strong></summary>

NZXT-ESC ist für NZXT-Kraken-Geräte ausgelegt, die den Anzeigemodus NZXT CAM Web Integration unterstützen. Verfügbare Displaygröße und -form werden über die NZXT-CAM-API ermittelt.

</details>

<details>
<summary><strong>Wo werden Presets und lokale Medien gespeichert?</strong></summary>

Presets werden im LocalStorage des Browsers gespeichert, lokale Bilder und Videos in IndexedDB. Exportiere wichtige Presets regelmäßig, wenn du Browser, Windows-Installation oder Computer wechselst.

</details>

<details>
<summary><strong>Benötigt Now Playing Spotify?</strong></summary>

Nein. NowPlaying.WebSocket verwendet unterstützte Windows-Mediensitzungen und Systemaudio und kann daher mit Browsern und anderen kompatiblen Medienanwendungen funktionieren.

</details>

<details>
<summary><strong>Können Community-Presets bearbeitet werden?</strong></summary>

Ja. Aus Explore importierte Presets sind nach dem Hinzufügen zur Library vollständig bearbeitbar.

</details>

<a id="license"></a>
## Lizenz

NZXT-ESC wird unter einer **Lizenz für persönliche Nutzung** veröffentlicht.

**Erlaubt:** persönliche Nutzung, persönliche Änderungen und Weiterverteilung mit deutlicher Nennung des Originalprojekts.

**Kommerzielle Nutzung:** Verkauf, Bündelung, Vermietung, Integration in ein kostenpflichtiges Produkt oder andere monetarisierte Nutzung erfordern die vorherige schriftliche Genehmigung des Projektinhabers.
Die vollständigen Bedingungen stehen in [LICENSE](../LICENSE).

## Support und Links

- **Website:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **Neueste Version:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Fehlerberichte und Ideen:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **Begleitanwendung:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

Wenn NZXT-ESC dein Setup verbessert hat, kannst du die weitere Entwicklung unterstützen:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Erstellt von **Gökhan AKGÜL (mRGogo)** angetrieben von Kaffee und fragwürdigen Schlafplänen.

