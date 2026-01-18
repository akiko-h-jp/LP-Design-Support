# Google Drive API セットアップガイド

## 概要

Google Drive APIを使用して、LP制作データをGoogle Driveに保存・読み込みするための認証情報を取得する手順です。

---

## 前提条件

- Googleアカウントを持っていること
- Google Cloud Consoleにアクセスできること

---

## セットアップ手順

### ステップ1: Google Cloud Consoleでプロジェクトを作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 画面上部のプロジェクト選択ドロップダウンをクリック
3. 「新しいプロジェクト」をクリック
4. プロジェクト名を入力（例: `LP Design Support`）
5. 「作成」をクリック
6. 作成したプロジェクトを選択

---

### ステップ2: Google Drive APIを有効化

1. 左側のメニューから「APIとサービス」→「ライブラリ」を選択
2. 検索バーに「Google Drive API」と入力
3. 「Google Drive API」を選択
4. 「有効にする」ボタンをクリック

---

### ステップ3: OAuth同意画面の設定

1. 左側のメニューから「APIとサービス」→「OAuth同意画面」を選択
2. ユーザータイプを選択：
   - **外部**：一般ユーザーも使用可能（推奨：開発・テスト用）
   - **内部**：同じ組織内のユーザーのみ
3. 「作成」をクリック
4. アプリ情報を入力：
   - **アプリ名**: LP Design Support Tool（任意）
   - **ユーザーサポートメール**: 自分のメールアドレス
   - **デベロッパーの連絡先情報**: 自分のメールアドレス
5. 「保存して次へ」をクリック
6. スコープの設定：
   - 「スコープを追加または削除」をクリック
   - 以下のスコープを追加：
     - `https://www.googleapis.com/auth/drive`（Google Driveへのフルアクセス）
     - `https://www.googleapis.com/auth/documents`（Google Docsへのアクセス）
     - `https://www.googleapis.com/auth/spreadsheets`（Google Sheetsへのアクセス）
   - 「更新」→「保存して次へ」をクリック
7. テストユーザーの追加（外部ユーザータイプの場合）：
   - 「ユーザーを追加」をクリック
   - 自分のGoogleアカウントのメールアドレスを追加
   - 「保存して次へ」をクリック
8. 概要を確認して「ダッシュボードに戻る」をクリック

---

### ステップ4: OAuth2認証情報（credentials.json）の作成

1. 左側のメニューから「APIとサービス」→「認証情報」を選択
2. 画面上部の「+ 認証情報を作成」をクリック
3. 「OAuth クライアント ID」を選択
4. アプリケーションの種類を選択：
   - **デスクトップアプリ** を選択
5. 名前を入力（例: `LP Design Support Desktop Client`）
6. 「作成」をクリック
7. 認証情報の詳細が表示されるので、「JSONをダウンロード」をクリック
8. ダウンロードしたJSONファイルを `credentials.json` にリネーム
9. プロジェクトのルートディレクトリに配置：
   ```
   /Users/a-hagiwara/Desktop/Learning/AI学習/AIエンジニア_アプリ/8-1_LP Design Support/credentials.json
   ```

---

### ステップ5: Google Driveフォルダの作成とIDの取得

#### 方法1: 手動でフォルダを作成する場合

1. [Google Drive](https://drive.google.com/) にアクセス
2. 新しいフォルダを作成（例: `LP Design Support Projects`）
3. フォルダを開く
4. ブラウザのアドレスバーからフォルダIDを取得
   - URLの形式: `https://drive.google.com/drive/folders/【ここがフォルダID】`
   - 例: `https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j`
   - フォルダID: `1a2b3c4d5e6f7g8h9i0j`

#### 方法2: プログラムで自動的にフォルダを作成する場合

Phase 2の実装で、自動的にフォルダを作成する機能を実装します。
この場合、`GOOGLE_DRIVE_FOLDER_ID`は空欄のままでも動作します。

### ステップ6: 環境変数の設定

`.env`ファイルに以下の設定を追加：

```env
GOOGLE_DRIVE_CREDENTIALS_PATH=credentials.json
GOOGLE_DRIVE_TOKEN_PATH=token.json
GOOGLE_DRIVE_FOLDER_ID=1a2b3c4d5e6f7g8h9i0j
```

**注意事項:**
- `GOOGLE_DRIVE_CREDENTIALS_PATH`: `credentials.json`のパス（相対パスまたは絶対パス）
- `GOOGLE_DRIVE_TOKEN_PATH`: OAuth2トークンの保存先（初回認証時に自動生成されます）
- `GOOGLE_DRIVE_FOLDER_ID`: 案件データを保存するGoogle DriveフォルダのID
  - 手動でフォルダを作成した場合: フォルダIDを設定
  - 自動でフォルダを作成する場合: 空欄のままでも可（Phase 2で実装）

---

## 初回認証フロー

初回実行時に、OAuth2認証フローが自動的に開始されます：

1. アプリケーションを実行
2. ブラウザが自動的に開き、Googleアカウントの認証画面が表示される
3. 自分のGoogleアカウントでログイン
4. アクセス許可を確認して「許可」をクリック
5. 認証が完了すると、`token.json`ファイルが自動生成される
6. 以降は`token.json`を使用して自動的に認証される

---

## 必要なスコープ

以下のスコープが必要です：

- `https://www.googleapis.com/auth/drive`
  - Google Driveへのフルアクセス（ファイル作成・読み込み・更新・削除）
  
- `https://www.googleapis.com/auth/documents`
  - Google Docsファイルの作成・編集
  
- `https://www.googleapis.com/auth/spreadsheets`
  - Google Sheetsファイルの作成・編集

---

## トラブルシューティング

### エラー: "invalid_client"

- `credentials.json`のパスが正しいか確認
- `credentials.json`が正しくダウンロードされているか確認

### エラー: "access_denied"

- OAuth同意画面でテストユーザーに自分のアカウントが追加されているか確認
- アプリが「テスト中」の状態の場合、テストユーザー以外はアクセスできません

### エラー: "invalid_grant"

- `token.json`を削除して再認証を試す
- システムの時刻が正しいか確認

### 認証画面が表示されない

- ブラウザが自動的に開かない場合は、手動でURLを開く必要がある場合があります
- コンソールに表示されるURLをコピーしてブラウザで開く

---

## セキュリティに関する注意事項

1. **credentials.jsonの管理**
   - `credentials.json`は機密情報です。Gitにコミットしないでください
   - `.gitignore`に追加することを推奨：
     ```
     credentials.json
     token.json
     .env
     ```

2. **token.jsonの管理**
   - `token.json`も機密情報です。同様にGitにコミットしないでください
   - トークンは定期的に更新されます

3. **本番環境での使用**
   - 本番環境では、サービスアカウントの使用を検討してください
   - OAuth2認証は開発・テスト環境向けです

---

## 参考リンク

- [Google Drive API ドキュメント](https://developers.google.com/drive/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 認証フロー](https://developers.google.com/identity/protocols/oauth2)

---

## 次のステップ

認証情報の設定が完了したら、Phase 2の実装に進みます。

