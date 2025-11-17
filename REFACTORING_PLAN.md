# ConfigPreview Refactoring Plan

## 📊 Mevcut Durum Analizi

### Dosya İstatistikleri
- **ConfigPreview.tsx**: 3,983 satır, ~203 KB
- **ConfigPreview.css**: ~12 KB
- **Toplam**: Tek dosyada çok fazla sorumluluk

### Mevcut Sorumluluklar
1. **Background Section** (~700 satır)
   - Preview (drag & drop, zoom, video/image rendering)
   - Settings (scale, x, y, align, fit, backgroundColor, showGuide)

2. **Overlay Section** (~3,200 satır)
   - Preview (single, dual, triple, custom modes)
   - Settings (mode selection, metrics, colors, sizes, positions, divider, custom readings/texts)

3. **Drag Handlers** (~500 satır)
   - Background drag
   - Overlay drag (single/dual/triple)
   - Custom reading drag
   - Custom text drag

4. **State Management** (~100 satır)
   - Multiple useState hooks
   - Multiple useRef hooks
   - Multiple useEffect hooks

## 🎯 Refactoring Hedefleri

1. ✅ **Modülerlik**: Her component tek bir sorumluluğa sahip olmalı
2. ✅ **Bakım Kolaylığı**: Yeni özellikler eklemek kolay olmalı
3. ✅ **Performans**: Code splitting, lazy loading, memoization (canlı önizleme kritik)
4. ✅ **Okunabilirlik**: Dosyalar maksimum 500-800 satır olmalı
5. ✅ **Geriye Dönük Uyumluluk**: Mevcut işlevsellik korunmalı
6. ✅ **Genişletilebilirlik**: Yeni overlay modları, tema sistemi, preset'ler, import/export için hazır yapı
7. ✅ **Overlay Odaklı**: Overlay ayarları en sık değiştiği için özel dikkat

## 📁 Önerilen Dosya Yapısı

```
src/ui/components/ConfigPreview/
├── index.tsx                          # Ana component (orchestrator)
├── BackgroundSection/
│   ├── BackgroundPreview.tsx         # Preview component
│   ├── BackgroundSettings.tsx        # Settings panel
│   └── hooks/
│       ├── useBackgroundDrag.ts      # Background drag logic
│       └── useBackgroundPosition.ts  # Position calculations
├── OverlaySection/
│   ├── OverlayPreview.tsx            # Preview component
│   ├── OverlaySettings.tsx          # Main settings panel
│   ├── modes/
│   │   ├── SingleModeSettings.tsx
│   │   ├── DualModeSettings.tsx
│   │   ├── TripleModeSettings.tsx
│   │   └── CustomModeSettings.tsx
│   ├── CustomMode/
│   │   ├── CustomReadingEditor.tsx
│   │   ├── CustomTextEditor.tsx
│   │   └── CustomItemList.tsx
│   └── hooks/
│       ├── useOverlayDrag.ts         # Overlay drag logic
│       ├── useCustomItemDrag.ts      # Custom items drag logic
│       └── useOverlayConfig.ts       # Overlay config management
└── shared/
    ├── PreviewCanvas.tsx             # Shared preview container
    ├── SettingRow.tsx                # Reusable setting row component
    ├── ResetButton.tsx               # Reusable reset button
    └── hooks/
        ├── usePreviewScaling.ts      # Scale calculations
        └── useDragHandlers.ts        # Common drag utilities
└── features/                         # Gelecek özellikler için
    ├── themes/                       # Tema sistemi (gelecek)
    ├── presets/                      # Preset sistemi (gelecek)
    └── animations/                   # Animasyon ayarları (gelecek)
```

## 🔄 Refactoring Adımları

### Faz 1: Shared Components ve Hooks (Güvenli, Onay Gerektirmez)
1. ✅ `PreviewCanvas.tsx` oluştur (ortak preview container)
2. ✅ `SettingRow.tsx` oluştur (tekrar eden setting row'ları için)
3. ✅ `ResetButton.tsx` oluştur (tekrar eden reset butonları için)
4. ✅ `usePreviewScaling.ts` hook'unu oluştur (scale hesaplamaları)
5. ✅ `useDragHandlers.ts` utility oluştur (ortak drag fonksiyonları)

### Faz 2: Background Section Ayrıştırma (Güvenli)
1. ✅ `BackgroundPreview.tsx` oluştur
2. ✅ `BackgroundSettings.tsx` oluştur
3. ✅ `useBackgroundDrag.ts` hook'unu oluştur
4. ✅ `useBackgroundPosition.ts` hook'unu oluştur
5. ✅ Ana component'te BackgroundSection'ı entegre et

### Faz 3: Overlay Section Ayrıştırma (Kritik, Dikkatli)
1. ✅ `OverlayPreview.tsx` oluştur
2. ✅ `OverlaySettings.tsx` oluştur (mode selection + conditional rendering)
3. ✅ Mode-specific settings component'lerini oluştur:
   - `SingleModeSettings.tsx`
   - `DualModeSettings.tsx`
   - `TripleModeSettings.tsx`
   - `CustomModeSettings.tsx`
4. ✅ `useOverlayDrag.ts` hook'unu oluştur
5. ✅ `useOverlayConfig.ts` hook'unu oluştur

### Faz 4: Custom Mode Detaylı Ayrıştırma (En Karmaşık)
1. ✅ `CustomReadingEditor.tsx` oluştur
2. ✅ `CustomTextEditor.tsx` oluştur
3. ✅ `CustomItemList.tsx` oluştur (unified list rendering)
4. ✅ `useCustomItemDrag.ts` hook'unu oluştur

### Faz 5: Ana Component Temizleme
1. ✅ `ConfigPreview/index.tsx` sadece orchestration yapsın
2. ✅ Tüm logic'i alt component'lere taşı
3. ✅ CSS'i modülerleştir (her component kendi CSS'ini içersin)

### Faz 6: Optimizasyon ve Performans (Kritik - Canlı Önizleme)
1. ✅ React.memo ile gereksiz re-render'ları önle
2. ✅ useMemo/useCallback ile hesaplamaları optimize et
3. ✅ Code splitting için lazy loading ekle (overlay modları için)
4. ✅ Preview component'lerini memoize et
5. ✅ Debouncing/throttling canlı önizleme güncellemeleri için

### Faz 7: Gelecek Özellikler İçin Hazırlık
1. ✅ Overlay modları için plugin-like yapı (yeni modlar kolayca eklenebilir)
2. ✅ Tema sistemi için context/provider hazırlığı
3. ✅ Preset sistemi için utilities
4. ✅ Import/export için utilities
5. ✅ Animasyon/efekt ayarları için genişletilebilir yapı

## ⚠️ Kritik Noktalar

### Korunması Gerekenler
1. **offsetScale formülü**: `previewSize / lcdResolution` - ASLA DEĞİŞTİRME
2. **LCD pixel conversion**: `previewToLcd` ve `lcdToPreview` fonksiyonları
3. **Real-time sync**: 100ms throttled save mekanizması
4. **Drag behavior**: Mevcut drag & drop davranışı
5. **State management**: useConfig ve useMediaUrl hook'ları

### Dikkat Edilmesi Gerekenler
1. **Custom mode complexity**: En karmaşık bölüm, dikkatli ayrıştır
2. **Mode switching**: Mode değiştiğinde default değerlerin set edilmesi
3. **Unified ordering**: Custom mode'da readings ve texts'in unified order'ı
4. **Label indices**: labelIndex vs order farkı

## 📝 Implementation Notes

### Component Props Interface
```typescript
// BackgroundPreview
interface BackgroundPreviewProps {
  mediaUrl: string;
  settings: AppSettings;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
  lang: Lang;
}

// OverlayPreview
interface OverlayPreviewProps {
  overlayConfig: OverlaySettings;
  metrics: OverlayMetrics;
  onOverlayChange: (overlay: Partial<OverlaySettings>) => void;
  lang: Lang;
  offsetScale: number;
  overlayPreviewScale: number;
}
```

### Hook Interfaces
```typescript
// useBackgroundDrag
interface UseBackgroundDragReturn {
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
}

// useOverlayDrag
interface UseOverlayDragReturn {
  isDraggingOverlay: boolean;
  isDraggingSecondaryTertiary: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
}
```

## 🚀 Başlangıç Stratejisi

1. **İlk olarak shared components**: Risk düşük, fayda yüksek
2. **Sonra Background**: Daha basit, test etmek kolay
3. **Sonra Overlay (single/dual/triple)**: Orta karmaşıklık
4. **En son Custom mode**: En karmaşık, en dikkatli yapılmalı

## ✅ Doğrulama Checklist

Her faz sonrası:
- [ ] Mevcut işlevsellik çalışıyor mu?
- [ ] Görünüş aynı mı?
- [ ] Drag & drop çalışıyor mu?
- [ ] Settings kaydediliyor mu?
- [ ] Real-time sync çalışıyor mu?
- [ ] Mode switching çalışıyor mu?
- [ ] Custom mode tüm özellikleri çalışıyor mu?

