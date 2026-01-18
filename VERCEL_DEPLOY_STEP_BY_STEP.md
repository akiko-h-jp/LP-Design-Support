# Vercelデプロイ ステップバイステップガイド

## エラー: "DEPLOYMENT_NOT_FOUND" の解決方法

このエラーは、デプロイメントが見つからない場合に発生します。以下の手順で解決してください。

---

## ステップ1: 既存プロジェクトの確認と削除

### 1.1 既存プロジェクトを確認

1. Vercelダッシュボード（https://vercel.com/dashboard）を開く
2. プロジェクト一覧を確認
3. `lp-design-support-7y7j` または類似の名前のプロジェクトがあるか確認

### 1.2 既存プロジェクトを削除（必要に応じて）

1. 既存プロジェクトをクリック
2. **Settings** → **General** を選択
3. 一番下までスクロール
4. **Delete Project** をクリック
5. プロジェクト名を入力して削除を確認

---

## ステップ2: 新規プロジェクトの作成

### 2.1 プロジェクト作成

1. Vercelダッシュボードで **「Add New...」** → **「Project」** をクリック
2. **Import Git Repository** を選択
3. GitHubリポジトリ **「LP-Design-Support」** を選択
4. **「Import」** をクリック

### 2.2 プロジェクト設定（重要）

**Configure Project** 画面で以下を設定：

1. **Project Name**: 任意の名前（例: `lp-design-support`）
2. **Framework Preset**: `Next.js` を選択
3. **Root Directory**: 
   - **「Edit」** をクリック
   - **「Root Directory」** を選択
   - `nextjs-app` と入力
   - **「Continue」** をクリック
4. **Build and Output Settings**:
   - Build Command: `npm run build`（自動検出）
   - Output Directory: `.next`（自動検出）
   - Install Command: `npm install`（自動検出）

### 2.3 環境変数の設定（後で設定可能）

この時点では環境変数を設定せず、まずデプロイが成功するか確認します。

### 2.4 デプロイ実行

1. **「Deploy」** をクリック
2. デプロイが完了するまで待機（通常1-3分）

---

## ステップ3: デプロイエラーの確認

### 3.1 ログの確認

デプロイが失敗した場合：

1. デプロイメントをクリック
2. **「Logs」** タブを開く
3. エラーメッセージを確認

### 3.2 よくあるエラーと解決方法

#### エラー: "No Next.js version detected"

**解決方法**:
- Root Directoryが `nextjs-app` に設定されているか確認
- Settings → General → Root Directory を確認

#### エラー: "Module not found"

**解決方法**:
- Root Directoryが正しく設定されているか確認
- `package.json`が正しい場所にあるか確認

#### エラー: "Build failed"

**解決方法**:
- ローカルで `npm run build` を実行してエラーを確認
- エラーがあれば修正してから再デプロイ

---

## ステップ4: 環境変数の設定

デプロイが成功したら、環境変数を設定します。

1. **Settings** → **Environment Variables** を選択
2. 以下の環境変数を追加：

```
GEMINI_API_KEY=your_gemini_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-project.vercel.app
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD_HASH=your_bcrypt_hash
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
GOOGLE_DRIVE_CREDENTIALS_JSON={JSON文字列}
GOOGLE_DRIVE_TOKEN_JSON={JSON文字列}（OAuth2を使用している場合）
```

3. 環境変数を追加後、**再デプロイ**を実行

---

## ステップ5: 動作確認

1. デプロイが完了したら、提供されたURLにアクセス
2. クライアント入力フォームが表示されるか確認
3. ログインページが表示されるか確認
4. エラーログを確認

---

## トラブルシューティング

### デプロイが完了しない

- Vercelのダッシュボードでログを確認
- ビルド時間が長すぎる場合は、タイムアウトの可能性があります

### 404エラーが表示される

- Root Directoryが正しく設定されているか確認
- `nextjs-app` ディレクトリが正しく認識されているか確認

### 環境変数が読み込まれない

- 環境変数を追加後、必ず再デプロイを実行
- 環境変数名にタイポがないか確認

---

## 確認チェックリスト

デプロイ前に以下を確認：

- [ ] GitHubリポジトリにコードがプッシュされている
- [ ] Root Directoryが `nextjs-app` に設定されている
- [ ] ローカルで `npm run build` が成功する
- [ ] `package.json` に `next` が含まれている
- [ ] 環境変数が正しく設定されている（デプロイ後）

---

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md)
- [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)
