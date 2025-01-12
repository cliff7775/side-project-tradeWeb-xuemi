function feedbackProductPriceFilter(cont) {
  let value = "";
  switch (cont) {
    case "lessThan100":
      value += "(product_price <= 100)";
      break;
    case "lessThan500":
      value += "(product_price > 100) AND (product_price <= 500)";
      break;
    case "lessThan1000":
      value += "(product_price > 500) AND (product_price <= 1000)";
      break;
    case "greaterThan1000":
      value += "(product_price > 1000)";
  }
  return value;
}

function feedbackProductSortFilter(cont) {
  let value = "";
  switch (cont) {
    case "SortFromHighest":
      value += "DESC";
      break;
    case "SortFromLowest":
      value += "ASC";
  }
  return value;
}

function feedbackTradeProductInsertInfo(merchantTradeNo, tradeItemList) {
  const firstFilterForTradeItemList = /&/g; //根據不同商品切割
  let firstStepTradeItemListForm = tradeItemList
    .split(firstFilterForTradeItemList)
    .filter((item) => {
      if (item) {
        return item;
      }
    });

  let productInfoList = [];
  firstStepTradeItemListForm.forEach((item) => {
    const secondFilterForTradeItemList = /\//g; //根據商品描述，再細部切割出鍵值對
    let secondStepTradeItemListForm = item.split(secondFilterForTradeItemList);

    let bundleProductInfo = {};
    secondStepTradeItemListForm.forEach((item) => {
      const thirdFilterForTradeItemList = /=/; //再把鍵值對切割，組合成物件
      const [key, value] = item.split(thirdFilterForTradeItemList);
      bundleProductInfo[key] = [value];
    });
    productInfoList.push(bundleProductInfo); //完成該商品切割，把物件放入陣列物件儲存
  });

  let finishWithtradeItemList = "";
  for (let i = 0; i < productInfoList.length; i++) {
    const { itemKey, itemNum, itemPrice } = productInfoList[i];
    if (i !== productInfoList.length - 1) {
      let containerForProductInfo = `("${merchantTradeNo}","${itemKey}",${itemNum},${itemPrice}),`;
      finishWithtradeItemList += containerForProductInfo;
    } else {
      let containerForProductInfo = `("${merchantTradeNo}","${itemKey}",${itemNum},${itemPrice});`;
      finishWithtradeItemList += containerForProductInfo;
    }
  }
  return finishWithtradeItemList;
}

function feedbackProductSaleNumInsertInfo(tradeItemList) {
  const firstFilterForTradeItemList = /&/g; //根據不同商品切割
  let firstStepTradeItemListForm = tradeItemList
    .split(firstFilterForTradeItemList)
    .filter((item) => {
      if (item) {
        return item;
      }
    });
  let productInfoList = [];
  firstStepTradeItemListForm.forEach((item) => {
    const secondFilterForTradeItemList = /\//g;
    let secondStepTradeItemListForm = item.split(secondFilterForTradeItemList);
    let bundleProductInfo = {};
    secondStepTradeItemListForm.forEach((item, i) => {
      const thirdFilterForTradeItemList = /=/;
      const [key, value] = item.split(thirdFilterForTradeItemList);
      if (i !== 2) {
        bundleProductInfo[key] = value;
      } else {
        productInfoList.push(bundleProductInfo);
      }
    });
  });

  return productInfoList;
}
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  feedbackProductPriceFilter,
  feedbackProductSortFilter,
  feedbackTradeProductInsertInfo,
  feedbackProductSaleNumInsertInfo,
};
