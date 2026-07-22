# NZXT-ESC

### Avancerad layout- och skärmanpassningsredigerare för NZXT Kraken AIO

Skapa helt redigerbara LCD-layouter för NZXT Kraken med dra-och-släpp-sensoröverlägg, egna typsnitt, bilder, GIF-filer, MP4-video, klockor, grafer, Now Playing-data och ljudreaktiva visualiseringar som renderas live via **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Öppna i NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Öppna webbredigeraren](https://nzxt-esc.pages.dev/)
· [Funktioner](#features)
· [Snabbstart](#quick-start)
· [Vanliga frågor](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESC dra-och-släpp-redigerare för NZXT Kraken LCD-layout"
       width="70%" />

> [!NOTE]
> **NZXT-ESC är ett oberoende communityprojekt.** Det är inte anslutet till, sponsrat av eller godkänt av NZXT.

Om NZXT-ESC förbättrade din setup kan du stödja den fortsatta utvecklingen:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## Anpassa NZXT Kraken LCD utan fasta layouter

NZXT-ESC gör NZXT Kraken-skärmen till en friformsyta. Bygg en egen LCD-skärm genom att placera varje sensor, grafik, klocka, bild eller medieelement exakt där du vill ha det. Ändra storlek, rotera, ordna om, byt namn, lås och formge elementen medan resultatet uppdateras live via NZXT CAM.

Grundredigeraren kräver **inget konto** och **ingen separat installation för slutanvändaren**. Presets och lokala medier stannar i webbläsarens lagring. Valfria musiköverlägg använder den lokala Windows-kompanjonappen [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="quick-start"></a>
## Snabbstart

### Öppna direkt i NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Klicka på **Open NZXT-ESC in NZXT CAM**.
2. Tillåt webbläsaren att öppna NZXT CAM.
3. Bekräfta **Load Web Integration**.
4. Öppna det nya Web Integration-kortet och välj **Configure**.
5. Skapa din layout; ändringarna synkroniseras med Kraken-skärmen.

<details>
<summary><strong>Manuell installation i NZXT CAM</strong></summary>

1. Öppna **NZXT CAM**.
2. Gå till **Lighting → Kraken → LCD Display**.
3. Välj **Web Integration**.
4. Öppna inställningarna för **Custom Web Integration**.
5. Ange:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Välj **Apply** och därefter **Add as Card**.
7. Öppna det nya kortet och välj **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Inställningsskärm för NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Lägg till NZXT-ESC som ett NZXT CAM Web Integration-kort"
       width="48%" />
</p>

</details>

## Se det i praktiken

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Anpassat NZXT Kraken LCD-preset skapat med NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Animerad NZXT Kraken-skärmlayout i NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Liveöverlägg med NZXT CAM-sensordata på en Kraken LCD"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Anpassad animerad Kraken LCD-skärm via NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Funktioner

| Funktion | Vad du får |
|---|---|
| **Friformsredigerare** | Dra, skala, rotera, lagerordna, lås, byt namn och placera varje element exakt. |
| **Live-sensordata från NZXT CAM** | Bygg egna displayer för CPU, GPU, RAM, vätsketemperatur, effekt, frekvens och fläkthastighet. |
| **Avancerad grafik** | Kombinera radiella, linjära, cirkulära och historiska sensorgrafer i en layout. |
| **Animerade bakgrunder** | Använd färger, gradienter, lokala bilder, GIF, MP4-video, direkta medie-URL:er, YouTube och Pinterest. |
| **Now Playing-integration** | Visa albumbilder, låtinformation och ljudreaktiva visualiseringar från en lokal Windows-klient. |
| **Explore och Library** | Importera communitypresets, redigera alla delar, organisera favoriter och hantera din lokala samling. |
| **Lokal lagring först** | Presets använder LocalStorage; lokala medier använder IndexedDB och stannar på enheten. |
| **Flerspråkig redigerare** | Använd gränssnittet på 18 språk. |

### Överläggselement

Den aktuella redigeraren delar in överläggselement i fyra tydliga kategorier:

| Innehåll | Data | Tid | Ljud |
|---|---|---|---|
| Text | Sensor | Digital klocka | Albumbild |
| Form | Radiell grafik | Analog klocka | Now Playing-text |
| Ikon | Linjär grafik | Datum | Ljudvisualiserare |
| Klistermärke | Cirkelgrafik |  |  |
| Bild | Sensordiagram |  |  |

Där det är möjligt använder alla element samma visuella arbetsflöde: välj elementet i förhandsvisningen eller lagerlistan och justera sedan position, storlek, rotation, ordning, stil och typspecifika inställningar.

### Hårdvaruövervakning

Skapa live-layouter med tillgängliga övervakningsdata från NZXT CAM, bland annat:

`CPU-temperatur` · `CPU-belastning` · `CPU-frekvens` · `CPU-effekt` · `CPU-fläkthastighet` · `GPU-temperatur` · `GPU-belastning` · `GPU-frekvens` · `GPU-effekt` · `GPU-fläkthastighet` · `RAM-användning` · `vätsketemperatur`

System med flera GPU:er kan automatiskt välja den aktiva GPU:n eller använda en bestämd GPU. Webbläsarredigeraren visar även exempelvärden när NZXT CAM API inte är tillgängligt, så layouter kan fortfarande skapas och förhandsgranskas.

### Bakgrunder och medier

Använd en solid färg eller gradient som bas och lägg sedan till medier från:

- Lokala PNG-, JPG-, GIF-, WebP- eller MP4-filer
- Direkta bild- och video-URL:er
- YouTube-videor
- Pinterest-medielänkar

Bakgrundsmedier kan placeras, skalas, passas in och kombineras med valfri överläggslayout. Lokala filer lagras i IndexedDB och laddas inte upp av NZXT-ESC.

### Presets, Explore och Library

- Spara och organisera upp till **20 egna presets** i det lokala Library.
- Bygg varje preset med upp till **40 överläggselement**.
- Importera och exportera redigerbara presetfiler för säkerhetskopiering eller delning.
- Bläddra bland communityskapade layouter via **Explore**.
- Lägg till ett Explore-preset i Library, anpassa det och gör det till ditt eget.
- Håll redigering och Kraken-rendering synkroniserade mellan de två NZXT CAM-vyerna.

## Now Playing och ljudvisualiserare

Den valfria Windows-klienten [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) körs lokalt och skickar mediesessions- och ljudspektrumdata till NZXT-ESC via en lokal WebSocket-anslutning.

Använd den för att lägga till:

- **Albumbild** aktuellt omslag med kontroller för storlek, kantlinje och hörn
- **Now Playing-text** titel, artist eller album med rullning för lång text
- **Ljudvisualiserare** anpassningsbara spektrum- och vågformsvisualiseringar i realtid

Integrationen är inte begränsad till Spotify. Kompanjonappen läser kompatibla Windows-mediesessioner och systemljud från webbläsare, mediespelare och andra appar.

<a id="languages"></a>
## Språk

Redigeraren stöder för närvarande:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**Översatt dokumentation:**
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

## Integritet och lokal lagring

NZXT-ESC är byggt kring lokal webbläsarlagring:

- Presetkonfiguration sparas i **LocalStorage**.
- Lokala bilder och videor sparas i **IndexedDB**.
- NZXT CAM-sensorvärden och användarskapade presets skickas inte till analystjänster.
- Appen samlar inte avsiktligt in personligt identifierbar information.

Produktionswebbplatsen använder **Google Tag Manager** och **Google Analytics 4** för anonym produktanalys. **CookieYes** hanterar samtycke där det krävs, och valfria analyscookies aktiveras enligt användarens val. Utvecklingsbyggen kräver inte produktionens analystjänster.

## Utveckling

### Kör lokalt

```bash
npm install
npm run dev
```

Öppna `http://localhost:5173`. Redigeraren använder simulerade hårdvarudata när NZXT CAM inte är tillgängligt.

```bash
npm run build   # Typkontrollera och skapa ett produktionsbygge
npm test        # Kör i18n-kontroller och Vitest-testsviten
```

### Arkitektur

<details>
<summary><strong>Projektstruktur och designprinciper</strong></summary>

```text
src/
├─ core/       Domänkontrakt för presets, överlägg, element och bakgrunder
├─ render/     Gemensam motor från preset till renderingsmodell
├─ storage/    LocalStorage-tillstånd, import/export och IndexedDB-medier
├─ platform/   Adaptrar för NZXT CAM och lokal kompanjonapp
├─ sync/       Synkronisering mellan redigerare och runtime
├─ i18n/       Typade språkmeddelanden och översättningsverktyg
└─ ui/
   ├─ config/  Dra-och-släpp-konfigurationsredigerare
   ├─ kraken/  Lättviktig runtime för Kraken-skärmen
   └─ shared/  Återanvändbara gränssnittskomponenter
```

Redigerarens förhandsvisning och Kraken-runtimen använder samma kanoniska renderingskedja. Den gemensamma motorn håller layout, stil och transformationer konsekventa mellan det användaren designar och det som visas på den fysiska skärmen.

Presetdata normaliseras före lagring, import/export är versionshanterad och redigerarens uppdateringar synkroniseras via `BroadcastChannel` med `localStorage` som reservlösning.

</details>

### Bidra

Bidrag och fokuserade pull requests är välkomna. Läs följande innan du gör arkitekturändringar:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Uppförandekod](../CODE_OF_CONDUCT.md)
- [Säkerhetspolicy](../SECURITY.md)

<a id="faq"></a>
## Vanliga frågor

<details>
<summary><strong>Måste jag installera NZXT-ESC?</strong></summary>

Grundredigeraren kräver ingen separat installation. Öppna den via NZXT CAM Web Integration. Endast de valfria musiköverläggen kräver den lokala Windows-klienten NowPlaying.WebSocket.

</details>

<details>
<summary><strong>Fungerar NZXT-ESC utan NZXT CAM?</strong></summary>

Redigeraren kan öppnas i en vanlig webbläsare och använder simulerade sensorvärden för design. Liveövervakning av hårdvara och visning på Kraken-skärmen kräver NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Vilka NZXT Kraken-modeller stöds?</strong></summary>

NZXT-ESC är utformat för NZXT Kraken-enheter som stöder visningsläget NZXT CAM Web Integration. Tillgänglig skärmstorlek och form hämtas via NZXT CAM API.

</details>

<details>
<summary><strong>Var lagras presets och lokala medier?</strong></summary>

Presets lagras i webbläsarens LocalStorage. Lokala bilder och videor lagras i IndexedDB. Exportera viktiga presets regelbundet när du byter webbläsare, Windows-installation eller dator.

</details>

<details>
<summary><strong>Kräver Now Playing Spotify?</strong></summary>

Nej. NowPlaying.WebSocket använder kompatibla Windows-mediesessioner och systemljud och kan därför fungera med webbläsare och andra kompatibla medieappar.

</details>

<details>
<summary><strong>Kan communitypresets redigeras?</strong></summary>

Ja. Presets som importeras från Explore är helt redigerbara efter att de lagts till i Library.

</details>

<a id="license"></a>
## Licens

NZXT-ESC publiceras under en **licens för personligt bruk**.

**Tillåtet:** personligt bruk, personliga ändringar och vidaredistribution med tydlig hänvisning till originalprojektet.

**Kommersiell användning:** försäljning, paketering, uthyrning, integrering i en betald produkt eller annan intäktsgenererande användning kräver skriftligt förhandsgodkännande från projektägaren.
Se [LICENSE för fullständiga villkor](../LICENSE).

## Support och länkar

- **Webbplats:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **Senaste version:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Felrapporter och idéer:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **Kompanjonapp:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

Om NZXT-ESC förbättrade din setup kan du stödja den fortsatta utvecklingen:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Byggt av **Gökhan AKGÜL (mRGogo)** drivs av kaffe och tveksamma sovscheman.
