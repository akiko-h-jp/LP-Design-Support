# LPデザイン支援ツール

AIを活用したLP（ランディングページ）制作支援アプリケーション

## プロジェクト概要

LP制作における以下の工程をAIで支援するデザイナー向けツール：
- 事前情報収集
- ヒアリング整理
- コピー設計
- デザイン指示生成

## 技術スタック

- **フロントエンド**: Next.js (React/TypeScript)
- **バックエンド**: Next.js API Routes (Node.js/TypeScript)
- **AI**: Gemini API
- **データ保存**: Google Drive / Google Docs
- **デプロイ**: Vercel

## プロジェクト構成

```
.
├── nextjs-app/              # Next.jsアプリケーション
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # クライアント入力フォーム
│   │   ├── designer/        # デザイナー用確認画面
│   │   ├── interview/        # ヒアリング整理画面
│   │   ├── copy/           # LPコピー生成画面
│   │   ├── design-instruction/  # デザイン指示生成画面
│   │   └── api/            # API Routes
│   ├── components/         # Reactコンポーネント
│   ├── lib/                # バックエンドロジック
│   │   ├── handlers/      # ハンドラー
│   │   ├── services/      # API連携サービス
│   │   └── utils/         # ユーティリティ
│   └── types/              # TypeScript型定義
├── CLIENT_INPUT_SPEC.md    # クライアント入力項目仕様書
├── PROJECT_PLAN.md         # 開発進行表
└── README.md
```

## クイックスタート

### ローカル開発環境のセットアップ

1. **依存パッケージのインストール**

```bash
cd nextjs-app
npm install
```

2. **環境変数の設定**

`nextjs-app/.env.local`ファイルを作成し、必要な環境変数を設定してください。

詳細は `nextjs-app/ENV_SETUP.md` を参照してください。

3. **開発サーバーの起動**

```bash
cd nextjs-app
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

### Vercelへのデプロイ

詳細なデプロイ手順は `DEPLOYMENT.md` を参照してください。

**簡単な手順：**

1. GitHubにリポジトリを作成・プッシュ
2. Vercelでプロジェクトを作成（GitHubリポジトリを接続）
3. 環境変数を設定
4. デプロイ完了

デプロイ前のチェックリストは `DEPLOYMENT_CHECKLIST.md` を参照してください。

## 開発進行表

詳細は `PROJECT_PLAN.md` を参照してください。

## 注意事項

- AIは補助役に徹し、最終判断は必ず人が行う
- 出力内容は常に編集可能
- データベースは使用せず、Google Driveを案件単位の保存先とする

## ドキュメント

### 開発・運用ドキュメント
- `PROJECT_PLAN.md`: 開発進行表
- `PROJECT_SUMMARY.md`: プロジェクト概要（技術スタック、実装内容、ページ構成など）
- `DEPLOYMENT.md`: Vercelデプロイメントガイド（詳細手順）
- `DEPLOYMENT_CHECKLIST.md`: デプロイ前チェックリスト

### 仕様書
- `CLIENT_INPUT_SPEC.md`: クライアント入力項目仕様書

### セットアップガイド
- `docs/GOOGLE_DRIVE_API_SETUP.md`: Google Drive APIセットアップガイド
- `docs/CREDENTIALS_PATH_SETUP.md`: 認証情報ファイルのパス設定方法
- `nextjs-app/README.md`: Next.jsアプリケーションの詳細ドキュメント
- `nextjs-app/ENV_SETUP.md`: 環境変数の設定方法
