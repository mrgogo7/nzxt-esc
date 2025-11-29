> ⚠️ This document is an automatically translated version of the main English README.
> Technical terms, code blocks, filenames, and project terminology are intentionally kept in their original form.

# NZXT Elite Screen Customizer (NZXT-ESC) v5.11.27

NZXT Kraken Elite LCD画面用のモダンなブラウザベースのメディアおよびオーバーレイエディタ。

カスタムアニメーション背景、メトリックオーバーレイ、テキストレイヤー、区切り線、完全にパーソナライズされたレイアウトを作成 — すべてNZXT CAM内でライブ同期されます。

個人使用のみ無料 — 商用利用は厳禁です。

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
## 📋 目次

- [🚀 クイックスタート](#-クイックスタート)
  - [方法1 — 直接起動（推奨）](#方法1--直接起動推奨)
  - [方法2 — 手動インストール（NZXT CAM内）](#方法2--手動インストールnzxt-cam内)
  - [推奨：統合カードの名前変更](#推奨統合カードの名前変更)
- [🎛 エディタの使用（設定ボタン）](#-エディタの使用設定ボタン)
- [💡 NZXT-ESCの特徴](#-nzxt-esの特徴)
  - [1. デザイン指向の編集体験](#1-デザイン指向の編集体験)
  - [2. 完全な要素ベースのオーバーレイエンジン](#2-完全な要素ベースのオーバーレイエンジン)
  - [3. リアルタイムLCD同期](#3-リアルタイムlcd同期)
  - [4. 高度なメディアエンジン](#4-高度なメディアエンジン)
  - [5. プリセットシステム（早期アクセス）](#5-プリセットシステム早期アクセス)
- [🌍 サポート言語](#-サポート言語)
- [🧪 技術詳細](#-技術詳細)
- [🔧 開発者情報](#-開発者情報)
- [🕛 バージョン履歴](#-バージョン履歴)
- [🔗 リンク](#-リンク)
- [📜 ライセンス](#-ライセンス)

---
### 🚀 クイックスタート

NZXT-ESCは「Web Integration」機能を使用してNZXT CAM内で動作します。インストール方法は2つあります：

#### 方法1 — 直接起動（推奨）

1. これをブラウザのアドレスバーにコピーします：
   ```text
   nzxt-cam://action/load-web-integration?url=https://mrgogo7.github.io/nzxt-esc/
   ```
2. Enterキーを押します。
3. ブラウザに質問が表示されます：「nzxt-camリンクをNZXT CAMで開きますか？」 → 承認 / 許可
4. NZXT CAMが自動的に起動します。
5. 確認ウィンドウが表示されます：Web Integrationを読み込みますか？次のWeb統合を読み込んでもよろしいですか？
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
6. 「読み込む」を押します。
7. 読み込み後、「Custom Web Integration」カードを開きます。

#### 方法2 — 手動インストール（NZXT CAM内）

1. NZXT CAMを開きます。
2. 次に移動します：Lighting → Kraken Elite V2 → LCD Display
3. 表示モードを次に変更します：Web Integration
4. 次の名前のカードを見つけます：Custom Web Integration
5. 「Settings」をクリックします。
6. URLを入力します：
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
7. 「Apply」を押します。
8. 次に押します：Add as Card
9. 「My Web Integration」という名前の新しいWeb Integrationカードが表示されます。
10. 「My Web Integration」を選択します。
11. NZXT-ESCエディタを開くために「Configure」を押します。

#### 推奨：統合カードの名前変更

NZXT CAMはデフォルト名「My Web Integration」を割り当てます。名前を変更するには：
1. 「My Web Integration」を選択します。
2. 「Edit」を押します。
3. フィールドを次に変更します：Title:
   ```text
   Elite Screen Customizer
   ```
   Description:
   ```text
   NZXT Elite Screen Customizer (NZXT-ESC)
   ```
これにより、統合を他のものと区別しやすくなります。

---
### 🎛 エディタの使用（設定ボタン）

すべての編集は「Configure」ボタンを通じてNZXT CAM内で実行されます。

エディタ内で以下を実行できます：

- メトリック、テキスト、区切り要素の追加 / 削除（オーバーレイあたり最大20要素）
- 位置、回転、スケール、不透明度、色の調整
- MP4 / GIF / PNG / JPG背景メディアの選択
- IndexedDB経由でブラウザに保存されたLocal Mediaファイルの使用
- プリセットの管理（Import, Export, Duplicate, Delete, Rename, Apply）
- オーバーレイプリセットテンプレートの使用（Single, Dual, Triple, Quadruple InfoGraphicレイアウト）
- ReplaceまたはAppendオプションでオーバーレイプリセットのインポート
- Quick Favoritesドロップダウンでお気に入りプリセット間の迅速な切り替え
- Kraken Elite LCD上でリアルタイムですべての変更をプレビュー

外部URLやconfig.htmlは不要になりました。

---
### 💡 NZXT-ESCの特徴

NZXT-ESCはテーマパックではありません — Kraken Elite LCD専用に構築された**完全なデザイン指向のレイアウトエディタ**です。

NZXT CAMがネイティブにサポートするものをはるかに超えた完全な創造的自由を提供します。

NZXT CAMは**以下を許可しません**：
- 自由な要素配置  
- 要素のスケーリングまたは回転  
- カスタムテキストオーバーレイ  
- 透明色  
- MP4背景  
- YouTube背景  
- Pinterest URL  
- 混合メディア + オーバーレイの組み合わせ  

NZXT-ESCは**これらすべてを可能にします**。

#### 1. デザイン指向の編集体験

- 自由なドラッグアンドドロップ配置
- 要素ごとの回転とスケーリング
- 円形LCDプレビュー周辺の変換ハンドル
- 矢印キーによる微調整
- 最小限で気が散らないインターフェース
- 実際のハードウェアと一致する正確な円形プレビュー

#### 2. 完全な要素ベースのオーバーレイエンジン

レガシーSingle/Dual/Tripleモードは完全に削除されました。

以下を自由に追加できます：

- メトリック要素
- テキスト要素
- 区切り要素

各要素は以下をサポートします：

- X/Y位置
- 回転
- スケール
- 色と不透明度
- 選択ハイライト

**オーバーレイプリセットシステム**

テンプレート選択モーダルを使用して、事前設定されたレイアウトを迅速に適用します。Single、Dual、Triple、またはQuadruple InfoGraphicテンプレートから選択します。各テンプレートは最適化された配置とスタイリングを備えています。テンプレートはReplaceモード（既存の要素を上書き）またはAppendモード（既存の要素に追加）でインポートできます。追加時、zIndex値はレンダリングの競合を防ぐために自動的に正規化されます。システムは設定あたり最大20のオーバーレイ要素をサポートします。

#### 3. リアルタイムLCD同期

- 安定性のための~100msスロットルで更新
- 手動更新は不要
- 編集するとLCD画面が即座に更新されます

#### 4. 高度なメディアエンジン

メディアエンジンは以下をサポートします：

- MP4ビデオ（LCDでの完全再生）
- GIFアニメーション
- PNG / JPG画像
- Local Mediaファイル（IndexedDB）：コンピュータから直接読み込まれたフル解像度の画像とビデオ
- **Pinterest URL → 直接メディアに自動解決**
- **YouTube URL（LCD再生）**


##### **🆕 Local Mediaサポート（新機能）**

NZXT-ESCには、**ローカル画像またはビデオ**を直接エディタに読み込むための統合システムが含まれています。  
ファイルは**IndexedDB**に安全に保存され、デバイスから離れることはありません。

サポートされるファイルタイプ：
- JPG / PNG / GIF  
- MP4ビデオ  
- 最大サイズ：**150 MB**

主な機能：
- 完全オフライン使用 — 外部ホスティング不要  
- 回転、スケール、fit/align、およびすべての変換ツールで動作  
- リモートメディアと同一のリアルタイムLCD同期  
- 各プリセットは1つのローカルメディア参照を含むことができます  
- ローカルメディアはエクスポートされたプリセットファイル内に**含まれません**  
- インポート時、ローカルメディアを使用していたプリセットは警告を表示し、再選択を許可します

このシステムにより、エディタの変換エンジンと100%互換性を保ちながら、真のオフライン、プライバシーに配慮した背景が可能になります。


**YouTube統合のハイライト：**

- YouTubeビデオは**実際のLCDで再生**されます（autoplay/mute/loopサポート）
- エディタのプレビューは、埋め込みプレーヤーの制限によりYouTubeビデオを再生できません  
- 代わりに、**赤いドラッグ可能なプレースホルダー**が表示されます  
- ユーザーは以下を実行できます：
  - YouTubeビデオの位置を設定  
  - ビデオをスケーリング  
  - align/fit設定を適用  
  - 上に任意のオーバーレイ要素を配置  
- LCDは常にリアルタイムで最終結果を反映します  
- すべての標準背景ツールはYouTubeとシームレスに動作します

フィットモード：

- **Cover** — ディスプレイ全体を埋める  
- **Contain** — 完全なアスペクト比を維持  
- **Fill** — フィットするように伸縮（オプション）  

これにより、NZXT-ESCはNZXT CAM用の最初の完全なYouTube対応LCDエディタになります。

#### 5. プリセットシステム（早期アクセス）

利用可能なアクション：

- Import
- Export
- Delete
- Duplicate
- Rename
- Apply

プリセットは完全なレイアウトをJSONとして保存します。

**オーバーレイプリセットのインポート/エクスポート**

オーバーレイ要素設定を`.nzxt-esc-overlay-preset`ファイルとしてエクスポートして、バックアップまたは共有します。検証とエラー処理を備えたオーバーレイプリセットをインポートします。インポート時、既存の要素を上書きするにはReplaceモードを選択するか、現在の要素を保持しながら新しい要素を追加するにはAppendモードを選択します。インポートシステムには、テンプレート要素の自動ID生成と追加コンテンツのzIndex正規化が含まれます。

**Quick Favoritesドロップダウン**

Preset Managerボタンにマウスを合わせると、最大10個のお気に入りプリセット（★でマーク）をリストするコンパクトなドロップダウンが表示されます。各エントリには、プリセット名、お気に入りステータス、現在適用されているプリセットの「アクティブ」インジケーターが表示されます。アイテムを選択すると、完全なマネージャーと同じアトミックマージと自動保存ロジックを使用して、そのプリセットが即座に適用されます。ドロップダウンには、スムーズなフェードイン/フェードアウトアニメーションが含まれ、完全なPreset Managerインターフェースを開くための直接リンクが含まれています。これにより、少数の優先プリセット間で頻繁に切り替えるユーザー向けに、非常に高速なワークフローが提供されます。

##### **Local Media & Presets**
- エクスポートされたプリセットファイルにはローカルメディアバイナリが**含まれません**  
- 以前にローカルメディアを使用していたプリセットをインポートすると、ガイド付き警告が表示されます  
- ユーザーは新しい**Browse**モーダルを通じてファイルを再選択できます  
- すべての既存のプリセット機能（Apply, Duplicate, Rename, Delete）はローカルメディア参照を完全にサポートします  
- プリセットの切り替えは、IndexedDBから適切なローカルメディアを自動的に読み込みます（利用可能な場合）

---
### 🌍 サポート言語

NZXT-ESCは、ローカライズされたユーザー体験のために複数の言語をサポートします。エディタヘッダーの言語セレクターを使用して言語を切り替えます。

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

すべての翻訳は、簡単な管理と更新のために単一のTypeScriptファイルで維持されます。

---
### 🧪 技術詳細

- React 18
- TypeScript
- Vite bundler
- LocalStorage同期 + イベントブロードキャスト
- 円形LCD対応レンダーエンジン
- AABB + 回転変換数学
- テンプレートベースの要素生成を備えたオーバーレイプリセットシステム
- 自動ID割り当てとzIndex正規化
- 多言語UIサポート（English, Turkish, Spanish, German, Portuguese, French, Italian, Japanese）

---
### 🔧 開発者情報

クローンとインストール：

```bash
git clone https://github.com/mrgogo7/nzxt-esc
cd nzxt-esc
npm install
```

開発サーバーの起動：

```bash
npm run dev
```

NZXT CAMテスト用にLANで公開：

```bash
npm run dev -- --host
```

ビルド：

```bash
npm run build
```

ビルドのプレビュー：

```bash
npm run preview
```

**Contributing:**

- 大きな変更を開始する前にIssueを開く
- PRを小さく集中させる
- 明確なコミットメッセージを使用する
- プロジェクト構造に従う

---
### 🕛 バージョン履歴

#### 5.11.261 — Local Mediaサポート + エディタ改善（新機能）

**リリース日：** 2025-11-26

##### 🆕 新機能
- **Local Media背景（IndexedDB）**
  - コンピュータから直接JPG、PNG、GIF、またはMP4をインポート  
  - IndexedDB経由で安全に保存されたファイル  
  - オフラインで動作  
  - すべてのfit/scale/align変換モードと互換性あり  
  - Kraken LCDとリアルタイムで完全同期  
  - URLフィールドは多言語形式で`Local: filename.ext`を表示  

##### 💡 プリセットシステムの改善
- ローカルメディアを含むプリセットのエクスポートは警告をトリガーします（メディアは含まれません）  
- そのようなプリセットのインポートは再選択メッセージを表示します  
- プリセットの切り替えは、利用可能な場合、ローカルメディアを自動的に読み込みます  

##### 🖥 UI改善
- ローカルメディアを選択するための新しいBrowseモーダル  
- すべてのローカルメディアメッセージの完全な多言語サポート  
- 新しいボタンアイコン + 更新されたスタイリング  

##### 🧩 安定性の改善
- 改善されたメディア解決パイプライン  
- リークを防ぐためのBlob取り消し + クリーンアップ  
- より良いエラー処理とi18nカバレッジ  

#### 5.11.26 — Kraken LCDリアルタイム同期の大幅改善とオーバーレイ安定性の改善

**追加注記：**  
- 新しいプレースホルダーベースのプレビューシステムを使用した完全な位置/スケール配置で**YouTube背景サポート**（LCD再生）が導入されました。  
- 統一された変換数学により、比例プレビュー ↔ LCD配置が保証されます。

#### 5.11.241 — Kraken LCDリアルタイム同期の大幅改善とオーバーレイ安定性の改善

**リリース日：** 2025-11-24

##### 🔧 主要なシステム改善

- **Kraken LCDリアルタイム同期の大幅改善**  
  リアルタイムLCD同期は新しく導入されたものではありませんが、内部システム全体が再構築されました。以前の実装はプリセット再読み込みサイクルに依存しており、遅延、更新の見逃し、スナップバック動作を引き起こしていました。新しいBroadcastChannelベースのクロスタブ同期アーキテクチャは、安定した、低遅延の、フレーム同期更新フローを提供します。

##### 🛠 改善

- **オーバーレイレンダリングの信頼性の改善**  
  ランタイムオーバーレイ状態が空の場合、システムは保存されたプリセットオーバーレイデータに安全にフォールバックします。

- **背景/メディアの安定性アップグレード**  
  入力変更時の変換スナップバックが削除されました。

- **KrakenOverlayビューアーの最適化**  
  プリセットを再読み込みしなくなりました。即座の更新のためにランタイム変更を直接リッスンします。

##### 🐞 バグ修正

- 遅延したLCD更新が修正されました（以前はドラッグ終了後にのみ更新されていました）。

- 更新後のKrakenビューで欠落していたオーバーレイが修正されました。

- オーバーレイプリセットを追加する際の重複Reactキー警告が修正されました。

- 調整中にメディア/背景設定が元に戻る問題が修正されました。

##### ⚙ アーキテクチャの変更

- タブ間通信用の専用`runtimeBroadcast.ts`モジュールが導入されました。

- ブロードキャストループなしで安全なランタイム更新のための`setElementsForPresetSilent()`が追加されました。

- `useOverlayConfig()`がkrakenMode + ストレージフォールバックを適切に処理するように更新されました。

- すべてのオーバーレイ更新ソースが単一のランタイム駆動パイプラインに統一されました。

##### 📁 開発者向け注記

- BroadcastChannelはサポートされていない場合、適切にフォールバックします。

- ランタイム更新は、変異の問題を防ぐために同期前に深くクローンされます。

- このリリースは、古い同期アーキテクチャをモダンで安定したリアルタイムパイプラインに置き換えます。

#### v5.11.24

- オーバーレイ & プリセットマネージャーの品質向上パック
- 新しいオーバーレイエクスポートモーダル：エクスポートはクリーンなモーダルを使用してファイル名を要求します（ENTERキーをサポート）
- 新しいプリセットボタン：デフォルト値で完全に新しい空のプリセットを即座に作成
- 改善されたプリセットマネージャーUI：プリセットアクションボタンの並び替え：Delete → Favorite → Duplicate → Rename → Apply
- 改善されたオーバーレイ管理：
  - 「Clear All Overlay Elements」は確認モーダルを使用します
  - Deleteキーは選択された要素を削除します（確認モーダル付き）
  - すべての削除ボタンにツールチップサポートが追加されました
- グローバルモーダルの使いやすさの向上：すべてのモーダルがENTERキーによる確認をサポートします
- オーバーレイプリセットAppendのID衝突修正：追加時に要素IDを再生成することで、重複Reactキーの問題が完全に解決されました
- 一般的な安定性の改善：ランタイムアーキテクチャが保持され、自動保存ルールが尊重され、すべてのFAZ-9制約がそのまま残ります

#### v5.11.23

- テンプレート選択モーダルを備えたオーバーレイプリセットシステム
- Single、Dual、Triple、Quadruple InfoGraphicテンプレート
- ReplaceおよびAppendモードを備えたオーバーレイプリセットのインポート/エクスポート
- 要素制限がオーバーレイあたり20に増加
- 追加されたテンプレートの自動zIndex正規化
- テンプレート定義からの動的テンプレートリスト生成
- インポート/エクスポート操作のエラー通知の強化
- ビューポート対応メニュー配置の改善

#### v5.11.21

- 要素ベースのレイアウトエンジン
- 回転とスケール変換システム
- 選択ハイライト
- 矢印キー移動
- レガシーモードの削除
- 完全なプリセットマネージャー（Import/Export/Duplicate/Delete/Rename/Apply）
- 即座のプリセット切り替え用のQuick Favoritesドロップダウン
- UXと安定性の改善

以前のバージョンについては、GitHub Releasesを参照してください。

---
### 🔗 リンク

Repository: https://github.com/mrgogo7/nzxt-esc/

Support: [GitHub Sponsors](https://github.com/sponsors/mrgogo7) • [Patreon](https://www.patreon.com/mRGogo7) • [Buy Me a Coffee](https://www.buymeacoffee.com/mrgogo)

Issues:

https://github.com/mrgogo7/nzxt-esc/issues

---
### 📜 ライセンス

個人使用ライセンス

**許可：** 個人使用 • 個人による変更 • クレジット付き再配布

**禁止：** 商用利用 • あらゆる形式での販売、バンドル、レンタル、または収益化

NZXT-ESCは、個人使用のみを目的とした趣味とコミュニティ主導のプロジェクトです。

<details>
<summary><strong>📁 完全なSEOキーワードインデックス（クリックして展開）</strong></summary>

**nzxt kraken elite lcd editor, nzxt cam customization, nzxt web integration custom, nzxt animated lcd background, mp4 lcd background nzxt, youtube kraken elite lcd, nzxt gif overlay, nzxt overlay editor, custom lcd screen nzxt, nzxt cam alternatives, nzxt cam limitations, kraken elite custom display, nzxt lcd text editor, nzxt lcd metrics overlay, nzxt lcd mods, nzxt pinterest background, nzxt lcd media engine, nzxt-esc project, nzxt cam modding, nzxt kraken elite youtube support, custom nzxt layouts, nzxt cam web integration presets, nzxt overlay templates, nzxt custom ui editor, nzxt lcd graphics editor, nzxt real-time lcd sync, kraken elite advanced customization, nzxt cam mp4 support, nzxt cam gif support, nzxt cam youtube embed, nzxt cam background editor**

</details>

