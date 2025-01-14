function verifyUserPermissions(req, res, next) {
  if (!req.session.userRole) {
    const username = "會員";
    const text = "請重先登入，再繼續操作";
    res.render("redirectUrl", {
      username: username,
      message: text,
      count: 5,
      nonce: res.locals.cspNonce,
    });
    return;
  }
  next();
}

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = verifyUserPermissions;
