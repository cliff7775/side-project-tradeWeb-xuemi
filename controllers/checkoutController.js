//【引用模組功能】
//------------------------------------------------------------------------------>
const ecpay_payment = require("ecpay_aio_nodejs"); // 綠界提供的 SDK
const { createClient } = require("redis"); //引用 redis模組
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const redisDbConfig = require("../config/redis/redisDb.js");
const { HASHKEY, HASHIV, MERCHANTID, HOST } = require("../config/ecpayKey.js");
const {
  getFormattedDate,
  generateUnix,
} = require("../function/ecpayFunction/ecpay.js");
const productModel = require("../models/productModel.js");
const productModelinstance = new productModel();
//【設定參數並實例化】
//------------------------------------------------------------------------------>
const options = {
  OperationMode: "Test",
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV,
  },
  IgnorePayment: [],
  IsProjectContractor: false,
};

const create = new ecpay_payment(options);
let redisClient;
async function createRedisClient() {
  const client = await createClient(redisDbConfig)
    .on("error", (err) => console.log("Redis 客戶端 發生錯誤", err))
    .on("connect", () => {
      console.log("checkoutRedisClient 客戶端已連接");
    })
    .connect();
  return client;
}

// 頂層域初始化
(async () => {
  redisClient = await createRedisClient(); // 將 redisClient 儲存在頂層變數
})();
//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const getCheckoutWebPage = async (req, res) => {
  const { userID, username, userRole } = req.session;
  const regex = /spitem\d{3}/;
  const userOrder = req.query.cart;
  const userOrderList = userOrder.split(`,`);
  const matchedUserOrderList = userOrderList.filter((item) => regex.test(item));
  if (matchedUserOrderList.length === 0) {
    return;
  }
  console.log("篩選前", userOrderList);
  console.log("篩選後", matchedUserOrderList);
  if (matchedUserOrderList.length !== userOrderList.length) return;

  const orderGrouped = matchedUserOrderList.reduce((acc, item) => {
    if (!acc[item]) acc[item] = [];
    acc[item].push(item);
    return acc;
  }, {});

  console.log("grouped", orderGrouped);
  const productIdList = Object.keys(orderGrouped);
  console.log("getProductID", productIdList, productIdList.length);
  const finishCertificationProduct =
    await productModelinstance.getProductInCart(productIdList);
  console.log("finishCertificationProduct", finishCertificationProduct);

  let totalOrderPrice = null;
  let productDescList = ""; //null + 字串值得話 null變成字串一部分
  let totalOrderItemNum = 0;
  let productDescAttachments = "";
  for (const item of finishCertificationProduct) {
    const orderNum = orderGrouped[item.product_id].length;
    totalOrderItemNum += orderNum;
    const orderPrice = item.product_price * orderNum;
    totalOrderPrice += orderPrice;
    productDescList += `項目${item.product_name}*${orderNum}=總費用${orderPrice}元#`;
    productDescAttachments += `itemKey=${item.product_id}/itemNum=${orderNum}/itemPrice=${orderPrice}&`;

    console.log(
      `商品ID${item.product_id} 商品${item.product_name} 商品數${orderNum} 費用${item.product_price} 總費用${orderPrice}`
    );
  }

  //參數
  const base_param = {
    MerchantTradeNo: generateUnix(),
    MerchantTradeDate: getFormattedDate(),
    TotalAmount: String(totalOrderPrice),
    TradeDesc: "測試交易描述",
    ItemName: productDescList,
    ReturnURL: `${HOST}/checkout/ecpayInfoReturn`,
    ClientBackURL: `${HOST}/?username=${username}`,
    PaymentType: "aio",
    ChoosePayment: "Credit",
    EncryptType: 1,
    CustomField1: String(userID),
    CustomField2: String(totalOrderItemNum),
  };

  const htmlString = create.payment_client.aio_check_out_all(base_param);
  res.send(htmlString);
  console.log("儲存到redis", userID, productDescAttachments);
  await redisClient.set(userID, productDescAttachments, { EX: 86400 });
};

const getInfoFromEcpay = async (req, res) => {
  console.log("接收綠界回傳的資料 :", req.body);
  const {
    MerchantTradeNo,
    PaymentDate,
    PaymentType,
    TradeDate,
    TradeAmt,
    CustomField1,
    CustomField2,
  } = req.body;

  // 從請求主體中解構並提取 CheckMacValue 及其他資料
  const { CheckMacValue, ...data } = req.body;
  const { RtnCode, RtnMsg } = data;

  try {
    // 檢查交易是否成功
    if (RtnCode !== "1") {
      console.error(`交易失敗，代碼: ${RtnCode}，訊息: ${RtnMsg}`);
      res.sendStatus(500); // 回傳 500 狀態碼
      return;
    }

    // 生成檢查碼來驗證交易資料的正確性
    const checkValue = create.payment_client.helper.gen_chk_mac_value(data);
    // 驗證 CheckMacValue 是否正確
    const isValid = CheckMacValue === checkValue;
    console.log("確認交易正確性：", isValid);

    if (!isValid) {
      console.error("CheckMacValue 驗證失敗。");
      res.sendStatus(400); // 回傳 400 狀態碼表示錯誤請求
      return;
    }

    // 如果交易有效，回傳 '1|OK' 給綠界
    res.send("1|OK");
    const userOrderItemList = await redisClient.get(CustomField1);
    console.log("userOrderItemList", userOrderItemList);
    const bundleUserInfo = {
      merchantTradeNo: MerchantTradeNo, //訂單編號
      paymentDate: PaymentDate, //訂單付款時間
      paymentType: PaymentType, //訂單付款種類
      tradeDate: TradeDate, //訂單成立時間
      tradeAmt: TradeAmt, //訂單合計
      userID: CustomField1, //訂單USER
      totalItemNum: CustomField2, //訂單商品總數
      tradeItemList: userOrderItemList, //訂單詳細資訊
    };
    console.log("bundleUserInfo ", bundleUserInfo);
    redisClient.del(CustomField1, (err, response) => {
      if (err) {
        console.error("錯誤:", err);
      }
    });
    const ResultSetHeader = await productModelinstance.storeUserOrders(
      bundleUserInfo
    );
  } catch (error) {
    console.error("處理綠界回傳資料時發生錯誤:", error);
    return res.sendStatus(500); // 發生錯誤時回傳 500 狀態碼
  }
};

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  getCheckoutWebPage,
  getInfoFromEcpay,
};
