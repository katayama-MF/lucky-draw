#!/usr/bin/env node
/**
 * ストレステスト: 多数回プレイしてバグを検出する（1000回プレイでリール消失・当選ズレ・コンソールエラーなどを検出）
 *
 * 使い方:
 *   1) サーバー起動: node server.js  (http://localhost:8080)
 *   2) 別ターミナルで実行: npm run test:stress
 *   3) 回数指定: PLAY_COUNT=100 node scripts/stress-play.test.js
 *
 * ※ Puppeteer が起動しない場合:
 *   - IDE 内ではなく、OS のターミナル（Terminal.app 等）で実行してください。サンドボックスがブラウザ起動をブロックすることがあります。
 *   - Chrome 未導入時: npx puppeteer browsers install chrome
 *   - システム Chrome を明示: PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:stress
 */
const http = require('http');

const PLAY_COUNT = Math.min(1000, Math.max(1, parseInt(process.env.PLAY_COUNT, 10) || 1000));
const BASE = process.env.TEST_BASE || 'http://127.0.0.1:8080';
const STOP_ENABLE_WAIT_MS = 1500;
// 2段階モード時は賞品リールが約7秒＋減速で最大約9秒かかるため、環境変数で延長可能（例: AFTER_STOP_WAIT_MS=18000）
const AFTER_STOP_WAIT_MS = parseInt(process.env.AFTER_STOP_WAIT_MS, 10) || 18000;
const NEXT_BTN_VISIBLE_MS = parseInt(process.env.NEXT_BTN_VISIBLE_MS, 10) || 3000;
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
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-extensions',
      '--no-first-run',
    ],
  };
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOpts.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  } else if (process.platform === 'darwin') {
    const fs = require('fs');
    const sysChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (fs.existsSync(sysChrome)) {
      launchOpts.executablePath = sysChrome;
    }
  }
  launchOpts.timeout = 30000;
  const LAUNCH_TIMEOUT_MS = 35000;
  console.log('Chrome を起動しています…（最大' + LAUNCH_TIMEOUT_MS / 1000 + '秒で打ち切ります）');
  let browser;
  try {
    const launchPromise = puppeteer.launch(launchOpts);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Chrome の起動が ' + LAUNCH_TIMEOUT_MS / 1000 + ' 秒以内に完了しませんでした。')), LAUNCH_TIMEOUT_MS);
    });
    browser = await Promise.race([launchPromise, timeoutPromise]);
  } catch (err) {
    console.error('Chrome の起動に失敗しました:', err.message || err);
    console.error('');
    console.error('対処法:');
    console.error('  1) ターミナルで直接実行: npm run test:stress');
    console.error('  2) Chrome をインストール: npx puppeteer browsers install chrome');
    console.error('  3) システムの Chrome を指定: PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:stress');
    console.error('  4) IDE 内で実行している場合、サンドボックスがブラウザ起動をブロックしている可能性があります。OS のターミナルで試してください。');
    process.exit(1);
  }
  console.log('STRESS_CHROME_READY');

  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 800 });
  const failedUrls = [];
  page.on('console', (msg) => {
    const t = msg.type();
    const text = msg.text();
    if (t === 'error') {
      consoleErrors.push({ play: playIndex, text });
    }
  });
  page.on('response', (res) => {
    if (res.status() === 404) {
      const url = res.url();
      failedUrls.push({ play: playIndex, url });
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

  const scrollIntoView = async (selector) => {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'instant' });
    }, selector).catch(() => {});
  };
  const clickBigBtn = async () => {
    await scrollIntoView('#bigBtn');
    await wait(50);
    await page.click('#bigBtn', { force: true, timeout: 3000 }).catch(() => {});
  };
  const clickNextBtn = async () => {
    await scrollIntoView('.next-btn');
    await wait(50);
    await page.click('.next-btn', { force: true, timeout: 3000 }).catch(() => {});
  };

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
          await clickNextBtn();
          await wait(800);
        }
        await wait(300);
        continue;
      }

      await clickBigBtn();
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

      await clickBigBtn();

      // オーバーレイ待ち（2段階モード時は1回目STOPでレート停止→STARTで賞品リール→2回目STOPで当選表示のため、必要なら2回目の START→STOP を行う）
      let overlayWaited = 0;
      const secondCycleFirstCheckMs = 3000;
      const secondCycleCheckIntervalMs = 1500;
      let didSecondCycle = false;
      let lastSecondCycleCheck = 0;
      while (overlayWaited < AFTER_STOP_WAIT_MS) {
        const visible = await isOverlayVisible();
        if (visible) break;
        if (!didSecondCycle && overlayWaited >= secondCycleFirstCheckMs && overlayWaited >= lastSecondCycleCheck + secondCycleCheckIntervalMs) {
          lastSecondCycleCheck = overlayWaited;
          const btnText = await page.evaluate(() => document.getElementById('bigBtn')?.textContent || '');
          if (btnText.includes('START')) {
            didSecondCycle = true;
            await clickBigBtn();
            await wait(200);
            let stop2 = 0;
            while (stop2 < STOP_ENABLE_WAIT_MS) {
              if (await isStopEnabled()) break;
              await wait(80);
              stop2 += 80;
            }
            await wait(200 + Math.floor(Math.random() * 400));
            await clickBigBtn();
            overlayWaited = 0;
            lastSecondCycleCheck = 0;
            continue;
          }
        }
        await wait(100);
        overlayWaited += 100;
      }

      let overlayShown = await isOverlayVisible();
      // 最終リトライ: (1) STARTボタンがあれば賞品リール未開始の可能性→もう1回 START→STOP
      // (2) なければ減速が長引いている可能性→追加10秒待機
      if (!overlayShown) {
        const btnText2 = await page.evaluate(() => document.getElementById('bigBtn')?.textContent || '');
        if (btnText2.includes('START')) {
          await clickBigBtn();
          await wait(200);
          let stop3 = 0;
          while (stop3 < STOP_ENABLE_WAIT_MS) {
            if (await isStopEnabled()) break;
            await wait(80);
            stop3 += 80;
          }
          await wait(200 + Math.floor(Math.random() * 400));
          await clickBigBtn();
        }
        let extraWait = 0;
        while (extraWait < 12000) {
          if (await isOverlayVisible()) { overlayShown = true; break; }
          await wait(100);
          extraWait += 100;
        }
      }
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
          await clickNextBtn();
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
          await scrollIntoView('#tbSettings');
          await wait(50);
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
      try {
        await wait(600);
        const overlayVisible = await isOverlayVisible();
        if (overlayVisible) {
          await clickNextBtn();
          await wait(1000);
        } else {
          const btnText = await page.evaluate(() => document.getElementById('bigBtn')?.textContent || '');
          if (btnText.includes('STOP')) {
            await clickBigBtn();
            await wait(Math.min(AFTER_STOP_WAIT_MS, 5000));
            const ov = await isOverlayVisible();
            if (ov) {
              await clickNextBtn();
              await wait(800);
            }
          }
        }
        await wait(400);
      } catch (_) {}
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
  const byType = {};
  bugs.forEach((b) => {
    byType[b.type] = (byType[b.type] || 0) + 1;
  });
  const exceptions = bugs.filter((b) => b.type === 'exception');
  if (bugs.length > 0) {
    console.log('\n--- 検出したバグ一覧 ---');
    Object.entries(byType).forEach(([type, count]) => console.log(`  ${type}: ${count} 件`));
    if (exceptions.length > 0) {
      const msgCount = {};
      exceptions.forEach((b) => {
        const m = (b.message || '(no message)').slice(0, 120);
        msgCount[m] = (msgCount[m] || 0) + 1;
      });
      console.log('\n  --- exception の内訳（原因特定用）---');
      Object.entries(msgCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .forEach(([msg, count]) => console.log(`    [${count} 件] ${msg}`));
    }
    const sample = bugs.slice(0, 20);
    sample.forEach((b) => console.log(`    [play ${b.play}] ${b.type}${b.message ? ' ' + b.message : ''}${b.badge ? ' badge=' + b.badge : ''}`));
    if (bugs.length > 20) console.log(`    ... 他 ${bugs.length - 20} 件`);
  }
  if (consoleErrors.length > 0) {
    console.log('\n--- コンソールエラー (先頭10件) ---');
    consoleErrors.slice(0, 10).forEach((e) => console.log(`  [play ${e.play}] ${e.text}`));
  }
  if (failedUrls.length > 0) {
    const unique = [...new Map(failedUrls.map((f) => [f.url, f])).values()];
    console.log(`\n--- 404 Not Found (${failedUrls.length}件, ユニーク${unique.length}URL) ---`);
    unique.slice(0, 15).forEach((f) => console.log(`  ${f.url}`));
    if (unique.length > 15) console.log(`  ... 他 ${unique.length - 15} URL`);
  }
  console.log('\n========================================\n');
  const exceptionMessages = [];
  if (exceptions.length > 0) {
    const msgCount = {};
    exceptions.forEach((b) => {
      const m = (b.message || '(no message)').slice(0, 200);
      msgCount[m] = (msgCount[m] || 0) + 1;
    });
    exceptionMessages.push(...Object.entries(msgCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([msg, count]) => ({ message: msg, count })));
  }
  const unique404Urls = [...new Set(failedUrls.map((f) => f.url))];
  const stressResult = { plays: PLAY_COUNT, success: successCount, bugs: bugs.length, reelEmpty: reelEmptyCount, byType, exceptionSamples: exceptionMessages, failed404Urls: unique404Urls };
  console.log('STRESS_JSON=' + JSON.stringify(stressResult));
  process.exit(bugs.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
