# NZXT-ESC

### NZXT Kraken AIO向け高度な画面カスタマイズ・レイアウトエディター

ドラッグ＆ドロップ対応のセンサーオーバーレイ、カスタムフォント、画像、GIF、MP4動画、時計、グラフ、Now Playing情報、サウンド連動ビジュアルを使って、完全に編集可能なNZXT Kraken LCDレイアウトを作成し、**NZXT CAM Web Integration**経由でリアルタイム表示できます。

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[NZXT CAMで開く](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Webエディターを開く](https://nzxt-esc.pages.dev/)
· [機能](#features)
· [クイックスタート](#quick-start)
· [FAQ](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESCのドラッグ＆ドロップ式NZXT Kraken LCDレイアウトエディター"
       width="70%" />

> [!NOTE]
> **NZXT-ESCは独立したコミュニティプロジェクトです。** NZXTとの提携、スポンサー関係、公式承認はありません。

## 固定レイアウトに縛られないNZXT Kraken LCDカスタマイズ

NZXT-ESCはNZXT Krakenディスプレイを自由配置できるキャンバスに変えます。センサー、グラフィック、時計、画像、メディア要素を好きな位置に置いて、独自のLCD画面を作成できます。各要素のサイズ変更、回転、並べ替え、名称変更、ロック、スタイル調整を行いながら、NZXT CAMで結果をリアルタイムに確認できます。

コアエディターには**アカウント登録も、エンドユーザー向けの個別インストールも不要**です。プリセットとローカルメディアはブラウザー内に保存されます。音楽関連のオプションオーバーレイでは、ローカルで動作するWindows用コンパニオンアプリ[NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)を使用します。

<a id="quick-start"></a>
## クイックスタート

### NZXT CAMで直接開く

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. **Open NZXT-ESC in NZXT CAM**をクリックします。
2. ブラウザーからNZXT CAMを開くことを許可します。
3. **Load Web Integration**を確認します。
4. 新しいWeb Integrationカードを開き、**Configure**を選択します。
5. レイアウトを作成します。変更内容はKrakenディスプレイに同期されます。

<details>
<summary><strong>NZXT CAM内で手動設定する</strong></summary>

1. **NZXT CAM**を開きます。
2. **Lighting → Kraken → LCD Display**へ移動します。
3. **Web Integration**を選択します。
4. **Custom Web Integration**の設定を開きます。
5. 次のURLを入力します：

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. **Apply**を選択し、続けて**Add as Card**を選択します。
7. 新しいカードを開き、**Configure**を選択します。

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="NZXT CAM Web Integrationの設定画面"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="NZXT-ESCをNZXT CAM Web Integrationカードとして追加"
       width="48%" />
</p>

</details>

## 動作イメージ

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="NZXT-ESCで作成したカスタムNZXT Kraken LCDプリセット"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="NZXT-ESCのアニメーション付きNZXT Krakenディスプレイレイアウト"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Kraken LCDに表示されたNZXT CAMのリアルタイムセンサーオーバーレイ"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="NZXT CAM経由で動作するカスタムアニメーションKraken LCD画面"
       width="48%" />
</p>

<a id="features"></a>
## 機能

| 機能 | できること |
|---|---|
| **自由配置レイアウトエディター** | すべての要素をドラッグ、サイズ変更、回転、重ね順変更、ロック、名称変更、精密配置できます。 |
| **NZXT CAMのリアルタイムセンサーデータ** | CPU、GPU、RAM、液温、消費電力、周波数、ファン速度のカスタム表示を作成できます。 |
| **高度なグラフィック** | 放射状、直線、円形、履歴型のセンサーグラフを1つのレイアウトに組み合わせられます。 |
| **アニメーション背景** | 色、グラデーション、ローカル画像、GIF、MP4動画、直接メディアURL、YouTube、Pinterestを利用できます。 |
| **Now Playing連携** | ローカルWindowsクライアントからアルバムアート、曲情報、サウンド連動ビジュアルを表示できます。 |
| **ExploreとLibrary** | コミュニティプリセットを読み込み、すべてを編集し、お気に入りを整理してローカルコレクションを管理できます。 |
| **ローカル優先の保存** | プリセットはLocalStorage、ローカルメディアはIndexedDBを使用し、データは端末内に保持されます。 |
| **多言語エディター** | 18の対応言語でインターフェースを利用できます。 |

### オーバーレイ要素

現在のエディターでは、オーバーレイ要素を4つの分かりやすいカテゴリに分類しています：

| コンテンツ | データ | 時間 | オーディオ |
|---|---|---|---|
| テキスト | センサー | デジタル時計 | アルバムカバー |
| 図形 | 放射状グラフ | アナログ時計 | Now Playingテキスト |
| アイコン | 線形グラフ | 日付 | オーディオビジュアライザー |
| ステッカー | 円形グラフ |  |  |
| 画像 | センサーチャート |  |  |

可能な限り、各要素は共通の操作フローを使用します。プレビューまたはレイヤー一覧で要素を選択し、位置、サイズ、回転、順序、スタイル、要素固有の設定を調整します。

### ハードウェアモニタリング

NZXT CAMで利用可能なモニタリングデータを使って、次のようなリアルタイムレイアウトを作成できます：

`CPU温度` · `CPU使用率` · `CPU周波数` · `CPU消費電力` · `CPUファン速度` · `GPU温度` · `GPU使用率` · `GPU周波数` · `GPU消費電力` · `GPUファン速度` · `RAM使用率` · `液温`

複数GPU環境では、使用中のGPUを自動選択するか、特定のGPUを指定できます。NZXT CAM APIが利用できない場合でも、ブラウザーエディターはモック値を表示するため、レイアウトの作成とプレビューを続けられます。

### 背景とメディア

単色またはグラデーションをベースにして、次のソースからメディアを追加できます：

- ローカルのPNG、JPG、GIF、WebP、MP4ファイル
- 画像・動画の直接URL
- YouTube動画
- Pinterestのメディアリンク

背景メディアは位置、拡大縮小、フィット方法を調整し、任意のオーバーレイレイアウトと組み合わせられます。ローカルファイルはIndexedDBに保存され、NZXT-ESCからアップロードされることはありません。

### プリセット、Explore、Library

- ローカルLibraryに最大**20個のカスタムプリセット**を保存・整理できます。
- 各プリセットには最大**40個のオーバーレイ要素**を配置できます。
- 編集可能なプリセットファイルをバックアップや共有用にインポート・エクスポートできます。
- **Explore**でコミュニティ作成のレイアウトを閲覧できます。
- ExploreのプリセットをLibraryに追加し、自由に編集して自分だけのデザインにできます。
- NZXT CAMの2つのビュー間で編集内容とKrakenレンダリングを同期できます。

## Now Playingとオーディオビジュアライザー

オプションのWindowsクライアント[NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)はローカルで動作し、メディアセッション情報とオーディオスペクトラムデータをローカルWebSocket接続でNZXT-ESCへ送信します。

次の要素を追加できます：

- **アルバムカバー** サイズ、枠線、角丸を調整できる現在のアートワーク
- **Now Playingテキスト** 長い文字列のスクロールに対応した曲名、アーティスト名、アルバム名
- **オーディオビジュアライザー** カスタマイズ可能なリアルタイムのスペクトラム／波形表示

Spotify専用ではありません。コンパニオンアプリは、ブラウザー、メディアプレーヤー、その他のアプリから、対応するWindowsメディアセッションとシステム音声出力を取得します。

<a id="languages"></a>
## 対応言語

現在、エディターは次の言語に対応しています：

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**翻訳済みドキュメント：**
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

## プライバシーとローカル保存

NZXT-ESCはブラウザーのローカル保存を中心に設計されています：

- プリセット設定は**LocalStorage**に保存されます。
- ローカル画像と動画は**IndexedDB**に保存されます。
- NZXT CAMのセンサー値やユーザー作成プリセットは分析サービスへ送信されません。
- アプリは個人を特定できる情報を意図的に収集しません。

本番サイトでは、匿名の製品分析に**Google Tag Manager**と**Google Analytics 4**を使用します。必要な地域では**CookieYes**が同意を管理し、任意の分析Cookieはユーザーの選択に応じて有効化されます。開発ビルドでは本番用分析サービスは必要ありません。

## 開発

### ローカルで実行

```bash
npm install
npm run dev
```

`http://localhost:5173`を開きます。NZXT CAMが利用できない場合、エディターはモックのハードウェアデータを使用します。

```bash
npm run build   # 型チェックを行い本番ビルドを作成
npm test        # i18nチェックとVitestテストスイートを実行
```

### アーキテクチャ

<details>
<summary><strong>プロジェクト構成と設計原則</strong></summary>

```text
src/
├─ core/       プリセット、オーバーレイ、要素、背景のドメイン契約
├─ render/     共有のプリセット→レンダーモデル変換エンジン
├─ storage/    LocalStorage状態、インポート／エクスポート、IndexedDBメディア
├─ platform/   NZXT CAMとローカルコンパニオンアプリのアダプター
├─ sync/       エディター／ランタイム同期
├─ i18n/       型付きロケールメッセージと翻訳ユーティリティ
└─ ui/
   ├─ config/  ドラッグ＆ドロップ設定エディター
   ├─ kraken/  軽量なKrakenディスプレイランタイム
   └─ shared/  再利用可能なUIコンポーネント
```

エディターのプレビューとKrakenランタイムは、同じ標準レンダリングパイプラインを使用します。この共有エンジンにより、ユーザーが設計した内容と実機ディスプレイに表示される内容のレイアウト、スタイル、変換動作が一致します。

プリセットデータは保存前に正規化され、インポート／エクスポートはバージョン管理されます。エディターの更新は`BroadcastChannel`で同期され、利用できない場合は`localStorage`へフォールバックします。

</details>

### コントリビューション

コントリビューションや目的を絞ったPull Requestを歓迎します。アーキテクチャを変更する前に、次の文書をお読みください：

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [行動規範](../CODE_OF_CONDUCT.md)
- [セキュリティポリシー](../SECURITY.md)

<a id="faq"></a>
## よくある質問

<details>
<summary><strong>NZXT-ESCをインストールする必要がありますか？</strong></summary>

コアエディターに個別インストールは不要です。NZXT CAM Web Integrationから開いてください。ローカルのNowPlaying.WebSocket Windowsクライアントが必要なのは、オプションの音楽オーバーレイのみです。

</details>

<details>
<summary><strong>NZXT CAMなしでもNZXT-ESCは動作しますか？</strong></summary>

エディターは通常のブラウザーで開くことができ、デザイン用にモックセンサー値を使用します。リアルタイムのハードウェア監視とKrakenディスプレイへの出力にはNZXT CAM Web Integrationが必要です。

</details>

<details>
<summary><strong>どのNZXT Krakenモデルに対応していますか？</strong></summary>

NZXT-ESCは、NZXT CAM Web Integration表示モードに対応するNZXT Krakenデバイス向けに設計されています。利用可能な画面サイズと形状はNZXT CAM APIから取得されます。

</details>

<details>
<summary><strong>プリセットとローカルメディアはどこに保存されますか？</strong></summary>

プリセットはブラウザーのLocalStorageに、ローカル画像と動画はIndexedDBに保存されます。ブラウザー、Windows環境、PCを変更する場合は、重要なプリセットを定期的にエクスポートしてください。

</details>

<details>
<summary><strong>Now PlayingにはSpotifyが必要ですか？</strong></summary>

いいえ。NowPlaying.WebSocketは対応するWindowsメディアセッションとシステム音声を利用するため、ブラウザーや他の対応メディアアプリでも動作します。

</details>

<details>
<summary><strong>コミュニティプリセットは編集できますか？</strong></summary>

はい。Exploreからインポートしたプリセットは、Libraryへ追加した後にすべて編集できます。

</details>

<a id="license"></a>
## ライセンス

NZXT-ESCは**個人利用ライセンス**の下で公開されています。

**許可される利用:** 個人利用、個人的な改変、元プロジェクトへの明確なクレジットを付けた再配布。

**商用利用:** 販売、バンドル、貸与、有料製品への統合、その他の収益化を伴う利用には、プロジェクト所有者による事前の書面許可が必要です。
完全な条件は [LICENSEをご覧ください](../LICENSE).

## サポートとリンク

- **Webサイト:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **最新リリース:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **不具合報告・アイデア:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **コンパニオンアプリ:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

<div align="center">

NZXT-ESCがあなたの環境をより良くしたなら、継続的な開発を支援できます：

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

**Gökhan AKGÜL (mRGogo)**が開発 — コーヒーと疑わしい睡眠スケジュールで稼働中。

</div>
