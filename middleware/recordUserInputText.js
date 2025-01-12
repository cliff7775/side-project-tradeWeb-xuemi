//【引用模組功能】
//------------------------------------------------------------------------------>
const fs = require("fs"); //引用 檔案系統模組
const path = require("path"); //引用 路徑模組

//【引用外部設定檔、創建變數值】
//------------------------------------------------------------------------------>
const currentTimeStamp = require("../function/specificFunction/timeStamp.js");

function recordUserInputText(req, res, next) {
  const enterTimeStamp = currentTimeStamp();
  const queryValue = `查詢時間戳 : ${enterTimeStamp} , 【用戶查詢值 : ${req.query.searchValue}】\n`;
  const fileName = "userInputText.txt";
  const userInputLogPath = path.join(
    __dirname,
    "../log/userInputlog",
    fileName
  );
  fs.appendFile(userInputLogPath, queryValue, (error) => {
    if (error) {
      console.log("進站輸寫錯誤 :", error);
    }
  });

  next();
}

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = recordUserInputText;
