# NZXT-ESC - 最佳 NZXT Web Integration

### NZXT Kraken AIO 專用進階螢幕自訂版面編輯器

透過拖放式感測器疊加層、自訂字型、圖片、GIF、APNG、MP4、WebM 影片、時鐘、圖表、Now Playing 資訊,以及音效互動視覺效果,建立完全可編輯的 NZXT Kraken LCD 版面,並透過**NZXT CAM Web Integration**即時呈現。

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-25-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[在 NZXT CAM 中開啟](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [開啟即時預覽](https://nzxt-esc.pages.dev/)
· [支援的 NZXT Kraken 機型](#supported-nzxt-kraken-lcd-models)
· [功能](#features)
· [快速開始](#quick-start)
· [常見問題](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESC 拖放式 NZXT Kraken LCD 版面編輯器"
       width="70%" />

> [!NOTE]
> **NZXT-ESC 是一個獨立的社群專案。** 本專案與 NZXT 無任何關聯,並非由 NZXT 贊助或認可。

如果 NZXT-ESC 讓你的主機配置更上一層樓,歡迎支持專案的持續開發:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## 不受限於固定版面的 NZXT Kraken LCD 自訂功能

NZXT-ESC 將 NZXT Kraken 螢幕變成一塊自由配置的畫布。你可以將每個感測器、圖形、時鐘、圖片或媒體元素精準放置在想要的位置,打造專屬的 LCD 畫面。調整大小、旋轉、重新排序、重新命名、鎖定與設定樣式的同時,即可透過 NZXT CAM 即時看到結果更新。

核心編輯器**不需要帳號**,也**不需要額外安裝終端使用者程式**。預設集與本機媒體會保留在瀏覽器儲存空間中。選用的音樂疊加層功能則使用本機 Windows 隨附應用程式 [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)。

<a id="supported-nzxt-kraken-lcd-models"></a>

## 支援的 NZXT Kraken LCD 機型

NZXT-ESC 支援搭載 LCD 顯示螢幕並具備 NZXT CAM Web Integration 功能的 NZXT Kraken AIO 水冷散熱器,涵蓋現行與前代的 Kraken Elite、Kraken Plus、Kraken 及 Kraken Z 系列機型。

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

NZXT-ESC 會根據 NZXT CAM API 回報的 Kraken LCD 解析度、尺寸與螢幕形狀自動調整版面,讓自訂版面、感測器疊加層、動態背景、圖形與媒體都能透過 NZXT CAM Web Integration 呈現。

<a id="quick-start"></a>
## 快速開始

### 直接在 NZXT CAM 中開啟

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. 點擊 **Open NZXT-ESC in NZXT CAM**。
2. 允許瀏覽器開啟 NZXT CAM。
3. 確認 **Load Web Integration**。
4. 開啟新的 Web Integration 卡片,並選擇 **Configure**。
5. 建立你的版面;變更內容會與 Kraken 顯示螢幕同步。

<details>
<summary><strong>在 NZXT CAM 中手動設定</strong></summary>

1. 開啟 **NZXT CAM**。
2. 前往 **Lighting → Kraken → LCD Display**。
3. 選擇 **Web Integration**。
4. 開啟 **Custom Web Integration** 設定。
5. 輸入以下網址:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. 選擇 **Apply**,接著選擇 **Add as Card**。
7. 開啟新卡片並選擇 **Configure**。

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="NZXT CAM Web Integration 設定畫面"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="將 NZXT-ESC 新增為 NZXT CAM Web Integration 卡片"
       width="48%" />
</p>

</details>

## 實際運作展示

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="使用 NZXT-ESC 建立的自訂 NZXT Kraken LCD 預設集"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="NZXT-ESC 中的動態 NZXT Kraken 顯示螢幕版面"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Kraken LCD 上即時顯示的 NZXT CAM 感測器疊加層"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="透過 NZXT CAM 執行的自訂動態 Kraken LCD 畫面"
       width="48%" />
</p>

<a id="features"></a>
## 功能

| 功能特色 | 你能獲得的效果 |
|---|---|
| **自由版面編輯器** | 拖曳、調整大小、旋轉、分層、鎖定、重新命名,並精準定位每個元素。 |
| **NZXT CAM 即時感測器資料** | 建立自訂的 CPU、GPU、RAM、水冷液溫度、功耗、頻率與風扇轉速顯示畫面。 |
| **進階圖形** | 在同一個版面中結合放射狀、線性、圓形與歷史紀錄感測器圖形。 |
| **動態背景** | 使用顏色、漸層、本機圖片、GIF、MP4 影片、直接媒體網址、YouTube 及 Pinterest 素材來源。 |
| **Now Playing 整合** | 從本機 Windows 用戶端顯示專輯封面、曲目資訊與音效互動視覺效果。 |
| **Explore 與 Library** | 匯入社群預設集、編輯所有內容、整理最愛項目,並維護專屬的本機預設集收藏。 |
| **本機優先儲存** | 預設集使用 LocalStorage,本機媒體使用 IndexedDB,資料保留在你的裝置上。 |
| **多語言編輯器** | 介面支援 25 種語言。 |

### 疊加元素

目前的編輯器將疊加元素分為四個清楚的類別:

| 內容 | 資料 | 時間 | 音訊 |
|---|---|---|---|
| 文字 | 感測器 | 數位時鐘 | 專輯封面 |
| 形狀 | 放射狀圖形 | 類比時鐘 | Now Playing 文字 |
| 圖示 | 線性圖形 | 日期 | 音訊視覺化效果 |
| 貼圖 | 圓形圖形 |  |  |
| 圖片 | 感測器圖表 |  |  |

在可行的情況下,每個元素都採用相同的視覺操作流程:在預覽畫面或圖層清單中選取元素,然後調整其位置、大小、旋轉角度、順序、樣式,以及該類型專屬的設定。

### 硬體監控

使用 NZXT CAM 提供的監控資料建立即時版面,包括:

`CPU 溫度` · `CPU 使用率` · `CPU 頻率` · `CPU 功耗` · `CPU 風扇轉速` · `GPU 溫度` · `GPU 使用率` · `GPU 頻率` · `GPU 功耗` · `GPU 風扇轉速` · `RAM 使用率` · `水冷液溫度`

多 GPU 系統可以自動選擇使用中的 GPU,也可以指定特定的 GPU。當 NZXT CAM API 無法使用時,瀏覽器編輯器也會提供模擬數值,讓版面仍然可以設計與預覽。

### 背景與媒體

以純色或漸層作為底色,接著從以下來源新增媒體:

- 本機 PNG、JPG、GIF、WebP 或 MP4 檔案
- 圖片與影片的直接網址
- YouTube 影片
- Pinterest 媒體連結

背景媒體可以調整位置、縮放比例與符合方式,並與任何疊加版面組合使用。本機檔案會儲存在 IndexedDB 中,NZXT-ESC 不會將其上傳。

### 預設集、Explore 與 Library

- 在本機 Library 中儲存並整理最多 **20 個自訂預設集**。
- 每個預設集最多可放置 **40 個疊加元素**。
- 匯入與匯出可編輯的預設集檔案,用於備份或分享。
- 透過 **Explore** 瀏覽社群製作的版面。
- 將 Explore 中的預設集加入 Library,自訂內容並打造專屬版本。
- 在 NZXT CAM 的兩個檢視畫面之間,保持編輯內容與 Kraken 顯示同步。

## Now Playing 與音訊視覺化效果

選用的 Windows 用戶端 [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) 會在本機執行,並透過本機 WebSocket 連線,將媒體工作階段與音訊頻譜資料傳送給 NZXT-ESC。

使用它可以新增:

- **專輯封面** 目前的封面圖,並可調整大小、邊框與圓角
- **Now Playing 文字** 顯示曲目名稱、演出者或專輯名稱,長文字可捲動顯示
- **音訊視覺化效果** 可自訂的即時頻譜與波形視覺效果

並不限於 Spotify。這款隨附應用程式會讀取瀏覽器、媒體播放器及其他應用程式中受支援的 Windows 媒體工作階段與系統音訊輸出。

<a id="languages"></a>
## 語言

編輯器目前支援:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino` · `العربية` · `Bahasa Melayu` · `Ελληνικά` · `繁體中文` · `Tiếng Việt` · `Українська` · `Magyar`

**翻譯文件:**
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

## 隱私權與本機儲存

NZXT-ESC 的設計以本機瀏覽器儲存為核心:

- 預設集設定儲存在 **LocalStorage** 中。
- 本機圖片與影片儲存在 **IndexedDB** 中。
- NZXT CAM 感測器讀數與使用者建立的預設集不會傳送至分析服務。
- 本應用程式不會刻意蒐集任何可識別個人身分的資訊。

正式營運網站使用 **Google Tag Manager** 與 **Google Analytics 4**,以進行選用的匿名產品分析。在需要的地區,**CookieYes** 會負責管理同意設定,Google Analytics 的 Cookie 會依照使用者的同意選擇來啟用。

已部署的網站也使用 **Cloudflare Web Analytics**,透過 Cloudflare Pages 啟用,並獨立於 Google Tag Manager 運作。它提供以隱私為優先的網站流量與效能分析,且不使用 Cookie 或 LocalStorage。

### 貢獻方式

歡迎貢獻與目標明確的 pull request。在進行架構層級的變更之前,請先閱讀:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [行為準則](../CODE_OF_CONDUCT.md)
- [安全政策](../SECURITY.md)

<a id="faq"></a>
## 常見問題

<details>
<summary><strong>我需要安裝 NZXT-ESC 嗎?</strong></summary>

核心編輯器不需要另外安裝,透過 NZXT CAM Web Integration 開啟即可使用。只有選用的音樂疊加層功能才需要本機的 NowPlaying.WebSocket Windows 用戶端。

</details>

<details>
<summary><strong>沒有 NZXT CAM,NZXT-ESC 還能運作嗎?</strong></summary>

編輯器可以在一般瀏覽器中開啟,並使用模擬感測器數值進行設計。若要即時監控硬體並輸出至 Kraken 顯示螢幕,則需要 NZXT CAM Web Integration。

</details>

<details>
<summary><strong>支援哪些 NZXT Kraken 機型?</strong></summary>

NZXT-ESC 支援搭載 LCD 螢幕、並提供 NZXT CAM Web Integration 顯示模式的 **NZXT Kraken Elite、Kraken Plus、Kraken (2023) 及 Kraken Z 系列**散熱器。

完整機型清單請參閱[支援的 NZXT Kraken LCD 機型](#supported-nzxt-kraken-lcd-models)。

</details>

<details>
<summary><strong>預設集與本機媒體儲存在哪裡?</strong></summary>

預設集儲存在瀏覽器的 LocalStorage 中,本機圖片與影片則儲存在 IndexedDB 中。若要更換瀏覽器、重新安裝 Windows 或更換電腦,請記得定期匯出重要的預設集。

</details>

<details>
<summary><strong>Now Playing 需要 Spotify 嗎?</strong></summary>

不需要。NowPlaying.WebSocket 使用受支援的 Windows 媒體工作階段與系統音訊,因此可以搭配瀏覽器及其他相容的媒體應用程式使用。

</details>

<details>
<summary><strong>社群預設集可以編輯嗎?</strong></summary>

可以。從 Explore 匯入的預設集,加入 Library 後即可完全編輯。

</details>

<details>
<summary><strong>支援者存取權限如何運作?</strong></summary>

NZXT-ESC 由個人獨立開發與維護。在你有足夠時間真正體驗過這個專案之後,NZXT-ESC 可能會詢問你是否願意支持專案的持續開發,或者想再多花一點時間考慮。

支持不一定代表金錢。意見回饋、錯誤回報、想法、分享專案、幫助其他人發現這個專案,以及其他有意義的社群貢獻,都能幫助 NZXT-ESC 成長。

支援者存取代碼會提供給專案的支持者,也可能贈送給對 NZXT-ESC 做出實質貢獻的社群成員。

使用時間僅在 NZXT-ESC 於 Kraken 顯示螢幕上實際運作時才會被計入。

</details>

<a id="license"></a>
## 授權條款

NZXT-ESC 依據**個人使用授權**發布。

**允許事項:** 個人使用、個人修改,以及在明確標註原專案出處的情況下重新散布。

**商業使用:** 銷售、包裝銷售、租借、整合至付費產品,或其他任何營利用途,皆須事先取得專案擁有者的書面同意。
完整條款請參閱[LICENSE](../LICENSE)。

## 支援與社群

- **網站:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **最新版本:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **錯誤回報與想法:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

在 YouTube 與 Instagram 上追蹤 NZXT-ESC,掌握作品展示、新功能、教學、社群配置與專案最新消息。

如果 NZXT-ESC 已經成為你主機配置中不可或缺的一部分,支持這個專案的方式有很多種:分享意見與想法、回報錯誤、幫助其他人發現 NZXT-ESC、參與社群貢獻,或者單純請我喝杯咖啡。

每一種形式的貢獻都能幫助 NZXT-ESC 持續前進,而咖啡贊助則有助於支付伺服器、API、主機代管與維護等費用。

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

由 **Gökhan AKGÜL (mRGogo)** 打造 - 靠咖啡與不太健康的睡眠時間驅動。

</div>
