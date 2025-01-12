//【請求方法處理】
//------------------------------------------------------------------------------>
function errorHandler(err, req, res) {
  res.status(500).send("程式錯誤");
  console.error(err.stack);
}

//【函式暴露出去】
//------------------------------------------------------------------------------>
module.exports = errorHandler;
