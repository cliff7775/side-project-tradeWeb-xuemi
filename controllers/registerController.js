//【引用模組功能】
//------------------------------------------------------------------------------>

//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const {
  sha512Hash,
  bcryptHash,
} = require("../function/specificFunction/hashPassword.js");
const registerModel = require("../models/registerModel.js");
const registerModelinstance = new registerModel();

//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const getRegisterWebPage = (req, res) => {
  const username = req.session.username || "會員";
  const token = req.csrfToken;
  res.render("register", { username: username, token: token });
};

const createNewUser = async (req, res) => {
  const { name, email, password } = req.body; //獲得註冊頁面，用戶輸入值

  const userInfoResult = await registerModelinstance.authenticationUser(email); //認證用戶是否已註冊
  const numberofUserLists = userInfoResult.length; //取得用戶名單筆數
  if (numberofUserLists !== 0) {
    res.redirect("../");
    return; //用戶已存在結束註冊
  }
  const shaPassword = sha512Hash(password); //加密用戶密碼
  const bcrypthashPassword = await bcryptHash(shaPassword);
  const bundleUserInfo = {
    username: name,
    usermail: email,
    userpassword: bcrypthashPassword,
  };
  const ResultSetHeader = await registerModelinstance.addNewUser(
    bundleUserInfo
  ); //新增用戶
  if (ResultSetHeader.serverStatus === 2) {
    const userInfoResult = await registerModelinstance.authenticationUser(
      email
    );
    const { user_id, user_name, role_name } = userInfoResult[0];
    req.session.userRole = role_name;
    req.session.username = user_name;
    req.session.userID = user_id;
    res.render("home", { username: user_name }); //認證用戶新增狀態，
  }
};
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  getRegisterWebPage,
  createNewUser,
};
