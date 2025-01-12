//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const memberController = require("../controllers/memberController.js");
const verifyUserPermissions = require("../middleware/verifyUserPermissions.js");
//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/", verifyUserPermissions, memberController.getMemberWebPage);

router.get(
  "/history_order",
  verifyUserPermissions,
  memberController.viewMemberOrders
);

router.get(
  "/reset_pwd",
  verifyUserPermissions,
  memberController.getMemberPwdWebPage
);

router.post(
  "/accessOrderWithDetailedInfo",
  verifyUserPermissions,
  memberController.accessOrderWithDetailedInfo
);

router.post(
  "/updateMemberInfo",
  verifyUserPermissions,
  memberController.updateMemberInfo
);

router.post(
  "/reset_pwd",
  verifyUserPermissions,
  memberController.modifyMemberPassword
);

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
