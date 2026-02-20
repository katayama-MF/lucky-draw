# リール停止〜当選表示の実装仕様（現状の説明）

変更の有無は判断用。実装がどうなっているかの説明のみ。

---

## 1. 標準モードでの想定シーケンス

1. **START** → リール加速・回転開始（state='spinning'）
2. **STOP** → `stopSpin()` が呼ばれる
   - 抽選（actualWinnerSlotIdx, targetReelPos を決定）
   - state='stopping'
   - フォールバック用に 9 秒タイマーをセット（後述）
   - **runStop()** を `requestAnimationFrame` で開始
3. **runStop(now)** が毎フレーム呼ばれる
   - **毎フレーム先頭で** `#reelStrip` の `children.length === 0` をチェック（後述・経路A）
   - そうでなければ: 減速計算（moved, remaining）。`reelPos` を更新して `setPos(reelPos)` で描画
   - **remaining <= 0** になったフレームで: `wrapPos()`, `setPos(reelPos)` して **runPatternFinale()** を一度だけ呼び、return（ここで減速ループ終了＝「完全に止まった」扱い）
4. **runPatternFinale()**
   - パターン（Normal など）に応じて **smoothMove** や Pendulum の振動など
   - **アニメーションが完了したとき**にコールバックで **goToConfirmed()** を呼ぶ
5. **goToConfirmed()**
   - `reelPos = targetReelPos` にスナップ、`setPos(reelPos)`
   - フレームに `confirmed` を付与
   - **setTimeout(showWinner, viewingMs)** をセット（標準で REEL_VIEWING_MS=1800ms、ランク別で 1800〜2200ms）
6. **showWinner()**
   - 当選スロットを確定し、**showWinnerDisplay()** で winnerOverlay に `.show` を付与 → 画面上で当選賞品を表示

意図としては「リールが完全に止まる → パターン演出完了 → 確定 → 目視時間経過 → 当選表示」という順序。

---

## 2. showWinner() が呼ばれる全経路（現状の実装）

| # | 経路 | 条件 | いつ showWinner が呼ばれるか |
|---|------|------|------------------------------|
| **1** | **goToConfirmed() 内** | パターン演出が完了し、goToConfirmed() が実行されたとき | **viewingMs 後**（標準で 1800ms 前後）。リールはとっくに止まった後。 |
| **2** | **_showWinnerFallbackTimer** | STOP から 9 秒経過しても state が 'stopping' のまま（通常フローがどこかで止まった場合） | **9 秒後**。フォールバック用。 |
| **3** | **runStop() の先頭分岐** | そのフレームで `#reelStrip.children.length === 0` だったとき | buildReel()、150ms 後に ensureReelVisible のみ。**showWinner() は呼ばない**。当選表示は通常フロー（次のフレーム以降で remaining<=0 → runPatternFinale → goToConfirmed）か、9秒フォールバックに任せる。 |
| **4** | **smoothMove の tick 内の分岐** | パターン演出の某一フレームで strip の子が 0 だったとき | 同様に buildReel()、150ms 後に ensureReelVisible のみ。**showWinner() は呼ばない**。 |

経路 1 が「止まってから目視時間後に表示」の正規ルート。経路 3・4 は strip 復旧のみ行い、当選表示は別経路に任せる。

---

## 3. 経路 3・4 の扱い

- strip が空のときは **buildReel() と ensureReelVisible で復旧するだけ**。showWinner() は呼ばない。
- 当選表示は、その後の通常フロー（remaining<=0 → runPatternFinale → goToConfirmed → viewingMs 後に showWinner）か、9秒フォールバックで行う。

---

## 4. その他・補足

- **Normal で alreadyAtTarget のとき**: runStop で remaining<=0 になった時点で reelPos はほぼ targetReelPos。runPatternFinale() で `setTimeout(goToConfirmed, 80)` だけして、80ms 後に goToConfirmed() → その中で setTimeout(showWinner, viewingMs)。この経路では「止まってから 80ms で確定 → さらに viewingMs で当選表示」なので、止まる前に表示はしない。
- **フォールバック**: goToConfirmed が何らかの理由で呼ばれない場合、9 秒後に showWinner が一度だけ呼ばれる。

---

変更するかどうかはこの仕様を踏まえて判断できるようにした。コードは一切変更していない。
