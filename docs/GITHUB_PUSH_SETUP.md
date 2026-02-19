# GitHub に push するときの認証設定

`git push origin main` で「Password authentication is not supported」や「Authentication failed」と出る場合、GitHub の認証方法を次のどちらかに合わせてください。

---

## 方法1：Personal Access Token（PAT）を使う（手早く push したいとき）

GitHub では、**パスワードの代わりに「Personal Access Token」** を使います。

### 1. トークンを作る

1. ブラウザで **https://github.com** にログインする
2. 右上の **自分のアイコン** をクリック → **Settings**
3. 左の一番下 **Developer settings**
4. **Personal access tokens** → **Tokens (classic)** をクリック
5. **Generate new token** → **Generate new token (classic)** を選ぶ
6. **Note** に「lucky-draw」など、自分が分かる名前を入れる
7. **Expiration** で有効期限を選ぶ（例：90 days または No expiration）
8. **Select scopes** で **repo** にチェックを入れる（リポジトリの読み書き用）
9. 一番下の **Generate token** をクリック
10. 表示された **トークン（ghp_ で始まる文字列）** を**必ずコピー**して、安全な場所にメモする  
    ※ この画面を閉じると二度と表示されません

### 2. push するときにトークンを使う

ターミナルで、もう一度 push します。

```bash
cd /Users/kata-mba/Desktop/lucky-draw
git push origin main
```

- **Username** を聞かれたら → GitHub の**ユーザー名**（例：Katayama-MF）を入力して Enter
- **Password** を聞かれたら → **先ほどコピーしたトークン**を貼り付けて Enter（パスワードは入力しない）

これで push が通るはずです。  
Mac の「キーチェーン」に保存を聞かれたら「保存」を選ぶと、次回からパスワード入力を省略できます（トークンが保存されます）。

---

## 方法2：SSH で接続する（よく push する人向け）

HTTPS の代わりに SSH で GitHub に接続する方法です。一度設定すると、トークン入力が不要になります。

### 1. SSH キーがあるか確認する

ターミナルで次を実行します。

```bash
ls -la ~/.ssh
```

`id_rsa.pub` や `id_ed25519.pub` のようなファイルがあれば、すでにキーがあります。  
なければ次の「2. SSH キーを作る」に進みます。

### 2. SSH キーを作る（まだない場合）

```bash
ssh-keygen -t ed25519 -C "あなたのメール@example.com"
```

- ファイルの保存場所を聞かれたら **Enter**（既定の場所でよい）
- パスフレーズを聞かれたら、任意で入力するか、そのまま Enter で省略

### 3. 公開キーを GitHub に登録する

1. 次のコマンドで**公開キー**を表示し、**全文をコピー**します。  
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```  
   （`id_rsa.pub` を使っている場合は `cat ~/.ssh/id_rsa.pub`）
2. GitHub の **Settings** → **SSH and GPG keys** → **New SSH key**
3. **Title** に「MacBook」など分かりやすい名前を入れる
4. **Key** の欄にコピーした公開キーを貼り付けて **Add SSH key**

### 4. リモートを HTTPS から SSH に変える

lucky-draw のフォルダで次を実行します。

```bash
cd /Users/kata-mba/Desktop/lucky-draw
git remote set-url origin git@github.com:Katayama-MF/lucky-draw.git
```

### 5. push する

```bash
git push origin main
```

初回だけ「このホストを信頼しますか？」と出たら **yes** と入力して Enter。  
以降は、SSH キーにパスフレーズを設定していれば、その入力だけで push できます。

---

## うまくいかないとき

- **「Permission denied (publickey)」**  
  → SSH キーが GitHub に登録されているか、`git remote -v` で `git@github.com:...` になっているか確認してください。
- **「Invalid username or token」**  
  → PAT を使っている場合は、**パスワードではなくトークン**を入力しているか確認してください。トークンを再発行して、もう一度試すことも有効です。
