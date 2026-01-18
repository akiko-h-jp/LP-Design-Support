# GitHubへのプッシュ方法

認証エラーが発生している場合、以下のいずれかの方法でプッシュできます。

## 方法1: GitHub CLIを使用（最も簡単）

### 1. GitHub CLIのインストール（未インストールの場合）

```bash
# Homebrewを使用
brew install gh

# または公式サイトからダウンロード
# https://cli.github.com/
```

### 2. GitHub CLIでログイン

```bash
gh auth login
```

以下の手順に従います：
- GitHub.comを選択
- HTTPSを選択
- ブラウザで認証を完了
- または、Personal Access Tokenを入力

### 3. プッシュ

```bash
cd "/Users/a-hagiwara/Desktop/Learning/AI学習/AIエンジニア_アプリ/8-1_LP Design Support"
git push -u origin main
```

---

## 方法2: Personal Access Tokenを使用

### 1. Personal Access Tokenの作成

1. GitHubにログイン
2. 右上のプロフィールアイコン → **Settings**
3. 左メニューの一番下 → **Developer settings**
4. **Personal access tokens** → **Tokens (classic)**
5. **Generate new token (classic)** をクリック
6. 以下の設定：
   - **Note**: `LP-Design-Support`（任意の名前）
   - **Expiration**: 適切な期間を選択（例: 90 days）
   - **Select scopes**: `repo` にチェック
7. **Generate token** をクリック
8. **トークンをコピー**（この画面でしか表示されません）

### 2. プッシュ時にトークンを使用

```bash
cd "/Users/a-hagiwara/Desktop/Learning/AI学習/AIエンジニア_アプリ/8-1_LP Design Support"
git push -u origin main
```

プロンプトが表示されたら：
- **Username**: `akiko-h-jp`
- **Password**: コピーしたPersonal Access Token（パスワードではない）

### 3. トークンを保存（オプション）

```bash
# Git Credential Helperを使用してトークンを保存
git config --global credential.helper osxkeychain
```

次回からは自動的に認証されます。

---

## 方法3: SSHキーを使用

### 1. SSHキーの生成

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Enterキーを3回押してデフォルト設定で生成します。

### 2. SSHキーをGitHubに追加

```bash
# 公開鍵をクリップボードにコピー
pbcopy < ~/.ssh/id_ed25519.pub
```

1. GitHubにログイン
2. 右上のプロフィールアイコン → **Settings**
3. 左メニュー → **SSH and GPG keys**
4. **New SSH key** をクリック
5. **Title**: `MacBook Pro`（任意の名前）
6. **Key**: クリップボードの内容を貼り付け（`pbcopy`でコピー済み）
7. **Add SSH key** をクリック

### 3. リモートURLをSSHに変更

```bash
cd "/Users/a-hagiwara/Desktop/Learning/AI学習/AIエンジニア_アプリ/8-1_LP Design Support"
git remote set-url origin git@github.com:akiko-h-jp/LP-Design-Support.git
```

### 4. プッシュ

```bash
git push -u origin main
```

---

## 方法4: GitHub Desktopを使用

1. [GitHub Desktop](https://desktop.github.com/)をダウンロード・インストール
2. GitHub Desktopでログイン
3. **File** → **Add Local Repository**
4. プロジェクトフォルダを選択
5. **Publish repository** をクリック

---

## 現在の状態

- ✅ Gitリポジトリは初期化済み
- ✅ 71ファイルがコミット済み
- ✅ リモートリポジトリは設定済み
- ⏳ プッシュ待ち（認証が必要）

---

## 推奨方法

**GitHub CLI（方法1）**が最も簡単で安全です。インストール後、`gh auth login`を実行するだけで認証が完了します。
