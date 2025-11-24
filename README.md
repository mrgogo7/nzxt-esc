<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=110&color=gradient&text=NZXT%20Elite%20Screen%20Customizer%20(NZXT-ESC)%20v5.11.24&animation=twinkling&fontSize=30&reversal=false&section=header&textBg=false&fontColor=000000&fontAlign=50&fontAlignY=29"/>
</p>

# NZXT Elite Screen Customizer (NZXT-ESC) v5.11.24

![License](https://img.shields.io/badge/License-Personal%20Use%20Only-red) ![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-purple) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Vite](https://img.shields.io/badge/Vite-Bundler-purple) ![GitHub release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc)

A modern, browser-based media and overlay editor for NZXT Kraken Elite LCD screens.

Create custom animated backgrounds, metric overlays, text layers, divider lines, and fully personalized layouts — all synchronized live inside NZXT CAM.

Free for personal use only — commercial use is strictly prohibited.

<p align="center">
  <img src="https://raw.githubusercontent.com/mrgogo7/nzxt-esc/refs/heads/main/docs/Demo-Preview1.png" width="400"/>
  <img src="https://raw.githubusercontent.com/mrgogo7/nzxt-esc/refs/heads/main/docs/Demo-Preview2.png" width="400"/>
</p>

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif" width="400"/>
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif" width="400"/>
</p>

---

## 🚀 QUICK START

NZXT-ESC works INSIDE NZXT CAM using the "Web Integration" feature.

There are two ways to install it:

### METHOD 1 — DIRECT LAUNCH (RECOMMENDED)

1. Copy this into your browser's address bar:

   ```text
   nzxt-cam://action/load-web-integration?url=https://mrgogo7.github.io/nzxt-esc/
   ```

2. Press Enter.

3. Your browser will display a question:

   "Open nzxt-cam link with NZXT CAM?"

   → Approve / Allow

4. NZXT CAM will launch automatically.

5. You will see a confirmation window:

   Load Web Integration?

   Are you sure you would like to load the following web integration?

   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```

6. Press "Load".

7. After loading, open the "Custom Web Integration" card.

### METHOD 2 — MANUAL INSTALLATION (INSIDE NZXT CAM)

1. Open NZXT CAM.

2. Go to:

   Lighting → Kraken Elite V2 → LCD Display

3. Change the display mode to:

   Web Integration

4. Find the card named:

   Custom Web Integration

5. Click "Settings".

6. Enter the URL:

   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```

7. Press "Apply".

8. Then press:

   Add as Card

9. A new Web Integration card called "My Web Integration" will appear.

10. Select "My Web Integration".

11. Press "Configure" to open the NZXT-ESC editor.

### RECOMMENDED: RENAME THE INTEGRATION CARD

NZXT CAM assigns the default name "My Web Integration".

To rename:

1. Select "My Web Integration".

2. Press "Edit".

3. Change the fields to:

   Title:

   ```text
   Elite Screen Customizer
   ```

   Description:

   ```text
   NZXT Elite Screen Customizer (NZXT-ESC)
   ```

This helps distinguish the integration from others.

---

## 🎛 USING THE EDITOR (CONFIGURE BUTTON)

All editing is performed INSIDE NZXT CAM via the "Configure" button.

Inside the editor you can:

- Add / remove metric, text, and divider elements (up to 20 elements per overlay)
- Adjust position, rotation, scale, opacity, and color
- Choose MP4 / GIF / PNG / JPG background media
- Manage presets (Import, Export, Duplicate, Delete, Rename, Apply)
- Use overlay preset templates (Single, Dual, Triple, Quadruple InfoGraphic layouts)
- Import overlay presets with Replace or Append options
- Quickly switch between favorite presets via the Quick Favorites dropdown
- Preview all changes in real time on your Kraken Elite LCD

No external URL or config.html is required anymore.

---

## 💡 WHAT MAKES NZXT-ESC SPECIAL?

NZXT-ESC is not a theme pack — it is a full visual layout editor built specifically for the Kraken Elite LCD.

It focuses on:

- Creative freedom
- Precision positioning
- Real-time LCD feedback
- A clean and intuitive editing experience

### 1. DESIGN-ORIENTED EDITING EXPERIENCE

- Free drag-and-drop placement
- Rotation and scaling per element
- Transform handles around the circular LCD preview
- Arrow-key micro adjustments
- Minimal and distraction-free interface
- Accurate circular preview matching real hardware

### 2. FULL ELEMENT-BASED OVERLAY ENGINE

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

### 3. REAL-TIME LCD SYNCHRONIZATION

- Updates ~100ms throttle for stability
- No manual refresh needed
- LCD screen updates instantly as you edit

### 4. ADVANCED MEDIA ENGINE

Supports:

- MP4 video
- GIF animations
- PNG and JPG images

Includes:

- Cover / Contain / Fill modes
- Scaling
- Offset controls

### 5. PRESET SYSTEM (EARLY ACCESS)

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

---

## 🌍 SUPPORTED LANGUAGES

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

## 🧪 TECHNICAL DETAILS

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

## 🔧 DEVELOPER INFORMATION

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

Contributing:

- Open an Issue before starting major changes
- Keep PRs small and focused
- Use clear commit messages
- Follow project structure

---

## 🕛 VERSION HISTORY

v5.11.24 (Current)

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

v5.11.23

- Overlay preset system with template picker modal
- Single, Dual, Triple, and Quadruple InfoGraphic templates
- Overlay preset import/export with Replace and Append modes
- Element limit increased to 20 per overlay
- Automatic zIndex normalization for appended templates
- Dynamic template list generation from template definitions
- Enhanced error notifications for import/export operations
- Viewport-aware menu positioning improvements

v5.11.21

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

## 🔗 LINKS

Repository:

https://github.com/mrgogo7/nzxt-esc/

Support:

- [GitHub Sponsors](https://github.com/sponsors/mrgogo7)
- [Patreon](https://www.patreon.com/mRGogo7)
- [Buy Me a Coffee](https://www.buymeacoffee.com/mrgogo)

Issues:

https://github.com/mrgogo7/nzxt-esc/issues

---

## 📜 LICENSE

Personal Use License

Allowed:

- Personal use
- Personal modifications
- Redistribution with credit

Not Allowed:

- Commercial use
- Selling, bundling, renting, or monetizing in any form

NZXT-ESC is a hobby and community-driven project intended only for personal use.
