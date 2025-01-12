//【引用模組功能】
//------------------------------------------------------------------------------>
const path = require("path"); //引用 路徑模組
const fs = require("fs"); //引用 檔案系統模組
//【引用外部設定檔、創建變數值】
//------------------------------------------------------------------------------>
const currentTimeStamp = require("../function/specificFunction/timeStamp.js");
//------------------------------------------------------------------------------>
function handleUserAccess(req, res, next) {
  const { method, url, ip } = req;
  const userIp = ip.split(":")[3]; //剔除req物件的ip屬性值中的雜質
  const enterTimeStamp = currentTimeStamp();
  const userInfo = `進站時間戳 : ${enterTimeStamp}, 【方法: ${method} 登入地址: ${userIp} 進入路徑: ${url}】\n`;
  const fileName = "userAccess.txt"; // 用戶紀錄檔案名稱
  const recordUserAccessLogFilePath = path.join(
    __dirname,
    "../log/useraccesslog",
    fileName
  ); // 賦值完整檔案路徑字串
  fs.appendFile(recordUserAccessLogFilePath, userInfo, (error) => {
    if (error) {
      console.log("進站輸寫錯誤 :", error);
    }
  });
  next();
}
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = handleUserAccess;
