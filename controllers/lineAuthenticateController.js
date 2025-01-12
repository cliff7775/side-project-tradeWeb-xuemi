//【引用模組功能】
//------------------------------------------------------------------------------>
const crypto = require("crypto"); // 用於 SHA-512 加密
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const {
  sha512Hash,
  bcryptHash,
} = require("../function/specificFunction/hashPassword.js");
const {
  lionCallBackUrl,
  channelID,
  channelSecret,
  authorizationUrl,
  authorizationCodeUrl,
  verifyIdTokenUrl,
} = require("../config/lineAPI/loginv2.1.js");
const loginModel = require("../models/loginModel.js");

//【設定參數並實例化】
//------------------------------------------------------------------------------>
const loginModelstance = new loginModel();

//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const setupAuthorizationUrl = (req, res) => {
  const state = crypto.randomBytes(32).toString("hex"); // 生成安全的隨機 state 值
  const setParamsForauthorizationUrl =
    authorizationUrl +
    `?response_type=code&prompt=consent&client_id=${channelID}&redirect_uri=${lionCallBackUrl}&state=${state}&scope=profile%20openid%20email`;
  console.log("setParamsForauthorizationUrl :", setParamsForauthorizationUrl);
  res.redirect(setParamsForauthorizationUrl);
};

const parseCallBackUrlParams = async (req, res) => {
  const { code, state } = req.query;
  const header = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: lionCallBackUrl,
    client_id: channelID,
    client_secret: channelSecret,
  });

  const responseOfLinePlatformToken = await fetch(authorizationCodeUrl, {
    method: "POST",
    headers: header,
    body: body,
  });

  const requestTokenInfo = await responseOfLinePlatformToken.json();
  res.cookie("lineTokenInfo", requestTokenInfo, { httpOnly: true });
  res.redirect("../linev2.1/reqUserInfoFromLineAPI");
};

const reqUserProfileInfo = async (req, res) => {
  try {
    const { access_token, id_token, ...data } = req.cookies.lineTokenInfo;
    const header = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const body = new URLSearchParams({
      id_token: id_token,
      client_id: channelID,
    });
    const responseOfUserInfo = await fetch(verifyIdTokenUrl, {
      method: "POST",
      headers: header,
      body: body,
    });

    const userInfoFromLine = await responseOfUserInfo.json();
    const { name, email, sub } = userInfoFromLine; //取得LINE回傳用戶資料，並拆解賦值給變數，下行榜定成物件資料
    const shaPassword = sha512Hash(sub); //加密用戶密碼
    const bcrypthashPassword = await bcryptHash(shaPassword);
    const bundleUserInfo = {
      username: name,
      usermail: email,
      userpassword: bcrypthashPassword,
    };
    const userInfoResult = await loginModelstance.validThirdPartyUserInfo(
      email
    ); //先認證用戶是否已存在(認證電子信箱) (回傳非空值進入判斷)
    const numberofUserLists = userInfoResult.length; //取得用戶名單筆數
    if (numberofUserLists !== 0) {
      for (const userInfo of userInfoResult) {
        if (userInfo.user_name !== name) {
          //更新用戶資訊
          const ResultSetHeader = await loginModelstance.updateUserInfo(
            userInfo.user_id,
            name
          );
        }
        req.session.userRole = userInfo.role_name; //資料庫回傳該用戶身分
        req.session.username = name; //LINE回傳用戶名
        req.session.userID = userInfo.user_id;
        res.render("home", { username: req.session.username });
      }
      return;
    }
    const ResultSetHeader = await loginModelstance.createNewThirdPartyUser(
      bundleUserInfo
    ); //新增成新用戶
    if (ResultSetHeader.serverStatus === 2) {
      req.session.userRole = userInfoResult[0].role_name; //資料庫回傳該用戶身分
      req.session.username = name; //LINE回傳用戶名
      req.session.userID = userInfoResult[0].user_id;
      res.render("home", { username: req.session.username });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).send("Error fetching user info");
  }
};

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  setupAuthorizationUrl,
  parseCallBackUrlParams,
  reqUserProfileInfo,
};
