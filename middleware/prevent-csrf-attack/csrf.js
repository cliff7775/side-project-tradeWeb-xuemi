//【引用模組功能】
//------------------------------------------------------------------------------>
const Tokens = require("csrf"); //引用 csrf模組 (防禦跨站請求偽造)
const tokens = new Tokens();

async function createCsrfTokenAndKey(req, res, next) {
  try {
    const secret = await tokens.secret();
    const token = tokens.create(secret);

    res.cookie("csrfkey", secret, { httpOnly: true });
    req.csrfToken = token;
  } catch (error) {
    console.error(error);
  }
  next();
}

async function authenticateCsrfTokenAndKey(req, res, next) {
  const secret = req.cookies.csrfkey;
  const token = req.body._csrf;
  // 驗證 CSRF Token 的有效性
  if (!tokens.verify(secret, token)) throw new Error("Invalid token!");
  next();
}

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = { createCsrfTokenAndKey, authenticateCsrfTokenAndKey };
