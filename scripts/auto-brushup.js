#!/usr/bin/env node
/**
 * 自動ブラッシュアップ: テストプレイ → フィードバック解析 → 修正適用 → 繰り返し（最大100ターン）
 * 確認不要で一晩回せる。OS のターミナルで実行すること（Puppeteer は IDE 内で起動しない場合あり）。
 *
 * 使い方:
 *   cd /path/to/lucky-draw
 *   node scripts/auto-brushup.js
 *   TURNS=50 PLAY_COUNT=30 node scripts/auto-brushup.js
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { selectFix, applyFix } = require('./brushup-fixes.js');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8080;
const BASE = `http://127.0.0.1:${PORT}`;
const MAX_TURNS = Math.min(100, Math.max(1, parseInt(process.env.TURNS, 10) || 100));
const PLAY_COUNT_PER_TURN = Math.min(200, Math.max(10, parseInt(process.env.PLAY_COUNT, 10) || 50));
const CONFIRM_CLEAN_TURNS = 2;
const STRESS_TIMEOUT_MS = 15 * 60 * 1000;

const LOG_DIR = path.join(ROOT, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'brushup-' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + '.log');

function log(msg, alsoConsole = true) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, line);
  if (alsoConsole) console.log(msg);
}

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

function runStressTest(env) {
  return new Promise((resolve) => {
    const child = spawn('node', ['scripts/stress-play.test.js'], {
      cwd: ROOT,
      stdio: ['inherit', 'pipe', 'pipe'],
      env: { ...process.env, TEST_BASE: BASE, PLAY_COUNT: String(PLAY_COUNT_PER_TURN), ...env },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    const done = (payload) => {
      clearTimeout(tid);
      resolve(payload);
    };
    const tid = setTimeout(() => {
      child.kill('SIGKILL');
      done({ code: -1, stdout, stderr, result: null, timeout: true });
    }, STRESS_TIMEOUT_MS);
    child.on('close', (code) => {
      const line = stdout.split('\n').find((l) => l.startsWith('STRESS_JSON='));
      let result = null;
      if (line) {
        try {
          result = JSON.parse(line.slice('STRESS_JSON='.length));
        } catch (_) {}
      }
      done({ code, stdout, stderr, result });
    });
  });
}

async function main() {
  log('========== 自動ブラッシュアップ開始 ==========');
  log(`最大ターン: ${MAX_TURNS}, 1ターンあたりプレイ数: ${PLAY_COUNT_PER_TURN}`);
  log(`ログ: ${LOG_FILE}`);

  if (!(await checkServer())) {
    log('サーバーを起動しています…');
    const server = spawn('node', ['server.js'], { cwd: ROOT, stdio: 'ignore', detached: true });
    server.unref();
    const ok = await waitForServer();
    if (!ok) {
      log('サーバーの起動を待てませんでした。手動で node server.js を起動してから再度実行してください。', true);
      process.exit(1);
    }
    log('サーバー起動完了');
  } else {
    log('既にサーバーが起動しています');
  }

  const state = { env: {}, applied: new Set() };
  let cleanTurns = 0;

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    log(`\n--- ターン ${turn}/${MAX_TURNS} ---`);
    const { code, result, timeout } = await runStressTest(state.env);

    if (timeout) {
      log(`ターン ${turn}: ストレステストが ${STRESS_TIMEOUT_MS / 60000} 分でタイムアウトしました。`);
      continue;
    }
    if (!result) {
      log(`ターン ${turn}: ストレステストが結果を返しませんでした（クラッシュの可能性）。終了します。`);
      break;
    }

    const { plays, success, bugs, byType } = result;
    log(`プレイ: ${plays}, 成功: ${success}, バグ: ${bugs}`);
    if (bugs > 0 && byType && Object.keys(byType).length) {
      log(`内訳: ${JSON.stringify(byType)}`);
    }

    if (bugs === 0) {
      cleanTurns++;
      log(`バグなし (連続クリーン: ${cleanTurns}/${CONFIRM_CLEAN_TURNS})`);
      if (cleanTurns >= CONFIRM_CLEAN_TURNS) {
        log('安定してクリーンなため、自動ブラッシュアップを終了します。');
        process.exit(0);
      }
      continue;
    }

    cleanTurns = 0;
    const fix = selectFix(result, state);
    if (fix) {
      log(`適用する修正: ${fix.message}`);
      applyFix(fix, state);
      if (Object.keys(fix.env || {}).length) {
        log(`次ターンの env: ${JSON.stringify(fix.env)}`);
      }
    } else {
      log('これ以上適用する自動修正はありません。手動での対応が必要です。');
      log('結果の詳細はストレステストを単体実行して確認してください。');
      break;
    }
  }

  log(`\n========== 自動ブラッシュアップ終了（全 ${MAX_TURNS} ターン実施 or 打ち切り） ==========`);
  process.exit(0);
}

main().catch((e) => {
  log('エラー: ' + (e && e.message ? e.message : String(e)));
  process.exit(1);
});
