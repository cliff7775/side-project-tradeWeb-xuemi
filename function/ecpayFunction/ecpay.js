//【引用模組功能】
//------------------------------------------------------------------------------>

function getFormattedDate() {
  const merchantTradeTimeStamp = new Date().toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return merchantTradeTimeStamp;
}

function generateUnix() {
  let orderTimeStamp = "CliffWB" + new Date().getTime();

  return orderTimeStamp;
}

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  getFormattedDate,
  generateUnix,
};
