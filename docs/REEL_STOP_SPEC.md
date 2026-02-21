# レートリール・賞品リール ストップ演出の実装仕様

## 1. 座標系と進行方向

- **translateX(px)**: ストリップの左端のX位置。負の値＝左に配置。
- **スピン中の進行**: `reelPos -= move` により **reelPos が減少** = ストリップが**左方向**に移動。
- **視覚**: ストリップが左へ流れる = スロットが右から左へ流れる（新しいスロットが右から入ってくる）。

## 2. レートリール（stopRateSpin）

### 2.1 流れ
1. STOP押下 → 回転アニメーションをキャンセル
2. `pickRateRandom()` で当選レートを確定（確率ベース、位置に依存しない）
3. 当選レートのスロットから1つをランダムに選び `targetReelPos = posForSlot(targetSlotIdx)`
4. **進行方向補正**: `while(targetReelPos > reelPos && oneSet > 0) targetReelPos -= oneSet`
   - targetReelPos を reelPos 以下にする（= 現在位置より「左」＝進行方向に存在する位置）
   - 逆回転を防ぐ
5. `from = reelPos`（現在位置）から `targetReelPos` へ ease-out で補間
6. 補間式: `pos = from + (targetReelPos - from) * eased`、`eased = 1 - (1-t)^2`

### 2.2 補間の向き
- `targetReelPos <= from` が保証されている
- よって `targetReelPos - from <= 0`
- `pos` は `from` から `targetReelPos` へ**単調減少** → 左方向のみ移動（逆回転なし）

### 2.3 減速時間
- `stopDuration = max(350 or 550ms, ceil(2 * distance / spinSpeedPxPerSec))`

## 3. 賞品リール（stopPrizeReel → prizeReelDecelTrigger）

### 3.1 流れ
1. STOP押下 → `prizeReelDecelTrigger()` が呼ばれ、phase を `spin` → `decel` に変更
2. `startDecelPos = prizeReelPos`（現在位置）
3. `finalTargetPos = targetReelPos`（事前に計算済み）
4. **進行方向補正**: `while(oneSet > 0 && finalTargetPos > startDecelPos) finalTargetPos -= oneSet`
5. `decelFrom = startDecelPos` から `finalTargetPos` へ ease-out で補間
6. 補間式: `prizeReelPos = decelFrom + (finalTargetPos - decelFrom) * eased`

### 3.2 補間の向き
- `finalTargetPos <= startDecelPos` が保証
- 同様に左方向のみ移動（逆回転なし）

## 4. 逆回転が「見える」可能性の原因

### 4.1 座標計算の符号ミス
- `posForSlot(idx) = fw/2 - firstCenter - idx*centerStep`
- idx が大きいほど posForSlot は小さくなる（左側）。正しい。

### 4.2 補正ループの不足
- 「targetReelPos を from 以下にする」は実装済み。
- ただし、`targetReelPos - from` が **oneSet より大きい**場合、1回の `-= oneSet` では足りず、複数回ループする。正しく動くはず。

### 4.3 スピン中と減速中のループ補正の相互作用
- **スピン中**: `prizeReelPos < -oneSet*2` のとき `prizeReelPos += oneSet`（位置を戻す）
- **減速中**: ループ補正は行っていない
- スピン→減速の切り替え時、`startDecelPos` がループ補正直後の値だと、`targetReelPos` と `startDecelPos` が周期の両端にある可能性
- 例: startDecelPos = -100, finalTargetPos = -11900（同じスロットの別周期）
- 補間: -100 → -11900。値は減少しているが、**-100 から -11900 への移動は「一気に左へ大きく飛ぶ」**
- ブラウザの描画で、途中経過が不自然に見える可能性はある

### 4.4 targetReelPos の周期選択（対策済み）
- **対策**: `targetReelPos <= reelPos` にした後、`while(targetReelPos+oneSet<=reelPos) targetReelPos+=oneSet` で「同じスロットで最も reelPos に近い左側の周期」を選択。移動距離を最小化し、大きく飛ぶ見た目を防止。

### 4.5 イージングの印象
- ease-out `1-(1-t)^2`: 最初ゆっくり、最後に速く
- 減速というより「最後に加速して止まる」ように見える可能性

## 5. 逆回転ゼロ保証（絶対に左方向のみ）

- **目標位置**: 同じスロットで reelPos に最も近い左側の周期を選択（移動距離最小化）
- **補間中クランプ**: `pos = Math.max(targetReelPos, Math.min(pos, from))` で、補間結果を必ず [targetReelPos, from] に収める。絶対に右へ移動しない。
- **reelStep**: `dir < 0`（右方向ボタン）の場合は何もしない。逆回転を一切許可しない。

## 6. 推奨デバッグ

逆回転を再現したとき、以下をコンソールに出力して確認:
- `from`, `targetReelPos`, `targetReelPos - from`（正なら逆方向になる）
- `oneSet`, 補正後の `targetReelPos`
