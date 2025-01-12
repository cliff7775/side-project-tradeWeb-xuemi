//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const getIndexHtml = (req, res) => {
  if (req.query.username) {
    const username = req.query.username;
    res.render("home", { username: username });
    return;
  }
  const username = req.session.username || "會員";
  res.render("home", { username: username });
};
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  getIndexHtml,
};
