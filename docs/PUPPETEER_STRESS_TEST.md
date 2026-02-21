# ストレステスト（Puppeteer）の起動について

## 解決策（ここからやること）

**Cursor の外で、OS のターミナルを 1 つ開いて、次のどちらかを実行する。**

### 方法A: 1 コマンドでサーバー起動＋テスト（おすすめ）

ターミナルでプロジェクトのフォルダに移動してから:

```bash
cd /Users/kata-mba/Desktop/lucky-draw
npm run test:stress:run
```

- サーバーがまだ動いていなければ **自動で起動** してからストレステストを実行する。
- すでに `node server.js` で起動していれば、そのままストレステストだけ実行する。
- 100 回プレイが終わると終了する（回数変更: `PLAY_COUNT=50 npm run test:stress:run`）。

### 方法B: サーバーとテストを別々に動かす

**ターミナル 1:**

```bash
cd /Users/kata-mba/Desktop/lucky-draw
node server.js
```

**ターミナル 2:**

```bash
cd /Users/kata-mba/Desktop/lucky-draw
npm run test:stress
# または回数指定
PLAY_COUNT=100 node scripts/stress-play.test.js
```

---

## なぜ Cursor からだと動かないか

IDE（Cursor）の実行環境では **サンドボックス** により、Puppeteer が Chrome を **子プロセスとして起動することがブロック** されます。  
そのため「Cursor のターミナルや Run から」実行するとストレステストは失敗し、**OS のターミナル（Terminal.app など）から実行すると動く** 状態になります。

---

## Puppeteer が起動しないときの確認

**「Failed to launch the browser process: Code: null」** が出る場合:

1. **必ず OS のターミナルで実行しているか** 確認する（Cursor の統合ターミナルではなく、Terminal.app 等）。
2. Chrome が入っていない場合は: `npx puppeteer browsers install chrome`
3. システムの Chrome を明示する（例: macOS）:
   ```bash
   PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:stress:run
   ```

---

## 検出された問題の根本原因

テスト結果で `winner_overlay_not_shown` や 404 が出る場合の原因と対策は [STRESS_TEST_ISSUES.md](./STRESS_TEST_ISSUES.md) を参照。
