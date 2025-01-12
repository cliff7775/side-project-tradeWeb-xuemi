//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const path = require("path"); //引用 路徑模組
const router = express.Router();

//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/", (req, res) => {
  const fileName = "robots.txt";
  const filePath = path.join(__dirname, "../", fileName);
  res.sendFile(filePath);
});

//【函式暴露出去】
//------------------------------------------------------------------------------>
module.exports = router;
