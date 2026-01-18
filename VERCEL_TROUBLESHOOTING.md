# Vercelデプロイ トラブルシューティング

## エラー: "No Next.js version detected"

### 原因
Vercelが`package.json`を見つけられていません。通常、Root Directoryの設定が正しくないことが原因です。

### 解決方法

#### 1. Root Directoryの設定を確認

1. Vercelダッシュボードでプロジェクトを開く
2. **Settings** → **General** を選択
3. **Root Directory** セクションを確認
4. **Edit** をクリック
5. `nextjs-app` と入力
6. **Save** をクリック

#### 2. 設定後の再デプロイ

Root Directoryを変更した後は、必ず再デプロイが必要です：

1. **Deployments** タブを開く
2. 最新のデプロイメントの **「...」** メニューをクリック
3. **Redeploy** を選択

または、GitHubに新しいコミットをプッシュすると自動的に再デプロイされます。

#### 3. 確認事項

- ✅ Root Directoryが `nextjs-app` に設定されている
- ✅ `nextjs-app/package.json` が存在する
- ✅ `nextjs-app/package.json` に `next` が `dependencies` に含まれている

---

## その他のよくあるエラー

### エラー: "Module not found"

**原因**: 依存パッケージがインストールされていない

**解決方法**:
- Root Directoryが正しく設定されているか確認
- `package.json`が正しい場所にあるか確認

### エラー: "Build failed"

**原因**: ビルドエラー

**解決方法**:
- Vercelのログを確認
- ローカルで `npm run build` を実行してエラーを確認

### エラー: "Environment variable is not set"

**原因**: 環境変数が設定されていない

**解決方法**:
- Vercelダッシュボードで環境変数を確認
- 環境変数を追加後、再デプロイを実行

---

## 確認コマンド（ローカル）

デプロイ前に、ローカルで以下を実行して確認：

```bash
cd nextjs-app
npm install
npm run build
```

エラーなく完了すれば、Vercelでもビルドできるはずです。
