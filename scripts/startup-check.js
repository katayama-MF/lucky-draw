#!/usr/bin/env node
/**
 * 8GB Chromebook 向け: サーバー起動・応答チェック（Puppeteer 不要・軽量）
 * 使い方:
 *   node scripts/startup-check.js              … 既に起動中のサーバーに GET のみ
 *   node scripts/startup-check.js --spawn      … server.js を起動してからチェックして終了
 *   node scripts/startup-check.js --spawn --loop 5   … 5回繰り返し（メモリリーク・不安定の検出）
 * 環境変数:
 *   NODE_OPTIONS=--max-old-space-size=256  … 本番起動前にメモリ制限を試す場合
 *   TEST_PORT=8080  TEST_BASE=http://127.0.0.1:8080
 */
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = parseInt(process.env.TEST_PORT, 10) || 8080;
const BASE = process.env.TEST_BASE || `http://127.0.0.1:${PORT}`;
const WAIT_MS = parseInt(process.env.STARTUP_WAIT_MS, 10) || 3000;
const POLL_MS = 100;

function fetch(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url, BASE);
    http.get(u, { timeout: 5000 }, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function waitForServer(deadlineMs) {
  const deadline = Date.now() + (deadlineMs || WAIT_MS);
  while (Date.now() < deadline) {
    try {
      const { status } = await fetch('/');
      if (status === 200) return true;
    } catch (_) {}
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  return false;
}

function checkOnce() {
  const results = { ok: true, errors: [] };
  return (async () => {
    const urls = [
      { url: '/', minLength: 100 },
      { url: '/index.html', minLength: 100 },
      { url: '/script.js', minLength: 1000 },
      { url: '/style.css', minLength: 100 },
    ];
    for (const { url, minLength } of urls) {
      try {
        const { status, body } = await fetch(url);
        if (status !== 200) {
          results.ok = false;
          results.errors.push(`${url} → status ${status}`);
        } else if (body.length < minLength) {
          results.ok = false;
          results.errors.push(`${url} → body too short (${body.length} < ${minLength})`);
        }
      } catch (e) {
        results.ok = false;
        results.errors.push(`${url} → ${e.message}`);
      }
    }
    return results;
  })();
}

function startServer(env = {}) {
  const child = spawn('node', ['server.js'], {
    cwd: ROOT,
    stdio: 'ignore',
    env: { ...process.env, ...env },
  });
  child.on('error', (e) => {
    console.error('[startup-check] server spawn error:', e.message);
  });
  return child;
}

async function runWithSpawn(round) {
  const env = {};
  if (process.env.NODE_OPTIONS) env.NODE_OPTIONS = process.env.NODE_OPTIONS;
  const server = startServer(env);
  const label = round != null ? ` [round ${round}]` : '';
  try {
    const up = await waitForServer();
    if (!up) {
      console.error(`[startup-check]${label} サーバーが ${WAIT_MS}ms 以内に起動しませんでした`);
      return { ok: false, errors: ['server did not start in time'] };
    }
    const result = await checkOnce();
    if (!result.ok) {
      console.error(`[startup-check]${label} チェック失敗:`, result.errors);
    }
    return result;
  } finally {
    if (server && server.kill) server.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 200));
  }
}

async function main() {
  const args = process.argv.slice(2);
  const doSpawn = args.includes('--spawn');
  const loopIdx = args.indexOf('--loop');
  const loopCount = loopIdx >= 0 && args[loopIdx + 1] != null
    ? Math.max(1, parseInt(args[loopIdx + 1], 10))
    : 0;

  if (doSpawn && loopCount > 0) {
    console.log(`[startup-check] メモリ制約チェック: ${loopCount} 回 起動→応答→終了 を繰り返します\n`);
    let failCount = 0;
    for (let i = 1; i <= loopCount; i++) {
      const result = await runWithSpawn(i);
      if (!result.ok) failCount++;
      if (result.ok) process.stdout.write(`  round ${i}/${loopCount} OK\n`);
    }
    console.log('');
    if (failCount > 0) {
      console.error(`[startup-check] クリティカル: ${failCount}/${loopCount} 回で失敗しました。`);
      process.exit(1);
    }
    console.log('[startup-check] 全ラウンド成功。');
    process.exit(0);
  }

  if (doSpawn) {
    const result = await runWithSpawn();
    process.exit(result.ok ? 0 : 1);
  }

  // 既存サーバーへの GET のみ
  const up = await waitForServer(5000);
  if (!up) {
    console.error('[startup-check] サーバーに接続できません。先に node server.js を起動してください.');
    process.exit(1);
  }
  const result = await checkOnce();
  if (!result.ok) {
    console.error('[startup-check] チェック失敗:', result.errors);
    process.exit(1);
  }
  console.log('[startup-check] 起動・応答 OK');
  process.exit(0);
}

main().catch((e) => {
  console.error('[startup-check]', e.message || e);
  process.exit(1);
});
