//【引用外部設定檔模組功能】
//------------------------------------------------------------------->
const trustedWebUrls = require("../friendlyWebSite/trustedWebUrls.js");
//------------------------------------------------------------------->
function handleRedirect(req, res, next) {
  //檢查是否提供重定向目標
  const redirectUrlValue = req.query.redirectUrl;

  //檢查請求轉址屬性是否帶值，開始區分後續處理流程

  //next() 方法只能轉移函式控制權到下一個函式，但無法中斷當下函式程式執行，所以搭配if()控制流程避免後續執行
  if (!redirectUrlValue) {
    next(); // 檢查變數是空值(null)，則讓請求離開此中間件
  } else {
    // 檢查變數有帶值，開始檢查重定向目標是否在白名單中
    if (!trustedWebUrls.includes(redirectUrlValue)) {
      // //.includes() 方法會返回一個布林值，指示目標字串或陣列是否包含指定的值
      res.status(400).send("Unauthorized redirectUrl");
    } else {
      // 如果驗證通過，執行轉址並設定
      res.status(302).redirect(redirectUrlValue);
    }
  }
}

module.exports = handleRedirect;
