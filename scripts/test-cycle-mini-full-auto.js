#!/usr/bin/env node
/**
 * 完全自動: サーバー起動 → 小テスト繰り返し → フルテスト → サーバー停止
 * 使い方: npm run test:cycle:mini:full  で寝てOK
 * 環境変数: test-cycle-mini-full.js と同じ + TEST_PORT
 */
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const PORT = parseInt(process.env.TEST_PORT, 10) || 8080;
const BASE = process.env.TEST_BASE || `http://127.0.0.1:${PORT}`;
const SERVER_WAIT_MS = 20000;
const POLL_MS = 300;

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
    serverProcess.on('exit', (code) => {
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

async function main() {
  console.log('[test-cycle-mini-full] 完全自動: サーバー起動 → 小テスト繰り返し → フルテスト → 終了\n');
  try {
    try {
      await fetchOk('/');
      console.log('[test-cycle-mini-full] 既にサーバーが動いているため、そのままテストを開始します。\n');
    } catch (_) {
      console.log('[test-cycle-mini-full] サーバーを起動しています…\n');
      serverStartedByUs = true;
      await startServer();
      await waitForServer();
      console.log('[test-cycle-mini-full] サーバー起動済み。\n');
    }

    const env = { ...process.env, TEST_BASE: process.env.TEST_BASE || BASE };
    await new Promise((resolve, reject) => {
      const c = spawn('node', ['scripts/test-cycle-mini-full.js'], {
        stdio: 'inherit',
        shell: false,
        env,
        cwd: ROOT,
      });
      c.on('close', (code) => (code === 0 ? resolve() : reject(new Error('exit ' + code))));
      c.on('error', reject);
    });
    process.exit(0);
  } catch (e) {
    console.error('[test-cycle-mini-full]', e.message || e);
    process.exit(1);
  } finally {
    stopServer();
  }
}

main();
