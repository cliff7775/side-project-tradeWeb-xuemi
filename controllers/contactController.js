//【引用模組功能】
//------------------------------------------------------------------------------>
const nodemailer = require("nodemailer"); // 引用 nodemailer 寄送模組
const crypto = require("crypto"); // 引用 加密模組
const fs = require("fs"); //引用 檔案系統模組
const path = require("path"); //引用 路徑模組
const cluster = require("cluster"); //引用 叢集模組
const { Buffer } = require("buffer");
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const {
  sha512Hash,
  bcryptHash,
} = require("../function/specificFunction/hashPassword.js");
const {
  commonMessageFormat,
  messageWithFileFormat,
  messageWithPassWordFormat,
} = require("../config/googleAPI/mailformat.js");
const contactModel = require("../models/contactModel.js");
const contactModelinstance = new contactModel();
let data = "";
let binaryData = "";
//【設定參數並實例化】
//------------------------------------------------------------------------------>
const worker = cluster.worker;
let googleMailer;
async function setupGmailEngine() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sideprojecttradeweb@gmail.com",
      pass: "tdccyztffzdhfbwi",
    },
  });
  await transporter.verify();
  return transporter;
}
(async function start() {
  googleMailer = await setupGmailEngine();
  console.log("Google 寄信功能建立完成");
})();
let chunks = [];
//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const getContactWebPage = (req, res) => {
  const username = req.session.username || "會員";
  res.render("contactUs", { username: username, nonce: res.locals.cspNonce });
};

const sendUserMessageWithFile = (req, res) => {
  const { usermail } = req.body;
  const userInfoBox = req.body;
  const fileName = decodeURIComponent(req.headers["file-name"]);
  userInfoBox.fileName = fileName;

  const filepath = path.join(__dirname, "../fileStore", fileName);
  req.on("data", (chunk) => {
    //專讀取二進置資料
    chunks.push(chunk);
    const buffer = Buffer.concat(chunks); // 將多個buffer拼接成一個新的buffer

    fs.writeFile(filepath, buffer, (err) => {
      if (err) console.error("寫入檔案時發生錯誤:", err);
    });
  });

  if (usermail) {
    const message = messageWithFileFormat(userInfoBox);
    googleMailer.sendMail(message, (err, info) => {
      fs.unlink(filepath, (err) => {
        if (err) throw err;
        console.log("Successfully Deleted");
        chunks = [];
      });
      if (err) console.error(err);
      console.log("Email sent");
    });
  }

  res.send("信件成功寄出");
};

const sendUserMessage = (req, res) => {
  const userInfoBox = req.body;

  const message = commonMessageFormat(userInfoBox);
  googleMailer.sendMail(message, (err, info) => {
    if (err) console.error(err);
    console.log("Email sent");
  });
  res.send("信件成功寄出");
};

const getUpdatePassWordWebPage = (req, res) => {
  const username = req.session.username || "會員";
  res.render("updateUserPassWord", {
    username: username,
    nonce: res.locals.cspNonce,
  });
};

const updateUserPassWord = async (req, res) => {
  const { userEmail } = req.body;
  const userInfoResult = await contactModelinstance.checkUserMail(userEmail); //認證用戶電子郵件
  const numberofUserLists = userInfoResult.length; //取得用戶名單筆數
  if (!numberofUserLists) {
    res.send("用戶不存在");
  }
  const { user_id, user_name, user_email } = userInfoResult[0]; //取得用戶名單內資訊
  const bundleUserInfo = { username: user_name, usermail: user_email }; //建立用戶資訊物件
  const randomPassword = crypto.randomBytes(5).toString("hex"); //產生亂數密碼
  const shaPassword = sha512Hash(randomPassword); //加密用戶密碼
  const bcrypthashPassword = await bcryptHash(shaPassword);
  const ResultSetHeader = await contactModelinstance.updateUserPassWord(
    bcrypthashPassword,
    user_id
  ); //資料庫更新用戶密碼
  if (ResultSetHeader.serverStatus !== 2) {
    //紀錄錯誤發生
  }
  const message = messageWithPassWordFormat(bundleUserInfo, randomPassword); //建立用戶客制信件內容
  googleMailer.sendMail(message, (err, info) => {
    //透過物件發送用戶信件
    if (err) console.error(err);
    console.log("Email sent");
    res.send("請至信箱查看新密碼");
  });
};

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  getContactWebPage,
  sendUserMessage,
  sendUserMessageWithFile,
  getUpdatePassWordWebPage,
  updateUserPassWord,
};
