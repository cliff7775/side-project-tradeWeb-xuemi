//【引用模組功能】
//------------------------------------------------------------------------------>
const { create } = require("express-handlebars"); //引用 視圖模板模組

const hbs = create({
  // Specify helpers which are only registered on this instance.
  helpers: {
    exchangeEcpayText: (str) => {
      if (str === "Credit_CreditCard") {
        return "信用卡";
      } else {
        return "未知";
      }
    },
    eqUserGender: (a, b) => a === b,
    validUserGender: (a) => {
      if (a === "未選擇") {
        return false;
      } else {
        return true;
      }
    },
    validBirthday: (a) => {
      if (a) {
        return true;
      }
    },
  },
});

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = hbs;
