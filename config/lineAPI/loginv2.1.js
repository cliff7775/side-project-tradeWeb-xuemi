//【設置 Line Providers Admin用戶端 Basic information】
//------------------------------------------------------------------------------>
const lionCallBackUrl =
  "https://cliffweb.zeabur.app/linev2.1/returnAuthorizationCode";
const channelID = "請填值";
const channelSecret = "請填值";
const authorizationUrl = `https://access.line.me/oauth2/v2.1/authorize`;
const authorizationCodeUrl = `https://api.line.me/oauth2/v2.1/token`;
const verifyIdTokenUrl = "https://api.line.me/oauth2/v2.1/verify";

//【參數暴露】
//------------------------------------------------------------------------------>
module.exports = {
  lionCallBackUrl,
  channelID,
  channelSecret,
  authorizationUrl,
  authorizationCodeUrl,
  verifyIdTokenUrl,
};
