# Vercelデプロイ修正内容

## 修正した問題

### 1. ファイルシステム依存の問題

VercelのServerless Functionsでは、書き込み可能なファイルシステムが限られています。以下の修正を行いました：

#### `projectNumberManager.ts`
- **問題**: `process.cwd()`を使用してファイルを保存していたため、Vercelでは書き込み不可
- **修正**: Vercel環境では`/tmp`ディレクトリ（`os.tmpdir()`）を使用するように変更
- **注意**: `/tmp`ディレクトリは一時的なもので、デプロイ間で保持されません

#### `clientInputHandler.ts`
- **問題**: `temp_client_inputs`ディレクトリにファイルを保存していたため、Vercelでは書き込み不可
- **修正**: Vercel環境では`/tmp`ディレクトリを使用するように変更
- **注意**: `/tmp`ディレクトリは一時的なもので、デプロイ間で保持されません

### 2. vercel.jsonの最適化

- **変更**: 不要な`buildCommand`、`devCommand`、`installCommand`を削除（Vercelが自動検出）
- **保持**: `regions`と`functions`の設定は維持

---

## 修正後の動作

### ローカル環境
- `project_numbers.json`はプロジェクトルートに保存
- `temp_client_inputs`ディレクトリはプロジェクトルートに作成

### Vercel環境
- `project_numbers.json`は`/tmp`ディレクトリに保存（一時的）
- `temp_client_inputs`ディレクトリは`/tmp`ディレクトリに作成（一時的）

---

## 制限事項

### 一時的なストレージ
Vercelの`/tmp`ディレクトリは以下の制限があります：
- デプロイ間で保持されない
- 関数実行間で保持される（同じデプロイ内）
- 最大512MBの容量

### 本番環境での推奨
本番環境では、以下のような永続的なストレージを使用することを推奨します：
- **データベース**: PostgreSQL、MySQL、MongoDBなど
- **外部ストレージ**: Google Drive API（既に実装済み）、AWS S3など
- **環境変数**: 小さな設定データの場合

---

## 次のステップ

1. **デプロイの実行**
   - Vercelダッシュボードで手動デプロイを実行
   - または、GitHubにプッシュして自動デプロイをトリガー

2. **環境変数の設定**
   - `VERCEL_ENV_SETUP.md`を参照して環境変数を設定

3. **動作確認**
   - デプロイ後、各機能が正常に動作するか確認
   - エラーが発生した場合は、Vercelのログを確認

---

## 修正ファイル一覧

1. `nextjs-app/lib/utils/projectNumberManager.ts`
   - Vercel環境での`/tmp`ディレクトリ使用に対応

2. `nextjs-app/lib/handlers/clientInputHandler.ts`
   - Vercel環境での`/tmp`ディレクトリ使用に対応

3. `nextjs-app/vercel.json`
   - 不要な設定を削除して最適化

---

## トラブルシューティング

### エラー: "ENOENT: no such file or directory"
- **原因**: `/tmp`ディレクトリが存在しない
- **対処**: ディレクトリの自動作成処理が実装済みですが、エラーが発生する場合はVercelのログを確認

### エラー: "EACCES: permission denied"
- **原因**: `/tmp`ディレクトリへの書き込み権限がない
- **対処**: Vercelの`/tmp`ディレクトリは書き込み可能なはずですが、エラーが発生する場合はVercelサポートに問い合わせ

### データが保持されない
- **原因**: `/tmp`ディレクトリは一時的なもので、デプロイ間で保持されない
- **対処**: 本番環境では、データベースや外部ストレージを使用することを推奨
