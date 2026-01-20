# Vercelデプロイ後のログインエラー対処法

## エラー: "Server error - There is a problem with the server configuration"

このエラーは、通常、環境変数が設定されていない、またはNextAuth.jsの設定に問題がある場合に発生します。

---

## 確認すべき環境変数

### 1. NextAuth.js関連（必須）

以下の環境変数が設定されているか確認：

```
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-project.vercel.app
```

**重要**: 
- `NEXTAUTH_URL` は、Vercelが自動生成したURLに置き換えてください
- 例: `https://lp-design-support.vercel.app`

### 2. 管理者認証情報（必須）

```
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD_HASH=your_bcrypt_password_hash_here
```

**注意**: 
- `ADMIN_PASSWORD_HASH` は、bcryptでハッシュ化されたパスワードです
- ローカルで生成したハッシュを使用してください

### 3. Google Drive API（オプション）

ログイン機能自体には不要ですが、アプリの機能に必要です：

```
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here
GOOGLE_DRIVE_CREDENTIALS_JSON={"type":"service_account",...}
```

---

## 環境変数の設定方法

### ステップ1: Vercelダッシュボードで環境変数を設定

1. Vercelダッシュボードでプロジェクトを開く
2. **Settings** → **Environment Variables** を選択
3. 各環境変数を追加

### ステップ2: 環境変数の適用範囲

各環境変数を追加する際、以下の適用範囲を選択：

- **Production**: 本番環境 ✅
- **Preview**: プレビュー環境 ✅
- **Development**: 開発環境（通常は不要）

### ステップ3: 再デプロイ

環境変数を追加した後、**必ず再デプロイ**が必要です：

1. **Deployments** タブを開く
2. 最新のデプロイメントの **「...」** メニューをクリック
3. **「Redeploy」** を選択

または、GitHubからトリガー：

```bash
git commit --allow-empty -m "Trigger redeploy after env vars"
git push origin main
```

---

## Vercelログの確認方法

### ステップ1: ログを確認

1. Vercelダッシュボードで **Deployments** タブを開く
2. 最新のデプロイメントをクリック
3. **「Logs」** タブを開く
4. エラーメッセージを確認

### ステップ2: よくあるエラーメッセージ

#### エラー: "NEXTAUTH_SECRET is not set"

**原因**: `NEXTAUTH_SECRET` が設定されていない

**解決方法**:
1. **Settings** → **Environment Variables**
2. `NEXTAUTH_SECRET` を追加
3. 再デプロイ

#### エラー: "NEXTAUTH_URL is not set"

**原因**: `NEXTAUTH_URL` が設定されていない

**解決方法**:
1. **Settings** → **Environment Variables**
2. `NEXTAUTH_URL` を追加（Vercelが生成したURL）
3. 再デプロイ

#### エラー: "ADMIN_PASSWORD_HASH is not set"

**原因**: `ADMIN_PASSWORD_HASH` が設定されていない

**解決方法**:
1. **Settings** → **Environment Variables**
2. `ADMIN_PASSWORD_HASH` を追加
3. 再デプロイ

---

## 環境変数の生成方法

### NEXTAUTH_SECRETの生成

```bash
openssl rand -base64 32
```

または、Node.jsで生成：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### ADMIN_PASSWORD_HASHの生成

```bash
cd nextjs-app
node scripts/generate-password-hash.js your_password
```

---

## チェックリスト

環境変数の設定を確認：

- [ ] `NEXTAUTH_SECRET` が設定されている
- [ ] `NEXTAUTH_URL` が設定されている（Vercelが生成したURL）
- [ ] `ADMIN_EMAIL` が設定されている
- [ ] `ADMIN_PASSWORD_HASH` が設定されている
- [ ] 環境変数を追加後、再デプロイを実行した

---

## 次のステップ

1. **環境変数を設定**
2. **再デプロイを実行**
3. **ログインを再度試す**
4. **エラーが続く場合は、Vercelのログを確認**

問題が解決しない場合は、Vercelのログのエラーメッセージを共有してください。
