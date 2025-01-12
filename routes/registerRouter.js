//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const registerController = require("../controllers/registerController.js");
const handleEndPointFormReq = require("../middleware/rate-limiter-flexible/handleEndPointReq.js");
const {
  createCsrfTokenAndKey,
  authenticateCsrfTokenAndKey,
} = require("../middleware/prevent-csrf-attack/csrf.js");
//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/", createCsrfTokenAndKey, registerController.getRegisterWebPage);
router.post(
  "/",
  handleEndPointFormReq,
  authenticateCsrfTokenAndKey,
  registerController.createNewUser
);

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
