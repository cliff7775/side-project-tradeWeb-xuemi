//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const lineAuthenticateController = require("../controllers/lineAuthenticateController.js");
//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/login", lineAuthenticateController.setupAuthorizationUrl);
router.get(
  "/returnAuthorizationCode",
  lineAuthenticateController.parseCallBackUrlParams
);
router.get(
  "/reqUserInfoFromLineAPI",
  lineAuthenticateController.reqUserProfileInfo
);

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
