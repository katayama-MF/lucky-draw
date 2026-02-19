#!/usr/bin/env node
/**
 * テスト→失敗時は修正コマンド実行→再テスト を繰り返すサイクル
 * 使い方:
 *   1) 別ターミナルで node server.js を起動しておく
 *   2) npm run test:cycle
 *   3) 環境変数（任意）:
 *      TEST_CYCLE_MAX_ROUNDS=5     … 最大試行回数（既定 5）
 *      TEST_CYCLE_FIX="npm run lint -- --fix"  … 失敗時に実行する修正コマンド（未設定なら修正なしで再試行のみ）
 *      PLAY_COUNT=100              … ストレステストの回数（test-cycle にそのまま渡す）
 */
const { spawn } = require('child_process');
const path = require('path');

const MAX_ROUNDS = Math.max(1, parseInt(process.env.TEST_CYCLE_MAX_ROUNDS, 10) || 5);
const FIX_CMD = process.env.TEST_CYCLE_FIX || '';
const PLAY_COUNT = process.env.PLAY_COUNT || '';
const TEST_BASE = process.env.TEST_BASE || '';

const ROOT = path.resolve(__dirname, '..');

function run(cmd, args, env = {}) {
  return new Promise((resolve, reject) => {
    const c = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...env },
      cwd: ROOT,
    });
    c.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
    c.on('error', reject);
  });
}

async function runStressTest() {
  const env = {};
  if (PLAY_COUNT) env.PLAY_COUNT = PLAY_COUNT;
  if (TEST_BASE) env.TEST_BASE = TEST_BASE;
  await run('node', ['scripts/stress-play.test.js'], env);
}

async function runFix() {
  if (!FIX_CMD.trim()) return;
  console.log('\n[test-cycle] 修正コマンドを実行: ' + FIX_CMD + '\n');
  return new Promise((resolve, reject) => {
    const c = spawn(FIX_CMD, [], { stdio: 'inherit', shell: true, cwd: ROOT });
    c.on('close', (code) => (code === 0 ? resolve() : reject(new Error('exit ' + code))));
    c.on('error', reject);
  });
}

async function main() {
  console.log('[test-cycle] 最大 ' + MAX_ROUNDS + ' 回まで テスト → (失敗時)修正 → 再テスト を繰り返します。\n');
  if (FIX_CMD) console.log('[test-cycle] 失敗時の修正コマンド: ' + FIX_CMD + '\n');
  else console.log('[test-cycle] TEST_CYCLE_FIX 未設定のため、失敗時は再試行のみ行います。\n');

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    console.log('\n========== test-cycle ラウンド ' + round + '/' + MAX_ROUNDS + ' ==========\n');
    try {
      await runStressTest();
      console.log('\n[test-cycle] 全テスト成功（ラウンド ' + round + '）\n');
      process.exit(0);
    } catch (e) {
      console.log('\n[test-cycle] ラウンド ' + round + ' で失敗: ' + (e.message || e) + '\n');
      if (round === MAX_ROUNDS) {
        console.log('[test-cycle] 最大試行回数に達しました。\n');
        process.exit(1);
      }
      if (FIX_CMD.trim()) {
        try {
          await runFix();
        } catch (fixErr) {
          console.log('[test-cycle] 修正コマンドがエラー: ' + (fixErr.message || fixErr) + '\n');
        }
      }
      console.log('[test-cycle] 2秒後に再試行します…\n');
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
