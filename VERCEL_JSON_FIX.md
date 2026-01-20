# Vercel JSON環境変数の修正方法

## エラー内容

```
Expected ',' or '}' after property value in JSON at position 407
```

このエラーは、`GOOGLE_DRIVE_CREDENTIALS_JSON`環境変数のJSON形式が正しくないことを示しています。

---

## 原因

Vercelの環境変数にJSONを設定する際、以下の問題が発生する可能性があります：

1. **ダブルクォートのエスケープ**: JSON内のダブルクォートが正しくエスケープされていない
2. **改行文字**: JSON内の改行が正しく処理されていない
3. **特殊文字**: JSON内の特殊文字が正しくエスケープされていない

---

## 解決方法

### 方法1: JSONを1行の文字列に変換（推奨）

#### ステップ1: ローカルでJSONを準備

```bash
# credentials.jsonファイルがある場合
cat credentials.json | jq -c . | tr -d '\n'
```

または、Node.jsで変換：

```bash
node -e "console.log(JSON.stringify(require('./credentials.json')))"
```

#### ステップ2: Vercelの環境変数に設定

1. Vercelダッシュボードで **Settings** → **Environment Variables** を開く
2. `GOOGLE_DRIVE_CREDENTIALS_JSON` を編集または削除して再作成
3. 変換したJSON文字列を貼り付け
4. **Save** をクリック

**重要**: 
- JSON全体を1行の文字列として設定
- ダブルクォートは自動的にエスケープされます（Vercelが処理）
- 改行は削除してください

---

### 方法2: 手動で修正

#### ステップ1: JSONの内容を確認

1. ローカルの`credentials.json`ファイルを開く
2. JSON形式が正しいか確認

#### ステップ2: JSONを1行に変換

1. JSONの内容をコピー
2. すべての改行を削除
3. 1行の文字列にする

#### ステップ3: Vercelに設定

1. Vercelダッシュボードで **Settings** → **Environment Variables** を開く
2. `GOOGLE_DRIVE_CREDENTIALS_JSON` を編集
3. 1行のJSON文字列を貼り付け
4. **Save** をクリック

---

## JSON形式の確認

### 正しい形式

```json
{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

### 間違った形式

```json
{
  "type": "service_account",
  "project_id": "...",
  ...
}
```

（改行が含まれている）

---

## 確認方法

### ステップ1: 環境変数を再設定

1. Vercelダッシュボードで `GOOGLE_DRIVE_CREDENTIALS_JSON` を削除
2. 正しい形式で再作成
3. **Save** をクリック

### ステップ2: 再デプロイ

1. **Deployments** タブを開く
2. 最新のデプロイメントの **「...」** メニューをクリック
3. **「Redeploy」** を選択

### ステップ3: ログを確認

1. デプロイメントの **Logs** タブを開く
2. エラーが解消されているか確認
3. `[GoogleDriveService] Credentials JSON length:` が表示されるか確認

---

## トラブルシューティング

### 問題1: まだJSONパースエラーが発生する

**対処**:
1. JSONの内容を再度確認
2. JSONバリデーター（https://jsonlint.com/）で検証
3. 正しいJSON形式になっているか確認

### 問題2: 環境変数が長すぎる

**対処**:
1. Vercelの環境変数の制限を確認（通常は問題ありません）
2. JSONが正しく1行になっているか確認

### 問題3: 特殊文字が含まれている

**対処**:
1. `private_key`内の改行は`\n`として保持
2. その他の特殊文字は自動的にエスケープされます

---

## 次のステップ

1. `GOOGLE_DRIVE_CREDENTIALS_JSON`を正しい形式で再設定
2. 再デプロイを実行
3. ログを確認してエラーが解消されているか確認

問題が解決しない場合は、Vercelのログで `[GoogleDriveService] JSON around error position:` の内容を確認してください。
