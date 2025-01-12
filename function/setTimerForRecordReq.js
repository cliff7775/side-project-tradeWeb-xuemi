//【引用模組功能】
//------------------------------------------------------------------------------>
const path = require("path"); //引用 路徑模組
const fs = require("fs"); //引用 檔案系統模組

function setTimerForRecordReq(totalNumOfReq, totalDataOfReqResource, time) {
  // 3個傳入參數，分別是 請求數、請求數據陣列、本地時間
  console.log("3600000 seconds passed...");
  const reqRecordNum = totalNumOfReq;
  const reqDataList = totalDataOfReqResource;
  const stampCurrenttime = time;

  const fileName = "recordWebReqResource.txt"; // 請求紀錄檔案名稱
  const webReqResourceLogFilePath = path.join(
    __dirname,
    "../log/requestResourcelog/",
    fileName
  ); // 賦值完整檔案路徑字串
  const writeStreamOfReqResource = fs.createWriteStream(
    //採用stream寫入方法，避免一次寫入過多檔案，造成記憶體負擔
    webReqResourceLogFilePath, // 傳入完整檔案路徑字串
    { flags: "a" } // 傳入該參數，檔案寫入方式為追加模式
  );
  let reqResourceRecordList = ""; // 初始化空字串，儲存後續搭配樣板字面值的請求數據
  for (const valueOfReqResource of reqDataList) {
    // 遍歷請求數據陣列，依序處理每個物件數據，最後一併存入reqResourceRecordList變數
    const reqUrlPath = valueOfReqResource.reqUrlPath;
    const reqUrlPathNum = valueOfReqResource.reqUrlPathNum;
    const prepareInputInfo = `網址請求路徑 : ${reqUrlPath} , 網址請求數 : ${reqUrlPathNum}\n`;
    reqResourceRecordList += prepareInputInfo;
  }
  const finalInputInfo = `═════════════════【下列時間區間請求塊: ${stampCurrenttime}; 資源請求數: ${reqRecordNum}】═════════════════\n${reqResourceRecordList}`; //
  writeStreamOfReqResource.write(finalInputInfo, (err) => {
    if (err) {
      console.log("進站輸寫錯誤 :", err);
    }
  });
}
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = setTimerForRecordReq;
