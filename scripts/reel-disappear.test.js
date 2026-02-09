#!/usr/bin/env node
/**
 * リールが消えないことをブラウザで検証するテスト
 * 事前に npm run dev でサーバーを起動し、別ターミナルで:
 *   npx node scripts/reel-disappear.test.js
 * または package.json の test:reel を実行
 */
const http = require('http');

const BASE = 'http://127.0.0.1:3000';

function fetch(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url, BASE);
    http.get(u, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function main() {
  let ok = 0, fail = 0;
  try {
    const { status } = await fetch('/');
    if (status !== 200) {
      console.error('サーバーが起動していません。npm run dev で http://localhost:3000 を起動してから再度実行してください.');
      process.exit(1);
    }
  } catch (e) {
    console.error('接続失敗:', e.message);
    console.error('先に npm run dev でサーバーを起動してください.');
    process.exit(1);
  }

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer が入っていません。npm install --save-dev puppeteer を実行してください.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  try {
    await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 10000 });
    await page.waitForSelector('#reelStrip', { timeout: 5000 });

    const getReelChildren = () => page.evaluate(() => document.getElementById('reelStrip')?.children?.length ?? -1);

    /** リールが画面上で見えているか（子要素数 + 表示状態） */
    const getReelVisible = () =>
      page.evaluate(() => {
        const el = document.getElementById('reelStrip');
        if (!el) return { ok: false, reason: 'no_element', children: 0 };
        const n = el.children.length;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const parent = el.parentElement;
        const parentRect = parent ? parent.getBoundingClientRect() : null;
        const visible =
          n > 0 &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          parseFloat(style.opacity) > 0 &&
          rect.width > 0 &&
          rect.height > 0;
        return {
          ok: visible,
          children: n,
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          width: rect.width,
          height: rect.height,
        };
      });

    const afterLoad = await getReelChildren();
    if (afterLoad <= 0) {
      console.log('FAIL: 読み込み直後にリールの子要素がありません (children=' + afterLoad + ')');
      fail++;
    } else {
      console.log('OK: 読み込み後 リール子要素数 =', afterLoad);
      ok++;
    }

    const visibleAfterLoad = await getReelVisible();
    if (!visibleAfterLoad.ok && visibleAfterLoad.children > 0) {
      console.log('WARN: 読み込み後 子はあるが非表示', JSON.stringify(visibleAfterLoad));
    }

    await page.click('#bigBtn');
    await new Promise((r) => setTimeout(r, 2500));

    const duringSpin = await getReelChildren();
    if (duringSpin <= 0) {
      console.log('FAIL: 回転中にリールの子要素が消えました (children=' + duringSpin + ')');
      fail++;
    } else {
      console.log('OK: 回転中もリール子要素数 =', duringSpin);
      ok++;
    }

    await page.click('#bigBtn');
    await new Promise((r) => setTimeout(r, 4000));

    const afterStop = await getReelChildren();
    if (afterStop <= 0) {
      console.log('FAIL: ストップ演出後にリールの子要素がありません (children=' + afterStop + ')');
      fail++;
    } else {
      console.log('OK: ストップ演出後 リール子要素数 =', afterStop);
      ok++;
    }

    const visibleAfterStop = await getReelVisible();
    if (!visibleAfterStop.ok) {
      if (visibleAfterStop.children <= 0) {
        console.log('FAIL: ストップ後 リールが空または非表示', JSON.stringify(visibleAfterStop));
        fail++;
      } else {
        console.log('FAIL: ストップ後 子はあるが非表示', JSON.stringify(visibleAfterStop));
        fail++;
      }
    } else {
      ok++;
    }

    // --- 早押し: START 直後にすぐ STOP ---
    await page.click('#bigBtn');
    await new Promise((r) => setTimeout(r, 150));
    await page.click('#bigBtn');
    await new Promise((r) => setTimeout(r, 3500));
    const afterEarlyStop = await getReelChildren();
    if (afterEarlyStop <= 0) {
      console.log('FAIL: 早押しストップ後にリールの子が消えた (children=' + afterEarlyStop + ')');
      fail++;
    } else {
      console.log('OK: 早押しストップ後 リール子要素数 =', afterEarlyStop);
      ok++;
    }

    // --- 5回＋20回連続 START→ストップ（負荷でリール消失の再現を試す）---
    const clickBigBtn = async () => {
      await page.evaluate(() => document.getElementById('bigBtn')?.click());
    };
    const rounds = [5, 20];
    for (const total of rounds) {
      for (let i = 0; i < total; i++) {
        await clickBigBtn();
        await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
        await clickBigBtn();
        await new Promise((r) => setTimeout(r, 5200));
        const count = await getReelChildren();
        if (count <= 0) {
          console.log('FAIL: 連続' + (i + 1) + '/' + total + '回目でリールの子が消えた (children=' + count + ')');
          fail++;
          break;
        }
        if (i === total - 1) {
          console.log('OK: ' + total + '回連続 START/STOP 後もリール子要素数 =', count);
          ok++;
        }
      }
      if (fail > 0) break;
    }
  } finally {
    await browser.close();
  }

  console.log('\n結果:', ok, 'OK,', fail, 'FAIL');
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
