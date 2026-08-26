# NZXT-ESC - A legjobb NZXT webes integráció

### Fejlett képernyő-testreszabási elrendezés-szerkesztő az NZXT Kraken AIO-hoz

Hozz létre teljesen szerkeszthető NZXT Kraken LCD elrendezéseket húzd-és-ejtsd érzékelő-overlay-ekkel, egyéni betűtípusokkal, képekkel, GIF-ekkel, APNG-vel, MP4, WebM videóval, órákkal, grafikonokkal, Now Playing adatokkal és hangra reagáló vizuális effektekkel, amelyeket az **NZXT CAM Web Integration** jelenít meg élőben.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-25-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Megnyitás az NZXT CAM-ban](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Élő előnézet megnyitása](https://nzxt-esc.pages.dev/)
· [Támogatott Kraken modellek](#supported-nzxt-kraken-lcd-models)
· [Funkciók](#features)
· [Gyors kezdés](#quick-start)
· [GYIK](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESC húzd-és-ejtsd NZXT Kraken LCD elrendezés-szerkesztő"
       width="70%" />

> [!NOTE]
> **Az NZXT-ESC egy független közösségi projekt.** Nem áll kapcsolatban az NZXT-vel, nem az NZXT szponzorálja, és nem az NZXT hagyta jóvá.

Ha az NZXT-ESC javított a beállításodon, támogathatod a további fejlesztését:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## NZXT Kraken LCD testreszabás rögzített elrendezések nélkül

Az NZXT-ESC szabadformájú vászonná alakítja az NZXT Kraken kijelzőt. Építs egyéni LCD képernyőt úgy, hogy minden érzékelőt, grafikát, órát, képet vagy médiaelemet pontosan oda helyezel, ahová szeretnéd. Módosítsd a méretet, forgasd, rendezd át, nevezd át, zárold és formázd az elemeket, miközben az eredmény élőben frissül az NZXT CAM-on keresztül.

Az alapszerkesztő nem igényel **fiókot**, és nem igényel **külön végfelhasználói telepítést** sem. A presetek és a helyi médiafájlok a böngésző tárhelyén maradnak. Az opcionális zenei overlay-ek a helyi [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) Windows kísérőalkalmazást használják.

<a id="supported-nzxt-kraken-lcd-models"></a>

## Támogatott NZXT Kraken LCD modellek

Az NZXT-ESC támogatja az LCD kijelzővel és NZXT CAM Web Integration funkcióval rendelkező NZXT Kraken AIO folyadékhűtőket, beleértve a jelenlegi és korábbi generációs Kraken Elite, Kraken Plus, Kraken és Kraken Z modelleket.

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

Az NZXT-ESC automatikusan alkalmazkodik a Kraken LCD felbontásához, méretéhez és kijelzőalakjához, amelyet az NZXT CAM API jelent, lehetővé téve egyéni elrendezések, érzékelő-overlay-ek, animált hátterek, grafikák és médiafájlok megjelenítését az NZXT CAM Web Integration-ön keresztül.

<a id="quick-start"></a>
## Gyors kezdés

### Közvetlen megnyitás az NZXT CAM-ban

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Kattints az **Open NZXT-ESC in NZXT CAM** gombra.
2. Engedélyezd a böngésződnek, hogy megnyissa az NZXT CAM-ot.
3. Erősítsd meg a **Load Web Integration** lépést.
4. Nyisd meg az új Web Integration kártyát, és válaszd a **Configure** lehetőséget.
5. Hozd létre az elrendezésedet; a változtatások szinkronizálódnak a Kraken kijelzővel.

<details>
<summary><strong>Kézi beállítás az NZXT CAM-on belül</strong></summary>

1. Nyisd meg az **NZXT CAM**-ot.
2. Menj a **Lighting → Kraken → LCD Display** menüpontra.
3. Válaszd a **Web Integration** lehetőséget.
4. Nyisd meg a **Custom Web Integration** beállításokat.
5. Add meg:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Válaszd az **Apply**, majd az **Add as Card** gombot.
7. Nyisd meg az új kártyát, és válaszd a **Configure** lehetőséget.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="NZXT CAM Web Integration beállítási képernyő"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Az NZXT-ESC hozzáadása NZXT CAM Web Integration kártyaként"
       width="48%" />
</p>

</details>

## Nézd meg működés közben

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Egyéni NZXT Kraken LCD preset az NZXT-ESC-vel létrehozva"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Animált NZXT Kraken kijelző-elrendezés az NZXT-ESC-ben"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Élő NZXT CAM érzékelő-overlay egy Kraken LCD-n"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Egyéni animált Kraken LCD képernyő, amely az NZXT CAM-on keresztül fut"
       width="48%" />
</p>

<a id="features"></a>
## Funkciók

| Képesség | Mit ad neked |
|---|---|
| **Szabadformájú elrendezés-szerkesztő** | Húzd, méretezd, forgasd, rétegezd, zárold, nevezd át és pozicionáld pontosan minden elemet. |
| **Élő NZXT CAM érzékelőadatok** | Építs egyéni CPU-, GPU-, RAM-, folyadékhőmérséklet-, teljesítmény-, frekvencia- és ventilátorsebesség-kijelzőket. |
| **Fejlett grafikák** | Kombinálj radiális, lineáris, kör alakú és korábbi adatokat mutató érzékelő-grafikákat egyetlen elrendezésben. |
| **Animált hátterek** | Használj színeket, színátmeneteket, helyi képeket, GIF-eket, MP4 videót, közvetlen médiafájl URL-eket, valamint YouTube- és Pinterest-forrásokat. |
| **Now Playing integráció** | Jelenítsd meg az albumborítót, a szám adatait és a hangra reagáló vizuális effekteket egy helyi Windows kliensből. |
| **Explore és Library** | Importálj közösségi preseteket, szerkessz minden részletet, rendezd a kedvenceket, és tartsd karban a saját helyi preset-gyűjteményedet. |
| **Elsősorban helyi tárolás** | A presetek LocalStorage-t használnak; a helyi médiafájlok IndexedDB-ben tárolódnak, és az eszközödön maradnak. |
| **Többnyelvű szerkesztő** | Használd a felületet 25 támogatott nyelven. |

### Overlay-elemek

A jelenlegi szerkesztő négy jól elkülönülő kategóriába csoportosítja az overlay-elemeket:

| Tartalom | Adat | Idő | Hang |
|---|---|---|---|
| Szöveg | Érzékelő | Digitális óra | Albumborító |
| Alakzat | Radiális grafika | Analóg óra | Now Playing szöveg |
| Ikon | Lineáris grafika | Dátum | Hangvizualizáló |
| Matrica | Kör alakú grafika |  |  |
| Kép | Érzékelő-grafikon |  |  |

Minden elem, ahol csak lehetséges, ugyanazt a vizuális munkafolyamatot használja: válaszd ki az előnézetben vagy a rétegek listájában, majd állítsd be a pozícióját, méretét, forgatását, sorrendjét, stílusát és típusspecifikus beállításait.

### Hardvermonitorozás

Hozz létre élő elrendezéseket az elérhető NZXT CAM monitorozási adatok felhasználásával, ideértve:

`CPU-hőmérséklet` · `CPU-terhelés` · `CPU-frekvencia` · `CPU-teljesítmény` · `CPU-ventilátor sebessége` · `GPU-hőmérséklet` · `GPU-terhelés` · `GPU-frekvencia` · `GPU-teljesítmény` · `GPU-ventilátor sebessége` · `RAM-használat` · `folyadékhőmérséklet`

A több GPU-val rendelkező rendszerek automatikusan kiválaszthatják az aktív GPU-t, vagy használhatnak egy adott GPU-t. A böngészős szerkesztő emulált értékeket is biztosít, ha az NZXT CAM API nem érhető el, így az elrendezések akkor is tervezhetők és előnézetben megtekinthetők.

### Hátterek és médiafájlok

Használj egy homogén színt vagy színátmenetet alapként, majd adj hozzá médiát a következő forrásokból:

- Helyi PNG, JPG, GIF, WebP vagy MP4 fájlok
- Közvetlen kép- és videó URL-ek
- YouTube videók
- Pinterest médialinkek

A háttérmédia pozicionálható, méretezhető, illeszthető, és bármilyen overlay-elrendezéssel kombinálható. A helyi fájlok IndexedDB-ben tárolódnak, és az NZXT-ESC nem tölti fel őket sehova.

### Presetek, Explore és Library

- Mentsd és rendezd akár **20 egyéni presetet** a helyi Library-ban.
- Építs fel minden presetet akár **40 overlay-elemmel**.
- Importálj és exportálj szerkeszthető preset fájlokat biztonsági mentéshez vagy megosztáshoz.
- Böngéssz a közösség által készített elrendezések között az **Explore**-on keresztül.
- Adj hozzá egy Explore presetet a Library-hoz, testreszabhatod, és a sajátoddá teheted.
- Tartsd szinkronban a szerkesztést és a Kraken megjelenítést a két NZXT CAM nézet között.

## Now Playing és hangvizualizáló

Az opcionális [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) Windows kliens helyben fut, és médiamunkamenet- és hangspektrum-adatokat küld az NZXT-ESC-nek egy helyi WebSocket kapcsolaton keresztül.

Használd az alábbiak hozzáadásához:

- **Albumborító** az aktuális borítókép méret-, szegély- és sarokbeállításokkal
- **Now Playing szöveg** cím, előadó vagy album hosszú szöveg görgetésével
- **Hangvizualizáló** testreszabható valós idejű spektrum- és hullámforma-vizualizáció

Nem korlátozódik a Spotify-ra. A kísérőalkalmazás a támogatott Windows médiamunkameneteket és a rendszer hangkimenetét olvassa be böngészőkből, médialejátszókból és más alkalmazásokból.

<a id="languages"></a>
## Nyelvek

A szerkesztő jelenleg a következőket támogatja:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino` · `العربية` · `Bahasa Melayu` · `Ελληνικά` · `繁體中文` · `Tiếng Việt` · `Українська` · `Magyar`

**Lefordított dokumentáció:**
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
[Bahasa Melayu](README.ms.md) ·
[Ελληνικά](README.el.md) ·
[繁體中文](README.zh-TW.md) ·
[Tiếng Việt](README.vi.md) ·
[Українська](README.uk.md) ·
[Magyar](README.hu.md)

## Adatvédelem és helyi tárolás

Az NZXT-ESC a böngésző helyi tárolása köré van tervezve:

- A preset-konfiguráció **LocalStorage**-ban tárolódik.
- A helyi képek és videók **IndexedDB**-ben tárolódnak.
- Az NZXT CAM érzékelőadatok és a felhasználó által létrehozott presetek nem kerülnek elküldésre analitikai szolgáltatásoknak.
- Az alkalmazás szándékosan nem gyűjt személyazonosításra alkalmas információt.

Az éles weboldal **Google Tag Manager**-t és **Google Analytics 4**-et használ opcionális, névtelen termékanalitikához. A **CookieYes** kezeli a hozzájárulást, ahol szükséges, és a Google Analytics sütik a felhasználó hozzájárulási döntéseinek megfelelően aktiválódnak.

A közzétett weboldal emellett **Cloudflare Web Analytics**-ot is használ, amelyet a Cloudflare Pages engedélyez, és amely függetlenül működik a Google Tag Managertől. Adatvédelem-központú weboldal-forgalmi és teljesítményanalitikát biztosít sütik vagy LocalStorage használata nélkül.

### Közreműködés

A közreműködéseket és a célzott pull requesteket szívesen fogadjuk. Mielőtt architekturális változtatásokat végeznél, olvasd el:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Magatartási kódex](../CODE_OF_CONDUCT.md)
- [Biztonsági szabályzat](../SECURITY.md)

<a id="faq"></a>
## GYIK

<details>
<summary><strong>Telepítenem kell az NZXT-ESC-t?</strong></summary>

Az alapszerkesztő nem igényel külön telepítést. Nyisd meg az NZXT CAM Web Integration-ön keresztül. Csak az opcionális zenei overlay-ek igénylik a helyi NowPlaying.WebSocket Windows klienst.

</details>

<details>
<summary><strong>Működik az NZXT-ESC NZXT CAM nélkül?</strong></summary>

A szerkesztő megnyitható egy szokásos böngészőben is, és emulált érzékelőértékeket használ a tervezéshez. Az élő hardvermonitorozáshoz és a Kraken kijelzőn történő megjelenítéshez NZXT CAM Web Integration szükséges.

</details>

<details>
<summary><strong>Mely NZXT Kraken modellek támogatottak?</strong></summary>

Az NZXT-ESC támogatja az LCD-vel felszerelt **NZXT Kraken Elite, Kraken Plus, Kraken (2023) és Kraken Z sorozatú** hűtőket, amelyek biztosítják az NZXT CAM Web Integration kijelzési módot.

Tekintsd meg a [támogatott NZXT Kraken LCD modellek](#supported-nzxt-kraken-lcd-models) teljes listáját.

</details>

<details>
<summary><strong>Hol tárolódnak a presetek és a helyi médiafájlok?</strong></summary>

A presetek a böngésző LocalStorage-ában tárolódnak. A helyi képek és videók IndexedDB-ben tárolódnak. Exportáld rendszeresen a fontos preseteket, amikor másik böngészőre, Windows telepítésre vagy számítógépre vált.

</details>

<details>
<summary><strong>A Now Playing igényel Spotify-t?</strong></summary>

Nem. A NowPlaying.WebSocket a támogatott Windows médiamunkameneteket és a rendszerhangot használja, így böngészőkkel és más kompatibilis médiaalkalmazásokkal is működhet.

</details>

<details>
<summary><strong>Szerkeszthetők a közösségi presetek?</strong></summary>

Igen. Az Explore-ból importált presetek teljesen szerkeszthetők, miután hozzáadtad őket a Library-hoz.

</details>

<details>
<summary><strong>Hogyan működik a Supporter Access?</strong></summary>

Az NZXT-ESC-t egy önálló fejlesztő fejleszti és tartja karban. Miután volt elég időd valóban megismerni a projektet, az NZXT-ESC megkérdezheti, szeretnéd-e támogatni a további fejlesztését, vagy inkább még egy kis időt szeretnél a döntéshez.

A támogatás nem feltétlenül jelent pénzt. Visszajelzések, hibajelentések, ötletek, a projekt megosztása, mások segítése a felfedezésében, és más értelmes közösségi hozzájárulások is mind segítik az NZXT-ESC növekedését.

A Supporter Access kódok elérhetők a projekt támogatói számára, és ajándékba is adhatók olyan közösségi tagoknak, akik érdemben hozzájárulnak az NZXT-ESC-hez.

A használati idő csak akkor számít, amikor az NZXT-ESC ténylegesen fut a Kraken kijelzőn.

</details>

<a id="license"></a>
## Licenc

Az NZXT-ESC **személyes használatra szóló licenc** alatt jelenik meg.

**Engedélyezett:** személyes használat, személyes módosítások, valamint terjesztés az eredeti projekt egyértelmű feltüntetésével.

**Kereskedelmi felhasználás:** értékesítés, csomagolás, bérbeadás, fizetős termékbe való integrálás vagy egyéb, pénzügyi haszonnal járó felhasználás a projekt tulajdonosának előzetes írásos engedélyét igényli.
Lásd a [LICENCE teljes szövegét](../LICENSE).

## Támogatás és közösség

- **Weboldal:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **Legfrissebb kiadás:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Hibajelentések és ötletek:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

Kövesd az NZXT-ESC-t YouTube-on és Instagramon a bemutatókért, új funkciókért, oktatóanyagokért, közösségi beállításokért és projektfrissítésekért.

Ha az NZXT-ESC helyet kapott a beállításodban, sokféleképpen támogathatod a projektet: oszd meg visszajelzéseidet és ötleteidet, jelents hibákat, segíts másoknak felfedezni az NZXT-ESC-t, járulj hozzá a közösséghez, vagy egyszerűen csak hívj meg egy kávéra.

Minden fajta hozzájárulás segít az NZXT-ESC-nek előrelépni, a kávétámogatás pedig a szerver-, API-, tárhely- és karbantartási költségek fedezésében segít.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Készítette: **Gökhan AKGÜL (mRGogo)** - kávé és kétes alvási szokások hajtják.

</div>
