#!/usr/bin/env node
/**
 * prize_pics 内の JPG/PNG を SVG に変換する（画像を base64 で埋め込んだ SVG を生成し、元ファイルを削除）。
 * 実行: node scripts/raster-to-svg.js
 */

const fs = require('fs');
const path = require('path');

const PRIZE_PICS_DIR = path.join(__dirname, '..', 'prize_pics');
const SIZE = 200;
const RE = /^LD_?0*(\d+)\.(png|jpg|jpeg)$/i;
const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };

function main() {
  if (!fs.existsSync(PRIZE_PICS_DIR)) {
    console.log('prize_pics フォルダがありません');
    return;
  }
  const files = fs.readdirSync(PRIZE_PICS_DIR);
  let converted = 0;
  let removed = 0;
  for (const name of files) {
    const m = name.match(RE);
    if (!m) continue;
    const id = 'LD_' + String(parseInt(m[1], 10)).padStart(4, '0');
    const ext = m[2].toLowerCase();
    const mime = MIME[ext] || 'image/png';
    const srcPath = path.join(PRIZE_PICS_DIR, name);
    const svgPath = path.join(PRIZE_PICS_DIR, id + '.svg');
    if (fs.existsSync(svgPath)) {
      console.log('スキップ（既に SVG あり）: ' + name);
      continue;
    }
    try {
      const buf = fs.readFileSync(srcPath);
      const b64 = buf.toString('base64');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<image href="data:${mime};base64,${b64}" width="${SIZE}" height="${SIZE}" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
      fs.writeFileSync(svgPath, svg, 'utf8');
      fs.unlinkSync(srcPath);
      converted++;
      console.log('変換: ' + name + ' → ' + id + '.svg');
    } catch (e) {
      console.error(name + ': ' + e.message);
    }
  }
  console.log('---');
  console.log('変換: ' + converted + ' 件、元ファイルを削除しました');
}

main();
