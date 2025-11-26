# NZXT Elite Screen Customizer (NZXT-ESC) v5.11.261

A modern, browser-based media and overlay editor for NZXT Kraken Elite LCD screens.

Create custom animated backgrounds, metric overlays, text layers, divider lines, and fully personalized layouts — all synchronized live inside NZXT CAM.

Free for personal use only — commercial use is strictly prohibited.

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
## 📋 CONTENTS

- [🚀 Quick Start](#-quick-start)
  - [Method 1 — Direct Launch (Recommended)](#method-1--direct-launch-recommended)
  - [Method 2 — Manual Installation (Inside NZXT CAM)](#method-2--manual-installation-inside-nzxt-cam)
  - [Recommended: Rename the Integration Card](#recommended-rename-the-integration-card)
- [🎛 Using the Editor (Configure Button)](#-using-the-editor-configure-button)
- [💡 What Makes NZXT-ESC Special?](#-what-makes-nzxt-esc-special)
  - [1. Design-Oriented Editing Experience](#1-design-oriented-editing-experience)
  - [2. Full Element-Based Overlay Engine](#2-full-element-based-overlay-engine)
  - [3. Real-Time LCD Synchronization](#3-real-time-lcd-synchronization)
  - [4. Advanced Media Engine](#4-advanced-media-engine)
  - [5. Preset System (Early Access)](#5-preset-system-early-access)
- [🌍 Supported Languages](#-supported-languages)
- [🧪 Technical Details](#-technical-details)
- [🔧 Developer Information](#-developer-information)
- [🕛 Version History](#-version-history)
- [🔗 Links](#-links)
- [📜 License](#-license)

---
### 🚀 QUICK START

NZXT-ESC works INSIDE NZXT CAM using the "Web Integration" feature. There are two ways to install it:

#### METHOD 1 — DIRECT LAUNCH (RECOMMENDED)

1. Copy this into your browser's address bar:
   ```text
   nzxt-cam://action/load-web-integration?url=https://mrgogo7.github.io/nzxt-esc/
   ```
2. Press Enter.
3. Your browser will display a question: "Open nzxt-cam link with NZXT CAM?" → Approve / Allow
4. NZXT CAM will launch automatically.
5. You will see a confirmation window: Load Web Integration? Are you sure you would like to load the following web integration?
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
6. Press "Load".
7. After loading, open the "Custom Web Integration" card.

#### METHOD 2 — MANUAL INSTALLATION (INSIDE NZXT CAM)

1. Open NZXT CAM.
2. Go to: Lighting → Kraken Elite V2 → LCD Display
3. Change the display mode to: Web Integration
4. Find the card named: Custom Web Integration
5. Click "Settings".
6. Enter the URL:
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
7. Press "Apply".
8. Then press: Add as Card
9. A new Web Integration card called "My Web Integration" will appear.
10. Select "My Web Integration".
11. Press "Configure" to open the NZXT-ESC editor.

#### RECOMMENDED: RENAME THE INTEGRATION CARD

NZXT CAM assigns the default name "My Web Integration". To rename:
1. Select "My Web Integration".
2. Press "Edit".
3. Change the fields to: Title:
   ```text
   Elite Screen Customizer
   ```
   Description:
   ```text
   NZXT Elite Screen Customizer (NZXT-ESC)
   ```
This helps distinguish the integration from others.

---
### 🎛 USING THE EDITOR (CONFIGURE BUTTON)

All editing is performed INSIDE NZXT CAM via the "Configure" button.

Inside the editor you can:

- Add / remove metric, text, and divider elements (up to 20 elements per overlay)
- Adjust position, rotation, scale, opacity, and color
- Choose MP4 / GIF / PNG / JPG background media
- Use Local Media files stored in the browser via IndexedDB
- Manage presets (Import, Export, Duplicate, Delete, Rename, Apply)
- Use overlay preset templates (Single, Dual, Triple, Quadruple InfoGraphic layouts)
- Import overlay presets with Replace or Append options
- Quickly switch between favorite presets via the Quick Favorites dropdown
- Preview all changes in real time on your Kraken Elite LCD

No external URL or config.html is required anymore.

---
### 💡 WHAT MAKES NZXT-ESC SPECIAL?

NZXT-ESC is not a theme pack — it is a **full, design-oriented layout editor** built specifically for the Kraken Elite LCD.

It offers complete creative freedom far beyond what NZXT CAM supports natively.

NZXT CAM **does not** allow:
- Free element positioning  
- Element scaling or rotation  
- Custom text overlays  
- Transparent colors  
- MP4 backgrounds  
- YouTube backgrounds  
- Pinterest URLs  
- Mixed media + overlay combinations  

NZXT-ESC **enables all of these**.

#### 1. DESIGN-ORIENTED EDITING EXPERIENCE

- Free drag-and-drop placement
- Rotation and scaling per element
- Transform handles around the circular LCD preview
- Arrow-key micro adjustments
- Minimal and distraction-free interface
- Accurate circular preview matching real hardware

#### 2. FULL ELEMENT-BASED OVERLAY ENGINE

Legacy Single/Dual/Triple modes were removed entirely.

You can now freely add:

- Metric elements
- Text elements
- Divider elements

Each element supports:

- X/Y position
- Rotation
- Scale
- Color & opacity
- Selection highlight

**Overlay Preset System**

Quickly apply pre-configured layouts using the template picker modal. Choose from Single, Dual, Triple, or Quadruple InfoGraphic templates, each with optimized positioning and styling. Templates can be imported with Replace (overwrites existing elements) or Append (adds to existing elements) modes. When appending, zIndex values are automatically normalized to prevent rendering conflicts. The system supports up to 20 overlay elements per configuration.

#### 3. REAL-TIME LCD SYNCHRONIZATION

- Updates ~100ms throttle for stability
- No manual refresh needed
- LCD screen updates instantly as you edit

#### 4. ADVANCED MEDIA ENGINE

The media engine supports:

- MP4 video (full playback in LCD)
- GIF animations
- PNG / JPG images
- Local Media Files (IndexedDB): Full-resolution images & videos loaded directly from your computer
- **Pinterest URLs → auto-resolved to direct media**
- **YouTube URLs (LCD playback)**


##### **🆕 Local Media Support (NEW)**

NZXT-ESC now includes a built-in system to load **local images or videos** directly into the editor.  
Files are securely stored in **IndexedDB** and never leave your device.

Supported file types:
- JPG / PNG / GIF  
- MP4 video  
- Max size: **150 MB**

Key features:
- Fully offline usage — no external hosting required  
- Works with rotation, scale, fit/align, and all transform tools  
- Real-time LCD synchronization identical to remote media  
- Each preset may contain one local media reference  
- Local media is **not included** inside exported preset files  
- Upon import, presets that used local media will display a warning and allow re-selection

This system enables true offline, privacy-friendly backgrounds while remaining 100% compatible with the editor’s transform engine.


**YouTube Integration Highlights:**

- YouTube videos **play on the actual LCD** (autoplay/mute/loop supported)
- The editor’s Preview cannot play YouTube videos due to embedded-player restrictions  
- Instead, a **red draggable placeholder** is shown  
- Users can:
  - Position the YouTube video  
  - Scale the video  
  - Apply align/fit settings  
  - Place any overlay elements on top  
- The LCD always reflects the final result in real-time  
- All standard background tools work with YouTube seamlessly

Fit modes:

- **Cover** — fill entire display  
- **Contain** — maintain full aspect ratio  
- **Fill** — stretch to fit (optional)  

This makes NZXT-ESC the first full YouTube-capable LCD editor for NZXT CAM.

#### 5. PRESET SYSTEM (EARLY ACCESS)

Available actions:

- Import
- Export
- Delete
- Duplicate
- Rename
- Apply

Presets store the full layout as JSON.

**Overlay Preset Import/Export**

Export your overlay element configurations as `.nzxt-esc-overlay-preset` files for backup or sharing. Import overlay presets with validation and error handling. When importing, choose Replace mode to overwrite existing elements or Append mode to add new elements while preserving current ones. The import system includes automatic ID generation for template elements and zIndex normalization for appended content.

**Quick Favorites Dropdown**

Hovering over the Preset Manager button reveals a compact dropdown listing up to 10 favorite presets (marked with ★). Each entry displays the preset name, favorite status, and an "active" indicator for the currently applied preset. Selecting an item immediately applies that preset using the same atomic merge and autosave logic as the full manager. The dropdown features smooth fade-in/fade-out animations and includes a direct link to open the full Preset Manager interface. This provides an extremely fast workflow for users who frequently switch between a small set of preferred presets.

##### **Local Media & Presets**
- Exported preset files **do not include** the local media binary  
- Importing a preset that previously used local media shows a guided warning  
- Users can reselect the file via the new **Browse** modal  
- All existing preset functions (Apply, Duplicate, Rename, Delete) fully support local media references  
- Switching presets automatically loads the appropriate local media from IndexedDB (if available)

---
### 🌍 SUPPORTED LANGUAGES

NZXT-ESC supports multiple languages for a localized user experience. Switch between languages using the language selector in the editor header.

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

All translations are maintained in a single TypeScript file for easy management and updates.

---
### 🧪 TECHNICAL DETAILS

- React 18
- TypeScript
- Vite bundler
- LocalStorage sync + event broadcasting
- Circular LCD-aware render engine
- AABB + rotation transform math
- Overlay preset system with template-based element generation
- Automatic ID assignment and zIndex normalization
- Multi-language UI support (English, Turkish, Spanish, German, Portuguese, French, Italian, Japanese)

---
### 🔧 DEVELOPER INFORMATION

Clone and Install:

```bash
git clone https://github.com/mrgogo7/nzxt-esc
cd nzxt-esc
npm install
```

Start Dev Server:

```bash
npm run dev
```

Expose on LAN for NZXT CAM testing:

```bash
npm run dev -- --host
```

Build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

**Contributing:**

- Open an Issue before starting major changes
- Keep PRs small and focused
- Use clear commit messages
- Follow project structure

---
### 🕛 VERSION HISTORY

#### 5.11.261 — Local Media Support + Editor Improvements (NEW)

**Release Date:** 2025-11-26

##### 🆕 NEW FEATURES
- **Local Media Backgrounds (IndexedDB)**
  - Import JPG, PNG, GIF, or MP4 directly from your computer  
  - Files stored securely via IndexedDB  
  - Works offline  
  - Compatible with all fit/scale/align transform modes  
  - Fully synchronized to the Kraken LCD in real-time  
  - URL field shows `Local: filename.ext` in multilingual format  

##### 💡 Preset System Enhancements
- Exporting presets containing local media triggers a warning (media not included)  
- Importing such presets displays a reselect message  
- Preset switching automatically loads local media if available  

##### 🖥 UI IMPROVEMENTS
- New Browse modal for selecting local media  
- Full multilingual support for all local media messages  
- New button icon + updated styling  

##### 🧩 STABILITY IMPROVEMENTS
- Improved media resolution pipeline  
- Blob revocation + cleanup to prevent leaks  
- Better error handling & i18n coverage  

#### 5.11.26 — Kraken LCD Real-Time Sync Overhaul & Overlay Stability Improvements

**Additional Note:**  
- Introduced **YouTube background support** (LCD playback) with full positioning/scale alignment using the new placeholder-based Preview system.  
- Unified transform math ensures proportional Preview ↔ LCD alignment.

#### 5.11.241 — Kraken LCD Real-Time Sync Overhaul & Overlay Stability Improvements

**Release Date:** 2025-11-24

##### 🔧 Major System Improvements

- **Kraken LCD Real-Time Sync Overhaul**  
  Real-time LCD synchronization wasn't newly introduced, but the entire internal system has been rebuilt. The previous implementation relied on preset reload cycles and caused delays, missed updates, and snap-back behaviors. The new BroadcastChannel-based cross-tab sync architecture provides a stable, low-latency, frame-synced update flow.

##### 🛠 Improvements

- **Overlay rendering reliability improvements**  
  When the runtime overlay state is empty, the system now safely falls back to stored preset overlay data.

- **Background/media stability upgrade**  
  Removed transform snap-back on input changes.

- **KrakenOverlay viewer optimization**  
  No longer reloads presets; now listens directly to runtime changes for instant updates.

##### 🐞 Bug Fixes

- Fixed delayed LCD updates (previously updated only after drag end).

- Fixed missing overlays in Kraken view after refresh.

- Fixed duplicate React key warnings when appending overlay presets.

- Fixed media/background settings reverting during adjustments.

##### ⚙ Architecture Changes

- Introduced a dedicated `runtimeBroadcast.ts` module for inter-tab communication.

- Added `setElementsForPresetSilent()` for safe runtime updates without broadcast loops.

- Updated `useOverlayConfig()` to properly handle krakenMode + storage fallback.

- Unified all overlay update sources into a single runtime-driven pipeline.

##### 📁 Developer Notes

- BroadcastChannel falls back gracefully if unsupported.

- Runtime updates are deeply cloned before sync to prevent mutation issues.

- This release replaces the old sync architecture with a modern, stable, real-time pipeline.

#### v5.11.24

- Overlay & Preset Manager Quality Upgrade Pack
- New Overlay Export Modal: Export now asks for a filename using a clean modal (supports ENTER key)
- New Preset Button: Instantly creates a brand-new empty preset with default values
- Improved Preset Manager UI: Reordered preset action buttons: Delete → Favorite → Duplicate → Rename → Apply
- Improved Overlay Management:
  - "Clear All Overlay Elements" now uses a confirmation modal
  - Delete key removes selected element (with confirmation modal)
  - Tooltip support added for all delete buttons
- Global Modal Usability Upgrades: All modals now support confirming via ENTER key
- ID Collision Fix for Overlay Preset Append: Fully resolved duplicate React key issue by regenerating element IDs on append
- General Stability Improvements: Runtime architecture preserved, autosave rules respected, and all FAZ-9 constraints remain intact

#### v5.11.23

- Overlay preset system with template picker modal
- Single, Dual, Triple, and Quadruple InfoGraphic templates
- Overlay preset import/export with Replace and Append modes
- Element limit increased to 20 per overlay
- Automatic zIndex normalization for appended templates
- Dynamic template list generation from template definitions
- Enhanced error notifications for import/export operations
- Viewport-aware menu positioning improvements

#### v5.11.21

- Element-based layout engine
- Rotation & scale transform system
- Selection highlight
- Arrow-key movement
- Legacy modes removed
- Full preset manager (Import/Export/Duplicate/Delete/Rename/Apply)
- Quick Favorites dropdown for instant preset switching
- UX and stability improvements

See GitHub Releases for older versions.

---
### 🔗 LINKS

Repository: https://github.com/mrgogo7/nzxt-esc/

Support: [GitHub Sponsors](https://github.com/sponsors/mrgogo7) • [Patreon](https://www.patreon.com/mRGogo7) • [Buy Me a Coffee](https://www.buymeacoffee.com/mrgogo)

Issues:

https://github.com/mrgogo7/nzxt-esc/issues

---
### 📜 LICENSE

Personal Use License

**Allowed:** Personal use • Personal modifications • Redistribution with credit

**Not Allowed:** Commercial use • Selling, bundling, renting, or monetizing in any form

NZXT-ESC is a hobby and community-driven project intended only for personal use.

<details>
<summary><strong>📁 Full SEO Keyword Index (Click to Expand)</strong></summary>

**nzxt kraken elite lcd editor, nzxt cam customization, nzxt web integration custom, nzxt animated lcd background, mp4 lcd background nzxt, youtube kraken elite lcd, nzxt gif overlay, nzxt overlay editor, custom lcd screen nzxt, nzxt cam alternatives, nzxt cam limitations, kraken elite custom display, nzxt lcd text editor, nzxt lcd metrics overlay, nzxt lcd mods, nzxt pinterest background, nzxt lcd media engine, nzxt-esc project, nzxt cam modding, nzxt kraken elite youtube support, custom nzxt layouts, nzxt cam web integration presets, nzxt overlay templates, nzxt custom ui editor, nzxt lcd graphics editor, nzxt real-time lcd sync, kraken elite advanced customization, nzxt cam mp4 support, nzxt cam gif support, nzxt cam youtube embed, nzxt cam background editor**

</details>
