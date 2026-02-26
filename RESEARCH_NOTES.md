# NZXT-ESC Araştırma Notları

## Mimari Özet
Proje, NZXT Kraken Elite LCD ekranları için gelişmiş bir görsel düzenleyici (editor) ve bu düzenleyicinin çıktılarını LCD üzerinde görüntüleyen bir "viewer" (KrakenOverlay) bileşeninden oluşur.

## Ana Bileşenler
1. **Config.tsx**: Ana düzenleyici arayüzü. Ayarların, presetlerin ve medya URL'lerinin yönetildiği yer.
2. **KrakenOverlay.tsx**: LCD ekran üzerinde çalışan bileşen. `?kraken=1` parametresiyle tetiklenir. Editördeki değişiklikleri `BroadcastChannel` üzerinden dinler.
3. **OverlayStateManager**: Action-based state yönetimi. Her işlem (taşıma, silme, ekleme) bir `Action` nesnesidir. Bu, Undo/Redo desteğini sağlar.
4. **Transform Engine**: LCD ve Preview koordinat sistemleri arasındaki matematiksel dönüşümleri yapan motor. Matris matematiği (`TransformMatrix.ts`) kullanır.

## Veri Akışı
- **Editör -> LCD**: `BroadcastChannel` (nzxtesc_overlay_runtime_vnext) kullanılarak runtime state senkronize edilir.
- **Kalıcılık**: `localStorage` (ayarlar ve preset listesi) ve `IndexedDB` (yerel medya dosyaları).
- **Monitoring**: NZXT CAM'den gelen sıcaklık/yük verileri `safeNZXT.ts` ve `useMonitoring.ts` üzerinden alınır.

## Kritik Bölgeler (Frozen Zone)
- `src/transform/engine/`: Koordinat dönüşüm formülleri burada kilitlenmiştir. `offsetScale = previewSize / lcdResolution` formülü bozulmamalıdır.
- `src/state/overlay/sync.ts`: Tablar arası senkronizasyon ve veri serileştirme mantığı.

## Dosya Yapısı
- `src/state/`: State yönetimi, action tanımları (`actions.ts`) ve store mantığı. `useOverlayStateManager` hook'u tablar arası senkronizasyonu yönetir.
- `src/transform/`: Matematiksel dönüşümler, sürükleme, boyutlandırma ve döndürme operasyonları. `engine/` ve `operations/` alt klasörleri matris matematiği ve spesifik transform mantığını barındırır.
- `src/ui/`: React bileşenleri, stil dosyaları ve yardımcı UI fonksiyonları. `Config.tsx` ana editör, `KrakenOverlay.tsx` ise LCD viewer'dır.
- `src/preset/`: Preset şeması, içe/dışa aktarma mantığı ve storage işlemleri. `storage.ts` localStorage yönetimini yapar.
- `src/i18n/`: Çoklu dil desteği (8 dil). Dil değişiklikleri `StorageEvent` ve `languagechange` özel olayı ile senkronize edilir.

## Teknik Detaylar ve Kısıtlamalar
- **Element Limiti:** Bir overlay'de en fazla 20 element bulunabilir (`MAX_OVERLAY_ELEMENTS`).
- **Senkronizasyon:** `BroadcastChannel` (V3B Runtime) her zaman etkindir. Editor ve Kraken view aynı `activePresetId` üzerinden haberleşir. Veriler `structuredClone` testinden geçirilerek güvenli bir şekilde serileştirilir.
- **Güvenlik:** Harici URL'ler (YouTube, Pinterest) ve yerel dosyalar için validasyonlar mevcuttur. Yerel dosyalar sadece IndexedDB'de saklanır, dışa aktarılan preset dosyalarına dahil edilmez.
- **Görselleştirme:** `UnifiedOverlayRenderer` tüm element tiplerini (metric, text, divider, clock, date) z-order sırasına göre render eder. CSS transform sırası kritiktir: `translate` -> `rotate`.
- **Undo/Redo:** `HistoryState` içinde `past`, `present` ve `future` action dizileri tutulur. Transaction'lar (batch) tamamlandığında tek bir action olarak history'ye işlenir. `replayActions` ile state yeniden inşa edilebilir.
- **Bounding Box & Handles:** Döndürülmüş elementler için `AABB` (Axis-Aligned Bounding Box) hesaplanır ve tutamaçlar (handles) bu box üzerine Figma stilinde yerleştirilir. Bu, döndürülmüş objelerin bile sezgisel şekilde boyutlandırılmasını sağlar.
- **Migration & Compatibility:** `overlayMigration.ts` legacy `OverlaySettings` verilerini yeni sisteme dönüştürür. `migrationIndex.ts` ise v0'dan v3'e (canonical z-order) kadar olan şema geçişlerini yönetir. v3 şeması, render sırası için `zOrder` dizisini otorite kabul eder.
- **Fingerprinting (Gelecek):** `computeFingerprintV2.ts` ile xxhash64 tabanlı, element sırasından bağımsız, derinlemesine state doğrulama sistemi hazırlanmış ancak henüz devreye alınmamıştır (PARKED).
- **Multi-Select (UI):** `groupBoundingBox.ts` çoklu seçimler için UI seviyesinde bir kapsayıcı kutu hesaplar. `operationDetectorV2.ts` ise yapılan işlemin tipini (move/resize/rotate) otomatik olarak algılar.
- **Render Loop:** 60Hz sabit render döngüsü (`renderLoop.ts`) donanım limitleriyle tam uyumluluk sağlar.
- **YouTube & Pinterest:** YouTube videoları `YouTubeRenderer` ile iframe üzerinden, Pinterest medyaları ise arka planda HTML parsing ve proxy kullanımıyla çözümlenerek gösterilir. Önizleme modunda YouTube için `PlaceholderRenderer` kullanılır.
- **UI & UX:**
    - `OverlayPreview.tsx`: Hitbox v2 mekanizması ile döndürülmüş elementlerde bile hassas tıklama tespiti yapar. Figma benzeri transform handles ve bounding box yapısı sunar.
    - `Element Inspectors`: Her element tipi (Metric, Text, Divider, Clock, Date) için özelleşmiş kontrol panelleri (`Inspector`) bulunur. Accordion yapısı ile alan tasarrufu sağlar.
    - `Custom Inputs`: `NumericStepper` (hızlı sayı artırımı), `TabbedColorPicker` (detaylı renk ve outline yönetimi) gibi özelleşmiş bileşenler kullanılır.
    - `Framer Motion`: `AnimateNumber` ile değer değişimleri yay fiziği (spring) kullanılarak akıcı hale getirilir. Modal ve drawer geçişleri de bu kütüphane ile yönetilir.
    - `Görsel Geri Bildirim`: Ölçekleme/ofset değişikliklerinde anlık değer etiketleri ve NZXT Kraken LED halkasını simüle eden `nzxt-glow-wrapper` gibi gelişmiş CSS efektleri mevcuttur.
    - `Sezgisel Etkileşim`: Mouse wheel ile sayı artırma, sürükleme sırasında manyetik snapping (yapışma) ve akıllı rehber çizgileri (smart guides) desteği sunar.
- **Hook Mimarisi:**
    - `useConfig` & `useMediaUrl`: Ayarların ve medyanın ana yönetim noktaları.
    - `useSettingsSync`: 100ms throttle ile performanslı senkronizasyon sağlar.
    - `useAtomicPresetSync`: Değişiklikleri otomatik olarak aktif preset'e kaydeder (autosave). `mergePresetFields` (Atomic Merge) kullanarak veri bütünlüğünü korur.
    - `useLocalMedia`: IndexedDB'den veri çekerken Blob URL sızıntılarını (`revokeObjectURL`) engeller.
- **Preset Boru Hattı (Pipeline):** `importPresetPipeline.ts` ile dosya okuma -> JSON parse -> Migration -> Validation (range/type check) -> Normalization (clamping) -> Settings conversion adımları sırasıyla uygulanır. `createPresetFromState` ise UI ve Runtime verilerini birleştirerek dışa aktarılabilir dosya oluşturur.
- **Sürüm Yönetimi (v0 -> v3):**
    - `v0`: Şema versiyonu yok (Legacy).
    - `v1`: `presetName` eklendi, yapı standardize edildi.
    - `v2`: `background.source` (youtube, pinterest, local vb.) metadata modeli eklendi.
    - `v3`: `zOrder` canonical dizisi eklendi. Render sırası artık bu diziye göre belirlenir.
    - `Migration Functions`: Her sürüm geçişi için (`migrate0To1`, `migrate1To2`, `migrate2To3`) özel fonksiyonlar mevcuttur ve bu fonksiyonlar birbirine zincirlenerek çalışır.
