# Vercelデプロイ成功後の手順

## デプロイの進行を確認

### 1. Deploymentsタブで確認

1. Vercelダッシュボードで **「Deployments」** タブを開く
2. 新しいデプロイメントが表示されているか確認
3. デプロイの状態を確認：
   - **Building**: ビルド中（正常）
   - **Ready**: デプロイ完了 ✅
   - **Error**: エラーが発生 ❌

### 2. ログの確認（エラーが発生した場合）

エラーが発生した場合：

1. デプロイメントをクリック
2. **「Logs」** タブを開く
3. エラーメッセージを確認

---

## デプロイが成功した場合

### ステップ1: サイトにアクセス

1. **Deployments** タブで **「Ready」** 状態を確認
2. **「Visit」** ボタンをクリックしてサイトにアクセス
3. エラーページが表示される場合は、環境変数の設定が必要

### ステップ2: 環境変数の設定

デプロイが成功したら、環境変数を設定します。

#### 環境変数設定画面を開く

1. **Settings** → **Environment Variables** を選択

#### 必須環境変数を追加

以下の環境変数を追加：

##### 1. Gemini API
```
Key: GEMINI_API_KEY
Value: your_gemini_api_key_here
```

##### 2. NextAuth.js
```
Key: NEXTAUTH_SECRET
Value: your_nextauth_secret_here
```

```
Key: NEXTAUTH_URL
Value: https://your-project.vercel.app
```
**注意**: `your-project.vercel.app` は、Vercelが自動生成したURLに置き換えてください。

##### 3. 管理者認証情報
```
Key: ADMIN_EMAIL
Value: your_admin_email@example.com
```

```
Key: ADMIN_PASSWORD_HASH
Value: your_bcrypt_password_hash_here
```

##### 4. Google Drive API
```
Key: GOOGLE_DRIVE_FOLDER_ID
Value: your_google_drive_folder_id_here
```

```
Key: GOOGLE_DRIVE_CREDENTIALS_JSON
Value: {"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**重要**: 
- JSON全体を1行の文字列として設定します
- `private_key`内の改行は`\n`としてエスケープします

### ステップ3: 環境変数の適用範囲

各環境変数を追加する際、以下の適用範囲を選択：

- **Production**: 本番環境
- **Preview**: プレビュー環境
- **Development**: 開発環境

通常は **Production** と **Preview** を選択します。

### ステップ4: 再デプロイ

環境変数を追加した後、再デプロイを実行します。

#### 方法1: Vercelダッシュボードから

1. **Deployments** タブを開く
2. 最新のデプロイメントの **「...」** メニューをクリック
3. **「Redeploy」** を選択

#### 方法2: GitHubからトリガー

```bash
git commit --allow-empty -m "Trigger redeploy after env vars"
git push origin main
```

---

## デプロイが失敗した場合

### エラーログの確認

1. デプロイメントをクリック
2. **「Logs」** タブを開く
3. エラーメッセージを確認

### よくあるエラーと対処

#### エラー: "No Next.js version detected"

**原因**: Root Directoryが正しく設定されていない

**解決方法**:
1. **Settings** → **General** → **Root Directory**
2. `nextjs-app` に設定
3. **Save** をクリック
4. 再デプロイを実行

#### エラー: "Build failed"

**原因**: ビルドエラー

**解決方法**:
1. **Logs** タブでエラーメッセージを確認
2. ローカルで `cd nextjs-app && npm run build` を実行してエラーを確認
3. エラーがあれば修正してから再デプロイ

#### エラー: "Module not found"

**原因**: 依存パッケージの問題

**解決方法**:
1. Root Directoryが `nextjs-app` に設定されているか確認
2. `package.json`が正しい場所にあるか確認
3. 再デプロイを実行

---

## 動作確認

再デプロイが完了したら：

1. **「Visit」** ボタンをクリックしてサイトにアクセス
2. 各ページが正常に表示されるか確認：
   - クライアント入力ページ（`/`）
   - ログインページ（`/login`）
   - デザイナー確認画面（`/designer`）- ログインが必要
3. エラーが発生する場合は、Vercelのログを確認

---

## チェックリスト

デプロイ成功後：

- [ ] デプロイが **Ready** 状態になっている
- [ ] サイトにアクセスできる
- [ ] 環境変数がすべて設定されている
- [ ] 再デプロイが完了している
- [ ] 各ページが正常に動作している

---

## 次のステップ

1. デプロイの進行を確認
2. デプロイが成功したら、環境変数を設定
3. 環境変数設定後、再デプロイを実行
4. 動作確認

問題が発生した場合は、エラーメッセージを共有してください。
