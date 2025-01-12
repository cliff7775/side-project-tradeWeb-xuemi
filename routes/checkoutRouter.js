//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const checkoutController = require("../controllers/checkoutController.js");
const verifyUserPermissions = require("../middleware/verifyUserPermissions.js");
//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/", verifyUserPermissions, checkoutController.getCheckoutWebPage);
router.post("/ecpayInfoReturn", checkoutController.getInfoFromEcpay);
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
