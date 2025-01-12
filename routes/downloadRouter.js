//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express"); //引用 Middleware 中間件軟體
const path = require("path"); //引用 路徑模組
const router = express.Router();
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>

//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/access_record_userinputtextlog", (req, res) => {
  const fileName = "userInputText.txt";
  const fileComPath = path.join(__dirname, "../log/userInputlog", fileName);
  res.download(fileComPath);
});

router.get("/access_record_webresourcelog", (req, res) => {
  const fileName = "recordWebReqResource.txt";
  const fileComPath = path.join(
    __dirname,
    "../log/requestResourcelog",
    fileName
  );
  res.download(fileComPath);
});

router.get("/access_record_userentryweblog", (req, res) => {
  const fileName = "userAccess.txt";
  const fileComPath = path.join(__dirname, "../log/useraccesslog", fileName);
  res.download(fileComPath);
});

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
