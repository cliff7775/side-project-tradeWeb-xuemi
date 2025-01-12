//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const contactController = require("../controllers/contactController.js");
//【請求方法處理】
//------------------------------------------------------------------------------>

router.post("/sendUserMessage", contactController.sendUserMessage);
router.post(
  "/sendUserMessageWithFile",
  contactController.sendUserMessageWithFile
);

router.post("/sendUpdateUserPassWord", contactController.updateUserPassWord);

router.get("/updateUserPassWord", contactController.getUpdatePassWordWebPage);
router.get("/", contactController.getContactWebPage);
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
