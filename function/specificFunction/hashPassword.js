//【引用模組功能】
//------------------------------------------------------------------------------>
const crypto = require("crypto"); // 用於 SHA-512 加密
const bcrypt = require("bcrypt"); // 用於 bcrypt 加密

// 使用 crypto 生成 SHA-512 雜湊
function sha512Hash(password) {
  return crypto.createHash("sha512").update(password).digest("hex");
}

async function bcryptHash(hashedPassword) {
  const bcrypthashPassword = await bcrypt.hash(hashedPassword, 10);
  return bcrypthashPassword;
}

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = { sha512Hash, bcryptHash };
