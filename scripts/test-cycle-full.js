#!/usr/bin/env node
/**
 * 完全自動: サーバー起動 → 待機 → テスト（失敗時は修正→再テスト） → サーバー停止
 * 使い方: npm run test:cycle:full  で寝てOK
 * 環境変数: TEST_CYCLE_MAX_ROUNDS, TEST_CYCLE_FIX, PLAY_COUNT は test-cycle と同じ
 */
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const PORT = parseInt(process.env.TEST_PORT, 10) || 8080;
const BASE = process.env.TEST_BASE || `http://127.0.0.1:${PORT}`;
const SERVER_WAIT_MS = 20000;
const POLL_MS = 300;

const MAX_ROUNDS = Math.max(1, parseInt(process.env.TEST_CYCLE_MAX_ROUNDS, 10) || 5);
const FIX_CMD = process.env.TEST_CYCLE_FIX || '';
const PLAY_COUNT = process.env.PLAY_COUNT || '';
const TEST_BASE_ENV = process.env.TEST_BASE || '';

let serverProcess = null;
let serverStartedByUs = false;

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

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

async function waitForServer() {
  const deadline = Date.now() + SERVER_WAIT_MS;
  while (Date.now() < deadline) {
    try {
      await fetchOk('/');
      return;
    } catch (_) {
      await wait(POLL_MS);
    }
  }
  throw new Error('サーバーが ' + (SERVER_WAIT_MS / 1000) + ' 秒以内に起動しませんでした');
}

function startServer() {
  return new Promise((resolve, reject) => {
    serverProcess = spawn('node', ['server.js'], {
      cwd: ROOT,
      stdio: 'ignore',
      env: { ...process.env },
    });
    serverProcess.on('error', (e) => reject(e));
    serverProcess.on('exit', (code, sig) => {
      if (code !== null && code !== 0 && serverProcess) reject(new Error('server exit ' + code));
    });
    wait(800).then(resolve);
  });
}

function stopServer() {
  if (serverStartedByUs && serverProcess && serverProcess.kill) {
    serverProcess.kill('SIGTERM');
    serverProcess = null;
  }
}

function run(cmd, args, env = {}) {
  return new Promise((resolve, reject) => {
    const c = spawn(cmd, args, {
      stdio: 'inherit',
      shell: false,
      env: { ...process.env, ...env },
      cwd: ROOT,
    });
    c.on('close', (code) => (code === 0 ? resolve() : reject(new Error('exit ' + code))));
    c.on('error', reject);
  });
}

async function runStressTest() {
  const env = { TEST_BASE: TEST_BASE_ENV || BASE };
  if (PLAY_COUNT) env.PLAY_COUNT = PLAY_COUNT;
  await run('node', ['scripts/stress-play.test.js'], env);
}

async function runFix() {
  if (!FIX_CMD.trim()) return;
  console.log('\n[test-cycle-full] 修正コマンドを実行: ' + FIX_CMD + '\n');
  return new Promise((resolve, reject) => {
    const c = spawn(FIX_CMD, [], { stdio: 'inherit', shell: true, cwd: ROOT });
    c.on('close', (code) => (code === 0 ? resolve() : reject(new Error('exit ' + code))));
    c.on('error', reject);
  });
}

async function main() {
  console.log('[test-cycle-full] 完全自動: サーバー起動 → テスト → 終了\n');
  try {
    try {
      await fetchOk('/');
      console.log('[test-cycle-full] 既にサーバーが動いているため、そのままテストを開始します。\n');
    } catch (_) {
      console.log('[test-cycle-full] サーバーを起動しています…\n');
      serverStartedByUs = true;
      await startServer();
      await waitForServer();
      console.log('[test-cycle-full] サーバー起動済み。テストを開始します。\n');
    }

    for (let round = 1; round <= MAX_ROUNDS; round++) {
      console.log('\n========== ラウンド ' + round + '/' + MAX_ROUNDS + ' ==========\n');
      try {
        await runStressTest();
        console.log('\n[test-cycle-full] 全テスト成功。\n');
        process.exit(0);
      } catch (e) {
        console.log('\n[test-cycle-full] ラウンド ' + round + ' で失敗: ' + (e.message || e) + '\n');
        if (round === MAX_ROUNDS) {
          console.log('[test-cycle-full] 最大試行回数に達しました。\n');
          process.exit(1);
        }
        if (FIX_CMD.trim()) {
          try {
            await runFix();
          } catch (fixErr) {
            console.log('[test-cycle-full] 修正コマンドがエラー: ' + (fixErr.message || fixErr) + '\n');
          }
        }
        console.log('[test-cycle-full] 2秒後に再試行します…\n');
        await wait(2000);
      }
    }
    process.exit(1);
  } finally {
    stopServer();
  }
}

main().catch((e) => {
  console.error('[test-cycle-full]', e.message || e);
  stopServer();
  process.exit(1);
});
