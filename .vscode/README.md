# 開発用

## エラーログを Cursor 内で確認する手順

1. **タスクの実行**: `Cmd+Shift+P` → 「タスク: タスクの実行」→ **「Dev: Run app」** を選ぶ（サーバーが `http://localhost:3000` で起動）
2. **Simple Browser で開く**: もう一度 `Cmd+Shift+P` → **「Simple Browser: Show」** と入力 → 表示されたら選択 → URL に `http://localhost:3000` を入力
3. アプリの **LOG パネル**（ツールバーの LOG）に、`logPanel` の内容に加えて **console.error / console.warn も表示**されます。DevTools を開かなくて済みます。

「Open app (ブラウザで開く)」タスクは、既定のブラウザで開く用です。Cursor 内で見る場合は上記の Simple Browser を使ってください。
