#!/usr/bin/env node
/**
 * サーバーを自動起動してからストレステストを実行するラッパー。
 * Cursor 内では Puppeteer が動かないため、OS のターミナルで実行すること。
 *
 * 使い方（Terminal.app などで）:
 *   cd /path/to/lucky-draw
 *   node scripts/run-stress-with-server.js
 *   PLAY_COUNT=100 node scripts/run-stress-with-server.js
 */
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8080;
const BASE = `http://127.0.0.1:${PORT}`;

function checkServer() {
  return new Promise((resolve) => {
    http.get(BASE + '/', (res) => resolve(true)).on('error', () => resolve(false));
  });
}

async function waitForServer(maxWait = 15000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    if (await checkServer()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  if (await checkServer()) {
    console.log('既にサーバーが起動しています。ストレステストを実行します。\n');
  } else {
    console.log('サーバーを起動してからストレステストを実行します…\n');
    const server = spawn('node', ['server.js'], { cwd: ROOT, stdio: 'ignore', detached: true });
    server.unref();
    const ok = await waitForServer();
    if (!ok) {
      console.error('サーバーの起動を待てませんでした。手動で node server.js を起動してから再度実行してください。');
      process.exit(1);
    }
  }

  const playCount = process.env.PLAY_COUNT || '100';
  const CHROME_LAUNCH_TIMEOUT_MS = 40000;
  const child = spawn('node', ['scripts/stress-play.test.js'], {
    cwd: ROOT,
    stdio: ['inherit', 'pipe', 'inherit'],
    env: { ...process.env, TEST_BASE: BASE, PLAY_COUNT: playCount },
  });
  let chromeReady = false;
  let timeoutId = setTimeout(() => {
    if (chromeReady) return;
    child.kill('SIGKILL');
    console.error('\n');
    console.error('Chrome の起動が ' + CHROME_LAUNCH_TIMEOUT_MS / 1000 + ' 秒以内に完了しませんでした。');
    console.error('対処: PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:stress:run');
    process.exit(1);
  }, CHROME_LAUNCH_TIMEOUT_MS);
  child.stdout.on('data', (chunk) => {
    const s = chunk.toString();
    if (s.includes('STRESS_CHROME_READY')) { chromeReady = true; clearTimeout(timeoutId); }
    process.stdout.write(s.replace(/STRESS_CHROME_READY\n?/, ''));
  });
  child.on('close', (code) => {
    clearTimeout(timeoutId);
    process.exit(code || 0);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
