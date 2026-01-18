# Vercel環境変数設定ガイド

Vercelではファイルシステムへの直接アクセスができないため、Google Drive認証情報を環境変数として設定する必要があります。

## 環境変数の設定方法

### 1. Vercelダッシュボードで環境変数を設定

1. Vercelプロジェクトのダッシュボードを開く
2. **Settings** → **Environment Variables** を選択
3. 以下の環境変数を追加：

### 必須環境変数

#### Gemini API
```
GEMINI_API_KEY=your_gemini_api_key_here
```

#### NextAuth.js
```
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-project.vercel.app
```

#### 管理者認証情報
```
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD_HASH=your_bcrypt_password_hash_here
```

#### Google Drive API

**方法1: 環境変数としてJSONを設定（推奨）**

```
GOOGLE_DRIVE_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**重要**: 
- JSON全体を1行の文字列として設定します
- `private_key`内の改行は`\n`としてエスケープします
- ダブルクォートはエスケープする必要があります（VercelのUIで自動的に処理されます）

```
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here
```

**OAuth2を使用している場合（サービスアカウントではない場合）:**

```
GOOGLE_DRIVE_TOKEN_JSON={"access_token":"...","refresh_token":"...","scope":"...","token_type":"Bearer","expiry_date":...}
```

---

## credentials.jsonの内容を環境変数に変換する方法

### 方法1: ターミナルで変換（推奨）

```bash
# credentials.jsonの内容を1行のJSON文字列に変換
cat credentials.json | jq -c . | tr -d '\n'
```

または、Node.jsで変換：

```bash
node -e "console.log(JSON.stringify(require('./credentials.json')))"
```

### 方法2: 手動で変換

1. `credentials.json`を開く
2. すべての内容をコピー
3. 改行を削除して1行にする
4. `private_key`内の改行は`\n`に変換
5. Vercelの環境変数に貼り付け

---

## token.jsonの内容を環境変数に変換する方法

OAuth2を使用している場合（サービスアカウントではない場合）：

### 方法1: ターミナルで変換（推奨）

```bash
# token.jsonの内容を1行のJSON文字列に変換
cat /Users/a-hagiwara/Desktop/Learning/AI学習/Key/token.json | jq -c . | tr -d '\n'
```

または、Node.jsで変換：

```bash
node -e "console.log(JSON.stringify(require('/Users/a-hagiwara/Desktop/Learning/AI学習/Key/token.json')))"
```

### 方法2: 手動で変換

1. `token.json`を開く
2. すべての内容をコピー
3. 改行を削除して1行にする
4. Vercelの環境変数に貼り付け

**注意**: `token.json`は有効期限があるため、期限切れの場合は再認証が必要です。

---

## 環境変数の設定例

### サービスアカウントを使用する場合

Vercelの環境変数設定画面で：

```
GOOGLE_DRIVE_CREDENTIALS_JSON
```

値（例）：
```
{"type":"service_account","project_id":"my-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"my-service@my-project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/my-service%40my-project.iam.gserviceaccount.com"}
```

### OAuth2クライアントを使用する場合

```
GOOGLE_DRIVE_CREDENTIALS_JSON
```

値（例）：
```
{"installed":{"client_id":"123456789.apps.googleusercontent.com","project_id":"my-project","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"GOCSPX-abc123","redirect_uris":["http://localhost"]}}
```

```
GOOGLE_DRIVE_TOKEN_JSON
```

値（例）：
```
{"access_token":"ya29.a0AfH6SMC...","refresh_token":"1//0gabc123...","scope":"https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents","token_type":"Bearer","expiry_date":1234567890}
```

---

## 注意事項

### 1. private_keyの改行について

`private_key`フィールドには改行が含まれています。環境変数に設定する際は、改行を`\n`としてエスケープする必要があります。

**正しい例：**
```
"private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### 2. JSONのエスケープ

Vercelの環境変数設定画面では、通常は自動的にエスケープされますが、手動で設定する場合は注意が必要です。

### 3. 環境変数のサイズ制限

Vercelの環境変数にはサイズ制限があります（通常4KB）。`credentials.json`が大きい場合は、サービスアカウントを使用することを推奨します（OAuth2クライアントより小さい）。

---

## 設定後の確認

環境変数を設定した後：

1. **再デプロイ**を実行（環境変数の変更は再デプロイが必要）
2. Vercelのログを確認してエラーがないか確認
3. Google Drive機能をテスト

---

## トラブルシューティング

### エラー: "認証情報の取得方法が指定されていません"

- `GOOGLE_DRIVE_CREDENTIALS_JSON`または`GOOGLE_DRIVE_CREDENTIALS_PATH`が設定されているか確認

### エラー: "トークンの解析に失敗しました"

- `GOOGLE_DRIVE_TOKEN_JSON`のJSON形式が正しいか確認
- 改行が正しくエスケープされているか確認

### エラー: "Google Drive認証に失敗しました"

- `credentials.json`の内容が正しいか確認
- サービスアカウントの権限が正しく設定されているか確認
- Google Cloud ConsoleでAPIが有効になっているか確認

---

## 参考

- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
