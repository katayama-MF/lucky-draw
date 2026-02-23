#!/usr/bin/env node
/**
 * 簡易HTTPサーバー（Node.js のみで起動、npm 不要）
 * 使い方: node server.js
 * ブラウザで http://localhost:8080 を開く
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const MIMES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.mp4': 'audio/mp4',
  '.webm': 'audio/webm',
};

const LOGS_DIR = path.join(__dirname, 'stress-test-logs');
const SOUND_DIR = path.join(__dirname, 'sound');

const server = http.createServer((req, res) => {
  let url = req.url === '/' ? '/index.html' : req.url;
  url = url.split('?')[0];

  if (url.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  // ブラウザの自動リクエストで 404 がコンソールに出ないようにする
  if (url === '/favicon.ico') {
    res.writeHead(204, { 'Content-Length': '0' });
    res.end();
    return;
  }

  // POST /api/sound-upload : 音ファイルを sound/ に保存
  if (req.method === 'POST' && url === '/api/sound-upload') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const name = String(data.name || '').replace(/[^a-zA-Z0-9_-]/g, '');
        const b64 = data.data || '';
        if (!name || !b64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'name and data required' }));
          return;
        }
        const allowed = ['super', 'mega', 'BGM', 'normal', 'big', 'button', 'commonClick', 'reelTick', 'confirm', 'winner', 'next', 'rateReelMega', 'rateReelSuper', 'rateReelBig'];
        if (!allowed.includes(name)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'invalid name' }));
          return;
        }
        const ext = (data.ext || 'ogg').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const allowedExt = ['ogg', 'mp3', 'wav', 'm4a', 'aac', 'mp4', 'webm'];
        const safeExt = allowedExt.includes(ext) ? ext : 'ogg';
        const fileName = name + '.' + safeExt;
        if (!fs.existsSync(SOUND_DIR)) fs.mkdirSync(SOUND_DIR, { recursive: true });
        const filePath = path.join(SOUND_DIR, fileName);
        const buf = Buffer.from(b64, 'base64');
        if (buf.length > 5 * 1024 * 1024) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'file too large (max 5MB)' }));
          return;
        }
        fs.writeFileSync(filePath, buf);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, file: fileName }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // POST /api/stress-test-log : ストレステストログを stress-test-logs/ に保存
  if (req.method === 'POST' && url === '/api/stress-test-log') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });
        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const fileName = `stress-${ts}.json`;
        const filePath = path.join(LOGS_DIR, fileName);
        const data = body && body.trim() ? body : '{}';
        fs.writeFileSync(filePath, data, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, file: fileName }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  const filePath = path.join(__dirname, url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
      return;
    }
    const ext = path.extname(filePath);
    const type = MIMES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  LUCKY DRAW サーバー起動');
  console.log('  → ブラウザで開く: http://localhost:' + PORT);
  console.log('  → 終了: Ctrl+C');
  console.log('');
});
