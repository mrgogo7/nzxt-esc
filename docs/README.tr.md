> ⚠️ This document is an automatically translated version of the main English README.
> Technical terms, code blocks, filenames, and project terminology are intentionally kept in their original form.

# NZXT Elite Screen Customizer (NZXT-ESC) v5.12 (Build 08)

NZXT Kraken Elite LCD ekranları için modern, tarayıcı tabanlı medya ve overlay editörü.

Özel animasyonlu arka planlar, metrik overlay'leri, metin katmanları, ayırıcı çizgiler ve tamamen kişiselleştirilmiş düzenler oluşturun — hepsi NZXT CAM içinde canlı olarak senkronize edilir.

Yalnızca kişisel kullanım için ücretsiz — ticari kullanım kesinlikle yasaktır.

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
## 📋 İÇİNDEKİLER

- [🚀 Hızlı Başlangıç](#-hızlı-başlangıç)
  - [Yöntem 1 — Doğrudan Başlatma (Önerilen)](#yöntem-1--doğrudan-başlatma-önerilen)
  - [Yöntem 2 — Manuel Kurulum (NZXT CAM İçinde)](#yöntem-2--manuel-kurulum-nzxt-cam-içinde)
  - [Önerilen: Entegrasyon Kartını Yeniden Adlandırma](#önerilen-entegrasyon-kartını-yeniden-adlandırma)
- [🎛 Editörü Kullanma (Yapılandır Butonu)](#-editörü-kullanma-yapılandır-butonu)
- [💡 NZXT-ESC'yi Özel Kılan Nedir?](#-nzxt-escyi-özel-kılan-nedir)
  - [1. Tasarım Odaklı Düzenleme Deneyimi](#1-tasarım-odaklı-düzenleme-deneyimi)
  - [2. Tam Eleman Tabanlı Overlay Motoru](#2-tam-eleman-tabanlı-overlay-motoru)
  - [3. Gerçek Zamanlı LCD Senkronizasyonu](#3-gerçek-zamanlı-lcd-senkronizasyonu)
  - [4. Gelişmiş Medya Motoru](#4-gelişmiş-medya-motoru)
  - [5. Preset Sistemi (Erken Erişim)](#5-preset-sistemi-erken-erişim)
- [🌍 Desteklenen Diller](#-desteklenen-diller)
- [🧪 Teknik Detaylar](#-teknik-detaylar)
- [🔧 Geliştirici Bilgileri](#-geliştirici-bilgileri)
- [🕛 Sürüm Geçmişi](#-sürüm-geçmişi)
- [🔗 Bağlantılar](#-bağlantılar)
- [📜 Lisans](#-lisans)

---
### 🚀 HIZLI BAŞLANGIÇ

NZXT-ESC, "Web Integration" özelliğini kullanarak NZXT CAM İÇİNDE çalışır. Kurmanın iki yolu vardır:

#### YÖNTEM 1 — DOĞRUDAN BAŞLATMA (ÖNERİLEN)

1. Bunu tarayıcınızın adres çubuğuna kopyalayın:
   ```text
   nzxt-cam://action/load-web-integration?url=https://mrgogo7.github.io/nzxt-esc/
   ```
2. Enter'a basın.
3. Tarayıcınız bir soru gösterecek: "nzxt-cam bağlantısını NZXT CAM ile aç?" → Onayla / İzin Ver
4. NZXT CAM otomatik olarak başlatılacaktır.
5. Bir onay penceresi göreceksiniz: Web Integration Yükle? Aşağıdaki web entegrasyonunu yüklemek istediğinizden emin misiniz?
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
   or Beta Version Now Available
   ```text
   https://nzxt-esc.pages.dev/
   ```
6. "Yükle"ye basın.
7. Yüklemeden sonra, "Custom Web Integration" kartını açın.

#### YÖNTEM 2 — MANUEL KURULUM (NZXT CAM İÇİNDE)

1. NZXT CAM'i açın.
2. Şuraya gidin: Lighting → Kraken Elite V2 → LCD Display
3. Görüntü modunu şuna değiştirin: Web Integration
4. Şu adlı kartı bulun: Custom Web Integration
5. "Settings"e tıklayın.
6. URL'yi girin:
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
7. "Apply"e basın.
8. Ardından basın: Add as Card
9. "My Web Integration" adlı yeni bir Web Integration kartı görünecektir.
10. "My Web Integration"ı seçin.
11. NZXT-ESC editörünü açmak için "Configure"a basın.

#### ÖNERİLEN: ENTEGRASYON KARTINI YENİDEN ADLANDIRMA

NZXT CAM varsayılan olarak "My Web Integration" adını atar. Yeniden adlandırmak için:
1. "My Web Integration"ı seçin.
2. "Edit"e basın.
3. Alanları şu şekilde değiştirin: Title:
   ```text
   Elite Screen Customizer
   ```
   Description:
   ```text
   NZXT Elite Screen Customizer (NZXT-ESC)
   ```
Bu, entegrasyonu diğerlerinden ayırt etmeye yardımcı olur.

---
### 🎛 EDITÖRÜ KULLANMA (YAPILANDIR BUTONU)

Tüm düzenleme işlemleri NZXT CAM İÇİNDE "Configure" butonu aracılığıyla gerçekleştirilir.

Editör içinde şunları yapabilirsiniz:

- Metrik, metin ve ayırıcı elemanlar ekleyin / kaldırın (overlay başına 20 elemana kadar)
- Konum, rotasyon, ölçek, opaklık ve renk ayarlayın
- MP4 / GIF / PNG / JPG arka plan medyası seçin
- IndexedDB aracılığıyla tarayıcıda saklanan Local Media dosyalarını kullanın
- Preset'leri yönetin (Import, Export, Duplicate, Delete, Rename, Apply)
- Overlay preset şablonlarını kullanın (Single, Dual, Triple, Quadruple InfoGraphic düzenleri)
- Replace veya Append seçenekleriyle overlay preset'lerini içe aktarın
- Quick Favorites açılır menüsü aracılığıyla favori preset'ler arasında hızlıca geçiş yapın
- Tüm değişiklikleri Kraken Elite LCD'nizde gerçek zamanlı olarak önizleyin

Artık harici URL veya config.html gerekmez.

---
### 💡 NZXT-ESC'Yİ ÖZEL KILAN NEDİR?

NZXT-ESC bir tema paketi değildir — Kraken Elite LCD için özel olarak oluşturulmuş **tam, tasarım odaklı bir düzen editörüdür**.

NZXT CAM'in yerel olarak desteklediğinin çok ötesinde tam yaratıcı özgürlük sunar.

NZXT CAM **şunlara izin vermez**:
- Serbest eleman konumlandırma  
- Eleman ölçeklendirme veya rotasyon  
- Özel metin overlay'leri  
- Şeffaf renkler  
- MP4 arka planlar  
- YouTube arka planlar  
- Pinterest URL'leri  
- Karışık medya + overlay kombinasyonları  

NZXT-ESC **bunların hepsini mümkün kılar**.

#### 1. TASARIM ODAKLI DÜZENLEME DENEYİMİ

- Serbest sürükle-bırak yerleştirme
- Eleman başına rotasyon ve ölçeklendirme
- Dairesel LCD önizlemesi etrafında transform tutamaçları
- Ok tuşu ile mikro ayarlamalar
- Minimal ve dikkat dağıtmayan arayüz
- Gerçek donanımla eşleşen doğru dairesel önizleme

#### 2. TAM ELEMAN TABANLI OVERLAY MOTORU

Eski Single/Dual/Triple modları tamamen kaldırıldı.

Artık özgürce ekleyebilirsiniz:

- Metrik elemanlar
- Metin elemanlar
- Ayırıcı elemanlar

Her eleman şunları destekler:

- X/Y konumu
- Rotasyon
- Ölçek
- Renk ve opaklık
- Seçim vurgusu

**Overlay Preset Sistemi**

Şablon seçici modalını kullanarak önceden yapılandırılmış düzenleri hızlıca uygulayın. Single, Dual, Triple veya Quadruple InfoGraphic şablonlarından seçim yapın, her biri optimize edilmiş konumlandırma ve stil ile. Şablonlar Replace (mevcut elemanların üzerine yazar) veya Append (mevcut elemanlara ekler) modlarıyla içe aktarılabilir. Ekleme yapılırken, zIndex değerleri render çakışmalarını önlemek için otomatik olarak normalize edilir. Sistem, yapılandırma başına 20 overlay elemanına kadar destekler.

#### 3. GERÇEK ZAMANLI LCD SENKRONİZASYONU

- Kararlılık için ~100ms throttle ile güncellemeler
- Manuel yenileme gerekmez
- Düzenlerken LCD ekran anında güncellenir

#### 4. GELİŞMİŞ MEDYA MOTORU

Medya motoru şunları destekler:

- MP4 video (LCD'de tam oynatma)
- GIF animasyonları
- PNG / JPG görüntüleri
- Local Media Dosyaları (IndexedDB): Bilgisayarınızdan doğrudan yüklenen tam çözünürlüklü görüntüler ve videolar
- **Pinterest URL'leri → doğrudan medyaya otomatik çözümlenir**
- **YouTube URL'leri (LCD oynatma)**


##### **🆕 Local Media Desteği (YENİ)**

NZXT-ESC artık **yerel görüntüleri veya videoları** doğrudan editöre yüklemek için yerleşik bir sistem içerir.  
Dosyalar güvenli bir şekilde **IndexedDB**'de saklanır ve cihazınızdan asla ayrılmaz.

Desteklenen dosya türleri:
- JPG / PNG / GIF  
- MP4 video  
- Maksimum boyut: **150 MB**

Temel özellikler:
- Tamamen çevrimdışı kullanım — harici hosting gerekmez  
- Rotasyon, ölçek, fit/align ve tüm transform araçlarıyla çalışır  
- Uzaktan medya ile aynı gerçek zamanlı LCD senkronizasyonu  
- Her preset bir yerel medya referansı içerebilir  
- Yerel medya dışa aktarılan preset dosyalarının **içinde yer almaz**  
- İçe aktarma sırasında, yerel medya kullanan preset'ler bir uyarı gösterecek ve yeniden seçime izin verecektir

Bu sistem, editörün transform motoruyla %100 uyumlu kalırken gerçek çevrimdışı, gizlilik dostu arka planları mümkün kılar.


**YouTube Entegrasyonu Öne Çıkanları:**

- YouTube videoları **gerçek LCD'de oynar** (otomatik oynatma/sessiz/döngü desteklenir)
- Editörün Önizlemesi, gömülü oynatıcı kısıtlamaları nedeniyle YouTube videolarını oynatamaz  
- Bunun yerine, **kırmızı sürüklenebilir bir placeholder** gösterilir  
- Kullanıcılar şunları yapabilir:
  - YouTube videosunun konumunu ayarlayabilir  
  - Videoyu ölçeklendirebilir  
  - Align/fit ayarlarını uygulayabilir  
  - Üzerine herhangi bir overlay elemanı yerleştirebilir  
- LCD her zaman gerçek zamanlı olarak nihai sonucu yansıtır  
- Tüm standart arka plan araçları YouTube ile sorunsuz çalışır

Fit modları:

- **Cover** — tüm ekranı doldurur  
- **Contain** — tam en-boy oranını korur  
- **Fill** — sığdırmak için uzatır (isteğe bağlı)  

Bu, NZXT-ESC'yi NZXT CAM için ilk tam YouTube destekli LCD editörü yapar.

#### 5. PRESET SİSTEMİ (ERKEN ERİŞİM)

Mevcut işlemler:

- Import
- Export
- Delete
- Duplicate
- Rename
- Apply

Preset'ler tam düzeni JSON olarak saklar.

**Overlay Preset Import/Export**

Overlay eleman yapılandırmalarınızı yedekleme veya paylaşma için `.nzxt-esc-overlay-preset` dosyaları olarak dışa aktarın. Doğrulama ve hata işleme ile overlay preset'lerini içe aktarın. İçe aktarırken, mevcut elemanların üzerine yazmak için Replace modunu veya mevcut olanları korurken yeni elemanlar eklemek için Append modunu seçin. İçe aktarma sistemi, şablon elemanları için otomatik ID oluşturma ve eklenen içerik için zIndex normalleştirmesi içerir.

**Quick Favorites Dropdown**

Preset Manager butonunun üzerine gelindiğinde, en fazla 10 favori preset'i (★ ile işaretli) listeleyen kompakt bir açılır menü görünür. Her giriş, preset adını, favori durumunu ve şu anda uygulanan preset için bir "aktif" göstergesini gösterir. Bir öğe seçildiğinde, tam yöneticiyle aynı atomic merge ve autosave mantığını kullanarak o preset hemen uygulanır. Açılır menü, pürüzsüz fade-in/fade-out animasyonları içerir ve tam Preset Manager arayüzünü açmak için doğrudan bir bağlantı içerir. Bu, küçük bir tercih edilen preset seti arasında sık sık geçiş yapan kullanıcılar için son derece hızlı bir iş akışı sağlar.

##### **Local Media & Presets**
- Dışa aktarılan preset dosyaları yerel medya ikili dosyasını **içermez**  
- Daha önce yerel medya kullanan bir preset'i içe aktarmak, rehberli bir uyarı gösterir  
- Kullanıcılar yeni **Browse** modalı aracılığıyla dosyayı yeniden seçebilir  
- Tüm mevcut preset işlevleri (Apply, Duplicate, Rename, Delete) yerel medya referanslarını tam olarak destekler  
- Preset'ler arasında geçiş yapmak, IndexedDB'den uygun yerel medyayı otomatik olarak yükler (varsa)

---
### 🌍 DESTEKLENEN DİLLER

NZXT-ESC, yerelleştirilmiş bir kullanıcı deneyimi için birden fazla dili destekler. Editör başlığındaki dil seçiciyi kullanarak diller arasında geçiş yapın.

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

Tüm çeviriler kolay yönetim ve güncellemeler için tek bir TypeScript dosyasında tutulur.

---
### 🧪 TEKNİK DETAYLAR

- React 18
- TypeScript
- Vite bundler
- LocalStorage sync + event broadcasting
- Dairesel LCD farkında render motoru
- AABB + rotasyon transform matematiği
- Şablon tabanlı eleman oluşturma ile overlay preset sistemi
- Otomatik ID atama ve zIndex normalleştirme
- Çok dilli UI desteği (English, Turkish, Spanish, German, Portuguese, French, Italian, Japanese)

---
### 🔧 GELİŞTİRİCİ BİLGİLERİ

Klonlama ve Kurulum:

```bash
git clone https://github.com/mrgogo7/nzxt-esc
cd nzxt-esc
npm install
```

Geliştirme Sunucusunu Başlat:

```bash
npm run dev
```

NZXT CAM testi için LAN'da aç:

```bash
npm run dev -- --host
```

Derleme:

```bash
npm run build
```

Derlemeyi önizle:

```bash
npm run preview
```

**Contributing:**

- Büyük değişikliklere başlamadan önce bir Issue açın
- PR'ları küçük ve odaklı tutun
- Net commit mesajları kullanın
- Proje yapısını takip edin

---
### 🕛 SÜRÜM GEÇMİŞİ

#### 5.11.261 — Local Media Desteği + Editör İyileştirmeleri (YENİ)

**Yayın Tarihi:** 2025-11-26

##### 🆕 YENİ ÖZELLİKLER
- **Local Media Arka Planları (IndexedDB)**
  - Bilgisayarınızdan doğrudan JPG, PNG, GIF veya MP4 içe aktarın  
  - Dosyalar IndexedDB aracılığıyla güvenli bir şekilde saklanır  
  - Çevrimdışı çalışır  
  - Tüm fit/scale/align transform modlarıyla uyumludur  
  - Kraken LCD'ye gerçek zamanlı olarak tam senkronize edilir  
  - URL alanı çok dilli formatta `Local: filename.ext` gösterir  

##### 💡 Preset Sistemi İyileştirmeleri
- Yerel medya içeren preset'leri dışa aktarmak bir uyarı tetikler (medya dahil değil)  
- Bu tür preset'leri içe aktarmak bir yeniden seçim mesajı gösterir  
- Preset geçişi, varsa yerel medyayı otomatik olarak yükler  

##### 🖥 UI İYİLEŞTİRMELERİ
- Yerel medya seçmek için yeni Browse modalı  
- Tüm yerel medya mesajları için tam çok dilli destek  
- Yeni buton ikonu + güncellenmiş stil  

##### 🧩 KARARLILIK İYİLEŞTİRMELERİ
- Geliştirilmiş medya çözümleme pipeline'ı  
- Sızıntıları önlemek için Blob iptali + temizlik  
- Daha iyi hata işleme ve i18n kapsamı  

#### 5.11.26 — Kraken LCD Gerçek Zamanlı Senkronizasyon Yenilemesi & Overlay Kararlılık İyileştirmeleri

**Ek Not:**  
- Yeni placeholder tabanlı Önizleme sistemi kullanılarak tam konumlandırma/ölçek hizalaması ile **YouTube arka plan desteği** (LCD oynatma) tanıtıldı.  
- Birleşik transform matematiği, orantılı Önizleme ↔ LCD hizalamasını sağlar.

#### 5.11.241 — Kraken LCD Gerçek Zamanlı Senkronizasyon Yenilemesi & Overlay Kararlılık İyileştirmeleri

**Yayın Tarihi:** 2025-11-24

##### 🔧 Büyük Sistem İyileştirmeleri

- **Kraken LCD Gerçek Zamanlı Senkronizasyon Yenilemesi**  
  Gerçek zamanlı LCD senkronizasyonu yeni tanıtılmadı, ancak tüm dahili sistem yeniden inşa edildi. Önceki uygulama, preset yeniden yükleme döngülerine dayanıyordu ve gecikmelere, kaçırılan güncellemelere ve geri dönüş davranışlarına neden oluyordu. Yeni BroadcastChannel tabanlı çapraz sekme senkronizasyon mimarisi, kararlı, düşük gecikmeli, kare senkronize güncelleme akışı sağlar.

##### 🛠 İyileştirmeler

- **Overlay render güvenilirliği iyileştirmeleri**  
  Runtime overlay durumu boş olduğunda, sistem artık saklanan preset overlay verilerine güvenli bir şekilde geri döner.

- **Arka plan/medya kararlılık yükseltmesi**  
  Girdi değişikliklerinde transform geri dönüşü kaldırıldı.

- **KrakenOverlay görüntüleyici optimizasyonu**  
  Artık preset'leri yeniden yüklemez; anında güncellemeler için doğrudan runtime değişikliklerini dinler.

##### 🐞 Hata Düzeltmeleri

- Gecikmeli LCD güncellemeleri düzeltildi (önceden yalnızca sürükleme sonunda güncelleniyordu).

- Yenilemeden sonra Kraken görünümünde eksik overlay'ler düzeltildi.

- Overlay preset'leri eklerken yinelenen React key uyarıları düzeltildi.

- Ayarlamalar sırasında medya/arka plan ayarlarının geri dönmesi düzeltildi.

##### ⚙ Mimari Değişiklikler

- Sekmeler arası iletişim için özel bir `runtimeBroadcast.ts` modülü tanıtıldı.

- Yayın döngüleri olmadan güvenli runtime güncellemeleri için `setElementsForPresetSilent()` eklendi.

- `useOverlayConfig()` krakenMode + storage geri dönüşünü düzgün şekilde işleyecek şekilde güncellendi.

- Tüm overlay güncelleme kaynakları tek bir runtime odaklı pipeline'a birleştirildi.

##### 📁 Geliştirici Notları

- BroadcastChannel desteklenmiyorsa zarif bir şekilde geri döner.

- Runtime güncellemeleri mutasyon sorunlarını önlemek için senkronizasyondan önce derinlemesine klonlanır.

- Bu sürüm, eski senkronizasyon mimarisini modern, kararlı, gerçek zamanlı bir pipeline ile değiştirir.

#### v5.11.24

- Overlay & Preset Manager Kalite Yükseltme Paketi
- Yeni Overlay Export Modal: Export artık temiz bir modal kullanarak bir dosya adı ister (ENTER tuşunu destekler)
- Yeni Preset Butonu: Varsayılan değerlerle tamamen yeni boş bir preset anında oluşturur
- Geliştirilmiş Preset Manager UI: Preset işlem butonları yeniden sıralandı: Delete → Favorite → Duplicate → Rename → Apply
- Geliştirilmiş Overlay Yönetimi:
  - "Clear All Overlay Elements" artık bir onay modalı kullanır
  - Delete tuşu seçili elemanı kaldırır (onay modalı ile)
  - Tüm silme butonları için tooltip desteği eklendi
- Global Modal Kullanılabilirlik Yükseltmeleri: Tüm modallar artık ENTER tuşu ile onaylamayı destekler
- Overlay Preset Append için ID Çakışması Düzeltmesi: Ekleme sırasında eleman ID'lerini yeniden oluşturarak yinelenen React key sorunu tamamen çözüldü
- Genel Kararlılık İyileştirmeleri: Runtime mimarisi korundu, autosave kurallarına uyuldu ve tüm FAZ-9 kısıtlamaları geçerli kaldı

#### v5.11.23

- Şablon seçici modalı ile overlay preset sistemi
- Single, Dual, Triple ve Quadruple InfoGraphic şablonları
- Replace ve Append modları ile overlay preset import/export
- Eleman limiti overlay başına 20'ye çıkarıldı
- Eklenen şablonlar için otomatik zIndex normalleştirme
- Şablon tanımlarından dinamik şablon listesi oluşturma
- Import/export işlemleri için geliştirilmiş hata bildirimleri
- Görünüm alanı farkında menü konumlandırma iyileştirmeleri

#### v5.11.21

- Eleman tabanlı düzen motoru
- Rotasyon ve ölçek transform sistemi
- Seçim vurgusu
- Ok tuşu hareketi
- Eski modlar kaldırıldı
- Tam preset yöneticisi (Import/Export/Duplicate/Delete/Rename/Apply)
- Anında preset geçişi için Quick Favorites açılır menüsü
- UX ve kararlılık iyileştirmeleri

Eski sürümler için GitHub Releases'a bakın.

---
### 🔗 BAĞLANTILAR

Repository: https://github.com/mrgogo7/nzxt-esc/

Support: [GitHub Sponsors](https://github.com/sponsors/mrgogo7) • [Patreon](https://www.patreon.com/mRGogo7) • [Buy Me a Coffee](https://www.buymeacoffee.com/mrgogo)

Issues:

https://github.com/mrgogo7/nzxt-esc/issues

---
### 📜 LİSANS

Kişisel Kullanım Lisansı

**İzin Verilen:** Kişisel kullanım • Kişisel değişiklikler • Kredi ile yeniden dağıtım

**İzin Verilmeyen:** Ticari kullanım • Herhangi bir şekilde satış, paketleme, kiralama veya para kazanma

NZXT-ESC yalnızca kişisel kullanım için tasarlanmış bir hobi ve topluluk odaklı projedir.

<details>
<summary><strong>📁 Tam SEO Anahtar Kelime Dizini (Genişletmek için Tıklayın)</strong></summary>

**nzxt kraken elite lcd editor, nzxt cam customization, nzxt web integration custom, nzxt animated lcd background, mp4 lcd background nzxt, youtube kraken elite lcd, nzxt gif overlay, nzxt overlay editor, custom lcd screen nzxt, nzxt cam alternatives, nzxt cam limitations, kraken elite custom display, nzxt lcd text editor, nzxt lcd metrics overlay, nzxt lcd mods, nzxt pinterest background, nzxt lcd media engine, nzxt-esc project, nzxt cam modding, nzxt kraken elite youtube support, custom nzxt layouts, nzxt cam web integration presets, nzxt overlay templates, nzxt custom ui editor, nzxt lcd graphics editor, nzxt real-time lcd sync, kraken elite advanced customization, nzxt cam mp4 support, nzxt cam gif support, nzxt cam youtube embed, nzxt cam background editor**

</details>

