# Vercel Build and Output Settings について

## デフォルト設定で問題ありません

Root Directoryを`nextjs-app`に設定している場合、**Build and Output Settingsはそのまま（デフォルト）で問題ありません**。

---

## 各設定の説明

### 1. Build Command

**デフォルト値**: `npm run build` or `next build`

**説明**:
- Root Directoryを`nextjs-app`に設定している場合、Vercelは自動的に`nextjs-app`ディレクトリ内でこのコマンドを実行します
- `nextjs-app/package.json`の`build`スクリプト（`next build`）が実行されます
- **変更不要**です

### 2. Output Directory

**デフォルト値**: "Next.js default"（通常は`.next`）

**説明**:
- Next.jsは自動的に`.next`ディレクトリにビルド結果を出力します
- Root Directoryを`nextjs-app`に設定している場合、Vercelは`nextjs-app/.next`を出力ディレクトリとして認識します
- **変更不要**です

### 3. Install Command

**デフォルト値**: `yarn install`, `pnpm install`, `npm install`, or `bun install`

**説明**:
- Vercelは自動的に`package-lock.json`、`yarn.lock`、`pnpm-lock.yaml`などのロックファイルを検出して、適切なパッケージマネージャーを選択します
- このプロジェクトは`npm`を使用しているため、`npm install`が実行されます
- Root Directoryを`nextjs-app`に設定している場合、Vercelは`nextjs-app`ディレクトリ内で`npm install`を実行します
- **変更不要**です

---

## 重要なポイント

### Root Directoryの設定が重要

**Root Directory**を`nextjs-app`に設定している場合：

1. Vercelはすべてのコマンドを`nextjs-app`ディレクトリ内で実行します
2. `nextjs-app/package.json`を読み込みます
3. `nextjs-app/.next`を出力ディレクトリとして使用します

そのため、**Build and Output Settingsはデフォルトのままで問題ありません**。

---

## 変更が必要な場合

通常は変更不要ですが、以下の場合のみ変更が必要です：

### 1. カスタムビルドコマンドが必要な場合

例：ビルド前に何か処理を実行する必要がある場合

```
npm run build:custom
```

ただし、このプロジェクトでは通常の`next build`で十分です。

### 2. カスタム出力ディレクトリが必要な場合

Next.jsのデフォルト（`.next`）以外のディレクトリに出力する必要がある場合のみ変更します。

ただし、このプロジェクトでは`.next`で十分です。

---

## 確認事項

デプロイ前に確認：

- ✅ **Root Directory**: `nextjs-app` に設定されている
- ✅ **Build Command**: デフォルト（`npm run build` or `next build`）のまま
- ✅ **Output Directory**: デフォルト（"Next.js default"）のまま
- ✅ **Install Command**: デフォルト（`npm install`など）のまま

---

## まとめ

**Build and Output Settingsは何も変更せず、デフォルトのままで問題ありません。**

重要なのは**Root Directoryを`nextjs-app`に設定すること**です。Root Directoryが正しく設定されていれば、Vercelは自動的に正しいディレクトリでコマンドを実行します。

そのまま「Deploy」ボタンをクリックしてデプロイを開始してください。
