//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const adminController = require("../controllers/adminController.js");
const verifyUserPermissions = require("../middleware/verifyUserPermissions.js");
//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/", verifyUserPermissions, adminController.getAdminWebPage);

router.get(
  "/query_userOrders",
  verifyUserPermissions,
  adminController.viewAllMemberOrders
);

router.get(
  "/reset_pwd",
  verifyUserPermissions,
  adminController.getMemberPwdWebPage
);

router.post(
  "/reset_pwd",
  verifyUserPermissions,
  adminController.modifyMemberPassword
);

router.post(
  "/accordneed_rankuserOrders",
  verifyUserPermissions,
  adminController.rankUserOrdersByNeed
);

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
