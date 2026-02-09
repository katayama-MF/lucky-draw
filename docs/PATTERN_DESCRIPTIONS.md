# 演出5パターンの説明（Step-by-Step は削除済み）

`runPatternFinale(targetCenter)` に渡る **targetCenter** は「**当選番号が中央に来る reelPos**」です。  
ここに「止まったときの中央」が来るように減速してから、各パターンで微少な動きをします。

---

## 現在のコードの挙動

### Pattern 0: Overshoot（オーバーシュート）
- **動き**: いったん **当選の 0.4 マス分先**（手前側）まで進んでから、**当選位置に戻る**。
- **コード**: `smoothMove(reelPos, overshoot, …)` → `smoothMove(reelPos, targetCenter, …)`
- **イメージ**: 少し行き過ぎてから、すりっと当選に戻る。

---

### Pattern 1: Normal（ノーマル）
- **動き**: 減速で近づいた位置から、**そのまま当選位置へなめらかに寄せる**。余計な動きなし。
- **コード**: `smoothMove(reelPos, targetCenter, …)`
- **イメージ**: 自然な止まり方。

---

### Pattern 2: Feint（フェイント）※修正済み
- **意図**: 「1つ手前で止まって見せて、一瞬止めてから1マス進んで当選」
- **修正後の動き**:
  1. **当選の1つ手前（targetCenter+ITEM_W）** まで移動して一旦停止
  2. 一瞬止まる（goHot + カウントダウン）
  3. **当選位置（targetCenter）** へ1マススライドして止まる
- ランダムモードでは着地位置を `randomCenterIdx = finalCenterIdx+1` にし、`targetReelPos` もそれに合わせて渡す。

---

### Pattern 3: Pendulum（ペンデュラム）
- **動き**: いったん **当選位置（targetCenter）** に寄せてから、**当選を中心に左右に振れ**、だんだん振れ幅を小さくして **当選で止める**。
- **コード**: `smoothMove(reelPos, targetCenter, …)` のあと、`targetCenter + sin(...)*amp*decay^2` で振動させ、最後に `setPos(targetCenter)`。
- **イメージ**: 当選の前後で小さい往復をして、当選で収束。

---

### Pattern 4: Direct（ダイレクト）
- **動き**: 減速で近づいた位置から、**当選位置へ一直線で寄せて止める**。Normal よりフレーム数だけ違う。
- **コード**: `smoothMove(reelPos, targetCenter, …)`
- **イメージ**: シンプルに当選に直行。

---

## まとめ（全パターンとも最後は当選が中央）

| パターン | 名前       | 最後に中央にあるもの | 動き |
|----------|------------|----------------------|------|
| 0        | Overshoot  | 当選                 | 行き過ぎ→戻って当選 |
| 1        | Normal     | 当選                 | 自然に当選で止まる |
| 2        | Feint      | 当選                 | 1つ手前で止まる→1マス進んで当選 |
| 3        | Pendulum   | 当選                 | 振れて当選で止まる |
| 4        | Direct     | 当選                 | 直線で当選で止まる |
