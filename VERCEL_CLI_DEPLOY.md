# Vercel CLIでデプロイする方法

## Vercel CLIを使用したデプロイ

Vercelダッシュボードからデプロイが開始されない場合、Vercel CLIを使用して直接デプロイできます。

---

## ステップ1: Vercel CLIにログイン

```bash
vercel login
```

ブラウザが開いて、Vercelアカウントでログインします。

---

## ステップ2: プロジェクトにリンク

既存のプロジェクトにリンクします：

```bash
cd "/Users/a-hagiwara/Desktop/Learning/AI学習/AIエンジニア_アプリ/8-1_LP Design Support"
vercel link
```

プロンプトが表示されたら：

1. **Set up and deploy?** → `Y`
2. **Which scope?** → アカウントを選択
3. **Link to existing project?** → `Y`
4. **What's the name of your existing project?** → `lp-design-support`
5. **In which directory is your code located?** → `nextjs-app`

---

## ステップ3: 本番環境にデプロイ

```bash
vercel --prod
```

これで、本番環境にデプロイされます。

---

## トラブルシューティング

### エラー: "Project not found"

プロジェクト名が違う可能性があります。Vercelダッシュボードでプロジェクト名を確認してください。

### エラー: "Not logged in"

`vercel login` を実行してログインしてください。

### エラー: "Root directory not found"

`vercel link` を実行して、Root Directoryを `nextjs-app` に設定してください。

---

## 注意事項

- Vercel CLIでデプロイすると、Vercelダッシュボードにもデプロイメントが表示されます
- 環境変数はVercelダッシュボードで設定する必要があります
- デプロイ後、Vercelダッシュボードでデプロイメントの状態を確認できます

---

## 次のステップ

1. `vercel login` でログイン
2. `vercel link` でプロジェクトにリンク
3. `vercel --prod` でデプロイ

これで、デプロイが開始されるはずです。
