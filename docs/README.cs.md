# NZXT-ESC

### Pokročilý editor rozvržení a přizpůsobení obrazovky pro NZXT Kraken AIO

Vytvářejte plně upravitelná LCD rozvržení pro NZXT Kraken s překryvy senzorů pomocí přetažení, vlastními fonty, obrázky, GIFy, videem MP4, hodinami, grafy, daty Now Playing a vizualizacemi reagujícími na zvuk, které se živě vykreslují přes **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Otevřít v NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Otevřít webový editor](https://nzxt-esc.pages.dev/)
· [Funkce](#features)
· [Rychlý start](#quick-start)
· [Časté dotazy](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Editor LCD rozvržení NZXT Kraken s přetažením v NZXT-ESC"
       width="70%" />

> [!NOTE]
> **NZXT-ESC je nezávislý komunitní projekt.** Není propojen, sponzorován ani podporován společností NZXT.

Pokud NZXT-ESC zlepšil vaši sestavu, můžete podpořit jeho další vývoj:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## Přizpůsobení LCD NZXT Kraken bez pevných rozvržení

NZXT-ESC mění displej NZXT Kraken na volné návrhové plátno. Vytvořte vlastní LCD obrazovku umístěním každého senzoru, grafiky, hodin, obrázku nebo mediálního prvku přesně tam, kam chcete. Měňte velikost, otáčejte, řaďte, přejmenovávejte, zamykejte a stylujte prvky a sledujte živou aktualizaci výsledku přes NZXT CAM.

Hlavní editor **nevyžaduje účet** ani **samostatnou instalaci pro koncového uživatele**. Presety a místní média zůstávají v úložišti prohlížeče. Volitelné hudební překryvy používají místní doprovodnou aplikaci pro Windows [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="quick-start"></a>
## Rychlý start

### Otevřít přímo v NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Klikněte na **Open NZXT-ESC in NZXT CAM**.
2. Povolte prohlížeči otevřít NZXT CAM.
3. Potvrďte **Load Web Integration**.
4. Otevřete novou kartu Web Integration a vyberte **Configure**.
5. Vytvořte rozvržení; změny se synchronizují s displejem Kraken.

<details>
<summary><strong>Ruční nastavení v NZXT CAM</strong></summary>

1. Otevřete **NZXT CAM**.
2. Přejděte na **Lighting → Kraken → LCD Display**.
3. Vyberte **Web Integration**.
4. Otevřete nastavení **Custom Web Integration**.
5. Zadejte:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Vyberte **Apply** a poté **Add as Card**.
7. Otevřete novou kartu a vyberte **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Obrazovka nastavení NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Přidání NZXT-ESC jako karty NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Podívejte se na něj v akci

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Vlastní LCD preset NZXT Kraken vytvořený v NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Animované rozvržení displeje NZXT Kraken v NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Živý překryv senzorů NZXT CAM na LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Vlastní animovaná LCD obrazovka Kraken přes NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Funkce

| Možnost | Co vám přináší |
|---|---|
| **Editor volného rozvržení** | Přetahujte, měňte velikost, otáčejte, vrstvete, zamykejte, přejmenovávejte a přesně umísťujte každý prvek. |
| **Živá data senzorů NZXT CAM** | Vytvářejte vlastní displeje CPU, GPU, RAM, teploty kapaliny, výkonu, frekvence a rychlosti ventilátorů. |
| **Pokročilá grafika** | Kombinujte radiální, lineární, kruhové a historické grafy senzorů v jednom rozvržení. |
| **Animovaná pozadí** | Používejte barvy, přechody, místní obrázky, GIFy, MP4 video, přímé URL médií, YouTube a Pinterest. |
| **Integrace Now Playing** | Zobrazujte obal alba, informace o skladbě a vizualizace reagující na zvuk z místního klienta Windows. |
| **Explore a Library** | Importujte komunitní presety, upravujte každý detail, organizujte oblíbené a spravujte vlastní místní sbírku. |
| **Místní úložiště na prvním místě** | Presety používají LocalStorage, místní média IndexedDB a zůstávají ve vašem zařízení. |
| **Vícejazyčný editor** | Používejte rozhraní v 18 podporovaných jazycích. |

### Prvky překryvu

Aktuální editor seskupuje prvky překryvu do čtyř přehledných kategorií:

| Obsah | Data | Čas | Zvuk |
|---|---|---|---|
| Text | Senzor | Digitální hodiny | Obal alba |
| Tvar | Radiální grafika | Analogové hodiny | Text Now Playing |
| Ikona | Lineární grafika | Datum | Zvukový vizualizér |
| Nálepka | Kruhová grafika |  |  |
| Obrázek | Graf senzoru |  |  |

Kde je to možné, všechny prvky používají stejný vizuální postup: vyberte prvek v náhledu nebo seznamu vrstev a upravte jeho polohu, velikost, otočení, pořadí, styl a nastavení specifická pro daný typ.

### Sledování hardwaru

Vytvářejte živá rozvržení s dostupnými monitorovacími daty NZXT CAM, včetně:

`teplota CPU` · `zatížení CPU` · `frekvence CPU` · `výkon CPU` · `rychlost ventilátoru CPU` · `teplota GPU` · `zatížení GPU` · `frekvence GPU` · `výkon GPU` · `rychlost ventilátoru GPU` · `využití RAM` · `teplota kapaliny`

Systémy s více GPU mohou automaticky vybrat aktivní GPU nebo použít konkrétní GPU. Když API NZXT CAM není dostupné, editor v prohlížeči také poskytuje ukázkové hodnoty, takže rozvržení lze dál navrhovat a zobrazovat v náhledu.

### Pozadí a média

Použijte plnou barvu nebo přechod jako základ a poté přidejte média z:

- Místních souborů PNG, JPG, GIF, WebP nebo MP4
- Přímých URL obrázků a videí
- Videí YouTube
- Mediálních odkazů Pinterest

Média na pozadí lze umístit, škálovat, přizpůsobit a kombinovat s libovolným rozvržením překryvů. Místní soubory jsou uloženy v IndexedDB a NZXT-ESC je nenahrává.

### Presety, Explore a Library

- Ukládejte a organizujte až **20 vlastních presetů** v místní Library.
- Vytvořte každý preset s až **40 prvky překryvu**.
- Importujte a exportujte upravitelné soubory presetů pro zálohu nebo sdílení.
- Procházejte rozvržení vytvořená komunitou v **Explore**.
- Přidejte preset z Explore do Library, přizpůsobte jej a vytvořte vlastní verzi.
- Udržujte úpravy a vykreslování Kraken synchronizované mezi dvěma zobrazeními NZXT CAM.

## Now Playing a zvukový vizualizér

Volitelný klient pro Windows [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) běží místně a posílá data mediální relace a zvukového spektra do NZXT-ESC přes místní připojení WebSocket.

Použijte jej k přidání:

- **Obalu alba** aktuálního obrázku s nastavením velikosti, okraje a rohů
- **Textu Now Playing** názvu, interpreta nebo alba s posouváním dlouhého textu
- **Zvukového vizualizéru** přizpůsobitelných spektrálních a vlnových vizualizací v reálném čase

Integrace není omezena na Spotify. Doprovodná aplikace čte podporované mediální relace Windows a systémový zvuk z prohlížečů, přehrávačů a dalších aplikací.

<a id="languages"></a>
## Jazyky

Editor aktuálně podporuje:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**Přeložená dokumentace:**
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

## Soukromí a místní úložiště

NZXT-ESC je navržen kolem místního úložiště prohlížeče:

- Konfigurace presetů je uložena v **LocalStorage**.
- Místní obrázky a videa jsou uloženy v **IndexedDB**.
- Hodnoty senzorů NZXT CAM a presety vytvořené uživatelem nejsou odesílány do analytiky.
- Aplikace záměrně neshromažďuje osobní identifikační údaje.

Produkční web používá **Google Tag Manager** a **Google Analytics 4** pro anonymní analýzu produktu. **CookieYes** spravuje souhlas tam, kde je vyžadován, a volitelné analytické cookies se zapínají podle volby uživatele. Vývojové buildy nevyžadují produkční analytické služby.

## Vývoj

### Spustit místně

```bash
npm install
npm run dev
```

Otevřete `http://localhost:5173`. Když NZXT CAM není dostupné, editor používá simulovaná hardwarová data.

```bash
npm run build   # Zkontrolovat typy a vytvořit produkční build
npm test        # Spustit kontroly i18n a sadu testů Vitest
```

### Architektura

<details>
<summary><strong>Struktura projektu a návrhové principy</strong></summary>

```text
src/
├─ core/       Doménové kontrakty presetů, překryvů, prvků a pozadí
├─ render/     Sdílený engine z presetu do modelu vykreslení
├─ storage/    Stav LocalStorage, import/export a média IndexedDB
├─ platform/   Adaptéry NZXT CAM a místní doprovodné aplikace
├─ sync/       Synchronizace editoru a runtime
├─ i18n/       Typované jazykové zprávy a překladové nástroje
└─ ui/
   ├─ config/  Konfigurační editor s přetažením
   ├─ kraken/  Lehký runtime displeje Kraken
   └─ shared/  Znovupoužitelné komponenty rozhraní
```

Náhled editoru a runtime Kraken používají stejný kanonický vykreslovací řetězec. Sdílený engine udržuje rozvržení, styl a transformace konzistentní mezi návrhem uživatele a výsledkem na fyzickém displeji.

Data presetů se před uložením normalizují, import/export je verzovaný a aktualizace editoru se synchronizují přes `BroadcastChannel` s náhradním řešením `localStorage`.

</details>

### Přispívání

Příspěvky a zaměřené pull requesty jsou vítány. Před změnami architektury si přečtěte:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Kodex chování](../CODE_OF_CONDUCT.md)
- [Bezpečnostní zásady](../SECURITY.md)

<a id="faq"></a>
## Časté dotazy

<details>
<summary><strong>Musím NZXT-ESC instalovat?</strong></summary>

Hlavní editor nevyžaduje samostatnou instalaci. Otevřete jej přes NZXT CAM Web Integration. Pouze volitelné hudební překryvy vyžadují místní Windows klient NowPlaying.WebSocket.

</details>

<details>
<summary><strong>Funguje NZXT-ESC bez NZXT CAM?</strong></summary>

Editor lze otevřít v běžném prohlížeči a pro návrh používá simulované hodnoty senzorů. Živé sledování hardwaru a výstup na displej Kraken vyžadují NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Které modely NZXT Kraken jsou podporovány?</strong></summary>

NZXT-ESC je určen pro zařízení NZXT Kraken, která podporují režim displeje NZXT CAM Web Integration. Dostupná velikost a tvar displeje se zjišťují přes API NZXT CAM.

</details>

<details>
<summary><strong>Kde jsou uloženy presety a místní média?</strong></summary>

Presety jsou uloženy v LocalStorage prohlížeče. Místní obrázky a videa jsou uloženy v IndexedDB. Při změně prohlížeče, instalace Windows nebo počítače pravidelně exportujte důležité presety.

</details>

<details>
<summary><strong>Vyžaduje Now Playing Spotify?</strong></summary>

Ne. NowPlaying.WebSocket používá podporované mediální relace Windows a systémový zvuk, takže může fungovat s prohlížeči a dalšími kompatibilními mediálními aplikacemi.

</details>

<details>
<summary><strong>Lze komunitní presety upravovat?</strong></summary>

Ano. Presety importované z Explore jsou po přidání do Library plně upravitelné.

</details>

<a id="license"></a>
## Licence

NZXT-ESC je vydán pod **licencí pro osobní použití**.

**Povoleno:** osobní použití, osobní úpravy a další šíření s jasným uvedením původního projektu.

**Komerční použití:** prodej, balíčkování, pronájem, integrace do placeného produktu nebo jiné zpeněžené použití vyžaduje předchozí písemné povolení vlastníka projektu.
Úplné podmínky najdete v [LICENSE](../LICENSE).

## Podpora a odkazy

- **Web:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **Nejnovější vydání:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Chyby a nápady:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **Doprovodná aplikace:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

Pokud NZXT-ESC zlepšil vaši sestavu, můžete podpořit jeho další vývoj:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Vytvořil **Gökhan AKGÜL (mRGogo)** poháněno kávou a pochybným spánkovým režimem.
