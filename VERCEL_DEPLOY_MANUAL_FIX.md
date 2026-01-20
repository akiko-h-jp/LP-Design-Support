# Vercelデプロイが開始されない場合の手動対処法

## 現在の状況

- ✅ Root Directory: `nextjs-app` に設定済み
- ✅ GitHubリポジトリ: 接続済み
- ❌ デプロイが開始されない

---

## 解決方法1: フィルターをクリア

Deploymentsページに「No Results」と表示されている場合、フィルターが原因の可能性があります。

### 手順

1. **Deployments** タブを開く
2. **「Clear Filters」** リンクをクリック
3. デプロイメントが表示されるか確認

---

## 解決方法2: 手動でデプロイを実行

### 手順

1. **Deployments** タブを開く
2. 右上の **「Deploy」** ボタンを探す
   - 見つからない場合、画面をスクロールして確認
   - または、プロジェクトページの上部メニューを確認
3. **「Deploy」** ボタンをクリック
4. **「Deploy from GitHub」** を選択
5. ブランチを選択（`main`）
6. **「Deploy」** をクリック

---

## 解決方法3: Vercel CLIを使用（推奨）

Vercel CLIを使用して、コマンドラインから直接デプロイできます。

### インストール

```bash
npm install -g vercel
```

### ログイン

```bash
vercel login
```

### デプロイ

```bash
cd "/Users/a-hagiwara/Desktop/Learning/AI学習/AIエンジニア_アプリ/8-1_LP Design Support"
vercel --prod
```

**注意**: 初回実行時は、プロジェクトの設定を確認するプロンプトが表示されます：
- **Set up and deploy?** → `Y`
- **Which scope?** → アカウントを選択
- **Link to existing project?** → `Y`
- **What's the name of your existing project?** → `lp-design-support`
- **In which directory is your code located?** → `nextjs-app`

---

## 解決方法4: GitHub Webhookの確認

VercelがGitHubの変更を検知できていない可能性があります。

### 確認方法

1. Vercelダッシュボードでプロジェクトを開く
2. **Settings** → **Git** を開く
3. **Connected Git Repository** セクションを確認
4. **「Disconnect」** をクリック（一時的に切断）
5. **「Connect Git Repository」** をクリック
6. GitHubリポジトリを再選択
7. **「Connect」** をクリック

これで、Webhookが再設定されます。

---

## 解決方法5: プロジェクトを再作成

上記の方法で解決しない場合、プロジェクトを一度削除して再作成します。

### 手順

1. Vercelダッシュボードでプロジェクトを開く
2. **Settings** → **General** を開く
3. 画面下部の **「Delete Project」** をクリック
4. 確認ダイアログで **「Delete」** をクリック
5. 新規プロジェクトを作成：
   - **「Add New...」** → **「Project」**
   - GitHubリポジトリ **「LP-Design-Support」** を選択
   - **Root Directory**: `nextjs-app` に設定
   - **Framework Preset**: `Next.js` を選択
   - **「Deploy」** をクリック

---

## 解決方法6: Vercelサポートに問い合わせ

上記の方法で解決しない場合、Vercelサポートに問い合わせます。

### 必要な情報

1. プロジェクト名: `lp-design-support`
2. GitHubリポジトリ: `akiko-h-jp/LP-Design-Support`
3. Root Directory: `nextjs-app`
4. 問題の詳細: デプロイが開始されない
5. 試したこと: フィルターをクリア、別ブラウザで試行、手動デプロイを試行

---

## 推奨される順序

1. **フィルターをクリア**（最も簡単）
2. **手動でデプロイを実行**
3. **Vercel CLIを使用**（確実）
4. **GitHub Webhookを再設定**
5. **プロジェクトを再作成**（最後の手段）

---

## 確認事項

デプロイを試す前に、以下を確認：

- [ ] Root Directoryが `nextjs-app` に設定されている（✅ 確認済み）
- [ ] GitHubリポジトリが接続されている（✅ 確認済み）
- [ ] ローカルで `npm run build` が成功する（✅ 確認済み）
- [ ] フィルターをクリアした
- [ ] 手動でデプロイを試した

---

## 次のステップ

まず、**解決方法1（フィルターをクリア）** と **解決方法2（手動でデプロイ）** を試してください。

それでも解決しない場合は、**解決方法3（Vercel CLI）** を試すことをお勧めします。
