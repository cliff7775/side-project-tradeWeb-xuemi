//【引用模組功能】
//------------------------------------------------------------------------------>
const bcrypt = require("bcrypt"); // 用於 bcrypt 加密
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const {
  sha512Hash,
  bcryptHash,
} = require("../function/specificFunction/hashPassword.js");
const productModel = require("../models/productModel.js");
const loginModel = require("../models/loginModel.js");
const loginModelinstance = new loginModel();
const productModelinstance = new productModel();
//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const getMemberWebPage = async (req, res) => {
  const { userID, username, userRole } = req.session;
  const userInfoResult = await loginModelinstance.accessUserInfo(userID);
  console.log("userInfoResult", userInfoResult);
  const { user_name, user_email, user_birthday, gender_name } =
    userInfoResult[0];
  console.log(
    "user_name, user_email, user_birthday, gender_name",
    user_name,
    user_email,
    user_birthday,
    gender_name
  );
  const date = new Date(user_birthday);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = date
    .toLocaleDateString("zh-TW", options)
    .replace(/\//g, "-");
  res.render("memberIndex", {
    username: user_name,
    usermail: user_email,
    userbirthday: formattedDate,
    usergender: gender_name,
    nonce: res.locals.cspNonce,
  });
};

const viewMemberOrders = async (req, res) => {
  const { userID, username, userRole } = req.session;
  const userOrdersInfoResult = await productModelinstance.accessUserOrdersInfo(
    userID
  );
  console.log("userOrdersInfoResult", userOrdersInfoResult);

  res.render("memberOrders", {
    username: username,
    userOrdersInfoResult,
    nonce: res.locals.cspNonce,
  });
};

const getMemberPwdWebPage = (req, res) => {
  const { userID, username, userRole } = req.session;
  res.render("memberUpdatePW", {
    username: username,
    nonce: res.locals.cspNonce,
  });
};

const accessOrderWithDetailedInfo = async (req, res) => {
  const { merchantradeValue } = req.body;
  if (merchantradeValue.length !== 20) {
    res.send("訂單編號格式錯誤");
    return;
  }
  const orderDetailedInfoResult =
    await productModelinstance.accessOrderWithDetailedInfo(merchantradeValue);

  const orderDetailedInfoResultjsonForm = JSON.stringify(
    orderDetailedInfoResult
  );
  res.json(orderDetailedInfoResultjsonForm);
};

const updateMemberInfo = async (req, res) => {
  const { userID } = req.session;
  const { username, userbirthday, usergender } = req.body;
  const bundleUserInfo = {
    userID: userID,
    username: username,
    userbirthday: userbirthday,
    usergender: usergender,
  };

  const ResultSetHeader = await loginModelinstance.updateUserWithNewInfo(
    bundleUserInfo
  );

  if (ResultSetHeader.serverStatus === 2) {
    req.session.username = username;
    res.send("會員資訊更新成功");
  }
};

const modifyMemberPassword = async (req, res) => {
  const { userID } = req.session;
  const { oldPwd, newPwd, newPwdAgain } = req.body;

  if (!oldPwd) return;
  if (newPwd !== newPwdAgain) return;
  const shaPassword = sha512Hash(oldPwd); //加密用戶密碼

  const userInfoResult = await loginModelinstance.accessUserInfo(userID);
  const result = await bcrypt.compare(
    shaPassword,
    userInfoResult[0].user_password
  );

  if (!result) {
    //輸入舊密碼有誤
    return;
  }
  const newPwdShaPassword = sha512Hash(newPwd); //加密用戶密碼
  const bcrypthashPassword = await bcryptHash(newPwdShaPassword);
  const bundleUserInfo = {
    userID: userInfoResult[0].user_id,
    userpassword: bcrypthashPassword,
  };
  const ResultSetHeader = await loginModelinstance.updateUserPwd(
    bundleUserInfo
  );
  if (ResultSetHeader.serverStatus === 2) {
    res.send("密碼更新成功");
  }
};

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  getMemberWebPage,
  viewMemberOrders,
  getMemberPwdWebPage,
  accessOrderWithDetailedInfo,
  updateMemberInfo,
  modifyMemberPassword,
};
