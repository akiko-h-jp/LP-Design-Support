# Vercelデプロイ デバッグガイド

## ローカルで動作するがVercelで動作しない原因

### 主な原因

1. **Root Directoryの設定が間違っている**（最も可能性が高い）
2. **Node.jsバージョンの違い**
3. **環境変数が設定されていない**（ビルド時には影響しないが、実行時にエラー）
4. **ファイルパスの問題**（Google Drive認証情報など）

---

## ステップ1: Vercelのログを確認

### ログの確認方法

1. Vercelダッシュボードを開く
2. プロジェクトを選択
3. **Deployments** タブを開く
4. 失敗したデプロイメントをクリック
5. **Logs** タブを開く
6. エラーメッセージを確認

### よくあるエラーメッセージ

#### エラー1: "No Next.js version detected"

**原因**: Root Directoryが正しく設定されていない

**解決方法**:
1. **Settings** → **General** → **Root Directory**
2. `nextjs-app` に設定
3. **Save** をクリック
4. **Deployments** → 最新のデプロイメント → **Redeploy**

#### エラー2: "Module not found"

**原因**: 依存パッケージがインストールされていない、またはRoot Directoryの設定が間違っている

**解決方法**:
- Root Directoryが `nextjs-app` に設定されているか確認
- `package.json` が正しい場所にあるか確認

#### エラー3: "Build failed" または TypeScriptエラー

**原因**: ビルド時のエラー

**解決方法**:
- ローカルで `npm run build` を実行してエラーを確認
- エラーがあれば修正してから再デプロイ

#### エラー4: "Environment variable is not set"

**原因**: 環境変数が設定されていない

**解決方法**:
- **Settings** → **Environment Variables** で環境変数を設定
- 設定後、再デプロイを実行

---

## ステップ2: Root Directoryの確認と修正

### 確認方法

1. Vercelダッシュボード → プロジェクト
2. **Settings** → **General**
3. **Root Directory** セクションを確認
4. `nextjs-app` になっているか確認

### 修正方法

1. **Root Directory** の **Edit** をクリック
2. **Root Directory** を選択
3. `nextjs-app` と入力
4. **Continue** をクリック
5. **Save** をクリック
6. **Deployments** タブで **Redeploy** を実行

---

## ステップ3: Node.jsバージョンの指定

ローカルでNode.js v25.2.1を使用している場合、Vercelのデフォルト（Node.js 18または20）と異なる可能性があります。

### package.jsonにenginesを追加

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

または、Vercelの設定でNode.jsバージョンを指定：

1. **Settings** → **General**
2. **Node.js Version** を確認
3. 必要に応じて変更（18.x または 20.x を推奨）

---

## ステップ4: 環境変数の設定

ビルド時には環境変数は不要ですが、実行時には必要です。

### 必須環境変数

- `GEMINI_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`（Vercelが自動生成したURL）
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `GOOGLE_DRIVE_FOLDER_ID`
- `GOOGLE_DRIVE_CREDENTIALS_JSON`
- `GOOGLE_DRIVE_TOKEN_JSON`（OAuth2を使用している場合）

### 設定方法

1. **Settings** → **Environment Variables**
2. 各環境変数を追加
3. **Save** をクリック
4. 再デプロイを実行

詳細は `VERCEL_ENV_SETUP.md` を参照してください。

---

## ステップ5: ローカルビルドの確認

Vercelでデプロイする前に、ローカルでビルドが成功することを確認：

```bash
cd nextjs-app
npm install
npm run build
```

エラーなく完了すれば、Vercelでもビルドできるはずです。

---

## トラブルシューティングチェックリスト

デプロイが失敗する場合、以下を確認：

- [ ] Root Directoryが `nextjs-app` に設定されている
- [ ] `nextjs-app/package.json` が存在する
- [ ] `nextjs-app/package.json` に `next` が `dependencies` に含まれている
- [ ] ローカルで `npm run build` が成功する
- [ ] Vercelのログでエラーメッセージを確認した
- [ ] 環境変数が正しく設定されている（実行時エラーの場合）
- [ ] Node.jsバージョンが適切に設定されている

---

## よくある質問

### Q: ローカルでは動作するのに、Vercelで動作しないのはなぜ？

A: 主な原因は以下です：
1. **Root Directoryの設定が間違っている**（最も多い）
2. **Node.jsバージョンの違い**
3. **環境変数が設定されていない**（実行時エラー）
4. **ファイルパスの問題**（ローカルファイルシステムへのアクセス）

### Q: Root Directoryを設定したのに、まだエラーが出る

A: 以下を確認してください：
1. Root Directoryを設定後、**必ず再デプロイ**を実行
2. 設定が正しく保存されているか確認
3. Vercelのログでエラーメッセージを確認

### Q: ビルドは成功するが、実行時にエラーが出る

A: 環境変数が設定されていない可能性が高いです：
1. **Settings** → **Environment Variables** で環境変数を確認
2. 必要な環境変数がすべて設定されているか確認
3. 環境変数を追加後、再デプロイを実行

---

## 次のステップ

1. Vercelのログを確認して、具体的なエラーメッセージを特定
2. このガイドに従って、該当する原因を解決
3. 解決後、再デプロイを実行

問題が解決しない場合は、Vercelのログのエラーメッセージを共有してください。
