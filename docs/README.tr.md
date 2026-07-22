# NZXT-ESC

### NZXT Kraken AIO için Gelişmiş Ekran Özelleştirme Düzen Editörü

Sürükle-bırak sensör katmanları, özel yazı tipleri, görseller, GIF ve MP4 videolar, saatler, grafikler, Şimdi Çalıyor verileri ve sese duyarlı görsellerle tamamen düzenlenebilir NZXT Kraken LCD tasarımları oluşturun; sonuçları **NZXT CAM Web Integration** üzerinden canlı görüntüleyin.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[NZXT CAM’de Aç](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Web Editörünü Aç](https://nzxt-esc.pages.dev/)
· [Özellikler](#features)
· [Hızlı Başlangıç](#quick-start)
· [SSS](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESC sürükle-bırak NZXT Kraken LCD düzen editörü"
       width="70%" />

> [!NOTE]
> **NZXT-ESC bağımsız bir topluluk projesidir.** NZXT ile bağlantılı değildir; NZXT tarafından desteklenmez, sponsor olunmaz veya onaylanmaz.

NZXT-ESC kurulumunuzu daha iyi hale getirdiyse geliştirme çalışmalarını destekleyebilirsiniz:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## Sabit düzenler olmadan NZXT Kraken LCD özelleştirmesi

NZXT-ESC, NZXT Kraken ekranını serbest biçimli bir tasarım alanına dönüştürür. Her sensörü, grafiği, saati, görseli veya medya öğesini tam istediğiniz noktaya yerleştirerek özel bir LCD ekran oluşturun. Öğeleri yeniden boyutlandırın, döndürün, sıralayın, yeniden adlandırın, kilitleyin ve biçimlendirin; sonucu NZXT CAM üzerinden anında izleyin.

Ana editör için **hesap gerekmez** ve **son kullanıcıya yönelik ayrı bir kurulum yoktur**. Preset’ler ve yerel medya tarayıcı depolamasında kalır. İsteğe bağlı müzik katmanları, yerel [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) Windows yardımcı uygulamasını kullanır.

<a id="quick-start"></a>
## Hızlı Başlangıç

### Doğrudan NZXT CAM’de açın

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. **Open NZXT-ESC in NZXT CAM** düğmesine tıklayın.
2. Tarayıcınızın NZXT CAM’i açmasına izin verin.
3. **Load Web Integration** onayını verin.
4. Yeni Web Integration kartını açın ve **Configure** seçeneğini seçin.
5. Tasarımınızı oluşturun; değişiklikler Kraken ekranıyla eşzamanlanır.

<details>
<summary><strong>NZXT CAM içinde manuel kurulum</strong></summary>

1. **NZXT CAM** uygulamasını açın.
2. **Lighting → Kraken → LCD Display** bölümüne gidin.
3. **Web Integration** seçeneğini seçin.
4. **Custom Web Integration** ayarlarını açın.
5. Şu adresi girin:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Önce **Apply**, ardından **Add as Card** seçeneğini seçin.
7. Yeni kartı açın ve **Configure** seçeneğini seçin.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="NZXT CAM Web Integration kurulum ekranı"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="NZXT-ESC uygulamasını NZXT CAM Web Integration kartı olarak ekleme"
       width="48%" />
</p>

</details>

## Çalışırken görün

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="NZXT-ESC ile oluşturulmuş özel NZXT Kraken LCD preset’i"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="NZXT-ESC içinde animasyonlu NZXT Kraken ekran düzeni"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Kraken LCD üzerinde canlı NZXT CAM sensör katmanı"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="NZXT CAM üzerinden çalışan özel animasyonlu Kraken LCD ekranı"
       width="48%" />
</p>

<a id="features"></a>
## Özellikler

| Yetenek | Size ne sağlar? |
|---|---|
| **Serbest biçimli düzen editörü** | Her öğeyi sürükleyin, yeniden boyutlandırın, döndürün, katmanlayın, kilitleyin, yeniden adlandırın ve hassas biçimde konumlandırın. |
| **Canlı NZXT CAM sensör verileri** | CPU, GPU, RAM, sıvı sıcaklığı, güç, frekans ve fan hızı için özel ekranlar oluşturun. |
| **Gelişmiş grafikler** | Radyal, doğrusal, dairesel ve geçmiş sensör grafiklerini tek tasarımda birleştirin. |
| **Animasyonlu arka planlar** | Renkler, degradeler, yerel görseller, GIF’ler, MP4 videolar, doğrudan medya URL’leri, YouTube ve Pinterest kaynaklarını kullanın. |
| **Şimdi Çalıyor entegrasyonu** | Yerel Windows istemcisinden albüm kapağı, parça bilgileri ve sese duyarlı görseller gösterin. |
| **Explore ve Library** | Topluluk preset’lerini içe aktarın, her bölümünü düzenleyin, favorileri yönetin ve kendi yerel preset koleksiyonunuzu oluşturun. |
| **Önce yerel depolama** | Preset’ler LocalStorage kullanır; yerel medya IndexedDB’de tutulur ve cihazınızdan ayrılmaz. |
| **Çok dilli editör** | Arayüzü desteklenen 18 dilde kullanın. |

### Overlay öğeleri

Güncel editör, overlay öğelerini dört anlaşılır kategoride gruplandırır:

| İçerik | Veri | Zaman | Ses |
|---|---|---|---|
| Metin | Sensör | Dijital Saat | Albüm Kapağı |
| Şekil | Radyal Grafik | Analog Saat | Şimdi Çalıyor Metni |
| İkon | Doğrusal Grafik | Tarih | Ses Görselleştirici |
| Çıkartma | Daire Grafik |  |  |
| Görsel | Sensör Grafiği |  |  |

Mümkün olan her yerde tüm öğeler aynı görsel çalışma akışını kullanır: öğeyi önizlemede veya katman listesinde seçin; ardından konumunu, boyutunu, dönüşünü, sırasını, stilini ve türe özel ayarlarını değiştirin.

### Donanım izleme

Kullanılabilir NZXT CAM izleme verileriyle canlı tasarımlar oluşturun:

`CPU sıcaklığı` · `CPU yükü` · `CPU frekansı` · `CPU gücü` · `CPU fan hızı` · `GPU sıcaklığı` · `GPU yükü` · `GPU frekansı` · `GPU gücü` · `GPU fan hızı` · `RAM kullanımı` · `sıvı sıcaklığı`

Çoklu GPU sistemleri etkin GPU’yu otomatik seçebilir veya belirli bir GPU kullanılabilir. NZXT CAM API erişilemediğinde tarayıcı editörü örnek değerler sağlar; böylece tasarımlar yine hazırlanabilir ve önizlenebilir.

### Arka planlar ve medya

Temel katman olarak düz bir renk veya degrade kullanın, ardından şu kaynaklardan medya ekleyin:

- Yerel PNG, JPG, GIF, WebP veya MP4 dosyaları
- Doğrudan görsel ve video URL’leri
- YouTube videoları
- Pinterest medya bağlantıları

Arka plan medyası konumlandırılabilir, ölçeklenebilir, ekrana uydurulabilir ve herhangi bir overlay düzeniyle birleştirilebilir. Yerel dosyalar IndexedDB’de saklanır ve NZXT-ESC tarafından yüklenmez.

### Preset’ler, Explore ve Library

- Yerel Library içinde en fazla **20 özel preset** kaydedin ve düzenleyin.
- Her preset’i en fazla **40 overlay öğesiyle** oluşturun.
- Yedekleme veya paylaşım için düzenlenebilir preset dosyalarını içe ve dışa aktarın.
- Topluluk tarafından hazırlanmış tasarımlara **Explore** üzerinden göz atın.
- Bir Explore preset’ini Library’ye ekleyin, özelleştirin ve kendinize ait hale getirin.
- Düzenleme ve Kraken görüntülemesini iki NZXT CAM görünümü arasında eşzamanlı tutun.

## Şimdi Çalıyor ve Ses Görselleştirici

İsteğe bağlı [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) Windows istemcisi yerel olarak çalışır ve medya oturumu ile ses spektrumu verilerini yerel bir WebSocket bağlantısı üzerinden NZXT-ESC’ye gönderir.

Şunları eklemek için kullanabilirsiniz:

- **Albüm Kapağı** boyut, kenarlık ve köşe kontrolleriyle güncel kapak görseli
- **Şimdi Çalıyor Metni** uzun metin kaydırma özelliğiyle parça adı, sanatçı veya albüm bilgisi
- **Ses Görselleştirici** özelleştirilebilir gerçek zamanlı spektrum ve dalga biçimi görselleri

Yalnızca Spotify ile sınırlı değildir. Yardımcı uygulama; tarayıcılar, medya oynatıcılar ve diğer uygulamalardaki desteklenen Windows medya oturumlarını ve sistem ses çıkışını okuyabilir.

<a id="languages"></a>
## Diller

Editör şu anda şu dilleri desteklemektedir:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**Çevrilmiş dokümantasyon:**
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

## Gizlilik ve yerel depolama

NZXT-ESC, yerel tarayıcı depolaması temel alınarak tasarlanmıştır:

- Preset yapılandırmaları **LocalStorage** içinde saklanır.
- Yerel görseller ve videolar **IndexedDB** içinde saklanır.
- NZXT CAM sensör değerleri ve kullanıcı tarafından oluşturulan preset’ler analitik sistemlerine gönderilmez.
- Uygulama tarafından kişiyi tanımlayan bilgiler bilinçli olarak toplanmaz.

Üretim sitesi, anonim ürün analitiği için **Google Tag Manager** ve **Google Analytics 4** kullanır. **CookieYes**, gerekli olduğu durumlarda kullanıcı onayını yönetir; isteğe bağlı analitik çerezleri kullanıcının izin tercihlerine göre etkinleştirilir. Geliştirme derlemeleri üretim analitik hizmetlerine ihtiyaç duymaz.

## Geliştirme

### Yerel olarak çalıştırma

```bash
npm install
npm run dev
```

`http://localhost:5173` adresini açın. NZXT CAM kullanılamadığında editör örnek donanım verileri kullanır.

```bash
npm run build   # Tür denetimi yap ve üretim derlemesi oluştur
npm test        # i18n kontrollerini ve Vitest test paketini çalıştır
```

### Mimari

<details>
<summary><strong>Proje yapısı ve tasarım ilkeleri</strong></summary>

```text
src/
├─ core/       Preset, overlay, öğe ve arka plan alan sözleşmeleri
├─ render/     Paylaşılan preset-to-render-model motoru
├─ storage/    LocalStorage durumu, içe/dışa aktarma ve IndexedDB medyası
├─ platform/   NZXT CAM ve yerel yardımcı uygulama adaptörleri
├─ sync/       Editör/çalışma zamanı eşzamanlaması
├─ i18n/       Tür güvenli yerel dil mesajları ve çeviri yardımcıları
└─ ui/
   ├─ config/  Sürükle-bırak yapılandırma editörü
   ├─ kraken/  Hafif Kraken ekran çalışma zamanı
   └─ shared/  Yeniden kullanılabilir arayüz bileşenleri
```

Editör önizlemesi ve Kraken çalışma zamanı aynı kanonik render hattını kullanır. Bu ortak motor, kullanıcının tasarladığı görünüm ile fiziksel ekranda görünen sonuç arasında düzen, stil ve dönüşüm davranışının tutarlı kalmasını sağlar.

Preset verileri depolamadan önce normalize edilir, içe/dışa aktarma sürümlenir ve editör güncellemeleri `localStorage` yedek yöntemiyle birlikte `BroadcastChannel` üzerinden eşzamanlanır.

</details>

### Katkıda bulunma

Katkılar ve odaklı pull request’ler memnuniyetle karşılanır. Mimari değişiklik yapmadan önce şunları okuyun:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Davranış Kuralları](../CODE_OF_CONDUCT.md)
- [Güvenlik Politikası](../SECURITY.md)

<a id="faq"></a>
## Sık Sorulan Sorular

<details>
<summary><strong>NZXT-ESC’yi yüklemem gerekiyor mu?</strong></summary>

Ana editör ayrı bir kurulum gerektirmez. NZXT CAM Web Integration üzerinden açabilirsiniz. Yalnızca isteğe bağlı müzik overlay’leri yerel NowPlaying.WebSocket Windows istemcisini gerektirir.

</details>

<details>
<summary><strong>NZXT-ESC, NZXT CAM olmadan çalışır mı?</strong></summary>

Editör normal bir tarayıcıda açılabilir ve tasarım için örnek sensör değerleri kullanır. Canlı donanım izleme ve Kraken ekranına görüntü aktarımı için NZXT CAM Web Integration gerekir.

</details>

<details>
<summary><strong>Hangi NZXT Kraken modelleri destekleniyor?</strong></summary>

NZXT-ESC, NZXT CAM Web Integration ekran modunu destekleyen NZXT Kraken cihazları için tasarlanmıştır. Kullanılabilir ekran boyutu ve şekli NZXT CAM API üzerinden belirlenir.

</details>

<details>
<summary><strong>Preset’ler ve yerel medya nerede saklanır?</strong></summary>

Preset’ler tarayıcının LocalStorage alanında, yerel görseller ve videolar ise IndexedDB’de saklanır. Başka bir tarayıcıya, Windows kurulumuna veya bilgisayara geçerken önemli preset’leri düzenli olarak dışa aktarın.

</details>

<details>
<summary><strong>Şimdi Çalıyor özelliği Spotify gerektirir mi?</strong></summary>

Hayır. NowPlaying.WebSocket desteklenen Windows medya oturumlarını ve sistem sesini kullanır; bu nedenle tarayıcılar ve diğer uyumlu medya uygulamalarıyla çalışabilir.

</details>

<details>
<summary><strong>Topluluk preset’leri düzenlenebilir mi?</strong></summary>

Evet. Explore üzerinden içe aktarılan preset’ler Library’ye eklendikten sonra tamamen düzenlenebilir.

</details>

<a id="license"></a>
## Lisans

NZXT-ESC, **Kişisel Kullanım Lisansı** ile yayımlanmaktadır.

**İzin verilenler:** kişisel kullanım, kişisel değişiklikler ve özgün projeye açıkça atıf verilerek yeniden dağıtım.

**Ticari kullanım:** satış, paketleme, kiralama, ücretli bir ürüne entegre etme veya diğer gelir getirici kullanımlar için proje sahibinden önceden yazılı izin alınması gerekir.
Tüm koşullar için [LICENSE dosyasına bakın](../LICENSE).

## Destek ve bağlantılar

- **Web sitesi:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **En son sürüm:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Hata bildirimleri ve fikirler:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **Yardımcı uygulama:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

NZXT-ESC kurulumunuzu daha iyi hale getirdiyse geliştirme çalışmalarını destekleyebilirsiniz:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

**Gökhan AKGÜL (mRGogo)** tarafından geliştirildi kahve ve tartışmalı uyku düzenleriyle destekleniyor.
