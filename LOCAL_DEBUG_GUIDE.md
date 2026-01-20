# ローカルデバッグガイド

## 開発サーバーの起動

開発サーバーは既に起動しています。

### アクセス方法

1. ブラウザで以下のURLを開く：
   ```
   http://localhost:3000
   ```

2. デザイナー画面にアクセス：
   ```
   http://localhost:3000/login
   ```
   - ログイン後、`http://localhost:3000/designer` にアクセス

---

## ログの確認方法

### 1. ターミナルのログを確認

開発サーバーを起動したターミナルで、以下のログが表示されます：

- `[API] Fetching project list...` - プロジェクト一覧取得開始
- `[API] Found X projects from temp storage` - 一時保存から取得したプロジェクト数
- `[API] Fetching projects from Google Drive...` - Google Driveから取得開始
- `[API] Found X projects from Google Drive` - Google Driveから取得したプロジェクト数
- `[API] Returning X total projects` - 返すプロジェクトの総数

### 2. エラーログの確認

エラーが発生した場合、以下のようなログが表示されます：

- `[API] Error fetching from Google Drive:` - Google Drive取得エラー
- `[DataStorageHandler] Google Driveからプロジェクト一覧取得エラー:` - データストレージハンドラーのエラー
- `フォルダ ${folder.name} の処理エラー:` - 特定のフォルダの処理エラー

---

## デバッグ手順

### ステップ1: ブラウザでアクセス

1. `http://localhost:3000/login` にアクセス
2. ログイン
3. `http://localhost:3000/designer` にアクセス

### ステップ2: ブラウザのコンソールを確認

1. ブラウザの開発者ツール（F12）を開く
2. **Console**タブを確認
3. エラーメッセージを確認

### ステップ3: ネットワークタブを確認

1. ブラウザの開発者ツール（F12）を開く
2. **Network**タブを確認
3. `/api/client-input/list`のリクエストを確認
4. レスポンスを確認

### ステップ4: ターミナルのログを確認

開発サーバーを起動したターミナルで、ログを確認：

- Google Driveからデータを取得しているか
- エラーが発生しているか
- 取得したプロジェクト数

---

## よくある問題と対処

### 問題1: Google Drive APIの認証エラー

**症状**: ターミナルに `DataStorageHandler初期化エラー:` が表示される

**確認事項**:
- `.env.local`ファイルに`GOOGLE_DRIVE_CREDENTIALS_JSON`が設定されているか
- `.env.local`ファイルに`GOOGLE_DRIVE_FOLDER_ID`が設定されているか

**解決方法**:
1. `.env.local`ファイルを確認
2. 環境変数が設定されていない場合は追加

### 問題2: プロジェクト一覧が空

**症状**: プロジェクト一覧に何も表示されない

**確認事項**:
- ターミナルのログで、Google Driveから取得したプロジェクト数が0か
- 一時保存から取得したプロジェクト数が0か

**解決方法**:
1. ターミナルのログを確認
2. Google Driveにプロジェクトフォルダが存在するか確認
3. フォルダ名が「案件番号_商品名」形式になっているか確認

### 問題3: JSONファイルの解析エラー

**症状**: ターミナルに `フォルダ ${folder.name} のJSONファイル解析エラー:` が表示される

**確認事項**:
- Google Driveのフォルダ内に「01_クライアント事前入力.json」ファイルが存在するか
- JSONファイルの内容が正しいか

**解決方法**:
1. Google Driveでフォルダを確認
2. JSONファイルが存在するか確認
3. JSONファイルの内容を確認

---

## 次のステップ

1. ブラウザで `http://localhost:3000/login` にアクセス
2. ログインしてデザイナー画面を開く
3. ターミナルのログを確認
4. エラーがあれば、エラーメッセージを共有してください
