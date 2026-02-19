#!/usr/bin/env node
/**
 * 小テスト（〜100回プレイ）を繰り返し → ログ出力 → バグ検出時に修正 → 再テスト
 * を繰り返し、連続でバグ0が続いたらフルテスト（1000回）を実行する自動サイクル
 *
 * 使い方:
 *   1) 別ターミナルで node server.js を起動しておく（または test:cycle:mini:full でサーバーも自動起動）
 *   2) npm run test:cycle:mini:full
 *
 * 環境変数:
 *   MINI_PLAY_COUNT=100       … 小テスト1回あたりのプレイ回数（既定 100）
 *   MINI_CLEAN_REQUIRED=3     … 連続で何回バグ0ならフルテストへ進むか（既定 3）
 *   MINI_MAX_ROUNDS=100       … 小テストの最大ラウンド数（既定 100）
 *   FULL_PLAY_COUNT=1000      … フルテストのプレイ回数（既定 1000）
 *   TEST_CYCLE_FIX="..."      … バグ検出時に実行する修正コマンド
 *   LOG_DIR=./logs            … ログ出力ディレクトリ（未設定なら ./test-logs）
 *   TEST_BASE=http://...      … テスト対象URL
 *   TEST_PORT=8080            … サーバーポート（test:cycle:mini:full 用）
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const MINI_PLAY_COUNT = Math.max(1, parseInt(process.env.MINI_PLAY_COUNT, 10) || 100);
const MINI_CLEAN_REQUIRED = Math.max(1, parseInt(process.env.MINI_CLEAN_REQUIRED, 10) || 3);
const MINI_MAX_ROUNDS = Math.max(1, parseInt(process.env.MINI_MAX_ROUNDS, 10) || 100);
const FULL_PLAY_COUNT = Math.max(1, parseInt(process.env.FULL_PLAY_COUNT, 10) || 1000);
const FIX_CMD = process.env.TEST_CYCLE_FIX || '';
const LOG_DIR = path.resolve(ROOT, process.env.LOG_DIR || 'test-logs');
const TEST_BASE = process.env.TEST_BASE || '';

let logStream = null;
let logPath = null;

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function openLog() {
  ensureLogDir();
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  logPath = path.join(LOG_DIR, `mini-cycle-${ts}.log`);
  logStream = fs.createWriteStream(logPath, { flags: 'a' });
  logStream.write(`\n========== 開始 ${new Date().toISOString()} ==========\n`);
  return logPath;
}

function log(msg) {
  const line = (msg || '') + '\n';
  process.stdout.write(line);
  if (logStream && logStream.writable) logStream.write(line);
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function runStressTest(playCount, envExtra = {}) {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      PLAY_COUNT: String(playCount),
      ...(TEST_BASE ? { TEST_BASE } : {}),
      ...envExtra,
    };
    const c = spawn('node', ['scripts/stress-play.test.js'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: false,
      env,
      cwd: ROOT,
    });
    let out = '';
    let err = '';
    c.stdout.on('data', (d) => {
      const s = d.toString();
      process.stdout.write(s);
      out += s;
      if (logStream && logStream.writable) logStream.write(s);
    });
    c.stderr.on('data', (d) => {
      const s = d.toString();
      process.stderr.write(s);
      err += s;
      if (logStream && logStream.writable) logStream.write(s);
    });
    c.on('close', (code) => {
      if (code === 0) resolve({ code: 0, out, err });
      else reject(new Error(`exit ${code}`));
    });
    c.on('error', reject);
  });
}

async function runFix() {
  if (!FIX_CMD.trim()) return;
  log('\n[test-cycle-mini-full] 修正コマンドを実行: ' + FIX_CMD + '\n');
  return new Promise((resolve, reject) => {
    const c = spawn(FIX_CMD, [], { stdio: 'inherit', shell: true, cwd: ROOT });
    c.on('close', (code) => (code === 0 ? resolve() : reject(new Error('exit ' + code))));
    c.on('error', reject);
  });
}

async function main() {
  openLog();
  log(`[test-cycle-mini-full] 小テスト→ログ→バグ検出時修正→再テスト の自動サイクル`);
  log(`  小テスト: ${MINI_PLAY_COUNT} 回プレイ/ラウンド`);
  log(`  連続 ${MINI_CLEAN_REQUIRED} 回バグ0でフルテストへ`);
  log(`  小テスト最大ラウンド: ${MINI_MAX_ROUNDS}`);
  log(`  フルテスト: ${FULL_PLAY_COUNT} 回プレイ`);
  if (FIX_CMD) log(`  修正コマンド: ${FIX_CMD}`);
  log(`  ログ: ${logPath}\n`);

  let consecutiveClean = 0;
  let totalBugs = 0;

  for (let round = 1; round <= MINI_MAX_ROUNDS; round++) {
    log(`\n---------- 小テスト ラウンド ${round}/${MINI_MAX_ROUNDS} (${MINI_PLAY_COUNT}回プレイ) ----------`);
    try {
      await runStressTest(MINI_PLAY_COUNT);
      consecutiveClean++;
      log(`\n[OK] ラウンド ${round}: バグ0 (連続 ${consecutiveClean}/${MINI_CLEAN_REQUIRED} 回クリーン)`);
      if (consecutiveClean >= MINI_CLEAN_REQUIRED) {
        log(`\n[test-cycle-mini-full] 連続 ${MINI_CLEAN_REQUIRED} 回クリーン達成。フルテストを実行します。\n`);
        break;
      }
    } catch (e) {
      consecutiveClean = 0;
      totalBugs++;
      log(`\n[NG] ラウンド ${round}: バグ検出 - ${e.message}`);
      log(`     ログ詳細は上記および ${logPath} を確認してください。`);
      if (FIX_CMD.trim()) {
        try {
          await runFix();
        } catch (fixErr) {
          log(`[test-cycle-mini-full] 修正コマンドがエラー: ${fixErr.message || fixErr}`);
        }
      }
      log(`[test-cycle-mini-full] 3秒後に次の小テストを開始します…\n`);
      await wait(3000);
    }
  }

  if (consecutiveClean < MINI_CLEAN_REQUIRED) {
    log(`\n[test-cycle-mini-full] 小テスト ${MINI_MAX_ROUNDS} ラウンド終了。連続クリーン未達のためフルテストはスキップします。`);
    if (logStream) logStream.end();
    process.exit(1);
  }

  log(`\n========== フルテスト開始 (${FULL_PLAY_COUNT} 回プレイ) ==========\n`);
  try {
    await runStressTest(FULL_PLAY_COUNT);
    log(`\n[test-cycle-mini-full] フルテスト成功。全サイクル完了。\n`);
    if (logStream) logStream.end();
    process.exit(0);
  } catch (e) {
    log(`\n[test-cycle-mini-full] フルテスト失敗: ${e.message}`);
    if (FIX_CMD.trim()) {
      try {
        await runFix();
        log(`[test-cycle-mini-full] 修正後にフルテストを再実行します…\n`);
        await wait(2000);
        try {
          await runStressTest(FULL_PLAY_COUNT);
          log(`\n[test-cycle-mini-full] 再実行後、フルテスト成功。\n`);
          if (logStream) logStream.end();
          process.exit(0);
        } catch (_) {
          // fall through to exit 1
        }
      } catch (_) {}
    }
    if (logStream) logStream.end();
    process.exit(1);
  }
}

main().catch((e) => {
  log('[test-cycle-mini-full] ' + (e.message || e));
  if (logStream) logStream.end();
  process.exit(1);
});
