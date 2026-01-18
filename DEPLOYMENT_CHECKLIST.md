# デプロイ前チェックリスト

GitHubとVercelにデプロイする前に、以下の項目を確認してください。

## ✅ コード準備

- [ ] `.gitignore`が正しく設定されている
- [ ] 機密情報（`.env.local`, `credentials.json`, `token.json`）がGitに含まれていない
- [ ] `temp_client_inputs/`ディレクトリが`.gitignore`に含まれている
- [ ] `project_numbers.json`が`.gitignore`に含まれている
- [ ] デバッグ用の`console.log`が削除されている（必要に応じて）
- [ ] コードに構文エラーがない（`npm run build`が成功する）

## ✅ 環境変数の準備

### ローカル環境で動作確認済み

- [ ] `GEMINI_API_KEY`が設定されている
- [ ] `GOOGLE_DRIVE_CREDENTIALS_PATH`が設定されている（または`GOOGLE_DRIVE_CREDENTIALS_JSON`）
- [ ] `GOOGLE_DRIVE_TOKEN_PATH`が設定されている（オプション）
- [ ] `GOOGLE_DRIVE_FOLDER_ID`が設定されている
- [ ] `NEXTAUTH_SECRET`が生成されている
- [ ] `NEXTAUTH_URL`が設定されている（ローカル: `http://localhost:3000`）
- [ ] `ADMIN_EMAIL`が設定されている
- [ ] `ADMIN_PASSWORD_HASH`が生成されている

### Vercel用の環境変数値

- [ ] `GEMINI_API_KEY`の値をメモ
- [ ] `NEXTAUTH_SECRET`の値をメモ（32文字以上のランダム文字列）
- [ ] `NEXTAUTH_URL`の値をメモ（VercelのURL、デプロイ後に設定）
- [ ] `ADMIN_EMAIL`の値をメモ
- [ ] `ADMIN_PASSWORD_HASH`の値をメモ
- [ ] `GOOGLE_DRIVE_FOLDER_ID`の値をメモ
- [ ] Google Drive認証情報の設定方法を決定（環境変数 or ファイル）

## ✅ GitHub準備

- [ ] GitHubアカウントにログインしている
- [ ] 新しいリポジトリを作成した
- [ ] リポジトリ名を決定した
- [ ] ローカルでGitリポジトリを初期化した
- [ ] 初回コミットを準備した
- [ ] `.gitignore`が正しく機能していることを確認（`git status`で確認）

## ✅ Vercel準備

- [ ] Vercelアカウントを作成/ログインした
- [ ] GitHubアカウントをVercelに接続した
- [ ] プロジェクト設定を確認した：
  - [ ] Framework Preset: Next.js
  - [ ] Root Directory: `nextjs-app`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `.next`
  - [ ] Install Command: `npm install`

## ✅ デプロイ手順

### Step 1: GitHubにプッシュ

```bash
# 1. リポジトリを初期化（まだの場合）
git init

# 2. ファイルを追加
git add .

# 3. 初回コミット
git commit -m "Initial commit: LP Design Support Tool"

# 4. リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. メインブランチにプッシュ
git branch -M main
git push -u origin main
```

### Step 2: Vercelでプロジェクトを作成

1. [ ] Vercelダッシュボードで「Add New...」→「Project」を選択
2. [ ] GitHubリポジトリを選択
3. [ ] プロジェクト設定を確認
4. [ ] 「Deploy」をクリック（環境変数は後で設定）

### Step 3: 環境変数を設定

1. [ ] デプロイ完了後、Vercelダッシュボードの「Settings」→「Environment Variables」を開く
2. [ ] 以下の環境変数を追加：
   - [ ] `GEMINI_API_KEY`
   - [ ] `NEXTAUTH_SECRET`
   - [ ] `NEXTAUTH_URL`（VercelのURL、例: `https://your-project.vercel.app`）
   - [ ] `ADMIN_EMAIL`
   - [ ] `ADMIN_PASSWORD_HASH`
   - [ ] `GOOGLE_DRIVE_FOLDER_ID`
   - [ ] `GOOGLE_DRIVE_CREDENTIALS_JSON`（Google Drive認証情報をJSON形式で）
3. [ ] 環境変数を追加後、再デプロイを実行

### Step 4: 動作確認

1. [ ] クライアント入力フォーム（`/`）が表示される
2. [ ] ログインページ（`/login`）が表示される
3. [ ] ログインが正常に動作する
4. [ ] デザイナー用画面（`/designer`）にアクセスできる
5. [ ] プロジェクト一覧が表示される
6. [ ] AI機能（ヒアリング整理、コピー生成）が動作する
7. [ ] Google Drive保存が動作する（設定している場合）

## ✅ デプロイ後の確認

- [ ] Vercelのログにエラーがないか確認
- [ ] ブラウザのコンソールにエラーがないか確認
- [ ] すべてのページが正常に表示される
- [ ] APIエンドポイントが正常に動作する
- [ ] 認証機能が正常に動作する

## ⚠️ 注意事項

- **機密情報**: 環境変数は絶対にGitHubにコミットしない
- **Google Drive認証**: Vercelではファイルシステムへの直接アクセスができないため、環境変数として設定する必要がある
- **再デプロイ**: 環境変数を追加/変更した場合は、必ず再デプロイを実行
- **ログ確認**: エラーが発生した場合は、Vercelのログを確認

## 📝 メモ欄

### リポジトリ情報
- GitHub URL: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
- Vercel URL: `https://your-project.vercel.app`

### 環境変数メモ（機密情報のため、安全な場所に保管）
```
GEMINI_API_KEY=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-project.vercel.app
ADMIN_EMAIL=...
ADMIN_PASSWORD_HASH=...
GOOGLE_DRIVE_FOLDER_ID=...
```

---

**チェックリストをすべて完了したら、デプロイを開始してください！**
