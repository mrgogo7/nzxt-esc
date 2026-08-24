# NZXT-ESC - Integrasi Web NZXT Terbaik

### Editor Reka Letak Penyesuaian Skrin Lanjutan untuk NZXT Kraken AIO

Cipta reka letak LCD NZXT Kraken yang boleh diedit sepenuhnya dengan overlay sensor seret-dan-lepas, fon kustom, imej, GIF, APNG, video MP4, WebM, jam, graf, data Now Playing, dan visual reaktif bunyi yang dipaparkan secara langsung melalui **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-20-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Buka dalam NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Buka Pratonton Langsung](https://nzxt-esc.pages.dev/)
· [Model Kraken Disokong](#supported-nzxt-kraken-lcd-models)
· [Ciri-ciri](#features)
· [Mula Pantas](#quick-start)
· [Soalan Lazim](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Editor reka letak LCD NZXT Kraken seret-dan-lepas oleh NZXT-ESC"
       width="70%" />

> [!NOTE]
> **NZXT-ESC ialah projek komuniti bebas.** Ia tidak berafiliasi dengan, ditaja oleh, atau disokong secara rasmi oleh NZXT.

Jika NZXT-ESC telah menambah baik persediaan anda, anda boleh menyokong pembangunannya yang berterusan:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## Penyesuaian LCD NZXT Kraken tanpa reka letak tetap

NZXT-ESC mengubah paparan NZXT Kraken menjadi kanvas bebas bentuk. Bina skrin LCD kustom dengan meletakkan setiap sensor, grafik, jam, imej, atau elemen media tepat di tempat yang anda mahukan. Ubah saiz, putar, susun semula, namakan semula, kunci, dan gayakan elemen sambil melihat hasilnya dikemas kini secara langsung melalui NZXT CAM.

Editor teras tidak memerlukan **akaun** dan tidak memerlukan **pemasangan berasingan untuk pengguna akhir**. Preset dan media tempatan kekal disimpan dalam storan pelayar. Overlay muzik pilihan menggunakan aplikasi pendamping Windows tempatan [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="supported-nzxt-kraken-lcd-models"></a>

## Model LCD NZXT Kraken Disokong

NZXT-ESC menyokong penyejuk cecair AIO NZXT Kraken yang mempunyai paparan LCD dan NZXT CAM Web Integration, termasuk model Kraken Elite, Kraken Plus, Kraken, dan Kraken Z generasi semasa dan sebelumnya.

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

NZXT-ESC secara automatik menyesuaikan reka letak mengikut resolusi, saiz, dan bentuk paparan LCD Kraken yang dilaporkan melalui API NZXT CAM, membolehkan reka letak kustom, overlay sensor, latar belakang animasi, grafik, dan media dipaparkan melalui NZXT CAM Web Integration.

<a id="quick-start"></a>
## Mula Pantas

### Buka terus dalam NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Klik **Open NZXT-ESC in NZXT CAM**.
2. Benarkan pelayar anda membuka NZXT CAM.
3. Sahkan **Load Web Integration**.
4. Buka kad Web Integration baharu dan pilih **Configure**.
5. Cipta reka letak anda; perubahan akan disegerakkan dengan paparan Kraken.

<details>
<summary><strong>Persediaan manual dalam NZXT CAM</strong></summary>

1. Buka **NZXT CAM**.
2. Pergi ke **Lighting → Kraken → LCD Display**.
3. Pilih **Web Integration**.
4. Buka tetapan **Custom Web Integration**.
5. Masukkan:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Pilih **Apply**, kemudian **Add as Card**.
7. Buka kad baharu dan pilih **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Skrin persediaan NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Menambah NZXT-ESC sebagai kad NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Lihat ia beraksi

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Preset LCD NZXT Kraken kustom yang dicipta dengan NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Reka letak paparan NZXT Kraken beranimasi dalam NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Overlay sensor NZXT CAM secara langsung pada LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Skrin LCD Kraken kustom beranimasi berjalan melalui NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Ciri-ciri

| Keupayaan | Apa yang anda perolehi |
|---|---|
| **Editor reka letak bebas bentuk** | Seret, ubah saiz, putar, lapiskan, kunci, namakan semula, dan letakkan setiap elemen dengan tepat. |
| **Data sensor NZXT CAM masa nyata** | Bina paparan CPU, GPU, RAM, suhu cecair, kuasa, frekuensi, dan kelajuan kipas kustom. |
| **Grafik lanjutan** | Gabungkan grafik sensor jenis jejari, linear, bulatan, dan sejarah dalam satu reka letak. |
| **Latar belakang beranimasi** | Gunakan warna, gradien, imej tempatan, GIF, video MP4, URL media terus, YouTube, dan sumber Pinterest. |
| **Integrasi Now Playing** | Paparkan artwork album, maklumat trek, dan visual reaktif bunyi daripada klien Windows tempatan. |
| **Explore dan Library** | Import preset komuniti, edit setiap bahagian, susun kegemaran, dan uruskan koleksi preset tempatan anda sendiri. |
| **Storan tempatan diutamakan** | Preset menggunakan LocalStorage; media tempatan menggunakan IndexedDB dan kekal di peranti anda. |
| **Editor pelbagai bahasa** | Gunakan antara muka dalam 20 bahasa yang disokong. |

### Elemen overlay

Editor semasa mengelompokkan elemen overlay kepada empat kategori yang jelas:

| Kandungan | Data | Masa | Audio |
|---|---|---|---|
| Teks | Sensor | Jam Digital | Kulit Album |
| Bentuk | Grafik Jejari | Jam Analog | Teks Now Playing |
| Ikon | Grafik Linear | Tarikh | Visualisasi Audio |
| Pelekat | Grafik Bulatan |  |  |
| Imej | Carta Sensor |  |  |

Setiap elemen menggunakan aliran kerja visual yang sama apabila boleh: pilih elemen tersebut dalam pratonton atau senarai lapisan, kemudian laraskan kedudukan, saiz, putaran, susunan, gaya, dan tetapan khusus jenisnya.

### Pemantauan perkakasan

Cipta reka letak masa nyata menggunakan data pemantauan NZXT CAM yang tersedia, termasuk:

`suhu CPU` · `beban CPU` · `frekuensi CPU` · `kuasa CPU` · `kelajuan kipas CPU` · `suhu GPU` · `beban GPU` · `frekuensi GPU` · `kuasa GPU` · `kelajuan kipas GPU` · `penggunaan RAM` · `suhu cecair`

Sistem berbilang GPU boleh memilih GPU aktif secara automatik atau menggunakan GPU tertentu. Editor pelayar juga menyediakan nilai tiruan apabila API NZXT CAM tidak tersedia, jadi reka letak masih boleh direka dan dipratonton.

### Latar belakang dan media

Gunakan warna pejal atau gradien sebagai asas, kemudian tambah media daripada:

- Fail PNG, JPG, GIF, WebP, atau MP4 tempatan
- URL imej dan video terus
- Video YouTube
- Pautan media Pinterest

Media latar belakang boleh dikedudukkan, diskalakan, disesuaikan, dan digabungkan dengan sebarang reka letak overlay. Fail tempatan disimpan dalam IndexedDB dan tidak dimuat naik oleh NZXT-ESC.

### Preset, Explore, dan Library

- Simpan dan susun sehingga **20 preset kustom** dalam Library tempatan.
- Bina setiap preset dengan sehingga **40 elemen overlay**.
- Import dan eksport fail preset yang boleh diedit untuk sandaran atau perkongsian.
- Layari reka letak buatan komuniti melalui **Explore**.
- Tambah preset Explore ke dalam Library, sesuaikan, dan jadikan ia milik anda sendiri.
- Pastikan penyuntingan dan paparan Kraken sentiasa disegerakkan merentas kedua-dua paparan NZXT CAM.

## Now Playing dan Visualisasi Audio

Klien Windows pilihan [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) berjalan secara tempatan dan menghantar data sesi media serta spektrum audio kepada NZXT-ESC melalui sambungan WebSocket tempatan.

Gunakannya untuk menambah:

- **Kulit Album** artwork semasa dengan kawalan saiz, sempadan, dan sudut
- **Teks Now Playing** tajuk, artis, atau album dengan tatal teks panjang
- **Visualisasi Audio** visual spektrum dan bentuk gelombang masa nyata yang boleh disesuaikan

Ia tidak terhad kepada Spotify sahaja. Aplikasi pendamping ini membaca sesi media Windows yang disokong serta output audio sistem daripada pelayar, pemain media, dan aplikasi lain.

<a id="languages"></a>
## Bahasa

Editor ini kini menyokong:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino` · `العربية` · `Bahasa Melayu`

**Dokumentasi terjemahan:**
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

## Privasi dan storan tempatan

NZXT-ESC direka bentuk berasaskan storan tempatan pelayar:

- Konfigurasi preset disimpan dalam **LocalStorage**.
- Imej dan video tempatan disimpan dalam **IndexedDB**.
- Bacaan sensor NZXT CAM dan preset buatan pengguna tidak dihantar kepada perkhidmatan analitik.
- Tiada maklumat peribadi yang boleh dikenal pasti dikumpul secara sengaja oleh aplikasi ini.

Laman web produksi menggunakan **Google Tag Manager** dan **Google Analytics 4** untuk analitik produk tanpa nama secara pilihan. **CookieYes** menguruskan persetujuan apabila diperlukan, dan kuki Google Analytics diaktifkan mengikut pilihan persetujuan pengguna.

Laman web yang digunakan juga menggunakan **Cloudflare Web Analytics**, yang diaktifkan melalui Cloudflare Pages dan beroperasi secara bebas daripada Google Tag Manager. Ia menyediakan analitik trafik dan prestasi laman web yang mengutamakan privasi tanpa menggunakan kuki atau LocalStorage.

### Menyumbang

Sumbangan dan pull request yang tertumpu adalah dialu-alukan. Sebelum membuat perubahan seni bina, baca:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Kod Etika](../CODE_OF_CONDUCT.md)
- [Dasar Keselamatan](../SECURITY.md)

<a id="faq"></a>
## Soalan Lazim

<details>
<summary><strong>Perlukah saya memasang NZXT-ESC?</strong></summary>

Editor teras tidak memerlukan pemasangan berasingan. Buka melalui NZXT CAM Web Integration. Hanya overlay muzik pilihan yang memerlukan klien Windows tempatan NowPlaying.WebSocket.

</details>

<details>
<summary><strong>Bolehkah NZXT-ESC berfungsi tanpa NZXT CAM?</strong></summary>

Editor boleh dibuka dalam pelayar biasa dan menggunakan nilai sensor tiruan untuk tujuan reka bentuk. Pemantauan perkakasan masa nyata dan output pada paparan Kraken memerlukan NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Model NZXT Kraken manakah yang disokong?</strong></summary>

NZXT-ESC menyokong penyejuk siri **NZXT Kraken Elite, Kraken Plus, Kraken (2023), dan Kraken Z** yang dilengkapi LCD dan menyediakan mod paparan NZXT CAM Web Integration.

Lihat senarai lengkap [Model LCD NZXT Kraken Disokong](#supported-nzxt-kraken-lcd-models).

</details>

<details>
<summary><strong>Di manakah preset dan media tempatan disimpan?</strong></summary>

Preset disimpan dalam LocalStorage pelayar. Imej dan video tempatan disimpan dalam IndexedDB. Eksport preset penting secara berkala apabila berpindah ke pelayar, pemasangan Windows, atau komputer lain.

</details>

<details>
<summary><strong>Adakah Now Playing memerlukan Spotify?</strong></summary>

Tidak. NowPlaying.WebSocket menggunakan sesi media Windows yang disokong dan audio sistem, jadi ia boleh berfungsi dengan pelayar dan aplikasi media lain yang serasi.

</details>

<details>
<summary><strong>Bolehkah preset komuniti diedit?</strong></summary>

Ya. Preset yang diimport daripada Explore boleh diedit sepenuhnya selepas ditambahkan ke dalam Library.

</details>

<details>
<summary><strong>Bagaimanakah Supporter Access berfungsi?</strong></summary>

NZXT-ESC dibangunkan dan diselenggara secara bebas. Selepas anda diberi masa yang cukup untuk benar-benar mengalami projek ini, NZXT-ESC mungkin akan bertanya sama ada anda ingin menyokong pembangunannya yang berterusan atau mengambil sedikit masa lagi untuk membuat keputusan.

Sokongan tidak semestinya bermaksud wang. Maklum balas, laporan pepijat, idea, perkongsian projek ini, membantu orang lain menemuinya, dan sumbangan komuniti bermakna yang lain semuanya membantu NZXT-ESC berkembang.

Supporter Access Code disediakan untuk penyokong projek dan juga boleh dihadiahkan kepada ahli komuniti yang menyumbang secara bermakna kepada NZXT-ESC.

Masa penggunaan hanya dikira semasa NZXT-ESC aktif berjalan pada paparan Kraken.

</details>

<a id="license"></a>
## Lesen

NZXT-ESC dikeluarkan di bawah **Lesen Penggunaan Peribadi**.

**Dibenarkan:** penggunaan peribadi, pengubahsuaian peribadi, dan pengedaran semula dengan kredit yang jelas kepada projek asal.

**Penggunaan komersial:** menjual, membundel, menyewakan, mengintegrasikan ke dalam produk berbayar, atau penggunaan lain yang diwangkan memerlukan kebenaran bertulis terlebih dahulu daripada pemilik projek.
Lihat [LICENSE untuk terma lengkap](../LICENSE).

## Sokongan dan komuniti

- **Laman web:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **Keluaran terkini:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Laporan pepijat dan idea:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

Ikuti NZXT-ESC di YouTube dan Instagram untuk tontonan pameran, ciri baharu, tutorial, persediaan komuniti, dan kemas kini projek.

Jika NZXT-ESC telah memperoleh tempat dalam persediaan anda, terdapat banyak cara untuk menyokong projek ini: kongsikan maklum balas dan idea, laporkan pepijat, bantu orang lain menemui NZXT-ESC, sumbang kepada komuniti - atau sekadar belikan saya kopi.

Setiap jenis sumbangan membantu NZXT-ESC bergerak maju, manakala sokongan kopi membantu menampung kos pelayan, API, hosting, dan penyelenggaraan.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Dibina oleh **Gökhan AKGÜL (mRGogo)** - dikuasakan oleh kopi dan jadual tidur yang meragukan.

</div>
