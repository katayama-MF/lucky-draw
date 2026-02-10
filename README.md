# LUCKY DRAW - パチスロ風抽選

イベント用の景品抽選アプリ。リールを回してストップで当選を表示します。

---

## 起動方法

```bash
git clone <このリポジトリのURL>
cd lucky-draw
npm install   # 初回のみ（任意）
npm run dev  # http://localhost:3000 で起動
```

ブラウザで **http://localhost:3000** を開いて利用します。  
（`npm start` でも可。ポートを変える場合は `npx serve . -l 8080` など）

---

## ブランチ（lucky-draw と lucky-draw-cloud）

- **main**: 現行の lucky-draw（静的・ローカル保存）
- **cloud**: 2台同期版「lucky-draw-cloud」の開発用ブランチ（予定）

詳細は [docs/BRANCH_STRATEGY.md](docs/BRANCH_STRATEGY.md) を参照。

---

## 本番利用・デプロイ

- **GitHub で共有してローカルで使う**: 上記のまま利用可能。
- **クラウドにデプロイする／2台で同期する**: [docs/DEPLOY_AND_SYNC.md](docs/DEPLOY_AND_SYNC.md) を参照。

---

## 主な機能

- 賞品は Google スプレッドシートで管理（設定 → 賞品一覧 → 更新）
- 抽選履歴・残り回数・設定はブラウザに保存（localStorage）
- 標準モード / サクサクモード、BGM・SE の ON/OFF など

---

## ドキュメント

| ファイル | 内容 |
|----------|------|
| [docs/SETUP_MANUAL.md](docs/SETUP_MANUAL.md) | **導入マニュアル**（クローン〜起動・賞品スプシ・画像のセット方法） |
| [docs/BRANCH_STRATEGY.md](docs/BRANCH_STRATEGY.md) | main（lucky-draw）と cloud（lucky-draw-cloud）のブランチ方針 |
| [docs/DEPLOY_AND_SYNC.md](docs/DEPLOY_AND_SYNC.md) | 本番利用・GitHub共有・クラウドデプロイ・2台同期 |
| [docs/REEL_IMAGE_SPEC.md](docs/REEL_IMAGE_SPEC.md) | リール用画像のデザイナー発注仕様（サイズ・形式） |
