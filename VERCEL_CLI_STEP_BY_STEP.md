# Vercel CLIでデプロイする手順（ステップバイステップ）

## 前提条件

- ✅ Vercel CLIがインストールされている
- ✅ Vercelアカウントにログインしている

---

## ステップ1: Vercelにログイン

```bash
vercel login
```

ブラウザが開いて、Vercelアカウントでログインします。

---

## ステップ2: プロジェクトにリンク（対話形式）

```bash
cd "/Users/a-hagiwara/Desktop/Learning/AI学習/AIエンジニア_アプリ/8-1_LP Design Support"
vercel link
```

以下のプロンプトが表示されたら、以下のように回答：

1. **Set up and deploy?** → `Y` を入力してEnter
2. **Which scope?** → アカウントを選択（矢印キーで選択してEnter）
3. **Link to existing project?** → `Y` を入力してEnter
4. **What's the name of your existing project?** → `lp-design-support` を入力してEnter
   - もしプロジェクト名が違う場合は、Vercelダッシュボードで確認してください
5. **In which directory is your code located?** → `nextjs-app` を入力してEnter

---

## ステップ3: 本番環境にデプロイ

```bash
vercel --prod
```

これで、本番環境にデプロイされます。

---

## トラブルシューティング

### エラー: "Project not found"

**解決方法**:
1. Vercelダッシュボードでプロジェクト名を確認
2. プロジェクト名が `lp-design-support` でない場合、正しい名前を入力

### エラー: "Not logged in"

**解決方法**:
```bash
vercel login
```

### エラー: "Root directory not found"

**解決方法**:
- `In which directory is your code located?` の質問で、必ず `nextjs-app` と入力してください

---

## デプロイ後の確認

デプロイが完了したら：

1. Vercelダッシュボードで **Deployments** タブを開く
2. 新しいデプロイメントが表示されているか確認
3. デプロイの状態を確認：
   - **Ready**: デプロイ完了
   - **Error**: エラーが発生（ログを確認）

---

## 注意事項

- Vercel CLIでデプロイすると、Vercelダッシュボードにもデプロイメントが表示されます
- 環境変数はVercelダッシュボードで設定する必要があります
- デプロイ後、環境変数を設定して再デプロイしてください

---

## 次のステップ

1. `vercel login` でログイン（まだの場合）
2. `vercel link` でプロジェクトにリンク
3. `vercel --prod` でデプロイ

これで、デプロイが開始されるはずです。
