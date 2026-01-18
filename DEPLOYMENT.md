# デプロイメントガイド

このドキュメントでは、GitHubとVercelを使用したデプロイ手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント
- 必要なAPIキーと認証情報

---

## 1. GitHubへのアップロード準備

### 1.1 リポジトリの作成

1. GitHubで新しいリポジトリを作成
2. リポジトリ名を決定（例: `lp-design-support`）

### 1.2 ローカルでGitリポジトリを初期化

```bash
cd /path/to/8-1_LP\ Design\ Support
git init
git add .
git commit -m "Initial commit: LP Design Support Tool"
```

### 1.3 GitHubリポジトリに接続

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 1.4 コミット前の確認事項

以下のファイルが`.gitignore`に含まれていることを確認：
- ✅ `.env.local` - 環境変数ファイル
- ✅ `temp_client_inputs/` - 一時保存データ
- ✅ `project_numbers.json` - 案件番号管理ファイル
- ✅ `credentials.json`, `token.json` - Google Drive認証情報
- ✅ `node_modules/` - 依存パッケージ
- ✅ `.next/` - Next.jsビルドファイル

---

## 2. Vercelでのデプロイ

### 2.1 Vercelプロジェクトの作成

1. [Vercel](https://vercel.com)にログイン
2. 「Add New...」→「Project」を選択
3. GitHubリポジトリを選択
4. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `nextjs-app`
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### 2.2 環境変数の設定

Vercelダッシュボードの「Settings」→「Environment Variables」で以下を設定：

#### 必須環境変数

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# NextAuth.js
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-project.vercel.app

# 管理者認証情報
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD_HASH=your_bcrypt_password_hash_here
```

#### Google Drive API（オプション）

**重要**: Vercelではファイルシステムへの直接アクセスができないため、Google Drive認証情報は環境変数として設定する必要があります。

##### 方法1: 環境変数として認証情報を設定（推奨）

`credentials.json`の内容を環境変数として設定：

```env
GOOGLE_DRIVE_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**注意**: この方法を使用する場合、`googleDriveService.ts`を修正して環境変数から読み込むようにする必要があります。

##### 方法2: 一時的なファイルシステムを使用（開発用）

VercelのServerless Functionsでは一時的なファイルシステムのみ利用可能です。本番環境では推奨されません。

#### その他の環境変数

```env
# Google Drive API
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here
```

### 2.3 環境変数の生成方法

#### NEXTAUTH_SECRET

```bash
# ランダムな32文字を生成
openssl rand -base64 32
```

または、Node.jsで生成：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### ADMIN_PASSWORD_HASH

```bash
cd nextjs-app
node scripts/generate-password-hash.js your_password
```

生成されたハッシュを`ADMIN_PASSWORD_HASH`に設定します。

### 2.4 デプロイ

1. 環境変数を設定後、「Deploy」ボタンをクリック
2. デプロイが完了するまで待機（通常1-3分）
3. デプロイ完了後、提供されたURLでアクセス

---

## 3. デプロイ後の確認事項

### 3.1 動作確認

1. **クライアント入力フォーム** (`/`)
   - フォームが表示されるか
   - 送信が正常に動作するか

2. **ログインページ** (`/login`)
   - ログインが正常に動作するか

3. **デザイナー用画面** (`/designer`)
   - 認証保護が機能しているか
   - プロジェクト一覧が表示されるか

4. **API動作確認**
   - Gemini APIが正常に動作するか
   - Google Drive APIが正常に動作するか（設定している場合）

### 3.2 エラーログの確認

Vercelダッシュボードの「Logs」タブでエラーログを確認：

- 環境変数が正しく設定されているか
- APIキーが有効か
- 外部APIへの接続が正常か

---

## 4. トラブルシューティング

### 4.1 ビルドエラー

**エラー**: `Module not found` または `Cannot find module`

**解決策**:
- `package.json`の依存関係を確認
- `npm install`をローカルで実行してエラーがないか確認
- `node_modules`が`.gitignore`に含まれていることを確認

### 4.2 環境変数エラー

**エラー**: `Environment variable is not set`

**解決策**:
- Vercelダッシュボードで環境変数が正しく設定されているか確認
- 環境変数名にタイポがないか確認
- デプロイ後に環境変数を追加した場合は、再デプロイが必要

### 4.3 Google Drive APIエラー

**エラー**: `Google Drive API認証エラー`

**解決策**:
- `GOOGLE_DRIVE_CREDENTIALS_JSON`が正しく設定されているか確認
- JSON形式が正しいか確認（エスケープが必要な場合あり）
- Google Cloud ConsoleでAPIが有効になっているか確認

### 4.4 NextAuth.jsエラー

**エラー**: `NEXTAUTH_SECRET is not set`

**解決策**:
- `NEXTAUTH_SECRET`が設定されているか確認
- `NEXTAUTH_URL`が正しいURL（VercelのURL）に設定されているか確認

---

## 5. 本番環境での注意事項

### 5.1 セキュリティ

- ✅ 環境変数はVercelダッシュボードで管理（GitHubにコミットしない）
- ✅ `ADMIN_PASSWORD_HASH`は強力なパスワードから生成
- ✅ `NEXTAUTH_SECRET`は推測困難な値を使用
- ✅ Google Drive認証情報は機密情報として扱う

### 5.2 パフォーマンス

- VercelのServerless Functionsはコールドスタートがある場合がある
- 初回リクエストが遅い場合は、Vercelの無料プランの制限を確認

### 5.3 データ保存

- 一時保存データ（`temp_client_inputs/`）はVercelのファイルシステムに保存されますが、再デプロイ時に削除される可能性があります
- 重要なデータは必ずGoogle Driveに保存してください

---

## 6. 継続的なデプロイ

### 6.1 自動デプロイ

GitHubにプッシュすると、自動的にVercelでデプロイされます：

```bash
git add .
git commit -m "Update: 変更内容の説明"
git push origin main
```

### 6.2 プレビューデプロイ

Pull Requestを作成すると、プレビューデプロイが自動的に作成されます。

### 6.3 ロールバック

Vercelダッシュボードの「Deployments」から過去のデプロイにロールバックできます。

---

## 7. 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google Drive API Documentation](https://developers.google.com/drive/api)

---

## 8. サポート

問題が発生した場合：

1. Vercelのログを確認
2. ブラウザのコンソールでエラーを確認
3. 環境変数の設定を再確認
4. 必要に応じて再デプロイ
