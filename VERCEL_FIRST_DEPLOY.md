# Vercel初回デプロイ手順

## 現在の状態

「No Production Deployment」が表示されている場合、デプロイメントがまだ実行されていない状態です。

---

## ステップ1: Root Directoryの設定確認

まず、Root Directoryが正しく設定されているか確認します。

### 確認方法

1. Vercelダッシュボードで **「lp-design-support」** プロジェクトを開く
2. **Settings** → **General** を選択
3. **Root Directory** セクションを確認
4. `nextjs-app` になっているか確認

### 設定方法（まだ設定していない場合）

1. **Root Directory** の **Edit** をクリック
2. **Root Directory** を選択
3. `nextjs-app` と入力
4. **Continue** をクリック
5. **Save** をクリック

---

## ステップ2: GitHubリポジトリの連携確認

### 確認方法

1. **Settings** → **Git** を選択
2. **Connected Git Repository** セクションを確認
3. `akiko-h-jp/LP-Design-Support` が表示されているか確認

### 連携されていない場合

1. **Connect Git Repository** をクリック
2. GitHubリポジトリ **「LP-Design-Support」** を選択
3. **Connect** をクリック

---

## ステップ3: 手動でデプロイを実行

### 方法1: Deploymentsタブから実行

1. プロジェクトページの上部メニューで **「Deployments」** タブをクリック
2. 右上の **「Deploy」** ボタンをクリック
3. **「Deploy from GitHub」** を選択
4. ブランチを選択（通常は `main`）
5. **「Deploy」** をクリック

### 方法2: GitHubからトリガー

1. ローカルで空のコミットを作成：
   ```bash
   git commit --allow-empty -m "Trigger Vercel deployment"
   git push origin main
   ```
2. Vercelが自動的にデプロイを開始します

---

## ステップ4: デプロイの進行を確認

### 確認方法

1. **Deployments** タブを開く
2. デプロイメントの状態を確認：
   - **Building**: ビルド中
   - **Ready**: デプロイ完了
   - **Error**: エラーが発生

### エラーが発生した場合

1. エラーが発生したデプロイメントをクリック
2. **Logs** タブを開く
3. エラーメッセージを確認
4. エラーメッセージに基づいて対処

---

## ステップ5: よくあるエラーと対処

### エラー1: "No Next.js version detected"

**原因**: Root Directoryが正しく設定されていない

**対処**:
1. **Settings** → **General** → **Root Directory**
2. `nextjs-app` に設定
3. **Save** をクリック
4. 再デプロイを実行

### エラー2: "Build failed"

**原因**: ビルドエラー

**対処**:
1. **Logs** タブでエラーメッセージを確認
2. ローカルで `npm run build` を実行してエラーを確認
3. エラーを修正してから再デプロイ

### エラー3: "Module not found"

**原因**: 依存パッケージの問題

**対処**:
1. Root Directoryが `nextjs-app` に設定されているか確認
2. `package.json` が正しい場所にあるか確認
3. 再デプロイを実行

---

## ステップ6: デプロイ成功後の確認

デプロイが成功したら：

1. **Deployments** タブで **「Ready」** 状態を確認
2. **Visit** ボタンをクリックしてサイトにアクセス
3. エラーページが表示される場合は、環境変数の設定が必要

---

## 環境変数の設定（デプロイ成功後）

デプロイが成功したら、環境変数を設定します：

1. **Settings** → **Environment Variables** を選択
2. 以下の環境変数を追加：
   - `GEMINI_API_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`（Vercelが自動生成したURL）
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `GOOGLE_DRIVE_CREDENTIALS_JSON`
   - `GOOGLE_DRIVE_TOKEN_JSON`（OAuth2を使用している場合）
3. 環境変数を追加後、**再デプロイ**を実行

詳細は `VERCEL_ENV_SETUP.md` を参照してください。

---

## チェックリスト

デプロイを実行する前に、以下を確認：

- [ ] Root Directoryが `nextjs-app` に設定されている
- [ ] GitHubリポジトリが連携されている
- [ ] ローカルで `npm run build` が成功する
- [ ] `nextjs-app/package.json` が存在する

---

## 次のステップ

1. Root Directoryを確認・設定
2. 手動でデプロイを実行
3. デプロイの進行を確認
4. エラーがあればログを確認して対処
5. デプロイ成功後、環境変数を設定

問題が解決しない場合は、Vercelのログのエラーメッセージを共有してください。
