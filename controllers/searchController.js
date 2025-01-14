//【引用模組功能】
//------------------------------------------------------------------------------>

//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const searchModel = require("../models/searchModel.js");
const searchModelinstance = new searchModel();
//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const queryUserInputTextToDb = async (req, res) => {
  const username = req.session.username || "會員";
  const commonText = "查詢字 :";
  const { priceRange, priceSorting, searchValue } = req.query;
  console.log(priceRange, priceSorting, searchValue);
  const queryInfoResult = await searchModelinstance.queryUserInput(searchValue);

  const numberofQueryLists = queryInfoResult.length;
  if (!numberofQueryLists) {
    const feedbackText = `此頁顯示9件 / 共${numberofQueryLists}件商品`;
    res.render("categoryProducts", {
      username: username,
      commonText: commonText,
      identifyText: searchValue,
      feedbackText: feedbackText,
      nonce: res.locals.cspNonce,
    });
    return;
  }

  if (priceRange && priceSorting) {
    const bundleQueryInfo = {
      searchText: searchValue,
      priceRange: priceRange,
      priceSorting: priceSorting,
    };
    const productInfoResult = await searchModelinstance.sortByPricesAndNeeds(
      bundleQueryInfo
    );
    const numberofProductLists = productInfoResult.length;
    const feedbackText = `此頁顯示9件 / 共${numberofProductLists}件商品`;
    res.render("categoryProducts", {
      username: username,
      commonText: commonText,
      identifyText: searchValue,
      feedbackText: feedbackText,
      productInfoResult: productInfoResult,
      nonce: res.locals.cspNonce,
    });
  } else if (priceRange) {
    const bundleQueryInfo = {
      searchText: searchValue,
      priceRange: priceRange,
    };
    const productInfoResult = await searchModelinstance.sortByPrices(
      bundleQueryInfo
    );
    const numberofProductLists = productInfoResult.length;
    const feedbackText = `此頁顯示9件 / 共${numberofProductLists}件商品`;
    res.render("categoryProducts", {
      username: username,
      commonText: commonText,
      identifyText: searchValue,
      feedbackText: feedbackText,
      productInfoResult: productInfoResult,
      nonce: res.locals.cspNonce,
    });
  } else if (priceSorting) {
    const bundleQueryInfo = {
      searchText: searchValue,
      priceSorting: priceSorting,
    };
    const productInfoResult = await searchModelinstance.sortByNeeds(
      bundleQueryInfo
    );
    const numberofProductLists = productInfoResult.length;
    const feedbackText = `此頁顯示9件 / 共${numberofProductLists}件商品`;
    res.render("categoryProducts", {
      username: username,
      commonText: commonText,
      identifyText: searchValue,
      feedbackText: feedbackText,
      productInfoResult: productInfoResult,
      nonce: res.locals.cspNonce,
    });
  } else {
    const feedbackText = `此頁顯示9件 / 共${numberofQueryLists}件商品`;
    res.render("categoryProducts", {
      username: username,
      commonText: commonText,
      identifyText: searchValue,
      feedbackText: feedbackText,
      productInfoResult: queryInfoResult,
      nonce: res.locals.cspNonce,
    });
  }
};

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  queryUserInputTextToDb,
};
