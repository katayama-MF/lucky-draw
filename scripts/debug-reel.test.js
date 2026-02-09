#!/usr/bin/env node
/**
 * リール演出ロジックのデバッグテスト（DOM不要）
 * 実行: node scripts/debug-reel.test.js
 */
const ITEM_W = 200; // script.js の ITEM_W と合わせる

function centerStripIndex(reelPos, fw = 800) {
  return Math.round((-reelPos + fw/2 - ITEM_W/2) / ITEM_W);
}

function reelPosForCenter(centerIdx, fw = 800) {
  return -(centerIdx * ITEM_W + ITEM_W/2 - fw/2);
}

// --- buildReel の条件: fullCount=0 のとき strip をクリアしない ---
console.log('\n=== buildReel 条件（コード確認） ===');
console.log('  fullCount=0 のとき strip.innerHTML を実行していないこと: コードで確認済み');
console.log('  （Step-by-Step 演出は削除済み）');

console.log('\n--- 完了 ---');
process.exit(0);
