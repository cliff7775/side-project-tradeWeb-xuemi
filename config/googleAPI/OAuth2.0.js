//【設置 OAuth 2.0 用戶端 ID 和密鑰】
//------------------------------------------------------------------------------>
const CLIENT_ID = "請填值";
const CLIENT_SECRET = "請填值";
const REDIRECT_URI = "請填值";

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

//【參數暴露】
//------------------------------------------------------------------------------>
module.exports = {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  SCOPES,
};
