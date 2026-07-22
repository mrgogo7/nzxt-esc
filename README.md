# Official repository for NZXT-ESC - the Enhanced Screen Customization Editor for NZXT Kraken displays.**

NZXT CAM's Web Integration is powerful, but its built-in layout editor is heavily limited. NZXT-ESC unlocks unlimited customization for NZXT CAM, replacing fixed layouts with a complete drag-and-drop custom layout editor. Create fully editable Kraken layouts using any sensor, font, icon, clock, image, GIF, video, background, or overlay, then see every change update live through NZXT CAM Web Integration.

No installation. No account. Everything runs entirely in your browser and syncs directly to your device through NZXT CAM.

Create fully personalized Kraken Display Screen layouts using text, shapes, clocks, dates, arc, linear and dynamic media sources like YouTube and Pinterest all with real-time preview and seamless NZXT CAM Web Integration support.

Perfect for PC enthusiasts, streamers, and modders who want to push the limits of Kraken Display Screen customization.

Official website: https://nzxt-esc.pages.dev  
Official source code: https://github.com/mrgogo7/nzxt-esc

###### 🌐 Read This Documentation in Your Language
##### 🇬🇧 English • [🇹🇷 Türkçe](docs/README.tr.md) • [🇩🇪 Deutsch](docs/README.de.md) • [🇪🇸 Español](docs/README.es.md) • [🇧🇷 Português-BR](docs/README.pt-BR.md) • [🇫🇷 Français](docs/README.fr.md) • [🇮🇹 Italiano](docs/README.it.md) • [🇯🇵 日本語](docs/README.ja.md)

![License](https://img.shields.io/badge/License-Personal%20Use%20Only-red) ![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-purple) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Vite](https://img.shields.io/badge/Vite-Bundler-purple) ![GitHub release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc)

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif" width="400"/>
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif" width="400"/>
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif" width="400"/>
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif" width="400"/>
</p>

BetaScreenShot:
<img width="770" height="530" alt="resim" src="https://github.com/user-attachments/assets/b1718a6a-af30-4a71-9f66-fb4d2c83719b" />

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
   https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/
   ```
OR

[Click Here & Open in NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
   
2. Press Enter.
3. Your browser will display a question: "Open nzxt-cam link with NZXT CAM?" → Approve / Allow
4. NZXT CAM will launch automatically.
5. You will see a confirmation window: Load Web Integration? Are you sure you would like to load the following web integration?
   ```text
   https://nzxt-esc.pages.dev/
   ```
6. Press "Load".
7. After loading, open the "Custom Web Integration" card.

#### METHOD 2 — MANUAL INSTALLATION (INSIDE NZXT CAM)

<img width="832" height="486" alt="resim" src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7" />
<img width="904" height="513" alt="resim" src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99" />


1. Open NZXT CAM.
2. Go to: Lighting → Kraken → LCD Display
3. Change the display mode to: Web Integration
4. Find the card named: Custom Web Integration
5. Click "Settings".
6. Enter the URL:
   ```text
   https://nzxt-esc.pages.dev/
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
   NZXT-ESC - NZXT Kraken Enhanced Screen Customization Editor
   ```
   Description:
   ```text
   NZXT Kraken Enhanced Screen Customization Editor (NZXT-ESC)
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
- Preview all changes in real time on your NZXT Kraken Display Screen LCD 

No external URL or config.html is required anymore.

---
### 💡 WHAT MAKES NZXT-ESC SPECIAL?

NZXT-ESC is not a theme pack — it is a **full, design-oriented layout editor** built specifically for the Kraken Display Screen LCD.

<img width="843" height="537" alt="resim" src="https://github.com/user-attachments/assets/e169a611-f331-4bb6-94a5-c093fb8ee7a3" />

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

You can freely add and customize:

Metric — Display CPU/GPU/VRM/RAM values live from NZXT CAM.

Text — Labels, titles, custom lines with outline, rotation, and full styling.

Divider — Visual separators with adjustable thickness, length, and angle.

Clock — Digital time with 12h/24h modes, custom formatting, outline, rotation, and full transform support.

Date — Fully customizable date formats (DD.MM.YYYY, MMM DD, YYYY-MM-DD, etc.), outline, rotation, transform support.

Every element supports:

✔ Rotation
✔ Resizing
✔ Outline color & thickness
✔ Drag positioning
✔ X/Y offsets
✔ Z-order control

**Overlay Preset System**

Quickly apply pre-configured layouts using the template picker modal. Choose from Single, Dual, Triple, or Quadruple InfoGraphic templates, each with optimized positioning and styling. Templates can be imported with Replace (overwrites existing elements) or Append (adds to existing elements) modes. When appending, zIndex values are automatically normalized to prevent rendering conflicts. The system supports up to 20 overlay elements per configuration.

#### 3. Using the Editor (Configure Button)

Inside the Editor:

🕑 Clock Element

A fully customizable digital time overlay supporting:

12h / 24h formats

Real-time updates

Rotation, resizing, outline

Full transform engine support

Works exactly like Metric and Text elements

📅 Date Element

A flexible date overlay with:

Custom format input (DD.MM.YYYY, MMM DD, YYYY-MM-DD, etc.)

Automatic multilingual month/day names

Rotation, outline, transform support

Same workflow as other visual elements

🎛 Background Media

Choose MP4 / GIF / PNG / JPG / YouTube / Pinterest or local media.

🎨 Theme & color controls

Full color picker with outline + alpha + stepper support.

✨ Layout interactions

Drag, resize, rotate, delete, duplicate, reorder.

#### 4. Media Engine

Supports: MP4, GIF, PNG, JPEG

Pinterest boards

YouTube videos (with safe warning modal)

Local browser files

Automatically downscales heavy content to prevent Kraken Display Screen LCD overload.


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

#### 5. Preset Manager

Create unlimited presets

Export or import presets

Append or overwrite existing layouts

Automatic conflict resolution

Multi-tab preset synchronization

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

**Contributing:**

- Open an Issue before starting major changes
- Keep PRs small and focused
- Use clear commit messages
- Follow project structure

---

### 🔗 LINKS

Official Repository: https://github.com/mrgogo7/nzxt-esc/

Support: [GitHub Sponsors](https://github.com/sponsors/mrgogo7) • [Patreon](https://www.patreon.com/mRGogo7) • [Buy Me a Coffee](https://www.buymeacoffee.com/mrgogo)

Issues: https://github.com/mrgogo7/nzxt-esc/issues

---

# Privacy

NZXT-ESC respects your privacy.

The project uses Google Tag Manager (GTM) to manage analytics services and feature integrations.

Anonymous usage analytics help us understand which features are used most often, identify usability issues, and improve future releases.

No personally identifiable information (PII), sensor data, preset content, or user-created layouts are collected.

Optional analytics cookies are only enabled after consent where required.

You can change your cookie preferences at any time from the website.

---

### 📜 LICENSE

Personal Use License

**Allowed:** Personal use • Personal modifications • Redistribution with credit

**Not Allowed:** Commercial use • Selling, bundling, renting, or monetizing in any form

NZXT-ESC is a hobby and community-driven project intended only for personal use.

<details>
<summary><strong>📁 Full SEO Keyword Index (Click to Expand)</strong></summary>

**Official repository for NZXT-ESC — the Enhanced Screen Customization Editor for NZXT Kraken displays.**

Official website: https://nzxt-esc.pages.dev  
Official source code: https://github.com/USERNAME/NZXT-ESC

Customize your LCD with full support for animated backgrounds (MP4, GIF), YouTube and Pinterest media, real-time sensor overlays, text editors, and advanced layout tools.

NZXT-ESC goes beyond default NZXT CAM limitations by enabling custom overlays, overlay templates, custom UI editor features, and real-time LCD sync.

Create advanced custom layouts, metrics overlays, and animated LCD screens with support for YouTube embeds, Pinterest backgrounds, and media engine capabilities.

Whether you're looking for NZXT CAM alternatives, Kraken Elite custom display tools, LCD mods, or advanced customization options, NZXT-ESC delivers the best web integration experience for NZXT devices.

**Official repository, offical nzxt-esc, nzxt esc, NZXT elite screen customizer, nzxt pinterest, nzxt youtube, nzxt youtube overlay, nzxt overlay, nzxt custom overlay, nzxt web integration, nzxt best web integration, nzxt kraken elite lcd editor, nzxt cam customization, nzxt web integration custom, nzxt animated lcd background, mp4 lcd background nzxt, youtube kraken elite lcd, nzxt gif overlay, nzxt overlay editor, custom lcd screen nzxt, nzxt cam alternatives, nzxt cam limitations, kraken elite custom display, nzxt lcd text editor, nzxt lcd metrics overlay, nzxt lcd mods, nzxt pinterest background, nzxt lcd media engine, nzxt-esc project, nzxt cam modding, nzxt kraken elite youtube support, custom nzxt layouts, nzxt cam web integration presets, nzxt overlay templates, nzxt custom ui editor, nzxt lcd graphics editor, nzxt real-time lcd sync, kraken elite advanced customization, nzxt cam mp4 support, nzxt cam gif support, nzxt cam youtube embed, nzxt cam background editor, nzxt kraken lcd customization, nzxt lcd customization tool, kraken lcd editor, nzxt lcd overlay editor, nzxt screen editor, nzxt lcd layout editor, nzxt kraken screen customization, nzxt lcd overlay tool, nzxt kraken display editor, nzxt lcd custom layouts, nzxt kraken gif background, nzxt kraken mp4 background, nzxt lcd youtube integration, nzxt lcd pinterest integration, nzxt lcd overlay creator, nzxt kraken overlay editor, nzxt lcd animation support, nzxt lcd video background, nzxt kraken screen editor, nzxt lcd customization editor, nzxt cam overlay customization, nzxt lcd widget editor, nzxt kraken custom ui, nzxt lcd skin editor, nzxt lcd personalization tool**

</details>
