# Create Deployment モーダルの入力方法

## 入力フィールドの説明

「Create Deployment」モーダルでは、**「Commit or Branch Reference」** フィールドにブランチ名またはコミットハッシュを入力します。

---

## 入力方法

### 方法1: ブランチ名を入力（推奨）

**入力フィールドに以下を入力：**

```
main
```

または

```
master
```

**注意**: 
- URLではなく、ブランチ名だけを入力してください
- `https://github.com/...` という形式ではなく、単に `main` と入力します

### 方法2: コミットハッシュを入力

最新のコミットハッシュを入力することもできます：

```
420239c
```

または完全なコミットハッシュ：

```
420239c8a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## 手順

### ステップ1: 入力フィールドをクリア

1. **「Commit or Branch Reference」** フィールドをクリック
2. 既存のURL（`https://github.com/...`）をすべて削除

### ステップ2: ブランチ名を入力

1. `main` と入力
2. **「Create Deployment」** ボタンが有効になることを確認

### ステップ3: デプロイを実行

1. **「Create Deployment」** ボタンをクリック
2. デプロイが開始されます

---

## よくある間違い

### ❌ 間違い: URLを入力

```
https://github.com/akiko-h-jp/LP-Design-Support
```

### ✅ 正しい: ブランチ名を入力

```
main
```

---

## 確認事項

- ✅ 入力フィールドに `main` と入力されている
- ✅ **「Create Deployment」** ボタンが有効になっている（グレーアウトされていない）
- ✅ リポジトリ名が `akiko-h-jp/LP-Design-Support` と表示されている

---

## 次のステップ

1. 入力フィールドに `main` と入力
2. **「Create Deployment」** ボタンをクリック
3. デプロイの進行を確認

これで、デプロイが開始されるはずです。
