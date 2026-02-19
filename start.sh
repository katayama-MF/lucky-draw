#!/bin/bash
cd "$(dirname "$0")"

echo ""
echo "  LUCKY DRAW を起動しています..."
echo ""

if command -v node >/dev/null 2>&1; then
  (sleep 1; open "http://localhost:8080" 2>/dev/null || xdg-open "http://localhost:8080" 2>/dev/null) &
  exec node server.js
fi

if command -v python3 >/dev/null 2>&1; then
  (sleep 1; open "http://localhost:8080" 2>/dev/null || xdg-open "http://localhost:8080" 2>/dev/null) &
  exec python3 -m http.server 8080
fi

if command -v python >/dev/null 2>&1; then
  (sleep 1; open "http://localhost:8080" 2>/dev/null || xdg-open "http://localhost:8080" 2>/dev/null) &
  exec python -m http.server 8080
fi

echo "  Node.js または Python がインストールされていません。"
echo "  「起動方法.txt」を参照してください。"
echo ""
exit 1
