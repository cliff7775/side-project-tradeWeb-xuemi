//【引用模組功能】
//------------------------------------------------------------------------------>

//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const productModel = require("../models/productModel.js");
const productModelinstance = new productModel();
//【請求方法-函式處理區】
//------------------------------------------------------------------------------>
const getSpecificCategoryWebPage = async (req, res) => {
  const username = req.session.username || "會員";
  const commonText = "商品類別 :";
  const { cid, priceRange, priceSorting } = req.query;
  const categoryId = cid;
  if (categoryId && priceRange && priceSorting) {
    const bundleQueryInfo = {
      categoryId: categoryId,
      priceRange: priceRange,
      priceSorting: priceSorting,
    };
    const productInfoResult = await productModelinstance.sortByPricesAndNeeds(
      bundleQueryInfo
    );
    const numberofProductLists = productInfoResult.length;
    const feedbackText = `此頁顯示9件 / 共${numberofProductLists}件商品`;
    res.render("categoryProducts", {
      username: username,
      commonText: commonText,
      identifyText: categoryId,
      feedbackText: feedbackText,
      productInfoResult,
      nonce: res.locals.cspNonce,
    });
    return;
  } else if (categoryId && priceRange) {
    const bundleQueryInfo = {
      categoryId: categoryId,
      priceRange: priceRange,
    };
    const productInfoResult = await productModelinstance.sortByPrices(
      bundleQueryInfo
    );

    const numberofProductLists = productInfoResult.length;
    const feedbackText = `此頁顯示9件 / 共${numberofProductLists}件商品`;
    res.render("categoryProducts", {
      username: username,
      commonText: commonText,
      identifyText: categoryId,
      feedbackText: feedbackText,
      productInfoResult,
      nonce: res.locals.cspNonce,
    });
    return;
  } else if (categoryId && priceSorting) {
    const bundleQueryInfo = {
      categoryId: categoryId,
      priceSorting: priceSorting,
    };
    const productInfoResult = await productModelinstance.sortByNeeds(
      bundleQueryInfo
    );

    const numberofProductLists = productInfoResult.length;
    const feedbackText = `此頁顯示9件 / 共${numberofProductLists}件商品`;
    res.render("categoryProducts", {
      username: username,
      commonText: commonText,
      identifyText: categoryId,
      feedbackText: feedbackText,
      productInfoResult,
      nonce: res.locals.cspNonce,
    });
    return;
  } else {
    const productInfoResult = await productModelinstance.getAllProduct(
      categoryId
    );
    const numberofProductLists = productInfoResult.length;
    const feedbackText = `此頁顯示9件 / 共${numberofProductLists}件商品`;
    res.render("categoryProducts", {
      username: username,
      commonText: commonText,
      identifyText: categoryId,
      feedbackText: feedbackText,
      productInfoResult,
      nonce: res.locals.cspNonce,
    });
  }
};

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  getSpecificCategoryWebPage,
};
