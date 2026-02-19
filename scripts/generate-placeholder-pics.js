#!/usr/bin/env node
/**
 * デフォルト画像（4レート用）のみ生成。実写がある場合はそれを適用、ない場合はこれを使用。
 * 使い方: node scripts/generate-placeholder-pics.js
 * → prize_pics/default_mega.svg, default_super.svg, default_big.svg, default_normal.svg の4つを作成
 * ※アプリは getPlaceholderImageUrl でインライン生成するため、このスクリプトは任意。
 *   4ファイルを静的参照したい場合や、画像フォルダ一覧用に使う。
 */

const fs = require('fs');
const path = require('path');

const PRIZE_PICS_DIR = path.join(__dirname, '..', 'prize_pics');
const SIZE = 200;

const RANK_COLORS = { mega: '#a855f7', super: '#ff8c00', big: '#00E5FF', normal: '#64748b' };

function svgPlaceholder(label, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<rect fill="${color}" width="${SIZE}" height="${SIZE}"/>
<text x="${SIZE/2}" y="${SIZE/2}" fill="white" font-size="20" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>`;
}

function main() {
  if (!fs.existsSync(PRIZE_PICS_DIR)) {
    fs.mkdirSync(PRIZE_PICS_DIR, { recursive: true });
    console.log('prize_pics フォルダを作成しました');
  }

  const ranks = ['mega', 'super', 'big', 'normal'];
  const labels = { mega: 'MegaSuperBigHit', super: 'SuperBigHit', big: 'BigHit', normal: 'Hit' };
  let count = 0;

  for (const rank of ranks) {
    const color = RANK_COLORS[rank];
    const label = labels[rank];
    const svg = svgPlaceholder(label, color);
    const outPath = path.join(PRIZE_PICS_DIR, `default_${rank}.svg`);
    fs.writeFileSync(outPath, svg, 'utf8');
    console.log('作成: default_' + rank + '.svg');
    count++;
  }

  console.log('---');
  console.log('デフォルト画像 4 件を作成しました');
}

main();
