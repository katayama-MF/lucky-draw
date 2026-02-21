/**
 * 自動ブラッシュアップ用の修正レジストリ。
 * 対症療法的な修正は行わない。根本原因を正しいプログラム・アルゴリズムで解決すべき。
 *
 * このモジュールはバグ検出時に「適用する修正」を返さず、結果のログのみに頼る。
 */

function selectFix(/* result, state */) {
  return null;
}

function applyFix(/* fix, state */) {}

module.exports = { selectFix, applyFix };
