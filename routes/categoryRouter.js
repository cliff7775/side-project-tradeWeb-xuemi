//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const categoryController = require("../controllers/categoryController.js");
//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/goods_list", categoryController.getSpecificCategoryWebPage);

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = router;
