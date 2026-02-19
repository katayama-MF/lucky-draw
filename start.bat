@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  LUCKY DRAW を起動しています...
echo

:: Node があれば server.js で起動（推奨）
where node >nul 2>&1
if %errorlevel% equ 0 (
  start "" "http://localhost:8080"
  node server.js
  goto :eof
)

:: なければ Python で起動
where python >nul 2>&1
if %errorlevel% equ 0 (
  start "" "http://localhost:8080"
  python -m http.server 8080
  goto :eof
)

where python3 >nul 2>&1
if %errorlevel% equ 0 (
  start "" "http://localhost:8080"
  python3 -m http.server 8080
  goto :eof
)

echo  Node.js または Python がインストールされていません。
echo  「起動方法.txt」を参照してください。
echo.
pause
