# NZXT-ESC - Best NZXT Web Integration

### Enhanced Screen Customization Layout Editor for NZXT Kraken AIO

Create fully editable NZXT Kraken LCD layouts with drag-and-drop sensor overlays, custom fonts, images, GIFs, APMG, MP4, WebM video, clocks, graphs, Now Playing data, and sound-reactive visuals rendered live through **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-19-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Open in NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Open Live Preview](https://nzxt-esc.pages.dev/)
· [Supported Kraken Models](#supported-nzxt-kraken-lcd-models)
· [Features](#features)
· [Quick Start](#quick-start)
· [FAQ](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESC drag-and-drop NZXT Kraken LCD layout editor"
       width="70%" />

> [!NOTE]
> **NZXT-ESC is an independent community project.** It is not affiliated with, sponsored by, or endorsed by NZXT.

If NZXT-ESC improved your setup, you can support its continued development:

> [!IMPORTANT]
> ### Hosted Usage and Supporter Access
>
> The hosted version of NZXT-ESC includes up to **100 hours of initial usage**
> so you can properly experience the project before deciding whether you would
> like to support its continued development.
>
> Reaching the initial usage limit does **not** mean immediate loss of access.
> You will have the option to receive additional time to continue using
> NZXT-ESC and give yourself a little more time to decide.
>
> Users who choose to support the project can receive a
> **Supporter Access Code** for additional hosted usage.
>
> Community support helps cover server, API, hosting, maintenance,
> and ongoing development costs.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## NZXT Kraken LCD customization without fixed layouts

NZXT-ESC turns the NZXT Kraken display into a free-form canvas. Build a custom LCD screen by placing each sensor, graphic, clock, image, or media element exactly where you want it. Resize, rotate, reorder, rename, lock, and style elements while watching the result update live through NZXT CAM.

The core editor requires **no account** and **no separate end-user installation**. Presets and local media stay in browser storage. Optional music overlays use the local [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) Windows companion app.

<a id="supported-nzxt-kraken-lcd-models"></a>

## Supported NZXT Kraken LCD Models

NZXT-ESC supports NZXT Kraken AIO liquid coolers with LCD displays and NZXT CAM Web Integration, including current and previous-generation Kraken Elite, Kraken Plus, Kraken, and Kraken Z models.

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

NZXT-ESC automatically adapts the layout to the Kraken LCD resolution, size, and display shape reported through the NZXT CAM API, allowing custom layouts, sensor overlays, animated backgrounds, graphics, and media to be rendered through NZXT CAM Web Integration.

<a id="quick-start"></a>
## Quick Start

### Open directly in NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Click **Open NZXT-ESC in NZXT CAM**.
2. Allow your browser to open NZXT CAM.
3. Confirm **Load Web Integration**.
4. Open the new Web Integration card and select **Configure**.
5. Create your layout; changes are synchronized with the Kraken display.

<details>
<summary><strong>Manual setup inside NZXT CAM</strong></summary>

1. Open **NZXT CAM**.
2. Go to **Lighting → Kraken → LCD Display**.
3. Select **Web Integration**.
4. Open the **Custom Web Integration** settings.
5. Enter:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Select **Apply**, then **Add as Card**.
7. Open the new card and select **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="NZXT CAM Web Integration setup screen"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Add NZXT-ESC as an NZXT CAM Web Integration card"
       width="48%" />
</p>

</details>

## See it in action

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Custom NZXT Kraken LCD preset created with NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Animated NZXT Kraken display layout in NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Live NZXT CAM sensor overlay on a Kraken LCD"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Custom animated Kraken LCD screen running through NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Features

| Capability | What it gives you |
|---|---|
| **Free-form layout editor** | Drag, resize, rotate, layer, lock, rename, and precisely position every element. |
| **Live NZXT CAM sensor data** | Build custom CPU, GPU, RAM, liquid-temperature, power, frequency, and fan-speed displays. |
| **Advanced graphics** | Combine radial, linear, circular, and historical sensor graphics in one layout. |
| **Animated backgrounds** | Use colors, gradients, local images, GIFs, MP4 video, direct media URLs, YouTube, and Pinterest sources. |
| **Now Playing integration** | Display album artwork, track information, and sound-reactive visuals from a local Windows client. |
| **Explore and Library** | Import community presets, edit every part, organize favorites, and maintain your own local preset collection. |
| **Local-first storage** | Presets use LocalStorage; local media uses IndexedDB and remains on your device. |
| **Multilingual editor** | Use the interface in 18 supported languages. |

### Overlay elements

The current editor groups overlay elements into four clear categories:

| Content | Data | Time | Audio |
|---|---|---|---|
| Text | Sensor | Digital Clock | Album Cover |
| Shape | Radial Graphic | Analog Clock | Now Playing Text |
| Icon | Linear Graphic | Date | Audio Visualizer |
| Sticker | Circle Graphic |  |  |
| Image | Sensor Chart |  |  |

Each element uses the same visual workflow wherever possible: select it in the preview or layer list, then adjust its position, size, rotation, order, style, and type-specific settings.

### Hardware monitoring

Create live layouts using available NZXT CAM monitoring data, including:

`CPU temperature` · `CPU load` · `CPU frequency` · `CPU power` · `CPU fan speed` · `GPU temperature` · `GPU load` · `GPU frequency` · `GPU power` · `GPU fan speed` · `RAM usage` · `liquid temperature`

Multi-GPU systems can automatically select the active GPU or use a specific GPU. The browser editor also provides mock values when the NZXT CAM API is unavailable, so layouts can still be designed and previewed.

### Backgrounds and media

Use a solid color or gradient as the base, then add media from:

- Local PNG, JPG, GIF, WebP, or MP4 files
- Direct image and video URLs
- YouTube videos
- Pinterest media links

Background media can be positioned, scaled, fitted, and combined with any overlay layout. Local files are stored in IndexedDB and are not uploaded by NZXT-ESC.

### Presets, Explore, and Library

- Save and organize up to **20 custom presets** in the local Library.
- Build each preset with up to **40 overlay elements**.
- Import and export editable preset files for backup or sharing.
- Browse community-made layouts through **Explore**.
- Add an Explore preset to the Library, customize it, and make it your own.
- Keep editing and Kraken rendering synchronized across the two NZXT CAM views.

## Now Playing and Audio Visualizer

The optional [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) Windows client runs locally and sends media-session and audio-spectrum data to NZXT-ESC through a local WebSocket connection.

Use it to add:

- **Album Cover** current artwork with sizing, border, and corner controls
- **Now Playing Text** title, artist, or album with long-text scrolling
- **Audio Visualizer** customizable real-time spectrum and waveform visuals

It is not limited to Spotify. The companion app reads supported Windows media sessions and system audio output from browsers, media players, and other apps.

<a id="languages"></a>
## Languages

The editor currently supports:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino` · `العربية`

**Translated documentation:**
[English](README.md) ·
[Türkçe](docs/README.tr.md) ·
[Español](docs/README.es.md) ·
[Deutsch](docs/README.de.md) ·
[Português-BR](docs/README.pt-BR.md) ·
[Français](docs/README.fr.md) ·
[Italiano](docs/README.it.md) ·
[日本語](docs/README.ja.md) ·
[ไทย](docs/README.th.md) ·
[Polski](docs/README.pl.md) ·
[Svenska](docs/README.sv.md) ·
[Nederlands](docs/README.nl.md) ·
[한국어](docs/README.ko.md) ·
[Русский](docs/README.ru.md) ·
[हिन्दी](docs/README.hi.md) ·
[Bahasa Indonesia](docs/README.id.md) ·
[Čeština](docs/README.cs.md) ·
[Filipino](docs/README.fil.md) ·
[العربية](docs/README.ar.md)

## Privacy and local storage

NZXT-ESC is designed around local browser storage:

- Preset configuration is stored in **LocalStorage**.
- Local images and videos are stored in **IndexedDB**.
- NZXT CAM sensor readings and user-created presets are not sent to analytics.
- No personally identifiable information is intentionally collected by the app.

The production website uses **Google Tag Manager** and **Google Analytics 4** for optional anonymous product analytics. **CookieYes** manages consent where required, and Google Analytics cookies are enabled according to the user's consent choices.

The deployed website also uses **Cloudflare Web Analytics**, enabled through Cloudflare Pages and operating independently of Google Tag Manager. It provides privacy-first website traffic and performance analytics without using cookies or LocalStorage.

### Contributing

Contributions and focused pull requests are welcome. Before making architectural changes, read:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)

<a id="faq"></a>
## FAQ

<details>
<summary><strong>Do I need to install NZXT-ESC?</strong></summary>

The core editor does not require a separate installation. Open it through NZXT CAM Web Integration. Only the optional music overlays require the local NowPlaying.WebSocket Windows client.

</details>

<details>
<summary><strong>Does NZXT-ESC work without NZXT CAM?</strong></summary>

The editor can be opened in a regular browser and uses mock sensor values for design. Live hardware monitoring and output on the Kraken display require NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Which NZXT Kraken models are supported?</strong></summary>

NZXT-ESC supports LCD-equipped **NZXT Kraken Elite, Kraken Plus, Kraken (2023), and Kraken Z series** coolers that provide the NZXT CAM Web Integration display mode.

See the complete list of [Supported NZXT Kraken LCD Models](#supported-nzxt-kraken-lcd-models).

</details>

<details>
<summary><strong>Where are presets and local media stored?</strong></summary>

Presets are stored in the browser's LocalStorage. Local images and videos are stored in IndexedDB. Export important presets regularly when moving to another browser, Windows installation, or computer.

</details>

<details>
<summary><strong>Does Now Playing require Spotify?</strong></summary>

No. NowPlaying.WebSocket uses supported Windows media sessions and system audio, so it can work with browsers and other compatible media applications.

</details>

<details>
<summary><strong>Can community presets be edited?</strong></summary>

Yes. Presets imported from Explore are fully editable after they are added to the Library.

</details>

<details>
<summary><strong>How does hosted usage and Supporter Access work?</strong></summary>

The hosted version of NZXT-ESC includes up to **100 hours of initial usage**,
giving you time to properly experience the project before deciding whether
you would like to support its continued development.

Reaching the initial usage limit does **not** immediately end your access.
You will have the option to receive additional decision time and continue
using NZXT-ESC before making your choice.

Users who choose to support the project can receive a
**Supporter Access Code** for additional hosted usage.

This usage model helps support server, API, hosting, maintenance, and
ongoing development costs while giving users enough time to experience
NZXT-ESC before deciding whether to support the project.

Usage time is counted while NZXT-ESC is actively running on the Kraken display.

</details>

<a id="license"></a>
## License

NZXT-ESC is released under a **Personal Use License**.

**Allowed:** personal use, personal modifications, and redistribution with clear credit to the original project.

**Commercial use:** selling, bundling, renting, integrating into a paid product, or other monetized use requires prior written permission from the project owner.
See [LICENSE for the complete terms](LICENSE).

## Support and community

- **Website:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **Latest release:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Bug reports and ideas:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

Follow NZXT-ESC on YouTube and Instagram for showcases, new features, tutorials, community setups, and project updates.

If NZXT-ESC improved your setup, you can support its continued development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Built by **Gökhan AKGÜL (mRGogo)** - powered by coffee and questionable sleep schedules.

</div>
