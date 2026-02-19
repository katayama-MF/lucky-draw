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
};

const server = http.createServer((req, res) => {
  let url = req.url === '/' ? '/index.html' : req.url;
  url = url.split('?')[0];
  const filePath = path.join(__dirname, url);

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
