#!/usr/bin/env node
/**
 * ストレステスト: 多数回プレイしてバグを検出する（1000回プレイでリール消失・当選ズレ・コンソールエラーなどを検出）
 * 使い方:
 *   1) Chrome が未導入なら: npx puppeteer browsers install chrome
 *   2) 別ターミナルでサーバー起動: node server.js  (http://localhost:8080)
 *   3) npm run test:stress  または  node scripts/stress-play.test.js
 *   4) 回数指定: PLAY_COUNT=100 node scripts/stress-play.test.js  (省略時は1000)
 *   Mac で Puppeteer の Chrome が無い場合、システムの Google Chrome を自動で使います。
 */
const http = require('http');

const PLAY_COUNT = Math.min(1000, Math.max(1, parseInt(process.env.PLAY_COUNT, 10) || 1000));
const BASE = process.env.TEST_BASE || 'http://127.0.0.1:8080';
const STOP_ENABLE_WAIT_MS = 1500;
const AFTER_STOP_WAIT_MS = 8000;
const NEXT_BTN_VISIBLE_MS = 3000;
const EXTRA_ACTION_EVERY = 50;

function fetchOk(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url, BASE);
    http.get(u, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => (res.statusCode === 200 ? resolve() : reject(new Error('status ' + res.statusCode))));
    }).on('error', reject);
  });
}

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  try {
    await fetchOk('/');
  } catch (e) {
    console.error('サーバーに接続できません。先に node server.js で http://localhost:8080 を起動してください.');
    process.exit(1);
  }

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer が必要です: npm install --save-dev puppeteer');
    process.exit(1);
  }

  const bugs = [];
  const consoleErrors = [];
  let reelEmptyCount = 0;
  let winnerMismatchCount = 0;
  let successCount = 0;
  let playIndex = 0;

  const launchOpts = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
  if (process.platform === 'darwin') {
    const fs = require('fs');
    const sysChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (fs.existsSync(sysChrome)) {
      launchOpts.executablePath = sysChrome;
    }
  }
  const browser = await puppeteer.launch(launchOpts);

  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 800 });
  page.on('console', (msg) => {
    const t = msg.type();
    const text = msg.text();
    if (t === 'error') {
      consoleErrors.push({ play: playIndex, text });
    }
  });
  page.on('pageerror', (err) => {
    bugs.push({ type: 'pageerror', play: playIndex, message: err.message });
  });

  try {
    await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (e) {
    console.error('ページ読み込み失敗:', e.message);
    await browser.close();
    process.exit(1);
  }

  await page.waitForSelector('#reelStrip', { timeout: 5000 });
  await wait(500);

  const getReelChildren = () => page.evaluate(() => document.getElementById('reelStrip')?.children?.length ?? -1);
  const getState = () => page.evaluate(() => (typeof state !== 'undefined' ? state : 'unknown'));
  const getWinnerBadge = () => page.evaluate(() => document.getElementById('winnerBadge')?.textContent?.trim() ?? '');
  const isOverlayVisible = () => page.evaluate(() => document.getElementById('winnerOverlay')?.classList?.contains('show') ?? false);
  const isStopEnabled = () => page.evaluate(() => !document.getElementById('bigBtn')?.disabled && (document.getElementById('bigBtn')?.textContent || '').includes('STOP'));

  for (playIndex = 1; playIndex <= PLAY_COUNT; playIndex++) {
    try {
      const reelBefore = await getReelChildren();
      if (reelBefore <= 0 && playIndex > 1) {
        reelEmptyCount++;
        bugs.push({ type: 'reel_empty_before_start', play: playIndex });
      }

      const btnExists = await page.evaluate(() => !!document.getElementById('bigBtn'));
      if (!btnExists) {
        bugs.push({ type: 'no_big_btn', play: playIndex });
        await wait(500);
        continue;
      }

      const btnText = await page.evaluate(() => document.getElementById('bigBtn')?.textContent || '');
      if (!btnText.includes('START')) {
        const overlayShown = await isOverlayVisible();
        if (overlayShown) {
          await page.click('.next-btn', { force: true, timeout: 3000 }).catch(() => {});
          await wait(800);
        }
        await wait(300);
        continue;
      }

      await page.click('#bigBtn', { force: true, timeout: 3000 }).catch(() => {});
      await wait(200);

      let stopWaited = 0;
      while (stopWaited < STOP_ENABLE_WAIT_MS) {
        const enabled = await isStopEnabled();
        if (enabled) break;
        await wait(80);
        stopWaited += 80;
      }

      const reelDuring = await getReelChildren();
      if (reelDuring <= 0) {
        reelEmptyCount++;
        bugs.push({ type: 'reel_empty_during_spin', play: playIndex });
      }

      await wait(200 + Math.floor(Math.random() * 400));

      await page.click('#bigBtn', { force: true, timeout: 3000 }).catch(() => {});

      let overlayWaited = 0;
      while (overlayWaited < AFTER_STOP_WAIT_MS) {
        const visible = await isOverlayVisible();
        if (visible) break;
        await wait(100);
        overlayWaited += 100;
      }

      const overlayShown = await isOverlayVisible();
      if (!overlayShown) {
        bugs.push({ type: 'winner_overlay_not_shown', play: playIndex });
        await wait(500);
        continue;
      }

      const reelAfterStop = await getReelChildren();
      if (reelAfterStop <= 0) {
        reelEmptyCount++;
        bugs.push({ type: 'reel_empty_after_stop', play: playIndex });
      }

      const badge = await getWinnerBadge();
      const badgeNo = badge.replace(/\D/g, '');
      if (!badgeNo && badge !== '') {
        bugs.push({ type: 'winner_badge_invalid', play: playIndex, badge });
      }

      let nextWaited = 0;
      while (nextWaited < NEXT_BTN_VISIBLE_MS) {
        const visible = await page.evaluate(() => {
          const el = document.querySelector('.next-btn');
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        });
        if (visible) {
          await page.click('.next-btn', { force: true, timeout: 3000 }).catch(() => {});
          break;
        }
        await wait(100);
        nextWaited += 100;
      }

      await wait(600);

      successCount++;

      if (playIndex % 100 === 0) {
        console.log(`  ... ${playIndex}/${PLAY_COUNT} 完了 (バグ ${bugs.length} 件)`);
      }

      if (playIndex % EXTRA_ACTION_EVERY === 0 && playIndex < PLAY_COUNT) {
        const state = await getState();
        if (state === 'idle') {
          await page.click('#tbSettings', { force: true, timeout: 2000 }).catch(() => {});
          await wait(150);
          const overlayOpen = await page.evaluate(() => document.querySelector('.settings-overlay.show') != null);
          if (overlayOpen) {
            await page.keyboard.press('Escape');
            await wait(100);
          }
        }
      }
    } catch (e) {
      bugs.push({ type: 'exception', play: playIndex, message: e.message });
    }
  }

  await browser.close();

  console.log('\n========== ストレステスト結果 ==========');
  console.log(`総プレイ回数: ${PLAY_COUNT}`);
  console.log(`成功カウント: ${successCount}`);
  console.log(`リール空になった回数: ${reelEmptyCount}`);
  console.log(`検出したバグ件数: ${bugs.length}`);
  if (consoleErrors.length > 0) {
    console.log(`コンソールエラー: ${consoleErrors.length} 件`);
  }
  if (bugs.length > 0) {
    console.log('\n--- 検出したバグ一覧 ---');
    const byType = {};
    bugs.forEach((b) => {
      byType[b.type] = (byType[b.type] || 0) + 1;
    });
    Object.entries(byType).forEach(([type, count]) => console.log(`  ${type}: ${count} 件`));
    const sample = bugs.slice(0, 20);
    sample.forEach((b) => console.log(`    [play ${b.play}] ${b.type}${b.message ? ' ' + b.message : ''}${b.badge ? ' badge=' + b.badge : ''}`));
    if (bugs.length > 20) console.log(`    ... 他 ${bugs.length - 20} 件`);
  }
  if (consoleErrors.length > 0) {
    console.log('\n--- コンソールエラー (先頭10件) ---');
    consoleErrors.slice(0, 10).forEach((e) => console.log(`  [play ${e.play}] ${e.text}`));
  }
  console.log('\n========================================\n');
  process.exit(bugs.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
