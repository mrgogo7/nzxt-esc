# NZXT-ESC

### Advanced na editor ng layout at screen customization para sa NZXT Kraken AIO

Gumawa ng ganap na nae-edit na NZXT Kraken LCD layouts gamit ang drag-and-drop sensor overlays, custom fonts, mga larawan, GIF, MP4 video, mga orasan, graphs, Now Playing data, at sound-reactive visuals na live na nire-render sa pamamagitan ng **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Buksan sa NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Buksan ang web editor](https://nzxt-esc.pages.dev/)
· [Mga feature](#features)
· [Mabilis na pagsisimula](#quick-start)
· [FAQ](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESC drag-and-drop NZXT Kraken LCD layout editor"
       width="70%" />

> [!NOTE]
> **Ang NZXT-ESC ay isang independent community project.** Hindi ito affiliated, sponsored, o endorsed ng NZXT.

## NZXT Kraken LCD customization nang walang fixed layouts

Ginagawang free-form canvas ng NZXT-ESC ang NZXT Kraken display. Bumuo ng custom LCD screen sa pamamagitan ng paglalagay ng bawat sensor, graphic, orasan, larawan, o media element sa eksaktong posisyong gusto mo. I-resize, i-rotate, ayusin ang order, palitan ang pangalan, i-lock, at i-style ang mga element habang nakikita mong live na nag-a-update ang resulta sa NZXT CAM.

Ang pangunahing editor ay **hindi nangangailangan ng account** at **walang hiwalay na installation para sa end user**. Nananatili sa browser storage ang presets at local media. Ang optional music overlays ay gumagamit ng lokal na Windows companion app na [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="quick-start"></a>
## Mabilis na pagsisimula

### Direktang buksan sa NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. I-click ang **Open NZXT-ESC in NZXT CAM**.
2. Payagan ang browser na buksan ang NZXT CAM.
3. Kumpirmahin ang **Load Web Integration**.
4. Buksan ang bagong Web Integration card at piliin ang **Configure**.
5. Gawin ang iyong layout; isi-sync ang mga pagbabago sa Kraken display.

<details>
<summary><strong>Manual setup sa loob ng NZXT CAM</strong></summary>

1. Buksan ang **NZXT CAM**.
2. Pumunta sa **Lighting → Kraken → LCD Display**.
3. Piliin ang **Web Integration**.
4. Buksan ang settings ng **Custom Web Integration**.
5. Ilagay ang:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Piliin ang **Apply**, pagkatapos ay **Add as Card**.
7. Buksan ang bagong card at piliin ang **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="NZXT CAM Web Integration setup screen"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Pagdagdag ng NZXT-ESC bilang NZXT CAM Web Integration card"
       width="48%" />
</p>

</details>

## Tingnan itong gumagana

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Custom NZXT Kraken LCD preset na ginawa sa NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Animated NZXT Kraken display layout sa NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Live NZXT CAM sensor overlay sa Kraken LCD"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Custom animated Kraken LCD screen sa pamamagitan ng NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Mga feature

| Kakayahan | Ano ang makukuha mo |
|---|---|
| **Free-form layout editor** | I-drag, i-resize, i-rotate, i-layer, i-lock, palitan ang pangalan, at eksaktong iposisyon ang bawat element. |
| **Live NZXT CAM sensor data** | Gumawa ng custom displays para sa CPU, GPU, RAM, liquid temperature, power, frequency, at fan speed. |
| **Advanced graphics** | Pagsamahin ang radial, linear, circular, at historical sensor graphs sa iisang layout. |
| **Animated backgrounds** | Gumamit ng colors, gradients, local images, GIF, MP4 video, direct media URLs, YouTube, at Pinterest. |
| **Now Playing integration** | Ipakita ang album artwork, track information, at sound-reactive visuals mula sa lokal na Windows client. |
| **Explore at Library** | Mag-import ng community presets, i-edit ang bawat bahagi, ayusin ang favorites, at panatilihin ang sarili mong local collection. |
| **Local-first storage** | Gumagamit ang presets ng LocalStorage; gumagamit ang local media ng IndexedDB at nananatili sa device mo. |
| **Multilingual editor** | Gamitin ang interface sa 18 suportadong wika. |

### Mga overlay element

Hinahati ng kasalukuyang editor ang overlay elements sa apat na malinaw na kategorya:

| Content | Data | Oras | Audio |
|---|---|---|---|
| Text | Sensor | Digital Clock | Album Cover |
| Shape | Radial Graphic | Analog Clock | Now Playing Text |
| Icon | Linear Graphic | Date | Audio Visualizer |
| Sticker | Circle Graphic |  |  |
| Image | Sensor Chart |  |  |

Hangga’t maaari, pareho ang visual workflow ng lahat ng element: piliin ito sa preview o layer list, pagkatapos ay ayusin ang position, size, rotation, order, style, at type-specific settings.

### Hardware monitoring

Gumawa ng live layouts gamit ang available na NZXT CAM monitoring data, kabilang ang:

`CPU temperature` · `CPU load` · `CPU frequency` · `CPU power` · `CPU fan speed` · `GPU temperature` · `GPU load` · `GPU frequency` · `GPU power` · `GPU fan speed` · `RAM usage` · `liquid temperature`

Maaaring awtomatikong piliin ng multi-GPU systems ang aktibong GPU o gumamit ng partikular na GPU. Nagbibigay din ang browser editor ng mock values kapag hindi available ang NZXT CAM API, kaya maaari pa ring magdisenyo at mag-preview ng layouts.

### Mga background at media

Gumamit ng solid color o gradient bilang base, pagkatapos ay magdagdag ng media mula sa:

- Local PNG, JPG, GIF, WebP, o MP4 files
- Direct image at video URLs
- YouTube videos
- Pinterest media links

Maaaring iposisyon, i-scale, i-fit, at pagsamahin ang background media sa anumang overlay layout. Naka-store ang local files sa IndexedDB at hindi ina-upload ng NZXT-ESC.

### Presets, Explore, at Library

- Mag-save at mag-organize ng hanggang **20 custom presets** sa local Library.
- Bumuo ng bawat preset gamit ang hanggang **40 overlay elements**.
- Mag-import at mag-export ng editable preset files para sa backup o sharing.
- Mag-browse ng community-made layouts sa **Explore**.
- Magdagdag ng Explore preset sa Library, i-customize ito, at gawin itong sarili mo.
- Panatilihing synchronized ang editing at Kraken rendering sa dalawang NZXT CAM views.

## Now Playing at Audio Visualizer

Ang optional Windows client na [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) ay lokal na tumatakbo at nagpapadala ng media-session at audio-spectrum data sa NZXT-ESC sa pamamagitan ng local WebSocket connection.

Gamitin ito para magdagdag ng:

- **Album Cover** kasalukuyang artwork na may controls para sa size, border, at corners
- **Now Playing Text** title, artist, o album na may scrolling para sa mahabang text
- **Audio Visualizer** customizable real-time spectrum at waveform visuals

Hindi ito limitado sa Spotify. Binabasa ng companion app ang suportadong Windows media sessions at system audio output mula sa browsers, media players, at iba pang apps.

<a id="languages"></a>
## Mga wika

Kasalukuyang sinusuportahan ng editor ang:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**Isinaling dokumentasyon:**
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

## Privacy at local storage

Idinisenyo ang NZXT-ESC sa paligid ng local browser storage:

- Naka-store ang preset configuration sa **LocalStorage**.
- Naka-store ang local images at videos sa **IndexedDB**.
- Hindi ipinapadala sa analytics ang NZXT CAM sensor readings at user-created presets.
- Hindi sinasadyang mangolekta ang app ng personally identifiable information.

Gumagamit ang production website ng **Google Tag Manager** at **Google Analytics 4** para sa anonymous product analytics. Pinamamahalaan ng **CookieYes** ang consent kapag kinakailangan, at ine-enable ang optional analytics cookies ayon sa pinili ng user. Hindi kailangan ng development builds ang production analytics services.

## Development

### Patakbuhin nang lokal

```bash
npm install
npm run dev
```

Buksan ang `http://localhost:5173`. Gumagamit ang editor ng mock hardware data kapag hindi available ang NZXT CAM.

```bash
npm run build   # I-type-check at gumawa ng production build
npm test        # Patakbuhin ang i18n checks at Vitest test suite
```

### Architecture

<details>
<summary><strong>Project structure at design principles</strong></summary>

```text
src/
├─ core/       Domain contracts para sa presets, overlays, elements, at backgrounds
├─ render/     Shared preset-to-render-model engine
├─ storage/    LocalStorage state, import/export, at IndexedDB media
├─ platform/   NZXT CAM at local companion-app adapters
├─ sync/       Editor/runtime synchronization
├─ i18n/       Typed locale messages at translation utilities
└─ ui/
   ├─ config/  Drag-and-drop configuration editor
   ├─ kraken/  Lightweight Kraken display runtime
   └─ shared/  Reusable interface components
```

Gumagamit ang editor preview at Kraken runtime ng parehong canonical render pipeline. Pinananatili ng shared engine na pareho ang layout, styling, at transform behavior sa pagitan ng disenyo ng user at ng lumalabas sa physical display.

Nino-normalize ang preset data bago i-store, versioned ang import/export, at sini-sync ang editor updates sa pamamagitan ng `BroadcastChannel` na may `localStorage` fallback.

</details>

### Pag-ambag

Malugod na tinatanggap ang contributions at focused pull requests. Bago gumawa ng architectural changes, basahin ang:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [Security Policy](../SECURITY.md)

<a id="faq"></a>
## FAQ

<details>
<summary><strong>Kailangan ko bang i-install ang NZXT-ESC?</strong></summary>

Hindi kailangan ng pangunahing editor ng hiwalay na installation. Buksan ito sa NZXT CAM Web Integration. Tanging optional music overlays lamang ang nangangailangan ng lokal na NowPlaying.WebSocket Windows client.

</details>

<details>
<summary><strong>Gumagana ba ang NZXT-ESC nang walang NZXT CAM?</strong></summary>

Maaaring buksan ang editor sa regular na browser at gumagamit ito ng mock sensor values para sa pagdisenyo. Kailangan ang NZXT CAM Web Integration para sa live hardware monitoring at output sa Kraken display.

</details>

<details>
<summary><strong>Aling NZXT Kraken models ang suportado?</strong></summary>

Idinisenyo ang NZXT-ESC para sa NZXT Kraken devices na sumusuporta sa NZXT CAM Web Integration display mode. Tinutukoy sa pamamagitan ng NZXT CAM API ang available na display size at shape.

</details>

<details>
<summary><strong>Saan naka-store ang presets at local media?</strong></summary>

Naka-store ang presets sa LocalStorage ng browser. Naka-store ang local images at videos sa IndexedDB. Regular na i-export ang mahahalagang presets kapag lilipat ng browser, Windows installation, o computer.

</details>

<details>
<summary><strong>Kailangan ba ng Spotify para sa Now Playing?</strong></summary>

Hindi. Gumagamit ang NowPlaying.WebSocket ng suportadong Windows media sessions at system audio, kaya maaari itong gumana sa browsers at iba pang compatible media apps.

</details>

<details>
<summary><strong>Mae-edit ba ang community presets?</strong></summary>

Oo. Ganap na nae-edit ang presets na na-import mula sa Explore pagkatapos idagdag sa Library.

</details>

<a id="license"></a>
## Lisensya

Inilalabas ang NZXT-ESC sa ilalim ng **Personal Use License**.

**Pinapayagan:** personal use, personal modifications, at redistribution na may malinaw na credit sa original project.

**Commercial use:** ang pagbebenta, bundling, pagpapaupa, pag-integrate sa bayad na produkto, o iba pang monetized use ay nangangailangan ng paunang nakasulat na pahintulot mula sa may-ari ng proyekto.
Tingnan ang [LICENSE para sa kumpletong terms](../LICENSE).

## Support at mga link

- **Website:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **Pinakabagong release:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Bug reports at ideas:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **Companion app:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

<div align="center">

Kung napaganda ng NZXT-ESC ang setup mo, maaari mong suportahan ang patuloy nitong development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Ginawa ni **Gökhan AKGÜL (mRGogo)** — pinapagana ng kape at kaduda-dudang sleep schedule.

</div>
