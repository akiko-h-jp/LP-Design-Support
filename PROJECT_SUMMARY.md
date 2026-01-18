# LPデザイン支援ツール - プロジェクト概要

## プロジェクト概要

LP（ランディングページ）制作における以下の工程をAIで支援するデザイナー向けWebアプリケーションです。クライアントからの事前情報収集から、ヒアリング整理、コピー設計、デザイン指示生成まで、LP制作のワークフローを効率化します。

### 主な特徴

- **AI支援による効率化**: Gemini APIを活用したヒアリング整理、コピー生成、デザイン指示生成
- **段階的なワークフロー**: クライアント入力 → ヒアリング整理 → コピー生成 → デザイン指示生成の流れ
- **データの永続化**: Google Drive/Google Docsへの自動保存機能
- **セキュアなアクセス制御**: デザイナー用機能へのログイン認証
- **編集可能な出力**: AI生成結果は常に編集・確定が可能

---

## 使用技術

### フロントエンド
- **Next.js 16.1.3** - Reactフレームワーク（App Router）
- **React 19.2.3** - UIライブラリ
- **TypeScript 5** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **lucide-react** - アイコンライブラリ

### バックエンド
- **Next.js API Routes** - サーバーサイドAPI
- **Node.js** - ランタイム環境

### AI・外部サービス連携
- **Gemini API (Gemini 2.5 Flash)** - AIテキスト生成・分析
- **Google Drive API** - データ保存（OAuth2認証）
- **Google Docs API** - ドキュメント作成

### 認証・セキュリティ
- **NextAuth.js v5 (beta)** - 認証ライブラリ
- **bcryptjs** - パスワードハッシュ化

### その他
- **uuid** - プロジェクトID生成

### デプロイ環境
- **Vercel** - ホスティングプラットフォーム（想定）

---

## 実装内容

### Phase 1: プロジェクト基盤構築
- Next.jsプロジェクトの初期化
- TypeScript設定
- Tailwind CSS設定
- 環境変数管理（`.env.local`）
- 基本的なエラーハンドリング

### Phase 2: Google Drive API連携
- OAuth2認証フローの実装
- プロジェクトフォルダの自動作成（案件番号_商品名形式）
- Google Docsへのデータ保存（JSON形式 + 読みやすい形式の両方）
- 既存フォルダへの保存機能

### Phase 3: クライアント事前ヒアリング機能
- クライアント入力フォーム（8セクション）
- 入力データのバリデーション
- 案件番号管理機能（YYYY-XXX形式、年ごとにリセット）
- デザイナー用確認・編集画面
- プロジェクト一覧表示

### Phase 4: Gemini API連携とヒアリング整理機能
- Gemini API統合（Gemini 2.5 Flash）
- AI分析機能（情報の不足・曖昧・矛盾の指摘）
- 追加質問生成機能（優先度付け付き）
- ヒアリング内容の構造化支援
- デザイナー編集・確定機能

### Phase 5: LPコピー生成機能
- 確定ヒアリング内容からのコピー生成
- セクション別コピー生成（Hero、Problem、Solution、Benefits、Social Proof、CTA）
- 編集メモ生成
- コピー編集機能（編集する/保存/確定ボタン）

### Phase 6: コピー編集・確定機能
- セクション別編集機能
- 確定コピーのGoogle Drive保存
- 既存プロジェクトフォルダへの保存

### Phase 7: デザイン指示生成機能
- 確定コピーからのデザイン指示生成
- デザインコンセプト、トーン、レイアウト方針の生成
- セクション別設計意図・メモの生成
- デザイン指示編集機能
- Google Drive保存（既存フォルダに保存）

### Phase 8: ログイン機能とセキュリティ強化
- NextAuth.jsによる認証機能
- メールアドレス・パスワードログイン
- デザイナー用ページの認証保護
- ログアウト機能

### Phase 9: 統合テストとエラーハンドリング
- 全機能の統合テスト
- エラーハンドリングの強化
- コード整理とデバッグコード削除

---

## ページ構成

### 公開ページ（認証不要）

#### 1. クライアント入力フォーム (`/`)
- **目的**: クライアントが事前に情報を入力
- **機能**:
  - 8セクションの入力フォーム
    - 基本情報
    - ターゲット情報
    - 提供価値・ベネフィット
    - 実績・社会証明（任意）
    - 競合情報（任意）
    - ブランド情報（任意）
    - LPの目的・ゴール
  - バリデーション機能
  - 送信機能
  - デザイナー用ログインページへのリンク

### デザイナー用ページ（認証必須）

#### 2. ログインページ (`/login`)
- **目的**: デザイナーの認証
- **機能**:
  - メールアドレス・パスワードログイン
  - エラーハンドリング

#### 3. デザイナー用確認画面 (`/designer`)
- **目的**: プロジェクト一覧と詳細確認・編集
- **機能**:
  - プロジェクト一覧表示（案件番号表示）
  - プロジェクト詳細表示・編集
  - Google Driveへの保存
  - 各機能へのナビゲーション
    - AIヒアリング整理
    - LPコピー生成
    - デザイン指示生成
  - ログアウト機能

#### 4. ヒアリング整理画面 (`/interview`)
- **目的**: AI支援によるヒアリング整理
- **機能**:
  - クライアント入力内容の表示
  - AI分析結果の表示（不足・曖昧・矛盾の指摘）
  - 追加質問の表示
  - ヒアリング内容の編集
  - 保存機能（アプリ内保存）
  - 確定機能（アプリ内保存 + Google Drive保存）

#### 5. LPコピー生成画面 (`/copy`)
- **目的**: LPコピーの生成・編集・確定
- **機能**:
  - コピー生成ボタン
  - 生成されたコピーの表示（セクション別）
  - 編集メモの表示
  - 編集機能（編集する/保存/確定ボタン）
  - 保存機能（アプリ内保存）
  - 確定機能（アプリ内保存 + Google Drive保存）

#### 6. デザイン指示生成画面 (`/design-instruction`)
- **目的**: デザイン指示の生成・編集・確定
- **機能**:
  - デザイン指示生成ボタン
  - 生成されたデザイン指示の表示
    - デザインコンセプト
    - トーン
    - レイアウト方針
    - セクション別設計意図・メモ
  - 編集機能（編集する/保存/確定ボタン）
  - 保存機能（アプリ内保存）
  - 確定機能（アプリ内保存 + Google Drive保存）

---

## API Routes構成

### 認証関連
- `POST /api/auth/[...nextauth]` - NextAuth.js認証エンドポイント

### クライアント入力関連
- `POST /api/client-input/receive` - クライアント入力データの受信
- `GET /api/client-input/list` - プロジェクト一覧取得
- `GET /api/client-input/[id]` - プロジェクト詳細取得
- `PUT /api/client-input/[id]` - プロジェクト更新
- `POST /api/client-input/[id]/save-to-drive` - Google Driveへの保存

### ヒアリング整理関連
- `POST /api/interview/analyze` - AI分析実行
- `POST /api/interview/questions` - 追加質問生成
- `POST /api/interview/structure` - 内容の構造化

### LPコピー生成関連
- `POST /api/copy/generate` - コピー生成
- `POST /api/copy/save` - コピー保存（アプリ内）
- `POST /api/copy/finalize` - コピー確定（アプリ内 + Google Drive）

### デザイン指示生成関連
- `POST /api/design-instruction/generate` - デザイン指示生成
- `POST /api/design-instruction/save` - デザイン指示保存（アプリ内）
- `POST /api/design-instruction/finalize` - デザイン指示確定（アプリ内 + Google Drive）

---

## 主要コンポーネント

### 再利用可能なUIコンポーネント
- `FormSection.tsx` - フォームセクション
- `InputField.tsx` - テキスト入力フィールド
- `TextareaField.tsx` - テキストエリアフィールド
- `SelectField.tsx` - セレクトフィールド

### ハンドラー（ビジネスロジック）
- `clientInputHandler.ts` - クライアント入力データ管理
- `interviewManagementHandler.ts` - ヒアリング整理ロジック
- `copyGenerationHandler.ts` - LPコピー生成ロジック
- `designInstructionHandler.ts` - デザイン指示生成ロジック
- `dataStorageHandler.ts` - Google Drive保存ロジック

### サービス（外部API連携）
- `geminiService.ts` - Gemini API連携
- `googleDriveService.ts` - Google Drive API連携

### ユーティリティ
- `validation.ts` - バリデーション関数
- `formatConverter.ts` - フロントエンド/バックエンドデータ形式変換
- `projectNumberManager.ts` - 案件番号管理（YYYY-XXX形式）

---

## データフロー

1. **クライアント入力** → 一時保存（`temp_client_inputs/`） → プロジェクトID生成
2. **案件番号割り当て** → `project_numbers.json`に記録（YYYY-XXX形式）
3. **デザイナー確認** → プロジェクト一覧表示 → 詳細表示・編集
4. **AIヒアリング整理** → Gemini API分析 → 結果保存
5. **LPコピー生成** → Gemini API生成 → 編集・確定 → Google Drive保存
6. **デザイン指示生成** → Gemini API生成 → 編集・確定 → Google Drive保存

---

## データ保存形式

### ローカル保存
- **一時保存**: `temp_client_inputs/`ディレクトリ（JSON形式）
- **案件番号管理**: `project_numbers.json`

### Google Drive保存
- **フォルダ名**: `案件番号_商品名`（例: `2026-001_サンプルサービス`）
- **保存形式**: 
  - JSON形式（機械読み取り用）
  - 読みやすい形式（人間が読みやすい形式）
- **保存タイミング**:
  - クライアント入力のGoogle Drive保存時
  - 確定コピー保存時
  - 確定デザイン指示保存時

---

## セキュリティ機能

- **認証**: NextAuth.jsによるメールアドレス・パスワード認証
- **パスワード管理**: bcryptjsによるハッシュ化
- **セッション管理**: JWTベースのセッション（30日間有効）
- **認証保護**: デザイナー用ページへの未認証アクセスをリダイレクト

---

## 開発環境

### 必要な環境変数
```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Google Drive API
GOOGLE_DRIVE_CREDENTIALS_PATH=/path/to/credentials.json
GOOGLE_DRIVE_TOKEN_PATH=/path/to/token.json
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# NextAuth.js
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# 管理者認証情報
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD_HASH=your_bcrypt_hash
```

### 開発コマンド
```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

---

## プロジェクト構造

```
.
├── nextjs-app/                    # Next.jsアプリケーション
│   ├── app/                       # Next.js App Router
│   │   ├── page.tsx              # クライアント入力フォーム
│   │   ├── login/                # ログインページ
│   │   ├── designer/             # デザイナー用確認画面
│   │   ├── interview/            # ヒアリング整理画面
│   │   ├── copy/                 # LPコピー生成画面
│   │   ├── design-instruction/   # デザイン指示生成画面
│   │   └── api/                 # API Routes
│   ├── components/               # Reactコンポーネント
│   ├── lib/                      # バックエンドロジック
│   │   ├── handlers/            # ビジネスロジック
│   │   ├── services/            # 外部API連携
│   │   └── utils/               # ユーティリティ
│   ├── types/                    # TypeScript型定義
│   └── temp_client_inputs/       # 一時保存データ
├── CLIENT_INPUT_SPEC.md          # クライアント入力項目仕様書
├── PROJECT_PLAN.md              # 開発進行表
├── PROJECT_SUMMARY.md           # プロジェクト概要（本ファイル）
└── README.md                    # プロジェクト説明
```

---

## 今後の拡張可能性

- 複数デザイナー対応（マルチユーザー認証）
- データベース連携（より高度なデータ管理）
- 画像生成AI連携（DALL-E 3、FLUX.1等）
- クライアント向け進捗確認機能
- コピー・デザイン指示のバージョン管理
- テンプレート機能

---

## 注意事項

- **AIは補助役**: AI生成結果は常に人間が確認・編集する必要があります
- **編集可能**: すべてのAI生成結果は編集・確定が可能です
- **データ保存**: データベースは使用せず、Google Driveを案件単位の保存先としています
- **環境変数**: 機密情報は環境変数で管理し、`.env.local`を`.gitignore`に追加してください

---

## ドキュメント

- `PROJECT_PLAN.md`: 開発進行表（詳細な実装内容）
- `CLIENT_INPUT_SPEC.md`: クライアント入力項目仕様書
- `docs/GOOGLE_DRIVE_API_SETUP.md`: Google Drive APIセットアップガイド
- `nextjs-app/ENV_SETUP.md`: 環境変数の設定方法
