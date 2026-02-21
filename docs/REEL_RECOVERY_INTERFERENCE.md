# リール復旧処理の他仕様への影響精査

13個の復旧処理が、止まるまでの流れ・当選表示・nextDraw・buildReelChunked 等の仕様を邪魔しないかを整理した。

---

## 前提：buildReel() の実行条件

- **strip を実際に更新するのは** `state === 'idle'` または `state === 'showing'` のときだけ（1050行）。
- `state` が `spinning` / `stopping` のときは buildReel() は strip を触らず、**strip が空なら setTimeout(buildReel, 0) だけ**して return する。
- そのため「stopping 中に buildReel を呼んでも、その場では復元されず、後で state が変わってから実行される」動きになる。

---

## 1. stopSpin() 入口で strip が空のとき

**処理**: buildReel() を呼んでから減速処理へ進む（1534〜1537行）。

**実際の挙動**: この時点で既に `state='stopping'`（1521行）のため、buildReel() は strip を更新せず、setTimeout(buildReel, 0) するだけ。

**他仕様への影響**:
- 「復元してから演出します」のログが出るが、**減速〜パターン演出のあいだ strip は空のまま**になる。
- ユーザーには「止まるまでリールが真っ白」という状態が続く。
- 当選表示は showWinner() 内で state='showing' にしてから buildReel() するので、その時点で初めて復元される。

**結論**: 仕様どおり「復元してから演出」にはなっておらず、見た目・体感の邪魔になる。復元は showWinner まで遅れる。

---

## 2. runStop() / smoothMove の tick で strip が空のとき

**処理**: buildReel()、まだ空なら _buildReelInProgress=false して buildReel()、150ms 後に ensureReelVisible()、return（1740〜1748行、1658〜1665行）。

**実際の挙動**:
- state は `stopping` のため buildReel() は strip を更新しない。setTimeout(buildReel, 0) だけが積まれる。
- **return するため runPatternFinale() が呼ばれない**（runStop から）／**smoothMove の onComplete が呼ばれない**（smoothMove から）。
- その結果 **goToConfirmed() が一度も呼ばれず、showWinner() も通常経路では呼ばれない**。
- 当選表示は正規フロー（runStop/smoothMove 内で strip 復元後に goToConfirmed → showWinner）で完了する。フォールバックは使用しない。

**他仕様への影響**:
- 「止まったあと、目視時間経過で当選表示」という仕様が破綻する。
- 減速中／演出中に strip が空になった場合、buildReel で復元したあと正規フローで当選表示まで完了する。

**結論**: 他仕様を強く邪魔する。復旧処理がメインの止まりフローを打ち切っている。

---

## 3. 回転中の animate() で strip が空のとき

**処理**: アニメ停止、state='idle'、setBtnState('start')、buildReel()、ensureReelVisible(150)、ログ「もう一度 START を押してください」（1477〜1489行）。

**実際の挙動**: state を idle にしているので、その後の buildReel() は実行され strip が復元される。

**他仕様への影響**:
- 回転中に strip が消えた場合は「復元しながら回転を続ける」はできない（buildReel は idle/showing でしか動かないため）。
- 意図としては「回転は諦めて復元し、ユーザーに再 START を促す」になっている。
- 仕様として矛盾はないが、「回転中は復旧しない（＝回転を止める）」というトレードオフになっている。

**結論**: 他仕様の邪魔というより、設計上の割り切り。問題は 1・2。

---

## 4. ensureReelVisible() の「子が少なすぎ」(tooFew) 復元

**処理**: `childCount > 0` かつ `childCount < expectedMin` のときも buildReel() する（1003〜1004行）。

**他仕様への影響**:
- **buildReelChunked の非同期中**に「一時的に子が少ない」状態になることがある。そのタイミングで 5秒タイマーなどから ensureReelVisible() が走ると、buildReel() が実行され strip が上書きされる。
- 結果として「Chunked で差し替えつつある strip を、ensureReelVisible が先に別内容で作り直す」競合が起こりうる。
- また「止まったあと目視している」showing 中に tooFew で buildReel すると、オーバーレイの背後でリール内容が入れ替わる。表示上の不整合やチラつきの原因になりうる。

**結論**: tooFew による復元は、Chunked や showing の仕様とタイミングが重なると邪魔する可能性がある。

---

## 5. 5秒ごとの setInterval(ensureReelVisible, 5000)

**処理**: 5秒ごとに ensureReelVisible() を呼ぶ（3677〜3679行）。

**他仕様への影響**:
- **nextDraw() 直後**にタイミングが重なると、nextDraw が rAF で buildReelChunked({ startFromPrevWinnerMinus1: true }) を予約した直後に ensureReelVisible() が走る場合がある。
- ensureReelVisible が buildReel() を実行すると _buildReelInProgress が true になり、その直後の buildReelChunked は「state や _buildReelInProgress」でスキップする可能性がある（1187行、1168行）。
- その場合「前回当選の1つ前を中央に」という nextDraw の仕様が効かず、リール位置が意図とずれる。

**結論**: 5秒タイマーが、nextDraw 直後の buildReelChunked による位置合わせを打ち消す可能性がある。

---

## 6. ensureReelVisible の spinning/stopping 時の遅延

**処理**: state が spinning または stopping のときは buildReel() を呼ばず、400ms 後に ensureReelVisible() を再スケジュール（1008〜1010行）。

**他仕様への影響**:
- 2秒・5秒の setInterval から何度も ensureReelVisible が呼ばれると、**「400ms 後に ensureReelVisible」が複数本**積まれる。
- state が idle/showing に変わったあと、短時間に ensureReelVisible が連続で走り、そのたび buildReel() が呼ばれる可能性がある。
- buildReel は _buildReelInProgress で連続実行は防がれるが、**不要な buildReel が複数回走る**ことでチラつきや負荷にはなりうる。

**結論**: 致命的な邪魔ではないが、遅延の「積み重なり」で不要な復元が複数回走る余地がある。

---

## 7. showWinner() 入口の buildReel、末尾の setTimeout(ensureReelVisible, 80)

**処理**: 入口で strip が空なら buildReel()（1836〜1840行）。末尾で 80ms 後に ensureReelVisible()（1891行）。

**実際の挙動**: showWinner() の先頭で既に state='showing'（1833行）なので、入口の buildReel() は strip を更新する。復元は意図どおり。

**他仕様への影響**:
- 80ms 後の ensureReelVisible は、ユーザーがすぐ「次へ」を押すと、nextDraw の ensureReelVisible(600) と時間的に近く、両方とも idle のときに走る。strip が既に十分ならどちらもすぐ return するので、大きな邪魔にはならない。
- 重複呼び出しによるチラつきの可能性はあるが、軽微。

**結論**: 他仕様を強く邪魔する要因ではない。

---

## 8. nextDraw() の buildReel とその後の buildReelChunked / ensureReelVisible(600)

**処理**: state='idle' にしたあと strip が空なら buildReel()（1896〜1903行）。続けて rAF で buildReelChunked、600ms 後に ensureReelVisible（1917〜1921行）。

**他仕様への影響**:
- nextDraw 時点では既に state='idle' なので、buildReel() は実行される。その直後の rAF で buildReelChunked が走るため、**strip は buildReel で一度作られたあと、buildReelChunked で差し替え・位置合わせ**される。
- 二重に strip を組み直すことになり、わずかなチラつきや、タイミングによっては「前回当選の1つ前」の位置が一瞬ずれる可能性はあるが、buildReelChunked が position を設定するので最終的には仕様どおりになる。
- 600ms 後の ensureReelVisible は、strip が既に十分あれば return するだけなので、通常は邪魔しない。

**結論**: 二重建築になるが、仕様を大きく崩すほどの邪魔にはなっていない。

---

## 9. MutationObserver、2秒間隔、初期化 100/400/800ms

**MutationObserver**: strip の子が 0 になったとき、state が spinning/stopping でなければ setTimeout(buildReel, 0)。観測とログは常に行う。  
→ 止まりフロー中は buildReel をスケジュールしないので、runStop/runPatternFinale の邪魔はしない。idle/showing で strip が空になったときの復元用として妥当。

**2秒間隔**: strip が 0 のときだけ ensureReelVisible()。  
→ ensureReelVisible のルール（spinning/stopping では 400ms 遅延）に従うため、他仕様との衝突は 5秒タイマーと同種だが、発火頻度は低い。

**100/400/800ms**: 初期化直後の復元用。  
→ 起動直後の strip 未構築やタイミングずれの補正であり、通常フローの邪魔にはならない。

**結論**: これらは他仕様を強く邪魔する要因ではない（5秒タイマーとの組み合わせは上記のとおり）。

---

## 10. buildReel() 内のスキップ時・例外時・完了直後の setTimeout(buildReel, 0)

**他仕様への影響**:
- state が idle/showing でないときは「スキップして setTimeout(buildReel, 0)」なので、stopping 中は strip はその場では復元されない。runStop 等の流れを止めるわけではない。
- 例外時・完了直後の「strip が空なら setTimeout(buildReel, 0)」は、strip が空になる異常系のフォローであり、他仕様を直接邪魔するものではない。

**結論**: 邪魔というより、復元の遅延実行。問題は「いつ state が変わるか」に依存する部分（1・2）にある。

---

## まとめ：他仕様を邪魔しうるもの

| # | 処理 | 邪魔の内容 | 深刻度 |
|---|------|------------|--------|
| 1 | stopSpin 入口の buildReel | 復元されず減速〜演出中ずっと strip が空。ログと実態が不一致。 | 中 |
| 2 | runStop / smoothMove で strip 空時 | buildReel で復元し、setPos → runPatternFinale（または onComplete）で正規フローを完了。 | - |
| 3 | animate で strip 空時の abort | 回転を止める設計なので仕様としては一貫。 | 低 |
| 4 | ensureReelVisible の tooFew | Chunked 中や showing 中に strip を上書きしうる。チラつき・位置ずれの可能性。 | 中 |
| 5 | 5秒 setInterval(ensureReelVisible) | nextDraw 直後の buildReelChunked をスキップさせ、「前回当選の1つ前」が効かなくなる可能性。 | 中 |
| 6 | ensureReelVisible の 400ms 遅延の積み重なり | 不要な buildReel の連続実行でチラつき・負荷の可能性。 | 低 |

**特に 2 は「止まったあと当選表示」という中心仕様を壊す。**  
1・4・5 は条件が重なったときに、見た目や位置合わせの仕様を邪魔する可能性がある。

対応を検討する場合は、  
- 2: runStop/smoothMove で strip が空のときは return せず、復元を待つか別経路で goToConfirmed までつなぐ、  
- 1: stopSpin 入口では state を一時的に idle にする等はせず、復元は showWinner に任せるか、復元完了を待ってから runStop に進む、  
といった方針の整理が必要。
