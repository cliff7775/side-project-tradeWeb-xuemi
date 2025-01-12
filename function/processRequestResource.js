//【引用外部設定檔、創建變數值】
//------------------------------------------------------------------------------>
const { RateLimiterUnion } = require("rate-limiter-flexible");
const setTimerForRecordReq = require("./setTimerForRecordReq.js"); // 紀錄請求數據至數據庫和文本檔案
const currentTimeStamp = require("./specificFunction/timeStamp.js"); // 呼叫返回本地時間字串值
let collectReqResourceTotalNum = 0; // 紀錄網站資源請求總數
let recordSingleReqResourceUrlPath = []; // 紀錄和判斷網站資源路徑名單
let recordAllReqResourceUrlPath = []; // 紀錄網站資源的請求資源路徑和請求數名單
let timerStatus = { toStart: null }; // 初始定時器狀態，當請求進來攜帶"notifyRequest"值，更新屬性toStart值
//------------------------------------------------------------------------------>
function recordRequestResource(worker, message) {
  if (message.channel) return; //worker程序的限制器運作時，會發送訊息(message)回 master程序，為避免影響函式運作，這行設置一個條件

  // 建立處理和紀錄請求資源函式
  //worker, message參數設定順序必須正確
  const reqUrlPath = message.originalUrl; // 取得物件中資源路徑字串值，賦值給 reqUrlPath 變數
  const reqCmdInfo = message.cmd; // 取得物件中cmd字串值，賦值給 reqCmdInfo 變數

  if (reqCmdInfo === "notifyRequest") collectReqResourceTotalNum += 1; //，判斷是否吻合"notifyRequest"，若true則collectReqResourceTotalNum + 1
  let getResourceUrlPathJudgeIndex =
    recordSingleReqResourceUrlPath.indexOf(reqUrlPath); // 判斷網站資源路徑名單，reqUrlPath變數值是否已存在，並透過回傳值判斷後面流程
  if (getResourceUrlPathJudgeIndex === -1) {
    // 如果判斷不存在，得到-1數值的值，進入此條件判斷的程式區塊
    recordSingleReqResourceUrlPath.push(reqUrlPath); // ➊把資源路徑字串值，加入到紀錄和判斷網站資源路徑名單中
    let recordReqResourceUrlPathInfo = {}; // ➋創建紀錄請求資源網址路徑資訊物件
    recordReqResourceUrlPathInfo.reqUrlPath = reqUrlPath; // ➌物件加入網址路徑屬性，並賦值資源路徑字串值
    recordReqResourceUrlPathInfo.reqUrlPathNum = 1; // ➍物件加入紀錄請求數屬性，並賦值數字1的值
    recordAllReqResourceUrlPath.push(recordReqResourceUrlPathInfo); // ➎把物件放入到 "紀錄網站資源的請求資源路徑和請求數名單"
  } else {
    // 如果判斷存在，得到非-1數值的值，進入此條件判斷的程式區塊
    for (let i = 0; i < recordAllReqResourceUrlPath.length; i++) {
      // for迴圈尋找名單中物件，有符合的資源路徑字串值，當條件判斷運算式返回true，進入此條件判斷的程式區塊，賦值數字1的值到吻合物件屬性
      const getRecordReqResourceUrlPathInfo = recordAllReqResourceUrlPath[i];
      if (getRecordReqResourceUrlPathInfo.reqUrlPath === reqUrlPath) {
        getRecordReqResourceUrlPathInfo.reqUrlPathNum += 1;
        break;
      }
    }
  }
  // console.log("目前請求數 :", collectReqResourceTotalNum);
  // console.log("請求網址路徑名單 :", recordSingleReqResourceUrlPath);
  // console.log("請求網址資訊 :", recordAllReqResourceUrlPath);
  if (!timerStatus.toStart) {
    // 此條件判斷式只在第一次請求進入，啟動第一個定時器(每 1s 執行一次)
    timerStatus.toStart = reqCmdInfo; // 更新屬性值，搭配反轉條件，避免定時器被多次啟動
    const timerForCalibration = setInterval(() => {
      //第一個定時器啟動，目的是校準時間，讓第二個定時器規律紀錄數據，並賦值定時器 id給變數 timer
      const time = new Date();
      const miunte = time.getMinutes();
      const second = time.getSeconds();
      //console.log(miunte, second);
      if (miunte === 0 && second === 0) {
        console.log("通過條件判斷值", miunte, second);
        // 校準到需要時間的啟動第二個定時器
        const stampCurrenttime = currentTimeStamp(); // 呼叫本地時間值並賦值
        const timerForRegularSendData = setInterval(() => {
          // 第二個定時器啟動 (每 3600000s = 1hr 執行一次)
          const stampCurrenttime = currentTimeStamp(); // 呼叫本地時間值並賦值
          setTimerForRecordReq(
            //傳入請求數據和本地時間等參數到函式
            collectReqResourceTotalNum,
            recordAllReqResourceUrlPath,
            stampCurrenttime
          );
          deleteRecordDataWithReq(); // 銷毀記錄請求數據的變數值
        }, 3600000);

        setTimerForRecordReq(
          //傳入請求數據和本地時間等參數到函式
          collectReqResourceTotalNum,
          recordAllReqResourceUrlPath,
          stampCurrenttime
        );
        deleteRecordDataWithReq(); // 銷毀記錄請求數據的變數值

        clearInterval(timerForCalibration); // 第一個定時器的傳入參數函式執行到這行，銷毀第一個定時器，因為完成校準時間
      }
    }, 1000);
  }
}

function deleteRecordDataWithReq() {
  collectReqResourceTotalNum = 0;
  recordSingleReqResourceUrlPath.length = 0;
  recordAllReqResourceUrlPath.length = 0;
}
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = recordRequestResource;
