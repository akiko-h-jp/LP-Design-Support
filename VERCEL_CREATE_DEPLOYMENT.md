# Vercelでデプロイを作成する方法

## 「Create Deployment」を使用する方法

右上のドロップダウンメニュー（三点リーダー）から **「Create Deployment」** を選択してデプロイを開始できます。

---

## 手順

### ステップ1: Create Deploymentを開く

1. **Deployments** タブを開く
2. 右上の **三点リーダー（...）** アイコンをクリック
3. **「Create Deployment」** を選択

### ステップ2: デプロイ設定

**Create Deployment** 画面で以下を設定：

1. **Branch**: `main` を選択
2. **Root Directory**: `nextjs-app` が設定されているか確認
   - 設定されていない場合、`nextjs-app` と入力
3. **Framework Preset**: `Next.js` が選択されているか確認
4. **Environment Variables**: この時点では設定不要（後で設定可能）

### ステップ3: デプロイを実行

1. **「Deploy」** ボタンをクリック
2. デプロイが開始されます

---

## デプロイの進行を確認

デプロイが開始されたら：

1. **Deployments** タブで新しいデプロイメントが表示されます
2. デプロイの状態を確認：
   - **Building**: ビルド中（正常）
   - **Ready**: デプロイ完了
   - **Error**: エラーが発生

### エラーが発生した場合

1. デプロイメントをクリック
2. **「Logs」** タブを開く
3. エラーメッセージを確認

---

## よくあるエラーと対処

### エラー: "No Next.js version detected"

**原因**: Root Directoryが正しく設定されていない

**解決方法**:
- **Create Deployment** 画面で **Root Directory** を `nextjs-app` に設定

### エラー: "Build failed"

**原因**: ビルドエラー

**解決方法**:
1. **Logs** タブでエラーメッセージを確認
2. ローカルで `cd nextjs-app && npm run build` を実行してエラーを確認
3. エラーがあれば修正してから再デプロイ

---

## 次のステップ

デプロイが成功したら：

1. **「Visit」** ボタンをクリックしてサイトにアクセス
2. エラーページが表示される場合は、環境変数の設定が必要
3. **Settings** → **Environment Variables** で環境変数を設定
4. 環境変数設定後、再デプロイを実行

---

## まとめ

- ✅ **「Create Deployment」** をクリックしてデプロイを開始
- ✅ **Branch**: `main` を選択
- ✅ **Root Directory**: `nextjs-app` に設定
- ✅ **Framework Preset**: `Next.js` を選択
- ✅ **「Deploy」** ボタンをクリック

これで、デプロイが開始されるはずです。
