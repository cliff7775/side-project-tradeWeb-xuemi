//【請求方法處理】
//------------------------------------------------------------------------------>
function noFoundHandler(req, res) {
  const username = req.session.username || "會員";

  res
    .status(404)
    .render("noFound", { username: username, nonce: res.locals.cspNonce });
}

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = noFoundHandler;
