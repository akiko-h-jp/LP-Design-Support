# credentials.jsonのパス設定方法

## 問題の説明

`.env`ファイルの`GOOGLE_DRIVE_CREDENTIALS_PATH`には、**ファイルのパス**を指定する必要があります。

- ✅ **正しい**: `/path/to/credentials.json` （ファイル名が含まれている）
- ❌ **間違い**: `/path/to/Key` （ディレクトリ名だけ）

## 正しい設定方法

### 方法1: ターミナルでファイルをドラッグ（推奨）

1. **`credentials.json`ファイル自体**をターミナルにドラッグ&ドロップ
   - フォルダではなく、**ファイル**をドラッグしてください
   - ファイル名（`credentials.json`）がパスに含まれていることを確認

2. 表示されたパスをコピー
   - 例: `/Users/a-hagiwara/Desktop/Learning/AI学習/Key/credentials.json`

3. `.env`ファイルに貼り付け
   ```env
   GOOGLE_DRIVE_CREDENTIALS_PATH=/Users/a-hagiwara/Desktop/Learning/AI学習/Key/credentials.json
   ```

### 方法2: ターミナルコマンドで確認

```bash
# credentials.jsonファイルの場所を確認
ls -la /Users/a-hagiwara/Desktop/Learning/AI学習/Key/

# ファイルが存在することを確認
# 出力に credentials.json が表示されればOK
```

### 方法3: プロジェクトルートに配置（最も簡単）

1. `credentials.json`ファイルをプロジェクトのルートディレクトリにコピー
   ```
   /Users/a-hagiwara/Desktop/Learning/AI学習/AIエンジニア_アプリ/8-1_LP Design Support/credentials.json
   ```

2. `.env`ファイルに相対パスで設定
   ```env
   GOOGLE_DRIVE_CREDENTIALS_PATH=credentials.json
   ```

## パスの確認方法

### 正しいパスの特徴
- パスの最後に `credentials.json` が含まれている
- 例: `.../Key/credentials.json`

### 間違ったパスの特徴
- パスの最後がフォルダ名だけ
- 例: `.../Key` （ファイル名がない）

## トラブルシューティング

### エラー: "Is a directory"
- **原因**: ディレクトリのパスを指定している
- **解決**: ファイル名（`credentials.json`）を含む完全なパスを指定

### エラー: "認証情報ファイルが見つかりません"
- **原因**: パスが間違っている、またはファイルが存在しない
- **解決**: 
  1. ファイルが実際に存在するか確認
  2. パスにスペースや特殊文字が含まれている場合は、引用符で囲む

## 確認コマンド

```bash
# ファイルが存在するか確認
test -f "/Users/a-hagiwara/Desktop/Learning/AI学習/Key/credentials.json" && echo "ファイルが存在します" || echo "ファイルが見つかりません"

# ファイルの内容を確認（最初の数行）
head -5 "/Users/a-hagiwara/Desktop/Learning/AI学習/Key/credentials.json"
```
