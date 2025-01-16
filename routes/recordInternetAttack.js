//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();
//【引用外部設定檔、創建變數值】
//------------------------------------------------------------------------------>
const currentTimeStamp = require("../function/specificFunction/timeStamp.js");

//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/", (req, res) => {
  const attackTimeStamp = currentTimeStamp();
  const attackMessage = req.body;
  console.log(`攻擊時間戳: ${attackTimeStamp} , 攻擊訊息: ${attackMessage}`);
});

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
