# STOPボタン押下時の挙動 実装仕様

2段階リールモード（USE_TWO_STAGE_REEL=true）を前提。

---

## 1. 全体フロー

```
[レートリール回転中] state=rate_spinning
    → STOP押下 → stopRateSpin()
    → 抽選 → 減速 → 停止 → 目視1秒 → onRateStopped()

[賞品リール待機] state=awaiting_prize_reel
    → START押下 → startPrizeReelSpin()（賞品リール回転開始）

[賞品リール回転中] state=prize_spinning
    → STOP押下 → stopPrizeReel() → prizeReelDecelTrigger()
    → 減速 → 停止 → 目視1秒 → showWinnerTwoStage()
```

---

## 2. STOPボタンの有効化タイミング

| 状態 | ボタン | STOP有効になるまでの時間 |
|------|--------|---------------------------|
| rate_spinning | STOP | 標準: 1125 ms / サクサク: 750 ms |
| prize_spinning | STOP | 標準: 1125 ms / サクサク: 750 ms |

- `setTimeout(..., config.speedMode==='fast'?750:1125)` で btn.disabled を false に
- その間は `btn.disabled` のため押下無効（二重押し防止）

---

## 3. レートリール STOP（stopRateSpin）

### 3.1 入口チェック

- `if(btn&&btn.disabled) return` … disabled 中は何もしない
- `if(reelAnim!==null) cancelAnimationFrame(reelAnim)` … 回転アニメーションを停止
- `if(state!=='rate_spinning') return` … 状態ガード

### 3.2 即時処理

1. `state='rate_stopping'`
2. `setBtnState('stopping')` … ボタン「DRAWING」、disabled
3. `SE.stop()` … ストップSE
4. `reelFrame`, `hitZone` に `hot` クラス追加
5. `pickRateRandom()` で当選レートを抽選

### 3.3 停止位置の決定

- 当選レートのスロットから1つをランダムに選択
- `targetReelPos = posForSlot(targetSlotIdx)`
- 逆回転しないよう `targetReelPos <= reelPos` に補正
- 同じスロットで最も近い左側の周期を選択（移動距離を最小化）

### 3.4 減速時間の算出

```
distance = |targetReelPos - reelPos|
spinSpeedPxPerSec = RATE_REEL_SPEED_MAX * 60  （= 30 * 60）
stopDuration = max(標準5000 / サクサク2500, ceil(2 * distance / spinSpeedPxPerSec))
```

- 最小値: 標準 5000 ms / サクサク 2500 ms
- 距離に比例: `2 * distance / (30*60)` で増加

### 3.5 減速アニメーション

- イージング: `eased = 1 - (1-t)^2`（ease-out）
- `pos = from + (targetReelPos - from) * eased`
- 補間中は `pos` を `[targetReelPos, from]` にクランプ（右方向移動を禁止）
- 1マス通過ごとに `SE.reelTick()` を再生

### 3.6 停止後

- `goToRateStopped()` 内で `setTimeout(onRateStopped(pickedRate), 1000)`
- レート停止後 1000 ms の目視時間は固定（標準/サクサク共通）

---

## 4. 賞品リール STOP（stopPrizeReel）

### 4.1 呼び出し

- `stopPrizeReel()` は `prizeReelDecelTrigger()` を呼ぶだけ
- 減速処理は `startPrizeReelSpin` 内で閉じた `prizeReelDecelTrigger` が担当

### 4.2 prizeReelDecelTrigger（STOP押下時に1回だけ実行）

1. `phase='spin'` のときだけ処理
2. `phase='decel'` に切り替え
3. `startDecelPos = prizeReelPos`（現在位置を記録）
4. `finalTargetPos = targetReelPos`（事前に決まっている当選賞品の位置）
5. 逆回転しないよう `finalTargetPos <= startDecelPos` に補正
6. 同じスロットで最も近い左側の周期を選択

### 4.3 減速時間の算出

```
distance = |finalTargetPos - startDecelPos|
spinSpeedPxPerSec = PRIZE_REEL_SPEED_MAX * 60  （= 50 * 60）
decelStopDuration = max(標準5000 / サクサク2500, ceil(2 * distance / spinSpeedPxPerSec))
```

### 4.4 減速アニメーション

- レートリールと同様の ease-out 補間
- 補間中は `[finalTargetPos, decelFrom]` にクランプ
- 1マス通過ごとに `SE.reelTick()` を再生

### 4.5 停止後

- `setTimeout(..., 1000)` で 1秒後に `showWinnerTwoStage()`
- 賞品停止後の目視時間 1000 ms は固定

---

## 5. 標準 vs サクサク（STOP押下まわり）

| 項目 | 標準 | サクサク |
|------|------|----------|
| STOPボタン有効まで | 1125 ms | 750 ms |
| 減速の最小時間 | 5000 ms | 2500 ms |
| 減速の距離計算 | 2*distance/(speed*60) | 同上 |
| レート停止後の目視 | 1000 ms | 1000 ms |
| 賞品停止後の目視 | 1000 ms | 1000 ms |

---

## 6. 調整検討用チェックリスト

| # | 項目 | 現状 | メモ |
|---|------|------|------|
| 1 | STOPボタン有効までの時間 | 750 / 1125 ms | |
| 2 | 減速の最小時間 | 2500 / 5000 ms | |
| 3 | 減速の距離係数（2*distance/speed） | 共通 | 短くするなら係数を小さく |
| 4 | レートリール速度（減速計算用） | RATE_REEL_SPEED_MAX=30 | |
| 5 | 賞品リール速度（減速計算用） | PRIZE_REEL_SPEED_MAX=50 | |
| 6 | レート停止後の目視 | 1000 ms 固定 | サクサクで短縮可能 |
| 7 | 賞品停止後の目視 | 1000 ms 固定 | サクサクで短縮可能 |
