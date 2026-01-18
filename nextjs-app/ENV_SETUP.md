# 環境変数の設定方法

## 必要な環境変数

`nextjs-app/.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Google Drive API
GOOGLE_DRIVE_CREDENTIALS_PATH=/path/to/credentials.json
GOOGLE_DRIVE_TOKEN_PATH=/path/to/token.json
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000

# 管理者認証情報
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD_HASH=your_password_hash
```

## 各環境変数の設定方法

### 1. Gemini APIキー

1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. 「Create API Key」をクリック
3. 生成されたAPIキーをコピー
4. `.env.local`ファイルの`GEMINI_API_KEY=`の後に貼り付け

### 2. Google Drive API

詳細は `docs/GOOGLE_DRIVE_API_SETUP.md` を参照してください。

### 3. NextAuth設定

#### NEXTAUTH_SECRET

ランダムな文字列を生成してください：

```bash
openssl rand -base64 32
```

または、以下のコマンドで生成：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### NEXTAUTH_URL

- 開発環境: `http://localhost:3000`
- 本番環境: デプロイ先のURL（例: `https://your-domain.com`）

### 4. 管理者認証情報

#### ADMIN_EMAIL

デザイナー用ログインに使用するメールアドレスを設定してください。

#### ADMIN_PASSWORD_HASH

パスワードのハッシュを生成するには、以下のコマンドを実行してください：

```bash
cd nextjs-app
node scripts/generate-password-hash.js "your_password"
```

生成されたハッシュを`.env.local`の`ADMIN_PASSWORD_HASH=`の後に貼り付けます。

## 開発サーバーの再起動

環境変数を変更した後は、**必ず開発サーバーを再起動**してください：

```bash
# 開発サーバーを停止（Ctrl+C）
# その後、再起動
cd nextjs-app
npm run dev
```

## 注意事項

- `.env.local`ファイルは`.gitignore`に含まれているため、Gitにはコミットされません
- 本番環境（Vercel）では、Vercelのダッシュボードで環境変数を設定する必要があります
- `NEXTAUTH_SECRET`と`ADMIN_PASSWORD_HASH`は機密情報です。絶対に公開しないでください