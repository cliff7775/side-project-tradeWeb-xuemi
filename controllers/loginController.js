//【引用模組功能】
//------------------------------------------------------------------------------>
const bcrypt = require("bcrypt"); // 用於 bcrypt 加密
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const {
  sha512Hash,
  bcryptHash,
} = require("../function/specificFunction/hashPassword.js");
const loginModel = require("../models/loginModel.js");
const loginModelinstance = new loginModel();

//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const getLoginWebPage = (req, res) => {
  if (req.session.username) {
    if (req.session.userRole === `common`) {
      res.redirect("../member/");
    } else {
      res.redirect("../admin/");
    }
    return;
  }
  const username = "會員";
  const token = req.csrfToken;
  res.render("login", {
    username: username,
    token: token,
    nonce: res.locals.cspNonce,
  });
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body; //獲得註冊頁面，用戶輸入值
  const shaPassword = sha512Hash(password); //加密用戶密碼

  const userInfoResult = await loginModelinstance.validUserInfo(email); //查詢用戶是否已註冊

  const numberofUserLists = userInfoResult.length; //取得用戶名單筆數
  if (!numberofUserLists) {
    //沒有這會員，需要註冊
    res.redirect("../login/");
    return;
  }

  const result = await bcrypt.compare(
    shaPassword,
    userInfoResult[0].user_password
  );
  if (!result) {
    //會員密碼有誤
    res.redirect("../login/");
    return;
  } else {
    const { user_id, user_name, role_name } = userInfoResult[0];
    req.session.username = user_name;
    req.session.userRole = role_name;
    req.session.userID = user_id;
    const message = `登入成功, 歡迎 ${user_name} 回來`;
    res.render("login", {
      username: user_name,
      successLogin: message,
      nonce: res.locals.cspNonce,
    });
  }
};
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  getLoginWebPage,
  authenticateUser,
};
