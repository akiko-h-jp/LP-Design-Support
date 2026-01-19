# Vercelデプロイ手順（ステップバイステップ）

このガイドでは、Vercelにプロジェクトをデプロイする手順を詳しく説明します。

---

## 前提条件

- ✅ GitHubリポジトリが準備されている（`akiko-h-jp/LP-Design-Support`）
- ✅ ローカルでビルドが成功する（`npm run build`が成功）
- ✅ Vercelアカウントにログインしている

---

## ステップ1: Vercelで新規プロジェクトを作成

### 1.1 Vercelダッシュボードを開く

1. ブラウザで [https://vercel.com](https://vercel.com) を開く
2. ログインする（GitHubアカウントでログイン推奨）

### 1.2 新規プロジェクトを作成

1. Vercelダッシュボードの右上にある **「Add New...」** ボタンをクリック
2. **「Project」** を選択

### 1.3 GitHubリポジトリを選択

1. **「Import Git Repository」** セクションが表示される
2. GitHubリポジトリの一覧から **「LP-Design-Support」** を探す
3. **「Import」** ボタンをクリック

**注意**: リポジトリが表示されない場合：
- **「Configure GitHub App」** をクリックして、VercelにGitHubアクセス権限を付与
- リポジトリのアクセス権限を確認

---

## ステップ2: プロジェクト設定（重要）

### 2.1 基本設定

**Configure Project** 画面で以下を設定：

1. **Project Name**: 
   - デフォルトの `lp-design-support` のまま、または任意の名前を入力
   - 例: `lp-design-support`

2. **Framework Preset**: 
   - **「Next.js」** を選択（自動検出される場合があります）

### 2.2 Root Directoryの設定（重要）

**Root Directory** の設定が最も重要です：

1. **「Root Directory」** セクションを見つける
2. **「Edit」** ボタンをクリック
3. **「Root Directory」** を選択
4. `nextjs-app` と入力
5. **「Continue」** をクリック
6. 設定が反映されていることを確認

**重要**: Root Directoryを `nextjs-app` に設定しないと、`package.json` が見つからずビルドエラーになります。

### 2.3 Build and Output Settings（確認のみ）

以下の設定は通常、自動検出されます：

- **Build Command**: `npm run build`（自動検出）
- **Output Directory**: `.next`（自動検出）
- **Install Command**: `npm install`（自動検出）

変更する必要はありませんが、確認してください。

### 2.4 Node.js Versionの設定

1. **「Environment Variables」** セクションの下に **「Node.js Version」** がある場合、設定します
2. **「Edit」** をクリック
3. **「Node.js Version」** を選択
4. **「20.x」** を選択（または **「22.x」**）
5. **「Save」** をクリック

**注意**: この設定は後で **Settings** → **General** からも変更できます。

---

## ステップ3: 環境変数の設定（後で設定可能）

この時点では環境変数を設定せず、まずデプロイが成功するか確認します。

**「Deploy」** ボタンをクリックする前に、環境変数は設定しなくてOKです。

---

## ステップ4: デプロイを実行

### 4.1 デプロイ開始

1. 画面下部の **「Deploy」** ボタンをクリック
2. デプロイが開始されます（通常1-3分）

### 4.2 デプロイの進行を確認

1. デプロイ画面で進行状況を確認：
   - **「Building」**: ビルド中
   - **「Ready」**: デプロイ完了
   - **「Error」**: エラーが発生

2. ログを確認する場合：
   - デプロイメントをクリック
   - **「Logs」** タブを開く

---

## ステップ5: デプロイエラーの確認と対処

### 5.1 エラーが発生した場合

デプロイが失敗した場合、以下の手順で確認します：

1. デプロイメントをクリック
2. **「Logs」** タブを開く
3. エラーメッセージを確認

### 5.2 よくあるエラーと解決方法

#### エラー1: "No Next.js version detected"

**原因**: Root Directoryが正しく設定されていない

**解決方法**:
1. **Settings** → **General** を開く
2. **Root Directory** を確認
3. `nextjs-app` に設定されているか確認
4. 違う場合は `nextjs-app` に変更して **Save**
5. 再デプロイを実行

#### エラー2: "Module not found"

**原因**: 依存パッケージの問題

**解決方法**:
1. Root Directoryが `nextjs-app` に設定されているか確認
2. `package.json` が正しい場所にあるか確認
3. 再デプロイを実行

#### エラー3: "Build failed"

**原因**: ビルドエラー

**解決方法**:
1. **Logs** タブでエラーメッセージを確認
2. ローカルで `npm run build` を実行してエラーを確認
3. エラーがあれば修正してから再デプロイ

---

## ステップ6: デプロイ成功後の確認

デプロイが成功したら：

1. **Deployments** タブで **「Ready」** 状態を確認
2. **「Visit」** ボタンをクリックしてサイトにアクセス
3. エラーページが表示される場合は、環境変数の設定が必要（次のステップ）

---

## ステップ7: 環境変数の設定

デプロイが成功したら、環境変数を設定します。

### 7.1 環境変数設定画面を開く

1. プロジェクトページで **「Settings」** をクリック
2. **「Environment Variables」** を選択

### 7.2 必須環境変数を追加

以下の環境変数を追加します：

#### 1. Gemini API
```
Key: GEMINI_API_KEY
Value: your_gemini_api_key_here
```

#### 2. NextAuth.js
```
Key: NEXTAUTH_SECRET
Value: your_nextauth_secret_here
```

```
Key: NEXTAUTH_URL
Value: https://your-project.vercel.app
```
**注意**: `your-project.vercel.app` は、Vercelが自動生成したURLに置き換えてください。

#### 3. 管理者認証情報
```
Key: ADMIN_EMAIL
Value: your_admin_email@example.com
```

```
Key: ADMIN_PASSWORD_HASH
Value: your_bcrypt_password_hash_here
```

#### 4. Google Drive API
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
- ダブルクォートはエスケープする必要があります（VercelのUIで自動的に処理されます）

**OAuth2を使用している場合（サービスアカウントではない場合）:**
```
Key: GOOGLE_DRIVE_TOKEN_JSON
Value: {"access_token":"...","refresh_token":"...","scope":"...","token_type":"Bearer","expiry_date":...}
```

### 7.3 環境変数の適用範囲

各環境変数を追加する際、以下の適用範囲を選択：

- **Production**: 本番環境
- **Preview**: プレビュー環境
- **Development**: 開発環境

通常は **Production** と **Preview** を選択します。

### 7.4 環境変数の保存

1. 各環境変数を追加後、**「Save」** をクリック
2. すべての環境変数を追加したら、**再デプロイ**を実行

---

## ステップ8: 再デプロイの実行

環境変数を追加した後、再デプロイを実行します。

### 方法1: Vercelダッシュボードから実行

1. **「Deployments」** タブを開く
2. 右上の **「Deploy」** ボタンをクリック
3. **「Deploy from GitHub」** を選択
4. ブランチを選択（通常は `main`）
5. **「Deploy」** をクリック

### 方法2: GitHubからトリガー

ローカルで空のコミットを作成してプッシュ：

```bash
git commit --allow-empty -m "Trigger Vercel deployment after env vars"
git push origin main
```

---

## ステップ9: 動作確認

再デプロイが完了したら：

1. **「Visit」** ボタンをクリックしてサイトにアクセス
2. 各ページが正常に表示されるか確認：
   - クライアント入力ページ（`/`）
   - ログインページ（`/login`）
   - デザイナー確認画面（`/designer`）- ログインが必要
3. エラーが発生する場合は、Vercelのログを確認

---

## チェックリスト

デプロイ前に確認：

- [ ] GitHubリポジトリが準備されている
- [ ] ローカルで `npm run build` が成功する
- [ ] Vercelアカウントにログインしている

デプロイ設定：

- [ ] Root Directoryが `nextjs-app` に設定されている
- [ ] Node.js Versionが `20.x` または `22.x` に設定されている
- [ ] Framework Presetが `Next.js` になっている

デプロイ後：

- [ ] デプロイが成功している（**Ready** 状態）
- [ ] 環境変数がすべて設定されている
- [ ] 再デプロイが完了している
- [ ] サイトが正常に動作している

---

## トラブルシューティング

### 問題1: デプロイが開始されない

**解決方法**:
- GitHubリポジトリが正しく接続されているか確認
- Root Directoryが正しく設定されているか確認

### 問題2: ビルドエラーが発生する

**解決方法**:
- ローカルで `npm run build` を実行してエラーを確認
- エラーがあれば修正してから再デプロイ

### 問題3: 環境変数が反映されない

**解決方法**:
- 環境変数を追加後、**再デプロイ**を実行
- 環境変数の適用範囲（Production/Preview/Development）を確認

### 問題4: サイトがエラーページを表示する

**解決方法**:
- Vercelのログを確認
- 環境変数が正しく設定されているか確認
- `NEXTAUTH_URL` が正しいURLになっているか確認

---

## 参考資料

- `VERCEL_ENV_SETUP.md`: 環境変数の詳細な設定方法
- `VERCEL_DEPLOY_FIXES.md`: デプロイ修正内容
- `VERCEL_TROUBLESHOOTING.md`: トラブルシューティング

---

## 次のステップ

デプロイが成功したら：

1. 各機能が正常に動作するか確認
2. Google Drive APIの動作確認
3. 認証機能の動作確認
4. 本番環境でのテスト

問題が発生した場合は、Vercelのログを確認して、エラーメッセージを共有してください。
