# Vercelログ確認ガイド

## 確認すべきログの場所

### 1. Vercelダッシュボードのログ（最重要）

#### ステップ1: デプロイメントを開く

1. Vercelダッシュボードで **「lp-design-support」** プロジェクトを開く
2. **「Deployments」** タブをクリック
3. **最新のデプロイメント**（一番上）をクリック

#### ステップ2: ログを確認

1. **「Logs」** タブをクリック
2. ログが表示されます

#### ステップ3: 確認すべきログメッセージ

以下のログメッセージを探してください：

##### 正常な場合のログ

```
[API] Fetching project list...
[API] Found X projects from temp storage
[API] Fetching projects from Google Drive...
[DataStorageHandler] Fetching project folders from Google Drive...
[DataStorageHandler] Found X folders
[API] Found X projects from Google Drive
[API] Returning X total projects
```

##### エラーの場合のログ

**エラー1: 環境変数が設定されていない**
```
[API] DataStorageHandler could not be initialized (Google Drive credentials may be missing)
[API] GOOGLE_DRIVE_CREDENTIALS_JSON: Not set
[API] GOOGLE_DRIVE_FOLDER_ID: Not set
```

**エラー2: Google Drive APIの認証エラー**
```
[API] DataStorageHandler初期化エラー: ...
[API] Error type: ...
[API] Error message: ...
```

**エラー3: Google Driveからのデータ取得エラー**
```
[API] Error fetching from Google Drive: ...
[DataStorageHandler] Google Driveからプロジェクト一覧取得エラー: ...
```

---

### 2. ブラウザのコンソール（クライアント側のエラー）

#### ステップ1: 開発者ツールを開く

1. ブラウザでVercelのサイトにアクセス
2. **F12** キーを押す（または右クリック → **検証**）
3. **「Console」** タブを開く

#### ステップ2: エラーメッセージを確認

以下のようなエラーが表示される可能性があります：

- `Failed to fetch` - ネットワークエラー
- `500 Internal Server Error` - サーバーエラー
- `404 Not Found` - エンドポイントが見つからない

---

### 3. ブラウザのネットワークタブ（API呼び出しの確認）

#### ステップ1: ネットワークタブを開く

1. ブラウザの開発者ツール（F12）を開く
2. **「Network」** タブを開く
3. ページをリロード（F5）

#### ステップ2: APIリクエストを確認

1. **「Filter」** に `list` と入力
2. `/api/client-input/list` のリクエストを探す
3. リクエストをクリック

#### ステップ3: レスポンスを確認

1. **「Response」** タブを開く
2. レスポンスの内容を確認：
   - 空の配列 `[]` が返されているか
   - エラーメッセージが含まれているか

#### ステップ4: ステータスコードを確認

- **200**: 成功（データが空の可能性）
- **500**: サーバーエラー
- **404**: エンドポイントが見つからない

---

## ログの確認手順（推奨順序）

### ステップ1: Vercelのログを確認（最重要）

1. Vercelダッシュボード → **Deployments** → 最新のデプロイメント → **Logs**
2. 上記のログメッセージを探す
3. エラーメッセージがあれば、その内容をコピー

### ステップ2: ブラウザのネットワークタブを確認

1. ブラウザでサイトにアクセス
2. 開発者ツール（F12）→ **Network** タブ
3. `/api/client-input/list` のリクエストを確認
4. レスポンスの内容を確認

### ステップ3: ブラウザのコンソールを確認

1. 開発者ツール（F12）→ **Console** タブ
2. エラーメッセージを確認

---

## よくある問題と対処

### 問題1: ログに何も表示されない

**原因**: デプロイメントがまだ完了していない、またはログが表示されていない

**対処**:
1. デプロイメントの状態を確認（**Building** か **Ready** か）
2. デプロイメントが完了している場合は、ページをリロードして再度ログを確認

### 問題2: ログに `GOOGLE_DRIVE_CREDENTIALS_JSON: Not set` が表示される

**原因**: 環境変数が設定されていない

**対処**:
1. Vercelダッシュボード → **Settings** → **Environment Variables**
2. `GOOGLE_DRIVE_CREDENTIALS_JSON` を追加
3. `GOOGLE_DRIVE_FOLDER_ID` を追加
4. 再デプロイを実行

### 問題3: ログに `Error fetching from Google Drive:` が表示される

**原因**: Google Drive APIの呼び出しでエラーが発生

**対処**:
1. エラーメッセージの詳細を確認
2. `GOOGLE_DRIVE_CREDENTIALS_JSON` の値が正しいか確認
3. `GOOGLE_DRIVE_FOLDER_ID` が正しいか確認

---

## ログの共有方法

以下の情報を共有してください：

1. **Vercelのログ**（Deployments → Logs）
   - エラーメッセージ全体をコピー
   - 特に `[API]` や `[DataStorageHandler]` で始まるメッセージ

2. **ブラウザのネットワークタブ**
   - `/api/client-input/list` のレスポンス内容
   - ステータスコード

3. **ブラウザのコンソール**
   - エラーメッセージ（あれば）

---

## 次のステップ

1. **Vercelのログを確認**（最重要）
2. エラーメッセージをコピーして共有
3. エラーメッセージに基づいて修正

Vercelのログで、`[API]` や `[DataStorageHandler]` で始まるメッセージを探してください。特にエラーメッセージがあれば、その内容を共有してください。
