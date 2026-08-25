# NZXT-ESC - En iyi NZXT Web Integration

### NZXT Kraken AIO için Gelişmiş Ekran Özelleştirme Düzen Editörü

Sürükle-bırak sensör katmanları, özel yazı tipleri, görseller, GIF, APNG, MP4 ve WebM videolar, saatler, grafikler, Şimdi Çalıyor verileri ve sese duyarlı görsellerle tamamen düzenlenebilir NZXT Kraken LCD tasarımları oluşturun; sonuçları **NZXT CAM Web Integration** üzerinden canlı görüntüleyin.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-21-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[NZXT CAM’de Aç](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Canlı Önizlemeyi Aç](https://nzxt-esc.pages.dev/)
· [Desteklenen Kraken Modelleri](#supported-nzxt-kraken-lcd-models)
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

<a id="supported-nzxt-kraken-lcd-models"></a>

## Desteklenen NZXT Kraken LCD Modelleri

NZXT-ESC; güncel ve önceki nesil Kraken Elite, Kraken Plus, Kraken ve Kraken Z modelleri dahil olmak üzere, LCD ekranlı ve NZXT CAM Web Integration destekli NZXT Kraken AIO sıvı soğutucularını destekler.

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

NZXT-ESC, NZXT CAM API üzerinden bildirilen Kraken LCD çözünürlüğüne, boyutuna ve ekran şekline göre düzeni otomatik olarak uyarlar; böylece özel düzenler, sensör katmanları, animasyonlu arka planlar, grafikler ve medya NZXT CAM Web Integration üzerinden görüntülenebilir.

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
| **Çok dilli editör** | Arayüzü desteklenen 21 dilde kullanın. |

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
· `Filipino` · `العربية` · `Bahasa Melayu` · `Ελληνικά`

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
[Filipino](README.fil.md) ·
[العربية](README.ar.md) ·
[Bahasa Melayu](README.ms.md) ·
[Ελληνικά](README.el.md)

## Gizlilik ve yerel depolama

NZXT-ESC, yerel tarayıcı depolaması temel alınarak tasarlanmıştır:

- Preset yapılandırmaları **LocalStorage** içinde saklanır.
- Yerel görseller ve videolar **IndexedDB** içinde saklanır.
- NZXT CAM sensör değerleri ve kullanıcı tarafından oluşturulan preset’ler analitik sistemlerine gönderilmez.
- Uygulama tarafından kişiyi tanımlayan bilgiler bilinçli olarak toplanmaz.

Üretim sitesi, anonim ürün analitiği için **Google Tag Manager** ve **Google Analytics 4** kullanır. **CookieYes**, gerekli olduğu durumlarda kullanıcı onayını yönetir ve Google Analytics çerezleri kullanıcının onay tercihlerine göre etkinleştirilir.

Yayındaki site ayrıca, Cloudflare Pages üzerinden etkinleştirilen ve Google Tag Manager’dan bağımsız çalışan **Cloudflare Web Analytics**’i kullanır. Bu hizmet, çerez veya LocalStorage kullanmadan gizliliğe öncelik veren web sitesi trafiği ve performans analitiği sağlar.

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

NZXT-ESC, NZXT CAM Web Integration ekran modunu destekleyen LCD'li **NZXT Kraken Elite, Kraken Plus, Kraken (2023) ve Kraken Z serisi** soğutucuları destekler.

Tam listeye [Desteklenen NZXT Kraken LCD Modelleri](#supported-nzxt-kraken-lcd-models) bölümünden ulaşabilirsiniz.

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

<details>
<summary><strong>Destekçi Erişimi nasıl işliyor?</strong></summary>

NZXT-ESC bağımsız olarak geliştirilir ve sürdürülür. Projeyi gerçek anlamda deneyimlemek için yeterli zamana sahip olduktan sonra NZXT-ESC, gelişimini desteklemek isteyip istemediğinizi ya da karar vermek için biraz daha zaman almak isteyip istemediğinizi sorabilir.

Destek vermek her zaman para anlamına gelmez. Geri bildirim, hata bildirimleri, fikirler, projeyi paylaşmak, başkalarının onu keşfetmesine yardımcı olmak ve diğer anlamlı topluluk katkılarının tümü NZXT-ESC’nin büyümesine yardımcı olur.

Destekçi Erişim Kodları, projeyi destekleyenlere sunulur ve NZXT-ESC’ye anlamlı katkılarda bulunan topluluk üyelerine de hediye edilebilir.

Kullanım süresi yalnızca NZXT-ESC, Kraken ekranında etkin biçimde çalışırken sayılır.

</details>

<a id="license"></a>
## Lisans

NZXT-ESC, **Kişisel Kullanım Lisansı** ile yayımlanmaktadır.

**İzin verilenler:** kişisel kullanım, kişisel değişiklikler ve özgün projeye açıkça atıf verilerek yeniden dağıtım.

**Ticari kullanım:** satış, paketleme, kiralama, ücretli bir ürüne entegre etme veya diğer gelir getirici kullanımlar için proje sahibinden önceden yazılı izin alınması gerekir.
Tüm koşullar için [LICENSE dosyasına bakın](../LICENSE).

## Destek ve topluluk

- **Web sitesi:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **En son sürüm:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Hata bildirimleri ve fikirler:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

Vitrinler, yeni özellikler, eğitimler, topluluk kurulumları ve proje güncellemeleri için NZXT-ESC’yi YouTube ve Instagram’da takip edin.

NZXT-ESC kurulumunuzda kendine bir yer edindiyse, projeyi desteklemenin birçok yolu var: geri bildirim ve fikirlerinizi paylaşın, hataları bildirin, başkalarının NZXT-ESC’yi keşfetmesine yardımcı olun, topluluğa katkıda bulunun - ya da yalnızca bana bir kahve ısmarlayın.

Her türlü katkı NZXT-ESC’nin ilerlemesine yardımcı olurken, kahve desteği sunucu, API, barındırma ve bakım maliyetlerinin karşılanmasına yardımcı olur.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

**Gökhan AKGÜL (mRGogo)** tarafından geliştirildi - kahve ve tartışmalı uyku düzenleriyle destekleniyor.
