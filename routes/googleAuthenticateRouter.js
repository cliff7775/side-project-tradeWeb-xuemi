//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const oauthServerController = require("../controllers/oauthServerController.js");

//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/login", oauthServerController.setupObjectForOauthServer);
router.get(
  "/oauthServerCallback",
  oauthServerController.parseObjectFromOauthServer
);
router.get(
  "/exchangeTokentoUserdata",
  oauthServerController.exchangeTokentoUserdata
);

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
