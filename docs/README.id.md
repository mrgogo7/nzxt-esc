# NZXT-ESC

### Editor tata letak dan kustomisasi layar tingkat lanjut untuk NZXT Kraken AIO

Buat tata letak LCD NZXT Kraken yang sepenuhnya dapat diedit dengan overlay sensor seret-lepas, font kustom, gambar, GIF, video MP4, jam, grafik, data Now Playing, dan visual reaktif suara yang dirender langsung melalui **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Buka di NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Buka editor web](https://nzxt-esc.pages.dev/)
· [Fitur](#features)
· [Mulai cepat](#quick-start)
· [FAQ](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Editor tata letak LCD NZXT Kraken seret-lepas dari NZXT-ESC"
       width="70%" />

> [!NOTE]
> **NZXT-ESC adalah proyek komunitas independen.** Proyek ini tidak berafiliasi, disponsori, atau didukung oleh NZXT.

## Kustomisasi LCD NZXT Kraken tanpa tata letak tetap

NZXT-ESC mengubah layar NZXT Kraken menjadi kanvas bebas. Bangun layar LCD kustom dengan menempatkan setiap sensor, grafik, jam, gambar, atau elemen media tepat di lokasi yang Anda inginkan. Ubah ukuran, putar, susun ulang, ganti nama, kunci, dan beri gaya pada elemen sambil melihat hasilnya diperbarui secara langsung melalui NZXT CAM.

Editor utama **tidak memerlukan akun** dan **tidak memerlukan instalasi terpisah untuk pengguna akhir**. Preset dan media lokal tetap berada di penyimpanan browser. Overlay musik opsional menggunakan aplikasi pendamping Windows lokal [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="quick-start"></a>
## Mulai cepat

### Buka langsung di NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Klik **Open NZXT-ESC in NZXT CAM**.
2. Izinkan browser membuka NZXT CAM.
3. Konfirmasikan **Load Web Integration**.
4. Buka kartu Web Integration baru lalu pilih **Configure**.
5. Buat tata letak Anda; perubahan akan disinkronkan dengan layar Kraken.

<details>
<summary><strong>Pengaturan manual di dalam NZXT CAM</strong></summary>

1. Buka **NZXT CAM**.
2. Masuk ke **Lighting → Kraken → LCD Display**.
3. Pilih **Web Integration**.
4. Buka pengaturan **Custom Web Integration**.
5. Masukkan:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Pilih **Apply**, lalu **Add as Card**.
7. Buka kartu baru lalu pilih **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Layar pengaturan NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Menambahkan NZXT-ESC sebagai kartu NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Lihat saat digunakan

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Preset LCD NZXT Kraken kustom yang dibuat dengan NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Tata letak layar NZXT Kraken animasi di NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Overlay sensor NZXT CAM langsung pada LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Layar LCD Kraken kustom dan animasi melalui NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Fitur

| Kemampuan | Manfaat untuk Anda |
|---|---|
| **Editor tata letak bebas** | Seret, ubah ukuran, putar, susun lapisan, kunci, ganti nama, dan tempatkan setiap elemen secara presisi. |
| **Data sensor NZXT CAM langsung** | Buat tampilan kustom untuk CPU, GPU, RAM, suhu cairan, daya, frekuensi, dan kecepatan kipas. |
| **Grafik tingkat lanjut** | Gabungkan grafik sensor radial, linear, melingkar, dan historis dalam satu tata letak. |
| **Latar belakang animasi** | Gunakan warna, gradien, gambar lokal, GIF, video MP4, URL media langsung, YouTube, dan Pinterest. |
| **Integrasi Now Playing** | Tampilkan sampul album, informasi lagu, dan visual reaktif suara dari klien Windows lokal. |
| **Explore dan Library** | Impor preset komunitas, edit setiap bagian, atur favorit, dan kelola koleksi lokal Anda sendiri. |
| **Penyimpanan lokal sebagai prioritas** | Preset menggunakan LocalStorage; media lokal menggunakan IndexedDB dan tetap berada di perangkat Anda. |
| **Editor multibahasa** | Gunakan antarmuka dalam 18 bahasa yang didukung. |

### Elemen overlay

Editor saat ini mengelompokkan elemen overlay ke dalam empat kategori yang jelas:

| Konten | Data | Waktu | Audio |
|---|---|---|---|
| Teks | Sensor | Jam digital | Sampul album |
| Bentuk | Grafik radial | Jam analog | Teks Now Playing |
| Ikon | Grafik linear | Tanggal | Visualisator audio |
| Stiker | Grafik lingkaran |  |  |
| Gambar | Grafik sensor |  |  |

Jika memungkinkan, semua elemen menggunakan alur kerja visual yang sama: pilih elemen di pratinjau atau daftar lapisan, lalu sesuaikan posisi, ukuran, rotasi, urutan, gaya, dan pengaturan khusus jenisnya.

### Pemantauan perangkat keras

Buat tata letak langsung menggunakan data pemantauan NZXT CAM yang tersedia, termasuk:

`suhu CPU` · `beban CPU` · `frekuensi CPU` · `daya CPU` · `kecepatan kipas CPU` · `suhu GPU` · `beban GPU` · `frekuensi GPU` · `daya GPU` · `kecepatan kipas GPU` · `penggunaan RAM` · `suhu cairan`

Sistem dengan beberapa GPU dapat memilih GPU aktif secara otomatis atau menggunakan GPU tertentu. Editor browser juga menyediakan nilai simulasi saat API NZXT CAM tidak tersedia, sehingga tata letak tetap dapat dirancang dan dipratinjau.

### Latar belakang dan media

Gunakan warna solid atau gradien sebagai dasar, lalu tambahkan media dari:

- File PNG, JPG, GIF, WebP, atau MP4 lokal
- URL gambar dan video langsung
- Video YouTube
- Tautan media Pinterest

Media latar belakang dapat diposisikan, diskalakan, disesuaikan, dan digabungkan dengan tata letak overlay apa pun. File lokal disimpan di IndexedDB dan tidak diunggah oleh NZXT-ESC.

### Preset, Explore, dan Library

- Simpan dan atur hingga **20 preset kustom** di Library lokal.
- Buat setiap preset dengan hingga **40 elemen overlay**.
- Impor dan ekspor file preset yang dapat diedit untuk cadangan atau berbagi.
- Jelajahi tata letak buatan komunitas melalui **Explore**.
- Tambahkan preset Explore ke Library, sesuaikan, dan jadikan milik Anda.
- Pertahankan sinkronisasi pengeditan dan rendering Kraken di antara dua tampilan NZXT CAM.

## Now Playing dan visualisator audio

Klien Windows opsional [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) berjalan secara lokal dan mengirim data sesi media serta spektrum audio ke NZXT-ESC melalui koneksi WebSocket lokal.

Gunakan untuk menambahkan:

- **Sampul album** ilustrasi saat ini dengan kontrol ukuran, bingkai, dan sudut
- **Teks Now Playing** judul, artis, atau album dengan pengguliran teks panjang
- **Visualisator audio** visual spektrum dan bentuk gelombang waktu nyata yang dapat disesuaikan

Integrasi ini tidak terbatas pada Spotify. Aplikasi pendamping membaca sesi media Windows yang didukung dan keluaran audio sistem dari browser, pemutar media, dan aplikasi lain.

<a id="languages"></a>
## Bahasa

Editor saat ini mendukung:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

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
[Filipino](README.fil.md)

## Privasi dan penyimpanan lokal

NZXT-ESC dirancang dengan penyimpanan lokal browser sebagai dasar:

- Konfigurasi preset disimpan di **LocalStorage**.
- Gambar dan video lokal disimpan di **IndexedDB**.
- Pembacaan sensor NZXT CAM dan preset buatan pengguna tidak dikirim ke layanan analitik.
- Aplikasi tidak sengaja mengumpulkan informasi identitas pribadi.

Situs produksi menggunakan **Google Tag Manager** dan **Google Analytics 4** untuk analitik produk anonim. **CookieYes** mengelola persetujuan jika diperlukan, dan cookie analitik opsional diaktifkan sesuai pilihan persetujuan pengguna. Build pengembangan tidak memerlukan layanan analitik produksi.

## Pengembangan

### Jalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Editor menggunakan data perangkat keras simulasi saat NZXT CAM tidak tersedia.

```bash
npm run build   # Periksa tipe dan buat build produksi
npm test        # Jalankan pemeriksaan i18n dan rangkaian uji Vitest
```

### Arsitektur

<details>
<summary><strong>Struktur proyek dan prinsip desain</strong></summary>

```text
src/
├─ core/       Kontrak domain preset, overlay, elemen, dan latar belakang
├─ render/     Mesin bersama dari preset ke model render
├─ storage/    Status LocalStorage, impor/ekspor, dan media IndexedDB
├─ platform/   Adaptor NZXT CAM dan aplikasi pendamping lokal
├─ sync/       Sinkronisasi editor/runtime
├─ i18n/       Pesan bahasa bertipe dan utilitas terjemahan
└─ ui/
   ├─ config/  Editor konfigurasi seret-lepas
   ├─ kraken/  Runtime ringan untuk layar Kraken
   └─ shared/  Komponen antarmuka yang dapat digunakan kembali
```

Pratinjau editor dan runtime Kraken menggunakan pipeline render kanonis yang sama. Mesin bersama ini menjaga tata letak, gaya, dan perilaku transformasi tetap konsisten antara desain pengguna dan hasil pada layar fisik.

Data preset dinormalisasi sebelum disimpan, impor/ekspor memiliki versi, dan pembaruan editor disinkronkan melalui `BroadcastChannel` dengan `localStorage` sebagai fallback.

</details>

### Berkontribusi

Kontribusi dan pull request yang terfokus sangat diterima. Sebelum membuat perubahan arsitektur, baca:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Kode Etik](../CODE_OF_CONDUCT.md)
- [Kebijakan Keamanan](../SECURITY.md)

<a id="faq"></a>
## FAQ

<details>
<summary><strong>Apakah saya perlu menginstal NZXT-ESC?</strong></summary>

Editor utama tidak memerlukan instalasi terpisah. Buka melalui NZXT CAM Web Integration. Hanya overlay musik opsional yang memerlukan klien Windows lokal NowPlaying.WebSocket.

</details>

<details>
<summary><strong>Apakah NZXT-ESC dapat digunakan tanpa NZXT CAM?</strong></summary>

Editor dapat dibuka di browser biasa dan menggunakan nilai sensor simulasi untuk desain. Pemantauan perangkat keras langsung dan keluaran ke layar Kraken memerlukan NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Model NZXT Kraken mana yang didukung?</strong></summary>

NZXT-ESC dirancang untuk perangkat NZXT Kraken yang mendukung mode tampilan NZXT CAM Web Integration. Ukuran dan bentuk layar yang tersedia ditentukan melalui API NZXT CAM.

</details>

<details>
<summary><strong>Di mana preset dan media lokal disimpan?</strong></summary>

Preset disimpan di LocalStorage browser. Gambar dan video lokal disimpan di IndexedDB. Ekspor preset penting secara berkala saat berpindah browser, instalasi Windows, atau komputer.

</details>

<details>
<summary><strong>Apakah Now Playing memerlukan Spotify?</strong></summary>

Tidak. NowPlaying.WebSocket menggunakan sesi media Windows yang didukung dan audio sistem, sehingga dapat bekerja dengan browser dan aplikasi media lain yang kompatibel.

</details>

<details>
<summary><strong>Apakah preset komunitas dapat diedit?</strong></summary>

Ya. Preset yang diimpor dari Explore dapat diedit sepenuhnya setelah ditambahkan ke Library.

</details>

<a id="license"></a>
## Lisensi

NZXT-ESC dirilis berdasarkan **Lisensi Penggunaan Pribadi**.

**Diizinkan:** penggunaan pribadi, modifikasi pribadi, dan distribusi ulang dengan kredit yang jelas kepada proyek asli.

**Penggunaan komersial:** penjualan, bundling, penyewaan, integrasi ke produk berbayar, atau penggunaan yang menghasilkan pendapatan lainnya memerlukan izin tertulis sebelumnya dari pemilik proyek.
Lihat [LICENSE untuk ketentuan lengkap](../LICENSE).

## Dukungan dan tautan

- **Situs web:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **Rilis terbaru:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Laporan bug dan ide:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **Aplikasi pendamping:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

<div align="center">

Jika NZXT-ESC meningkatkan setup Anda, Anda dapat mendukung pengembangannya:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Dibuat oleh **Gökhan AKGÜL (mRGogo)** — ditenagai kopi dan jadwal tidur yang meragukan.

</div>
