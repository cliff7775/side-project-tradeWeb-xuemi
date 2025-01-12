//【引用模組功能】
//------------------------------------------------------------------------------>
const { google } = require("googleapis"); //引用 第三方google api服務模組
const url = require("url");
const crypto = require("crypto"); // 用於 SHA-512 加密
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const {
  sha512Hash,
  bcryptHash,
} = require("../function/specificFunction/hashPassword.js");
const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  SCOPES,
} = require("../config/googleAPI/OAuth2.0.js");
const loginModel = require("../models/loginModel.js");

//【設定參數並實例化】
//------------------------------------------------------------------------------>
const googleOAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

googleOAuth2Client.on("tokens", (tokens) => {
  console.log("tokens 過期");
});

const loginModelstance = new loginModel();

//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const setupObjectForOauthServer = (req, res) => {
  const state = crypto.randomBytes(32).toString("hex"); // 生成安全的隨機 state 值
  const authUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    include_granted_scopes: true,
    //state: state,
  });

  res.redirect(authUrl);
};

const parseObjectFromOauthServer = async (req, res) => {
  let callBackUrlCheck = url.parse(req.url, true).query; //列出整個拆解後的query物件
  // if (callBackUrlCheck.errpr) {
  //   console.log("Error:" + q.error);
  // } else if (callBackUrlCheck.state !== req.session.state) {
  //   console.log("State mismatch. Possible CSRF attack");
  //   res.end("State mismatch. Possible CSRF attack");
  // } else {
  //   try {
  //     const { tokens } = await googleOAuth2Client.getToken(
  //       callBackUrlCheck.code
  //     );
  //     googleOAuth2Client.setCredentials(tokens);
  //     res.redirect("/googleOauth2.0/exchangeTokentoUserdata");
  //   } catch (err) {
  //     console.error("Error authenticating with Google:", err);
  //     res.status(500).send("Error authenticating with Google");
  //   }
  // }
  try {
    const { tokens } = await googleOAuth2Client.getToken(callBackUrlCheck.code);
    googleOAuth2Client.setCredentials(tokens);
    res.redirect("/googleOauth2.0/exchangeTokentoUserdata");
  } catch (err) {
    console.error("Error authenticating with Google:", err);
    res.status(500).send("Error authenticating with Google");
  }
};

const exchangeTokentoUserdata = async (req, res) => {
  try {
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleOAuth2Client.credentials.access_token}`,
        },
      }
    );
    const userInfoFromGoogle = await userInfoResponse.json();
    const { name, email, sub } = userInfoFromGoogle; //取得GOOGLE回傳用戶資料，並拆解賦值給變數，下行榜定成物件資料
    const shaPassword = sha512Hash(sub); //加密用戶密碼
    const bcrypthashPassword = await bcryptHash(shaPassword);
    const bundleUserInfo = {
      username: name,
      usermail: email,
      userpassword: bcrypthashPassword,
    };
    const userInfoResult = await loginModelstance.validThirdPartyUserInfo(
      email
    ); //先認證用戶是否已存在(認證電子信箱)
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
        req.session.username = name; //GOOGLE回傳用戶名
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
      req.session.username = name; //GOOGLE回傳用戶名
      req.session.userID = userInfo.user_id;
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
  setupObjectForOauthServer,
  parseObjectFromOauthServer,
  exchangeTokentoUserdata,
};
