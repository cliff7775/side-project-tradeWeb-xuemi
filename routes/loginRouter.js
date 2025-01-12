//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const loginController = require("../controllers/loginController.js");
const handleEndPointFormReq = require("../middleware/rate-limiter-flexible/handleEndPointReq.js");
const {
  createCsrfTokenAndKey,
  authenticateCsrfTokenAndKey,
} = require("../middleware/prevent-csrf-attack/csrf.js");
//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/", createCsrfTokenAndKey, loginController.getLoginWebPage);
router.post(
  "/",
  handleEndPointFormReq,
  authenticateCsrfTokenAndKey,
  loginController.authenticateUser
);

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
