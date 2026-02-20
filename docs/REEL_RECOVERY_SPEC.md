# リールが消えた場合の緊急処理・復旧一覧

**一括オフ**: script.js 先頭付近の `REEL_RECOVERY_ENABLED=false` を `true` にすると復旧が有効になる。`false` のときは以下すべての復旧処理が実行されない。

`#reelStrip` の子が 0 になる、または「少なすぎる」と判定されたときに動く処理を一覧にした。変更時はこのドキュメントと実装を整合させること。

---

## 1. ensureReelVisible()

**場所**: script.js 997行付近

**役割**: リールが空、または子が少なすぎる場合に buildReel() で復元する。

- **空**: `strip.children.length === 0`
- **少なすぎ**: 賞品ありかつ `children.length < expectedMin`（expectedMin = min(20, ceil(slotAssignments.length*0.4))）
- **スキップ条件**: 賞品なし、または `_buildReelInProgress`、または state が `spinning` / `stopping`（このときは 400ms 後に再実行）
- **実行**: 上記でなければ buildReel() をその場で呼ぶ。

**呼ばれるタイミング**（他から）:
- 初期化: 100ms / 400ms / 800ms の setTimeout（3679行付近）
- 5秒ごとの setInterval（3679行付近）
- 定期確認の setInterval（後述）から strip が空のとき
- runStop 内で strip が空のとき（buildReel のあと 150ms 後に 1 回）
- smoothMove の tick 内で strip が空のとき（同上）
- buildReel 完了直後の setTimeout(150)（1159行付近）
- buildReelChunked 完了直後の setTimeout(150)（1261行付近）
- __reelRecover()（コンソール用・1023行）

---

## 2. buildReel() 内のスキップ時・完了後の復旧

**state が idle / showing 以外でスキップしたとき**（1049〜1055行）  
- その場では strip を更新しない。  
- **strip が空かつ賞品あり**なら `setTimeout(()=>{ if(strip.children.length===0) buildReel(); }, 0)` で再試行。

**strip 更新をスキップしたとき**（1113〜1119行・state が idle/showing 以外）  
- 同様に、strip が空かつ賞品ありなら `setTimeout(..., 0)` で buildReel を再試行。

**子要素の差し替えで例外**（1140〜1145行）  
- catch 内で、もともと子がいたのに strip が空になっていれば `setTimeout(()=>buildReel(), 0)`。

**差し替え直後に strip が空**（1147〜1150行）  
- 「完了直後に strip が空 → 復元を試行」とログし、`setTimeout(()=>buildReel(), 0)`。

---

## 3. buildReelChunked() 内

**非同期の最初で strip が空**（1205〜1208行）  
- buildReel() をその場で呼び、return。

**差し替え前に strip が空**（1213〜1216行）  
- 賞品ありなら `setTimeout(()=>buildReel(), 0)` して return。

---

## 4. startSpin() の入口

**場所**: 1411〜1425行付近

- strip が空なら buildReel()。  
- まだ空なら _buildReelInProgress を false にして再度 buildReel()。  
- それでも strip が空なら「賞品はありますがリールを表示できません」とログして return（回転開始しない）。

---

## 5. 回転中の animate()（加速フェーズ）

**場所**: 1477〜1491行付近

- 毎フレーム strip が空かチェック。  
- **空なら 1 回だけ**: アニメ停止、state='idle'、setBtnState('start')、buildReel()、まだ空なら _buildReelInProgress=false して buildReel()、150ms 後に ensureReelVisible()、ログ「リールが消えていたため復元しました。もう一度 START を押してください」。

---

## 6. stopSpin() の入口

**場所**: 1533〜1538行付近

- strip が空かつ賞品ありなら、その場で buildReel() してから strip を再取得し、減速処理に進む。

---

## 7. runStop() の先頭（減速中）

**場所**: 1740〜1750行付近

- そのフレームで strip が空なら: アニメ停止、buildReel()、まだ空なら _buildReelInProgress=false して buildReel()、150ms 後に ensureReelVisible()、return（当選表示は呼ばない）。

---

## 8. smoothMove の tick 内（パターン演出中）

**場所**: 1657〜1666行付近

- 同上。strip が空なら buildReel()、ensureReelVisible(150)、return。

---

## 9. showWinner() の入口

**場所**: 1835〜1840行付近

- strip が空かつ賞品ありなら buildReel()、まだ空なら _buildReelInProgress=false して buildReel()。そのあと当選表示処理を続行。

---

## 10. nextDraw() 内

**場所**: 1900〜1905行付近

- strip が空かつ賞品ありなら _buildReelInProgress=false して buildReel()。そのあと「次へ」の処理を続行。

---

## 11. MutationObserver（strip の子が 0 になった瞬間）

**場所**: 3614〜3641行付近（IIFE で 1 回だけ登録）

- strip の childList を監視。  
- **子が 0 になったら**: ログ用に __lastReelEmptyState / __lastReelEmptyTime / __lastReelEmptyHistory 等をセット。2 秒に 1 回まで logPanel「リールが消えました → 復元を試行しています…」と console.warn。  
- **state が spinning / stopping 以外**かつ賞品ありなら `setTimeout(()=>{ if(strip.children.length===0) buildReel(); }, 0)`。

---

## 12. 定期確認（2 秒ごと）

**場所**: 3665〜3675行付近

- 2 秒ごとに strip.children.length を確認。  
- **0 なら**: 2 秒に 1 回まで logPanel「リールが空（定期確認）→ 復元を試行」し、**ensureReelVisible()** を呼ぶ。

---

## 13. 5 秒ごとのセーフティネット

**場所**: 3677〜3679行付近

- **setInterval(()=> ensureReelVisible(), 5000)** で、5 秒ごとに ensureReelVisible() を実行（空でなくても「子が少なすぎ」なら buildReel する）。

---

## 14. 初期化時の遅延復元

**場所**: 3681行付近

- **100ms / 400ms / 800ms** の 3 回、setTimeout で ensureReelVisible() を呼ぶ。初期化のタイミングずれでリールが空になった場合の復元用。

---

## 15. コンソール用

- **__reelHealth()**: strip の子数・state・needRecover などを返す（1016〜1021行）。  
- **__reelRecover()**: ensureReelVisible() を 1 回呼ぶ（1023行）。  
- **__reelDebugDump()**: リールが消えた原因切り分け用の状態をコンソールに出す（3644〜3661行）。

---

## まとめ（緊急処理が入る箇所）

| 種類 | きっかけ | 行うこと |
|------|----------|----------|
| ensureReelVisible | 空/少なすぎ、または定期・初期化 | buildReel()（spinning/stopping 時は 400ms 後再実行） |
| buildReel スキップ時 | state でスキップしたが strip が空 | setTimeout(buildReel, 0) |
| buildReel 例外・完了後空 | 差し替え失敗 or 直後に空 | setTimeout(buildReel, 0) |
| buildReelChunked | 非同期中に strip が空 | buildReel() または setTimeout(buildReel, 0) |
| startSpin | 入口で strip が空 | buildReel() 最大 2 回、ダメなら return |
| animate（回転中） | 1 フレーム目で strip が空 | 停止 → buildReel → ensureReelVisible(150) |
| stopSpin | 入口で strip が空 | buildReel() してから続行 |
| runStop | 減速中に strip が空 | buildReel → ensureReelVisible(150)、return |
| smoothMove tick | 演出中に strip が空 | 同上 |
| showWinner | 入口で strip が空 | buildReel() してから表示続行 |
| nextDraw | 入口で strip が空 | buildReel() してから次へ続行 |
| MutationObserver | strip の子が 0 になった瞬間 | ログ + (spinning/stopping 以外なら setTimeout(buildReel, 0)) |
| setInterval 2秒 | 2 秒ごとに strip が 0 | ensureReelVisible() |
| setInterval 5秒 | 5 秒ごと | ensureReelVisible() |
| 初期化 | 100/400/800 ms 後 | ensureReelVisible() |

以上が、リールが消えた場合の緊急処理・復旧の一覧である。
