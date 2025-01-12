function createCurrentTimeStmap() {
  const time = new Date().toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return time;
}

function createPastTimeStmap(tradeChoseDate) {
  let value = "";
  switch (tradeChoseDate) {
    case "Past1week":
      value += 7;
      break;
    case "Past3week":
      value += 21;
      break;
    case "Past1month":
      value += 30;
  }
  const date = new Date();
  date.setDate(date.getDate() - value);
  const formattedDate = date.toLocaleString("zh-tw", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return formattedDate;
}

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  createPastTimeStmap,
  createCurrentTimeStmap,
};
