//【引用模組功能】
//------------------------------------------------------------------------------>
const bcrypt = require("bcrypt"); // 用於 bcrypt 加密
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const {
  sha512Hash,
  bcryptHash,
} = require("../function/specificFunction/hashPassword.js");
const productModel = require("../models/productModel.js");
const adminOrdersModel = require("../models/adminOrdersModel.js");
const loginModel = require("../models/loginModel.js");
const loginModelinstance = new loginModel();
const productModelinstance = new productModel();
const adminOrdersModelinstance = new adminOrdersModel();
//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const getAdminWebPage = async (req, res) => {
  const categoryID = req.query.categoryID || "A1000";
  const { userID, username, userRole } = req.session;
  const userInfoResult = await loginModelinstance.accessUserInfo(userID);
  const allTradesStateResult =
    await adminOrdersModelinstance.queryAllTradesStateRate(); //查詢後台訂單狀態
  const allUserNumResult =
    await adminOrdersModelinstance.queryRegisterUserNum(); //查詢後台註冊用戶數
  const allTradePriceResult =
    await adminOrdersModelinstance.queryCalculateTotalTeadePrice(); //查詢商品總銷售額

  const topSaleProductRankResult =
    await adminOrdersModelinstance.queryTopSaleProductNum(); //查詢熱門商品銷售數
  const categorySaleProductRankResult =
    await adminOrdersModelinstance.queryEachCategorySaleNum(); //查詢類別商品總銷售數
  const heightCalculatePriceUsersResult =
    await adminOrdersModelinstance.queryHeightCalculatePriceUsers(); //訂單金額累積前面用戶
  const topSaleCategoryProductRankResult =
    await adminOrdersModelinstance.queryTopCategorySaleProductNum(categoryID); //查詢前5名類別熱門商品
  const { user_name } = userInfoResult[0];
  res.render("adminIndex", {
    username: user_name,
    allTradesStateResult,
    allUserNumResult,
    allTradePriceResult,
    topSaleProductRankResult,
    categorySaleProductRankResult,
    heightCalculatePriceUsersResult,
    topSaleCategoryProductRankResult,
    categoryValue: categoryID,
  });
};

const viewAllMemberOrders = async (req, res) => {
  const { userID, username, userRole } = req.session;
  const allOrdersInfoResult =
    await productModelinstance.accessAllUserOrdersInfo();
  res.render("adminOrders", { username: username, allOrdersInfoResult });
};

const getMemberPwdWebPage = (req, res) => {
  const { userID, username, userRole } = req.session;
  res.render("adminUpdatePW", { username: username });
};

const modifyMemberPassword = async (req, res) => {
  const { userID } = req.session;
  const { oldPwd, newPwd, newPwdAgain } = req.body;
  if (!oldPwd) return;
  if (newPwd !== newPwdAgain) return;
  const shaPassword = sha512Hash(oldPwd); //加密用戶密碼
  const userInfoResult = await loginModelinstance.accessUserInfo(userID);
  const result = await bcrypt.compare(
    shaPassword,
    userInfoResult[0].user_password
  );

  if (!result) {
    //輸入舊密碼有誤
    return;
  }
  const newPwdShaPassword = sha512Hash(newPwd); //加密用戶密碼
  const bcrypthashPassword = await bcryptHash(newPwdShaPassword);
  const bundleUserInfo = {
    userID: userInfoResult[0].user_id,
    userpassword: bcrypthashPassword,
  };
  const ResultSetHeader = await loginModelinstance.updateUserPwd(
    bundleUserInfo
  );
  if (ResultSetHeader.serverStatus === 2) {
    res.send("密碼更新成功");
  }
};

const rankUserOrdersByNeed = async (req, res) => {
  const { userID, username, userRole } = req.session;
  const {
    tradeNum,
    tradeUpdateState,
    tradeStateSort,
    tradeDateSort,
    tradeChoseDate,
    merchantradeValue,
  } = req.body;

  if (tradeNum && tradeUpdateState) {
    const ResultSetHeader =
      await adminOrdersModelinstance.updateSpecificTradeState(
        tradeNum,
        tradeUpdateState
      );
    if (ResultSetHeader.serverStatus === 2) {
      const allOrdersInfoResult =
        await productModelinstance.accessAllUserOrdersInfo();

      res.render("adminOrders", { username: username, allOrdersInfoResult });
    }
  } else if (merchantradeValue) {
    const orderDetailedInfoResult =
      await adminOrdersModelinstance.accessSpecificTradeDetailedInfo(
        merchantradeValue
      );
    const orderDetailedInfoResultjsonForm = JSON.stringify(
      orderDetailedInfoResult
    );
    res.json(orderDetailedInfoResultjsonForm); //用 fetch()
    return;
  } else if (tradeStateSort) {
    const allOrdersInfoResult =
      await adminOrdersModelinstance.accessAllTradesByState(tradeStateSort);

    res.render("adminOrders", { username: username, allOrdersInfoResult });
    return;
  } else if (tradeDateSort) {
    const allOrdersInfoResult =
      await adminOrdersModelinstance.accessAllTradesByDate(tradeDateSort);

    res.render("adminOrders", { username: username, allOrdersInfoResult });
    return;
  } else if (tradeChoseDate) {
    const allOrdersInfoResult =
      await adminOrdersModelinstance.accessTradesBySpecificTime(tradeChoseDate);

    res.render("adminOrders", { username: username, allOrdersInfoResult });
    return;
  }
};
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  getAdminWebPage,
  viewAllMemberOrders,
  getMemberPwdWebPage,
  modifyMemberPassword,
  rankUserOrdersByNeed,
};
