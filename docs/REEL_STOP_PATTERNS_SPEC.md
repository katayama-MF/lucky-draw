# リール止まりパターン 仕様書

当たりの番号に近づいた後の「止まり方」を定義する。ストップ押下〜減速開始までは既存のまま変更しない。

---

## フロー概要

```
[ストップ押下] → [減速] → [当たりに近づく] → [パターン選択] → [パターン実行] → [確定] → [当選表示]
                         ↑
                    ここから先がパターン
```

- **targetReelPos**: 当選番号がフレーム中央に来る reelPos
- **reelPos**: 現在のリール位置（減速終了時点では targetReelPos に近いが、ピッタリではない場合もある）

---

## パターン一覧（5種類）

### Pattern 0: Overshoot（オーバーシュート）
- **動き**: 当たりの約0.4マス分**先**（進行方向へ）行き過ぎる → 戻って当選で止まる
- **開始**: 減速終了時の reelPos（当たりより手前側）
- **処理**:
  1. `smoothMove(reelPos, targetReelPos - 0.4*centerStep, …)` で行き過ぎ
  2. `smoothMove(overshootPos, targetReelPos, …)` で当選位置へ戻す
  3. `setPos(targetReelPos)` で確定
- **体感**: 少し行き過ぎてから、すりっと当選に戻る

### Pattern 1: Normal（ノーマル）
- **動き**: 現在位置からそのまま当選位置へなめらかに寄せて止まる
- **処理**: `smoothMove(reelPos, targetReelPos, …)` のみ
- **体感**: 自然な止まり方。余計な動きなし

### Pattern 2: Feint（フェイント）
- **動き**: 1つ手前で止まったように見せる → 一瞬静止 → 1マス進んで当選で止まる
- **処理**:
  1. `smoothMove(reelPos, targetReelPos + centerStep, …)` で当たりの**1つ手前**に止まる
  2. 一瞬待機（例: 200〜400ms）
  3. `smoothMove(reelPos, targetReelPos, …)` で1マス進んで当選位置へ
  4. `setPos(targetReelPos)` で確定
- **体感**: 「あ、ハズレ？」→「いや、当たり！」のスリル

### Pattern 3: Pendulum（ペンデュラム）
- **動き**: 当選を中心に左右に振れ、だんだん振れ幅を小さくして当選で収束
- **処理**:
  1. `smoothMove(reelPos, targetReelPos, …)` で一度当選位置へ
  2. `amplitude * sin(t) * decay(t)` で振動（振幅は時間とともに減衰）
  3. 振れ幅が閾値以下になったら `setPos(targetReelPos)` で確定
- **体感**: 当選の前後で小さい往復をして、当選で収束

### Pattern 4: Direct（ダイレクト）
- **動き**: 当選位置へ一直線で寄せて止まる。Normal よりフレーム数（時間）だけ違う
- **処理**: `smoothMove(reelPos, targetReelPos, …)`（イージング・フレーム数が Normal と異なる）
- **体感**: シンプルに当選に直行

---

## パターン選択ロジック

- **抽選**: 0〜4 のいずれかをランダム（または確率配分）で選択
- **連続回避（任意）**: 前回と同じパターンを避ける場合は `lastPattern` を記録し、別パターンを選ぶ
- **レート連動（任意）**: メガ/スーパーなどは Overshoot や Pendulum を出しやすくする等

---

## 共通パラメータ

| 項目 | 説明 | 例 |
|------|------|-----|
| targetReelPos | 当選が中央に来る reelPos | 計算済み |
| centerStep | 隣マス間の中心間隔（px） | 約240 |
| smoothMove | 始点→終点をイージングで補間 | ease-out 等 |

---

## 実装ポイント

1. **alignToCenter の代わりに runPatternFinale(targetReelPos) を呼ぶ**
   - 減速で `remaining <= 0` になったら、その時点の `reelPos` と `targetReelPos` を渡す
   - パターンが「当選に寄せて止める」役割を持つ

2. **smoothMove の仕様**
   - `smoothMove(from, to, durationMs, onComplete)` のような形
   - 各フレームで reelPos を補間し、`setPos(reelPos)` で更新
   - 完了時に `onComplete` で次の処理または確定へ

3. **確定後の流れ**
   - パターン完了 → `setPos(targetReelPos)` → confirmed クラス追加 → 目視時間 → showWinner

---

## まとめ

| パターン | 名前 | 最終位置 | 特徴 |
|----------|------|----------|------|
| 0 | Overshoot | 当選 | 行き過ぎ→戻る |
| 1 | Normal | 当選 | 自然に止まる |
| 2 | Feint | 当選 | 手前で止まる→1マス進む |
| 3 | Pendulum | 当選 | 振れて収束 |
| 4 | Direct | 当選 | 直線で直行 |

全パターンとも、最後は **当選番号がフレーム中央** で確定する。
