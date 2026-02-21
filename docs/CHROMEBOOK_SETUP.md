# Chromebook での起動手順（スタンドアロン利用）

Chromebook をスタンドアロン（オフライン）で利用する場合のセットアップ手順です。  
**Mac 等で設定した内容をそのまま Chromebook に移行し、Chromebook での作業を最小限にします。**

---

## 準備（Mac 等で実施・1回だけ）

### 1. フォルダ一式を用意する

`lucky-draw` フォルダに以下が含まれていることを確認：

- `index.html`, `script.js`, `style.css`, `server.js`
- `sound/` フォルダ（SE・BGM の音声ファイル）
- 賞品画像（`prize_pics/` やアップロード済みのもの）

### 2. 設定を config.json にエクスポート

1. `node server.js` で起動し、ブラウザで `http://localhost:8080` を開く
2. 賞品タブの「更新」でスプシから賞品を読み込む
3. 設定タブ → 一般 → **「設定をエクスポート（config.json）」** をクリック
4. ダウンロードした `config.json` を **lucky-draw フォルダの直下** に保存

### 3. フォルダをメモリーカードにコピー

- `lucky-draw` フォルダ一式（`config.json` 含む）を SD カード等にコピー

---

## Chromebook での起動

### 1. メモリーカードから Linux へコピー

```bash
# 例: SD カードの lucky-draw をホーム直下にコピー
cp -r "/media/removable/SD Card/lucky-draw" ~/lucky-draw
```

### 2. サーバー起動

```bash
cd ~/lucky-draw
node server.js
```

### 3. ブラウザで開く

Chrome で `http://localhost:8080` を開く

### 4. config.json を読み込む（1回だけ）

1. 設定（⚙）→ 一般タブ
2. **「config.json を読み込み」** をクリック
3. 「config.json から設定を読み込みました」と表示されれば完了

---

## これで完了

- 賞品・SE・BGM・速度モード等の設定が Mac の状態で反映されます
- `sound/` フォルダ内のファイルがそのまま使われます
- 利用時はスタンドアロン（オフライン）で問題ありません

---

## 補足

| 項目 | 説明 |
|------|------|
| スプシ更新 | 利用時はオフラインのため不可。事前に「更新」で読み込んだ内容が config.json に保存されています |
| 画像 | 揃っていなくても動作します。プレースホルダー表示になります |
| Node.js | Chromebook の Linux に事前インストールが必要です |
