# Chromebook 8GB での利用（SDカード移行・起動チェック）

lucky-draw フォルダを SD カードに保存し、別の Chromebook の Linux 直下にコピーして起動・利用する手順と、**メモリ 8GB を制約にした起動チェック**の結果です。

---

## 1. 持っていくもの

- **lucky-draw フォルダごと**（中身すべて）を SD カードにコピーする。
- 必須ファイル: `index.html`, `script.js`, `style.css`, `server.js`, `package.json`, `config.json`（あれば）、`docs/`, `scripts/` など一式。

---

## 2. 別 Chromebook での手順（Linux 直下で利用）

1. SD カードを挿入し、**lucky-draw フォルダ全体**を Linux のホーム直下（または任意の場所）にコピーする。  
   例: `/home/ユーザー名/lucky-draw`
2. ターミナルを開き、そのフォルダに移動する。  
   `cd ~/lucky-draw`（パスは環境に合わせる）
3. **本番で必要なのは Node.js だけ**です。  
   - 起動: `node server.js`  
   - ブラウザで **http://localhost:8080** を開く。  
   - 終了: ターミナルで `Ctrl+C`

**npm install は必須ではありません。**  
`server.js` は Node の標準モジュール（`http`, `fs`, `path`）だけを使うため、そのまま動きます。

---

## 3. 8GB メモリを制約にした起動チェック

### 3.1 実施したテスト

| テスト | 内容 | 結果（要約） |
|--------|------|--------------|
| **startup-check:loop (5回)** | メモリ 256MB 制限で server.js を起動→GET で応答確認→終了を 5 回繰り返し | 全ラウンド成功 |
| **startup-check:loop (15回)** | 上記を 15 回繰り返し（メモリリーク・不安定の検出） | 全ラウンド成功 |
| **startup-check** | 既起動サーバーへ `/`, `/index.html`, `/script.js`, `/style.css` の GET | 応答 OK |
| **npm run test** | デバッグ用軽量テスト（DOM 不要） | 完了 |

### 3.2 クリティカルな問題（起動まわり）

- **サーバー起動**: メモリ 256MB に制限しても、起動→応答→終了を 15 回連続で成功。**本番の node server.js は 8GB 環境でクリティカルな問題は検出されていません。**
- **静的ファイル**: `/`, `index.html`, `script.js`, `style.css` はいずれも 200 で返り、最低限のサイズも満たしています。

### 3.3 8GB で注意すること

- **Puppeteer を使うテスト（ストレステスト）**  
  `npm run test:stress` や `npm run test:cycle:full` は Puppeteer（Chrome 起動）を使うため、**8GB マシンでは負荷が高く、省略してよい**です。  
  本番利用は「node server.js + ブラウザで http://localhost:8080」だけなので、Puppeteer は不要です。
- **npm install をした場合**  
  `npm install` すると `puppeteer` と `sharp` が入ります。ストレステストをしないなら、8GB では **npm install をしなくてよい**運用にすると安全です。
- **npx serve は使わない**  
  本番は **node server.js** を使うことを推奨します。`npx serve` は初回にパッケージを取得するため、オフラインやメモリが厳しい環境では不利です。
- **リールの回転について（8GB で滑らかに動かすため）**  
  賞品が 300 件を超える場合、リールは「窓付き」になり、**表示は約 300 要素だけ**に抑えています（メモリ負荷軽減）。窓の切り替えは **180ms 以上間隔をあけて**行うため、回転中に一瞬止まったように見えることを抑えています。  
  それでもカクつく場合は、**他のタブを閉じる**か、賞品数を 300 以下にすると安定しやすくなります。

---

## 4. 移行先で起動できるか確認したいとき（軽量チェック）

**Puppeteer は使いません。** サーバーを一時起動して GET で応答を見るだけです。

```bash
# サーバーを起動してからチェックして終了（1回）
npm run startup-check:spawn

# メモリを絞って 5 回繰り返し（不安定・メモリリークの確認）
NODE_OPTIONS="--max-old-space-size=256" npm run startup-check:loop
```

- すでに `node server.js` でサーバーを起動している場合は、別ターミナルで:  
  `npm run startup-check`  
  で「起動・応答 OK」が出れば問題ありません。

---

## 5. まとめ（クリティカルな点）

| 項目 | 判定 |
|------|------|
| フォルダごと SD → 別 Chromebook Linux にコピー | そのまま利用可能 |
| 起動方法 | `node server.js` → ブラウザで http://localhost:8080 |
| npm install | 本番では不要（server.js のみで動作） |
| 8GB でのサーバー起動・応答 | 256MB 制限下 15 回連続で問題なし |
| ストレステスト（Puppeteer） | 8GB では省略推奨。本番動作には不要 |

以上のチェックでは、**起動と静的配信に関するクリティカルな問題は検出されていません**。移行先でも `node server.js` で起動し、ブラウザで http://localhost:8080 を開いて利用できます。

---

## 6. ストレステストをどうしても実行する場合（8GB・任意）

`npm install` 済みで、ストレステストを軽く試す場合:

```bash
# サーバーを別ターミナルで起動: node server.js
PLAY_COUNT=20 npm run test:stress
```

回数は 20〜50 程度に抑えると 8GB でも負荷が軽くなります。本番利用には不要です。
