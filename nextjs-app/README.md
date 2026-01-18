# LP Design Support Tool - Next.js

LP制作支援ツールのNext.js版です。

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Google Drive API
GOOGLE_DRIVE_CREDENTIALS_PATH=/path/to/credentials.json
GOOGLE_DRIVE_TOKEN_PATH=/path/to/token.json
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## プロジェクト構成

```
nextjs-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # クライアント入力フォーム
│   ├── designer/          # デザイナー用確認画面
│   │   └── page.tsx
│   └── api/               # API Routes
│       └── client-input/
│           ├── route.ts   # POST /api/client-input/receive
│           ├── list/route.ts  # GET /api/client-input/list
│           └── [id]/route.ts  # GET, PUT /api/client-input/[id]
├── components/            # Reactコンポーネント
├── lib/                   # バックエンドロジック（Node.js/TypeScript）
│   ├── handlers/         # ハンドラー
│   ├── services/         # API連携サービス
│   └── utils/            # ユーティリティ
├── types/                 # TypeScript型定義
└── public/                # 静的ファイル
```

## Vercelデプロイ

### 1. Vercelにプロジェクトを接続

1. [Vercel](https://vercel.com)にログイン
2. 新しいプロジェクトを作成
3. GitHubリポジトリを接続
4. 環境変数を設定

### 2. 環境変数の設定

Vercelのダッシュボードで、以下の環境変数を設定してください：

- `GEMINI_API_KEY`
- `GOOGLE_DRIVE_CREDENTIALS_PATH` (オプション)
- `GOOGLE_DRIVE_TOKEN_PATH` (オプション)
- `GOOGLE_DRIVE_FOLDER_ID` (オプション)

### 3. デプロイ

GitHubにプッシュすると、自動的にデプロイされます。

## 開発

### ビルド

```bash
npm run build
```

### 本番環境での起動

```bash
npm start
```

### リンター

```bash
npm run lint
```

## 注意事項

- 一時保存データは `temp_client_inputs/` ディレクトリに保存されます
- Google Drive API連携は後で実装予定です
- Gemini API連携は後で実装予定です
