# NZXT-ESC - Die beste NZXT Web Integration

### Erweiterter Layout-Editor zur Bildschirm­anpassung für NZXT Kraken AIO

Erstelle vollständig bearbeitbare NZXT-Kraken-LCD-Layouts mit Drag-and-drop-Sensor-Overlays, eigenen Schriftarten, Bildern, GIFs, APNG, MP4- und WebM-Videos, Uhren, Diagrammen, Now-Playing-Daten und soundreaktiven Visualisierungen, die über **NZXT CAM Web Integration** live dargestellt werden.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-20-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[In NZXT CAM öffnen](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Live-Vorschau öffnen](https://nzxt-esc.pages.dev/)
· [Unterstützte Kraken-Modelle](#supported-nzxt-kraken-lcd-models)
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

<a id="supported-nzxt-kraken-lcd-models"></a>

## Unterstützte NZXT-Kraken-LCD-Modelle

NZXT-ESC unterstützt NZXT-Kraken-AIO-Flüssigkeitskühler mit LCD-Display und NZXT CAM Web Integration, einschließlich aktueller und vorheriger Kraken-Elite-, Kraken-Plus-, Kraken- und Kraken-Z-Modelle.

NZXT Kraken Elite (2024)
NZXT Kraken Elite 240
NZXT Kraken Elite 360
NZXT Kraken Elite 240 RGB
NZXT Kraken Elite 280 RGB
NZXT Kraken Elite 360 RGB
NZXT Kraken Elite 420 RGB
NZXT Kraken Plus (2025)
NZXT Kraken Plus 240
NZXT Kraken Plus 280
NZXT Kraken Plus 360
NZXT Kraken Plus 240 RGB
NZXT Kraken Plus 360 RGB
NZXT Kraken Elite (2023)
NZXT Kraken Elite 240 (2023)
NZXT Kraken Elite 280 (2023)
NZXT Kraken Elite 360 (2023)
NZXT Kraken Elite 240 RGB (2023)
NZXT Kraken Elite 280 RGB (2023)
NZXT Kraken Elite 360 RGB (2023)
NZXT Kraken (2023)
NZXT Kraken 240
NZXT Kraken 280
NZXT Kraken 360
NZXT Kraken 240 RGB
NZXT Kraken 280 RGB
NZXT Kraken 360 RGB
NZXT Kraken Z Series
NZXT Kraken Z53
NZXT Kraken Z63
NZXT Kraken Z73
NZXT Kraken Z53 RGB
NZXT Kraken Z63 RGB
NZXT Kraken Z73 RGB

NZXT-ESC passt das Layout automatisch an die über die NZXT-CAM-API gemeldete Kraken-LCD-Auflösung, -Größe und -Anzeigeform an, sodass eigene Layouts, Sensor-Overlays, animierte Hintergründe, Grafiken und Medien über NZXT CAM Web Integration dargestellt werden können.

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
| **Mehrsprachiger Editor** | Nutze die Oberfläche in 20 unterstützten Sprachen. |

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
· `Filipino` · `العربية` · `Bahasa Melayu`

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
[Filipino](README.fil.md) ·
[العربية](README.ar.md) ·
[Bahasa Melayu](README.ms.md)

## Datenschutz und lokale Speicherung

NZXT-ESC ist auf lokale Browser-Speicherung ausgelegt:

- Die Preset-Konfiguration wird in **LocalStorage** gespeichert.
- Lokale Bilder und Videos werden in **IndexedDB** gespeichert.
- NZXT-CAM-Sensordaten und von Nutzern erstellte Presets werden nicht an Analysedienste gesendet.
- Die Anwendung sammelt nicht absichtlich personenbezogene Daten.

Die Produktionswebsite verwendet **Google Tag Manager** und **Google Analytics 4** für anonyme Produktanalysen. **CookieYes** verwaltet die Einwilligung, sofern erforderlich, und Google-Analytics-Cookies werden entsprechend den Einwilligungsentscheidungen des Nutzers aktiviert.

Die veröffentlichte Website verwendet außerdem **Cloudflare Web Analytics**, aktiviert über Cloudflare Pages und unabhängig von Google Tag Manager betrieben. Es bietet datenschutzfreundliche Analysen zu Website-Traffic und -Leistung, ohne Cookies oder LocalStorage zu verwenden.

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

NZXT-ESC unterstützt LCD-Kühler der Serien **NZXT Kraken Elite, Kraken Plus, Kraken (2023) und Kraken Z**, die den Anzeigemodus NZXT CAM Web Integration bereitstellen.

Die vollständige Liste findest du unter [Unterstützte NZXT-Kraken-LCD-Modelle](#supported-nzxt-kraken-lcd-models).

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

<details>
<summary><strong>Wie funktioniert der Supporter-Zugang?</strong></summary>

NZXT-ESC wird unabhängig entwickelt und gepflegt. Nachdem du genügend Zeit hattest, das Projekt wirklich kennenzulernen, fragt dich NZXT-ESC möglicherweise, ob du seine weitere Entwicklung unterstützen oder dir noch etwas mehr Zeit für deine Entscheidung nehmen möchtest.

Unterstützung muss nicht Geld bedeuten. Feedback, Fehlerberichte, Ideen, das Teilen des Projekts, anderen dabei zu helfen, es zu entdecken, und andere sinnvolle Community-Beiträge helfen NZXT-ESC alle beim Wachsen.

Supporter-Zugangscodes stehen Unterstützern des Projekts zur Verfügung und können auch an Community-Mitglieder verschenkt werden, die einen sinnvollen Beitrag zu NZXT-ESC leisten.

Die Nutzungszeit wird nur gezählt, während NZXT-ESC aktiv auf dem Kraken-Display läuft.

</details>

<a id="license"></a>
## Lizenz

NZXT-ESC wird unter einer **Lizenz für persönliche Nutzung** veröffentlicht.

**Erlaubt:** persönliche Nutzung, persönliche Änderungen und Weiterverteilung mit deutlicher Nennung des Originalprojekts.

**Kommerzielle Nutzung:** Verkauf, Bündelung, Vermietung, Integration in ein kostenpflichtiges Produkt oder andere monetarisierte Nutzung erfordern die vorherige schriftliche Genehmigung des Projektinhabers.
Die vollständigen Bedingungen stehen in [LICENSE](../LICENSE).

## Support und Community

- **Website:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **Neueste Version:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Fehlerberichte und Ideen:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

Folge NZXT-ESC auf YouTube und Instagram für Showcases, neue Funktionen, Tutorials, Community-Setups und Projekt-Updates.

Wenn sich NZXT-ESC einen Platz in deinem Setup verdient hat, gibt es viele Möglichkeiten, das Projekt zu unterstützen: teile Feedback und Ideen, melde Fehler, hilf anderen, NZXT-ESC zu entdecken, engagiere dich in der Community - oder spendiere mir einfach einen Kaffee.

Jede Art von Beitrag bringt NZXT-ESC voran, während die Kaffee-Unterstützung hilft, Kosten für Server, API, Hosting und Wartung zu decken.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Erstellt von **Gökhan AKGÜL (mRGogo)** - angetrieben von Kaffee und fragwürdigen Schlafplänen.

