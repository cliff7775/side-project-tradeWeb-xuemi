//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express");
const router = express.Router();

//【請求方法處理】
//------------------------------------------------------------------------------>
router.get("/", (req, res) => {
  const username = req.session.username || "會員";
  res.render("privacyPolicy", {
    username: username,
    nonce: res.locals.cspNonce,
  });
});

//【函式暴露出去】
//------------------------------------------------------------------------------>
module.exports = router;
