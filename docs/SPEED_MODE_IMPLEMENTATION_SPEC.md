# 標準モード・サクサクモード 実装仕様（現状）

2段階リールモード（USE_TWO_STAGE_REEL=true）を前提とした、現在の script.js 実装に基づく仕様一覧。

---

## 1. 共通定数（speedMode に依存しない）

| 定数 | 値 | 用途 |
|------|-----|------|
| FRAME_MS | 1000/60 | 60fps 基準。速度は px/フレーム |
| RATE_REEL_SPEED_MAX | 30 | レートリールの最大速度 |
| PRIZE_REEL_SPEED_MAX | 50 | 賞品リールの最大速度 |
| rateViewingMs | 1000 | レート停止後の目視時間（固定） |
| prizeViewingMs | 1000 | 賞品リール停止後の目視時間（固定） |

※レート・賞品リールの最大速度は標準/サクサクで共通。

---

## 2. 標準 vs サクサク 一覧（2段階モード）

| 項目 | 標準 (normal) | サクサク (fast) | コード場所 |
|------|---------------|-----------------|------------|
| **STOPボタン有効まで** | 1125 ms | 750 ms | setTimeout(..., 1125/750) |
| **加速時間** | 0.525 秒 | 0.35 秒 | ACCEL_SEC |
| **減速の最小時間** | 5000 ms | 2500 ms | stopDuration, decelStopDuration の max 第1引数 |
| **減速の計算式** | max(550, ceil(2*distance/speed)) | max(350, ceil(2*distance/speed)) | 共通ロジック |

### レートリール（startRateSpin / stopRateSpin）

- 加速: ACCEL_SEC で 0→RATE_REEL_SPEED_MAX(30) へ
- 減速: stopDuration = max(550 or 350, 2*distance/(30*60))
- STOP有効: 750ms or 1125ms 後

### 賞品リール（startPrizeReelSpin）

- 加速: ACCEL_SEC で 0→PRIZE_REEL_SPEED_MAX(50) へ
- 減速: decelStopDuration = max(550 or 350, 2*distance/(50*60))
- STOP有効: 750ms or 1125ms 後

---

## 3. 1本リールモード（USE_TWO_STAGE_REEL=false 時のみ）

| 項目 | 標準 | サクサク | コード場所 |
|------|------|----------|------------|
| STOP有効まで | 1125 ms | 750 ms | stopEnableMs |
| 加速時間 | 0.525 秒 | 0.35 秒 | ACCEL_SEC |
| 最大速度 | 50 | 50 | REEL_SPEED_MAX（共通） |
| 減速カーブ指数 | 0.6 | 0.35 | exp |
| パターン baseDuration | 400 ms | 250 ms | smoothMove |
| Feint 待ち | 350 ms | 200 ms | feintWaitMs |
| Pendulum 振動時間 | 900 ms | 600 ms | pendDur |
| 目視時間下限 | 1800 ms | 1200 ms | REEL_VIEWING_MS |
| ランク別目視 | mega/super:2200, big/normal:1800 | 全て1500/1200 | showWinnerDelayByRank |

---

## 4. CSS（fast-mode）

| セレクタ | 効果 |
|----------|------|
| .fast-mode .winner-overlay.show .winner-stage | transition-delay: 0.025s |
| .fast-mode .winner-overlay.show .winner-rank-label | transition-delay: 0.05s |
| .fast-mode .winner-overlay.show .next-btn | transition-delay: 0.15s |

当選オーバーレイの表示テンポを短縮。

---

## 5. 2段階モードで speedMode が効く箇所まとめ

1. **STOPボタン有効までの待ち** … 750 / 1125 ms
2. **加速時間** … 0.35 / 0.525 秒
3. **減速の最小時間** … 350 / 550 ms

**効かない箇所（2段階モード）:**

- 最大速度（常に 30 / 50）
- レート停止後の目視 1000ms（固定）
- 賞品停止後の目視 1000ms（固定）
- 当選オーバーレイの CSS は fast-mode で短縮される

---

## 6. 調整検討用チェックリスト

| # | 項目 | 現状 | 調整案メモ |
|---|------|------|------------|
| 1 | STOP有効まで | 750 / 1125 ms | |
| 2 | 加速時間 | 0.35 / 0.525 秒 | |
| 3 | レートリール最大速度 | 30 固定 | サクサクで上げる？ |
| 4 | 賞品リール最大速度 | 50 固定 | サクサクで上げる？ |
| 5 | 減速の最小時間 | 2500 / 5000 ms | |
| 6 | 減速の距離係数 | 2*distance/speed 共通 | サクサクで係数変更？ |
| 7 | レート停止後の目視 | 1000 ms 固定 | サクサクで短縮？ |
| 8 | 賞品停止後の目視 | 1000 ms 固定 | サクサクで短縮？ |
| 9 | 当選オーバーレイ表示 | fast-mode で CSS 短縮 | |
|10 | その他 | | |
