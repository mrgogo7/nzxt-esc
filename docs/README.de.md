> ⚠️ This document is an automatically translated version of the main English README.
> Technical terms, code blocks, filenames, and project terminology are intentionally kept in their original form.

# NZXT Elite Screen Customizer (NZXT-ESC) v5.11.261

Ein moderner, browserbasierter Medien- und Overlay-Editor für NZXT Kraken Elite LCD-Bildschirme.

Erstellen Sie benutzerdefinierte animierte Hintergründe, Metrik-Overlays, Textebenen, Trennlinien und vollständig personalisierte Layouts — alles live in NZXT CAM synchronisiert.

Kostenlos nur für den persönlichen Gebrauch — kommerzielle Nutzung ist strengstens untersagt.

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
## 📋 INHALT

- [🚀 Schnellstart](#-schnellstart)
  - [Methode 1 — Direkter Start (Empfohlen)](#methode-1--direkter-start-empfohlen)
  - [Methode 2 — Manuelle Installation (In NZXT CAM)](#methode-2--manuelle-installation-in-nzxt-cam)
  - [Empfohlen: Integrationskarte umbenennen](#empfohlen-integrationskarte-umbenennen)
- [🎛 Verwendung des Editors (Konfigurieren-Button)](#-verwendung-des-editors-konfigurieren-button)
- [💡 Was macht NZXT-ESC besonders?](#-was-macht-nzxt-esc-besonders)
  - [1. Designorientierte Bearbeitungserfahrung](#1-designorientierte-bearbeitungserfahrung)
  - [2. Vollständiges elementbasiertes Overlay-Engine](#2-vollständiges-elementbasiertes-overlay-engine)
  - [3. Echtzeit-LCD-Synchronisation](#3-echtzeit-lcd-synchronisation)
  - [4. Erweiterte Medien-Engine](#4-erweiterte-medien-engine)
  - [5. Preset-System (Früher Zugang)](#5-preset-system-früher-zugang)
- [🌍 Unterstützte Sprachen](#-unterstützte-sprachen)
- [🧪 Technische Details](#-technische-details)
- [🔧 Entwicklerinformationen](#-entwicklerinformationen)
- [🕛 Versionsgeschichte](#-versionsgeschichte)
- [🔗 Links](#-links)
- [📜 Lizenz](#-lizenz)

---
### 🚀 SCHNELLSTART

NZXT-ESC funktioniert INNERHALB von NZXT CAM mit der Funktion "Web Integration". Es gibt zwei Möglichkeiten zur Installation:

#### METHODE 1 — DIREKTER START (EMPFOHLEN)

1. Kopieren Sie dies in die Adressleiste Ihres Browsers:
   ```text
   nzxt-cam://action/load-web-integration?url=https://mrgogo7.github.io/nzxt-esc/
   ```
2. Drücken Sie Enter.
3. Ihr Browser zeigt eine Frage: "nzxt-cam-Link mit NZXT CAM öffnen?" → Genehmigen / Erlauben
4. NZXT CAM wird automatisch gestartet.
5. Sie sehen ein Bestätigungsfenster: Web Integration laden? Sind Sie sicher, dass Sie die folgende Web-Integration laden möchten?
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
6. Drücken Sie "Laden".
7. Nach dem Laden öffnen Sie die Karte "Custom Web Integration".

#### METHODE 2 — MANUELLE INSTALLATION (IN NZXT CAM)

1. Öffnen Sie NZXT CAM.
2. Gehen Sie zu: Lighting → Kraken Elite V2 → LCD Display
3. Ändern Sie den Anzeigemodus auf: Web Integration
4. Finden Sie die Karte mit dem Namen: Custom Web Integration
5. Klicken Sie auf "Settings".
6. Geben Sie die URL ein:
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
7. Drücken Sie "Apply".
8. Drücken Sie dann: Add as Card
9. Eine neue Web-Integration-Karte namens "My Web Integration" wird angezeigt.
10. Wählen Sie "My Web Integration".
11. Drücken Sie "Configure", um den NZXT-ESC-Editor zu öffnen.

#### EMPFOHLEN: INTEGRATIONSKARTE UMBENENNEN

NZXT CAM weist standardmäßig den Namen "My Web Integration" zu. Zum Umbenennen:
1. Wählen Sie "My Web Integration".
2. Drücken Sie "Edit".
3. Ändern Sie die Felder auf: Title:
   ```text
   Elite Screen Customizer
   ```
   Description:
   ```text
   NZXT Elite Screen Customizer (NZXT-ESC)
   ```
Dies hilft, die Integration von anderen zu unterscheiden.

---
### 🎛 VERWENDUNG DES EDITORS (KONFIGURIEREN-BUTTON)

Alle Bearbeitungen werden INNERHALB von NZXT CAM über die Schaltfläche "Configure" durchgeführt.

Im Editor können Sie:

- Metrik-, Text- und Trennerelemente hinzufügen / entfernen (bis zu 20 Elemente pro Overlay)
- Position, Rotation, Skalierung, Deckkraft und Farbe anpassen
- MP4 / GIF / PNG / JPG Hintergrundmedien wählen
- Local Media-Dateien verwenden, die im Browser über IndexedDB gespeichert sind
- Presets verwalten (Import, Export, Duplicate, Delete, Rename, Apply)
- Overlay-Preset-Vorlagen verwenden (Single, Dual, Triple, Quadruple InfoGraphic-Layouts)
- Overlay-Presets mit Replace- oder Append-Optionen importieren
- Schnell zwischen bevorzugten Presets über das Quick Favorites-Dropdown wechseln
- Alle Änderungen in Echtzeit auf Ihrem Kraken Elite LCD in der Vorschau anzeigen

Keine externe URL oder config.html mehr erforderlich.

---
### 💡 WAS MACHT NZXT-ESC BESONDERS?

NZXT-ESC ist kein Theme-Paket — es ist ein **vollständiger, designorientierter Layout-Editor**, der speziell für das Kraken Elite LCD entwickelt wurde.

Es bietet vollständige kreative Freiheit, die weit über das hinausgeht, was NZXT CAM nativ unterstützt.

NZXT CAM **erlaubt nicht**:
- Freie Elementpositionierung  
- Elementskalierung oder -rotation  
- Benutzerdefinierte Text-Overlays  
- Transparente Farben  
- MP4-Hintergründe  
- YouTube-Hintergründe  
- Pinterest-URLs  
- Gemischte Medien + Overlay-Kombinationen  

NZXT-ESC **ermöglicht all dies**.

#### 1. DESIGNORIENTIERTE BEARBEITUNGSERFAHRUNG

- Freies Drag-and-Drop-Platzieren
- Rotation und Skalierung pro Element
- Transform-Handles um die kreisförmige LCD-Vorschau
- Pfeiltasten-Mikroanpassungen
- Minimales und ablenkungsfreies Interface
- Genaue kreisförmige Vorschau, die der echten Hardware entspricht

#### 2. VOLLSTÄNDIGES ELEMENTBASIERTES OVERLAY-ENGINE

Legacy Single/Dual/Triple-Modi wurden vollständig entfernt.

Sie können jetzt frei hinzufügen:

- Metrik-Elemente
- Text-Elemente
- Trennerelemente

Jedes Element unterstützt:

- X/Y-Position
- Rotation
- Skalierung
- Farbe & Deckkraft
- Auswahlhervorhebung

**Overlay Preset-System**

Wenden Sie schnell vorkonfigurierte Layouts über das Vorlagenauswahl-Modal an. Wählen Sie aus Single-, Dual-, Triple- oder Quadruple-InfoGraphic-Vorlagen, jede mit optimierter Positionierung und Styling. Vorlagen können mit Replace-Modus (überschreibt vorhandene Elemente) oder Append-Modus (fügt zu vorhandenen Elementen hinzu) importiert werden. Beim Anhängen werden zIndex-Werte automatisch normalisiert, um Renderkonflikte zu vermeiden. Das System unterstützt bis zu 20 Overlay-Elemente pro Konfiguration.

#### 3. ECHTZEIT-LCD-SYNCHRONISATION

- Updates mit ~100ms Drosselung für Stabilität
- Kein manuelles Aktualisieren erforderlich
- LCD-Bildschirm aktualisiert sich sofort beim Bearbeiten

#### 4. ERWEITERTE MEDIEN-ENGINE

Die Medien-Engine unterstützt:

- MP4-Video (vollständige Wiedergabe im LCD)
- GIF-Animationen
- PNG / JPG-Bilder
- Local Media-Dateien (IndexedDB): Vollauflösungsbilder und -videos, die direkt von Ihrem Computer geladen werden
- **Pinterest-URLs → automatisch zu direktem Medium aufgelöst**
- **YouTube-URLs (LCD-Wiedergabe)**


##### **🆕 Local Media-Unterstützung (NEU)**

NZXT-ESC enthält jetzt ein integriertes System zum Laden von **lokalen Bildern oder Videos** direkt in den Editor.  
Dateien werden sicher in **IndexedDB** gespeichert und verlassen Ihr Gerät niemals.

Unterstützte Dateitypen:
- JPG / PNG / GIF  
- MP4-Video  
- Maximale Größe: **150 MB**

Hauptfunktionen:
- Vollständig offline nutzbar — keine externe Hosting erforderlich  
- Funktioniert mit Rotation, Skalierung, Fit/Align und allen Transform-Tools  
- Echtzeit-LCD-Synchronisation identisch mit Remote-Medien  
- Jedes Preset kann eine lokale Medienreferenz enthalten  
- Lokale Medien sind **nicht enthalten** in exportierten Preset-Dateien  
- Beim Import zeigen Presets, die lokale Medien verwendeten, eine Warnung und ermöglichen eine erneute Auswahl

Dieses System ermöglicht echte Offline-, datenschutzfreundliche Hintergründe und bleibt zu 100% kompatibel mit der Transform-Engine des Editors.


**YouTube-Integration Highlights:**

- YouTube-Videos **spielen auf dem tatsächlichen LCD** (Autoplay/Stumm/Schleife unterstützt)
- Die Vorschau des Editors kann YouTube-Videos aufgrund von Embedded-Player-Einschränkungen nicht abspielen  
- Stattdessen wird ein **roter verschiebbarer Platzhalter** angezeigt  
- Benutzer können:
  - Die Position des YouTube-Videos festlegen  
  - Das Video skalieren  
  - Align/Fit-Einstellungen anwenden  
  - Beliebige Overlay-Elemente darüber platzieren  
- Das LCD spiegelt immer das Endergebnis in Echtzeit wider  
- Alle Standard-Hintergrundtools funktionieren nahtlos mit YouTube

Fit-Modi:

- **Cover** — füllt die gesamte Anzeige  
- **Contain** — behält das vollständige Seitenverhältnis bei  
- **Fill** — dehnt sich zum Anpassen (optional)  

Dies macht NZXT-ESC zum ersten vollständig YouTube-fähigen LCD-Editor für NZXT CAM.

#### 5. PRESET-SYSTEM (FRÜHER ZUGANG)

Verfügbare Aktionen:

- Import
- Export
- Delete
- Duplicate
- Rename
- Apply

Presets speichern das vollständige Layout als JSON.

**Overlay Preset Import/Export**

Exportieren Sie Ihre Overlay-Elementkonfigurationen als `.nzxt-esc-overlay-preset`-Dateien zur Sicherung oder zum Teilen. Importieren Sie Overlay-Presets mit Validierung und Fehlerbehandlung. Beim Import wählen Sie den Replace-Modus, um vorhandene Elemente zu überschreiben, oder den Append-Modus, um neue Elemente hinzuzufügen und gleichzeitig die aktuellen zu erhalten. Das Import-System umfasst automatische ID-Generierung für Vorlagenelemente und zIndex-Normalisierung für angehängte Inhalte.

**Quick Favorites Dropdown**

Beim Überfahren der Preset Manager-Schaltfläche wird ein kompaktes Dropdown angezeigt, das bis zu 10 Favoriten-Presets (mit ★ markiert) auflistet. Jeder Eintrag zeigt den Preset-Namen, den Favoritenstatus und einen "aktiven" Indikator für das derzeit angewendete Preset. Bei Auswahl eines Elements wird dieses Preset sofort mit derselben atomaren Merge- und Autosave-Logik wie der vollständige Manager angewendet. Das Dropdown verfügt über sanfte Ein-/Ausblend-Animationen und enthält einen direkten Link zum Öffnen der vollständigen Preset Manager-Oberfläche. Dies bietet einen extrem schnellen Workflow für Benutzer, die häufig zwischen einer kleinen Gruppe bevorzugter Presets wechseln.

##### **Local Media & Presets**
- Exportierte Preset-Dateien **enthalten nicht** die lokale Medien-Binärdatei  
- Beim Import eines Presets, das zuvor lokale Medien verwendete, wird eine geführte Warnung angezeigt  
- Benutzer können die Datei über das neue **Browse**-Modal erneut auswählen  
- Alle vorhandenen Preset-Funktionen (Apply, Duplicate, Rename, Delete) unterstützen lokale Medienreferenzen vollständig  
- Das Wechseln zwischen Presets lädt automatisch die entsprechende lokale Medien aus IndexedDB (falls verfügbar)

---
### 🌍 UNTERSTÜTZTE SPRACHEN

NZXT-ESC unterstützt mehrere Sprachen für eine lokalisierte Benutzererfahrung. Wechseln Sie zwischen Sprachen über die Sprachauswahl im Editor-Header.

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

Alle Übersetzungen werden in einer einzigen TypeScript-Datei für einfache Verwaltung und Updates verwaltet.

---
### 🧪 TECHNISCHE DETAILS

- React 18
- TypeScript
- Vite Bundler
- LocalStorage-Synchronisation + Event-Broadcasting
- Kreisförmiges LCD-bewusstes Render-Engine
- AABB + Rotations-Transform-Mathematik
- Overlay-Preset-System mit vorlagenbasierter Elementgenerierung
- Automatische ID-Zuweisung und zIndex-Normalisierung
- Mehrsprachige UI-Unterstützung (English, Turkish, Spanish, German, Portuguese, French, Italian, Japanese)

---
### 🔧 ENTWICKLERINFORMATIONEN

Klonen und Installieren:

```bash
git clone https://github.com/mrgogo7/nzxt-esc
cd nzxt-esc
npm install
```

Entwicklungsserver starten:

```bash
npm run dev
```

Für NZXT CAM-Tests im LAN freigeben:

```bash
npm run dev -- --host
```

Build:

```bash
npm run build
```

Build-Vorschau:

```bash
npm run preview
```

**Contributing:**

- Öffnen Sie ein Issue, bevor Sie größere Änderungen beginnen
- Halten Sie PRs klein und fokussiert
- Verwenden Sie klare Commit-Nachrichten
- Folgen Sie der Projektstruktur

---
### 🕛 VERSIONSGESCHICHTE

#### 5.11.261 — Local Media-Unterstützung + Editor-Verbesserungen (NEU)

**Veröffentlichungsdatum:** 2025-11-26

##### 🆕 NEUE FUNKTIONEN
- **Local Media-Hintergründe (IndexedDB)**
  - Importieren Sie JPG, PNG, GIF oder MP4 direkt von Ihrem Computer  
  - Dateien werden sicher über IndexedDB gespeichert  
  - Funktioniert offline  
  - Kompatibel mit allen Fit/Scale/Align-Transform-Modi  
  - Vollständig mit dem Kraken LCD in Echtzeit synchronisiert  
  - URL-Feld zeigt `Local: filename.ext` im mehrsprachigen Format  

##### 💡 Preset-System-Verbesserungen
- Beim Exportieren von Presets, die lokale Medien enthalten, wird eine Warnung ausgelöst (Medien nicht enthalten)  
- Beim Importieren solcher Presets wird eine erneute Auswahlmeldung angezeigt  
- Preset-Wechsel lädt automatisch lokale Medien, falls verfügbar  

##### 🖥 UI-VERBESSERUNGEN
- Neues Browse-Modal zum Auswählen lokaler Medien  
- Vollständige mehrsprachige Unterstützung für alle lokalen Medienmeldungen  
- Neues Button-Icon + aktualisiertes Styling  

##### 🧩 STABILITÄTSVERBESSERUNGEN
- Verbesserte Medienauflösungs-Pipeline  
- Blob-Widerruf + Bereinigung zur Leckvermeidung  
- Bessere Fehlerbehandlung und i18n-Abdeckung  

#### 5.11.26 — Kraken LCD Echtzeit-Synchronisations-Überholung & Overlay-Stabilitätsverbesserungen

**Zusätzlicher Hinweis:**  
- **YouTube-Hintergrundunterstützung** (LCD-Wiedergabe) mit vollständiger Positionierung/Skalierungsausrichtung unter Verwendung des neuen platzhalterbasierten Vorschau-Systems eingeführt.  
- Einheitliche Transform-Mathematik gewährleistet proportionale Vorschau ↔ LCD-Ausrichtung.

#### 5.11.241 — Kraken LCD Echtzeit-Synchronisations-Überholung & Overlay-Stabilitätsverbesserungen

**Veröffentlichungsdatum:** 2025-11-24

##### 🔧 Wichtige Systemverbesserungen

- **Kraken LCD Echtzeit-Synchronisations-Überholung**  
  Die Echtzeit-LCD-Synchronisation wurde nicht neu eingeführt, aber das gesamte interne System wurde neu aufgebaut. Die vorherige Implementierung stützte sich auf Preset-Neuladezyklen und verursachte Verzögerungen, verpasste Updates und Rückfallverhalten. Die neue BroadcastChannel-basierte Cross-Tab-Sync-Architektur bietet einen stabilen, niedriglatenten, rahmensynchronisierten Update-Flow.

##### 🛠 Verbesserungen

- **Overlay-Rendering-Zuverlässigkeitsverbesserungen**  
  Wenn der Runtime-Overlay-Status leer ist, fällt das System jetzt sicher auf gespeicherte Preset-Overlay-Daten zurück.

- **Hintergrund/Medien-Stabilitäts-Upgrade**  
  Transform-Rückfall bei Eingabeänderungen entfernt.

- **KrakenOverlay-Viewer-Optimierung**  
  Lädt Presets nicht mehr neu; hört jetzt direkt auf Runtime-Änderungen für sofortige Updates.

##### 🐞 Fehlerbehebungen

- Behobene verzögerte LCD-Updates (zuvor nur nach Drag-Ende aktualisiert).

- Behobene fehlende Overlays in der Kraken-Ansicht nach Aktualisierung.

- Behobene doppelte React-Key-Warnungen beim Anhängen von Overlay-Presets.

- Behobene Medien/Hintergrund-Einstellungen, die während Anpassungen zurückgesetzt wurden.

##### ⚙ Architekturänderungen

- Ein dediziertes `runtimeBroadcast.ts`-Modul für die Tab-übergreifende Kommunikation eingeführt.

- `setElementsForPresetSilent()` für sichere Runtime-Updates ohne Broadcast-Schleifen hinzugefügt.

- `useOverlayConfig()` aktualisiert, um krakenMode + Storage-Fallback ordnungsgemäß zu behandeln.

- Alle Overlay-Update-Quellen in eine einzige Runtime-gesteuerte Pipeline vereinheitlicht.

##### 📁 Entwicklerhinweise

- BroadcastChannel fällt elegant zurück, wenn nicht unterstützt.

- Runtime-Updates werden vor der Synchronisation tief geklont, um Mutationsprobleme zu vermeiden.

- Diese Version ersetzt die alte Sync-Architektur durch eine moderne, stabile, Echtzeit-Pipeline.

#### v5.11.24

- Overlay & Preset Manager Qualitäts-Upgrade-Paket
- Neues Overlay Export Modal: Export fragt jetzt nach einem Dateinamen mit einem sauberen Modal (unterstützt ENTER-Taste)
- Neue Preset-Schaltfläche: Erstellt sofort ein brandneues leeres Preset mit Standardwerten
- Verbesserte Preset Manager UI: Preset-Aktionsschaltflächen neu angeordnet: Delete → Favorite → Duplicate → Rename → Apply
- Verbesserte Overlay-Verwaltung:
  - "Clear All Overlay Elements" verwendet jetzt ein Bestätigungs-Modal
  - Delete-Taste entfernt ausgewähltes Element (mit Bestätigungs-Modal)
  - Tooltip-Unterstützung für alle Löschen-Schaltflächen hinzugefügt
- Globale Modal-Verwendbarkeits-Upgrades: Alle Modals unterstützen jetzt die Bestätigung über die ENTER-Taste
- ID-Kollisions-Fix für Overlay Preset Append: Vollständig behobenes doppeltes React-Key-Problem durch Neugenerierung von Element-IDs beim Anhängen
- Allgemeine Stabilitätsverbesserungen: Runtime-Architektur erhalten, Autosave-Regeln respektiert und alle FAZ-9-Einschränkungen bleiben intakt

#### v5.11.23

- Overlay-Preset-System mit Vorlagenauswahl-Modal
- Single-, Dual-, Triple- und Quadruple-InfoGraphic-Vorlagen
- Overlay-Preset-Import/Export mit Replace- und Append-Modi
- Elementlimit auf 20 pro Overlay erhöht
- Automatische zIndex-Normalisierung für angehängte Vorlagen
- Dynamische Vorlagenlistengenerierung aus Vorlagendefinitionen
- Verbesserte Fehlerbenachrichtigungen für Import/Export-Operationen
- Ansichtsfeldbewusste Menüpositionierungsverbesserungen

#### v5.11.21

- Elementbasiertes Layout-Engine
- Rotations- und Skalierungs-Transform-System
- Auswahlhervorhebung
- Pfeiltastenbewegung
- Legacy-Modi entfernt
- Vollständiger Preset-Manager (Import/Export/Duplicate/Delete/Rename/Apply)
- Quick Favorites-Dropdown für sofortigen Preset-Wechsel
- UX- und Stabilitätsverbesserungen

Siehe GitHub Releases für ältere Versionen.

---
### 🔗 LINKS

Repository: https://github.com/mrgogo7/nzxt-esc/

Support: [GitHub Sponsors](https://github.com/sponsors/mrgogo7) • [Patreon](https://www.patreon.com/mRGogo7) • [Buy Me a Coffee](https://www.buymeacoffee.com/mrgogo)

Issues:

https://github.com/mrgogo7/nzxt-esc/issues

---
### 📜 LIZENZ

Lizenz für persönliche Nutzung

**Erlaubt:** Persönliche Nutzung • Persönliche Änderungen • Weiterverteilung mit Namensnennung

**Nicht erlaubt:** Kommerzielle Nutzung • Verkauf, Bündelung, Vermietung oder Monetarisierung in jeglicher Form

NZXT-ESC ist ein Hobby- und Community-getriebenes Projekt, das nur für den persönlichen Gebrauch bestimmt ist.

<details>
<summary><strong>📁 Vollständiger SEO-Schlüsselwortindex (Zum Erweitern klicken)</strong></summary>

**nzxt kraken elite lcd editor, nzxt cam customization, nzxt web integration custom, nzxt animated lcd background, mp4 lcd background nzxt, youtube kraken elite lcd, nzxt gif overlay, nzxt overlay editor, custom lcd screen nzxt, nzxt cam alternatives, nzxt cam limitations, kraken elite custom display, nzxt lcd text editor, nzxt lcd metrics overlay, nzxt lcd mods, nzxt pinterest background, nzxt lcd media engine, nzxt-esc project, nzxt cam modding, nzxt kraken elite youtube support, custom nzxt layouts, nzxt cam web integration presets, nzxt overlay templates, nzxt custom ui editor, nzxt lcd graphics editor, nzxt real-time lcd sync, kraken elite advanced customization, nzxt cam mp4 support, nzxt cam gif support, nzxt cam youtube embed, nzxt cam background editor**

</details>

