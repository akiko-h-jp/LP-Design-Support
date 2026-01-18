const bcrypt = require('bcryptjs');

// コマンドライン引数からパスワードを取得
const password = process.argv[2];

if (!password) {
  console.error('使用方法: node generate-password-hash.js <パスワード>');
  process.exit(1);
}

// パスワードをハッシュ化
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('エラー:', err);
    process.exit(1);
  }
  console.log('\nパスワードハッシュ:');
  console.log(hash);
  console.log('\n.env.localに以下を追加してください:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
});
