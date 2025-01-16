//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const pool = require("./pool.js");
const {
  feedbackProductPriceFilter,
  feedbackProductSortFilter,
  feedbackTradeProductInsertInfo,
  feedbackProductSaleNumInsertInfo,
} = require("../function/specificFunction/queryProductFilter.js");
//【資料庫查詢】
//------------------------------------------------------------------------------>
class productModel {
  async getAllProduct(categoryId) {
    try {
      const result = await getAllProductFromDB(categoryId);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async accessUserOrdersInfo(categoryId) {
    try {
      const result = await accessUserOrdersFromDB(categoryId);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async accessOrderWithDetailedInfo(merchantradeValue) {
    try {
      const result = await accessOrderWithDetailedInfoFromDB(merchantradeValue);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async sortByPricesAndNeeds(bundleQueryInfo) {
    try {
      const result = await sortByPricesAndNeedsFromDB(bundleQueryInfo);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async sortByPrices(bundleQueryInfo) {
    try {
      const result = await sortByPricesFromDB(bundleQueryInfo);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async sortByNeeds(bundleQueryInfo) {
    try {
      const result = await sortByNeedsFromDB(bundleQueryInfo);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getProductInCart(productIdList) {
    try {
      const result = await getOrderProductFromDB(productIdList);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async storeUserOrders(bundleUserInfo) {
    const { userID, tradeItemList, ...data } = bundleUserInfo;
    const { merchantTradeNo } = bundleUserInfo;
    try {
      const productInfoList = feedbackProductSaleNumInsertInfo(tradeItemList);
      for (const productItem of productInfoList) {
        await storeUserOrdersEachProductNumInSpproductsFromDB(productItem);
      }

      await storeUserOrdersInMerchantradeFromDB(data);
      await storeUserOrdersInUsersAndTradesFromDB(userID, merchantTradeNo);
      await storeUserOrdersInTradesAndProductsFromDB(
        merchantTradeNo,
        tradeItemList
      );

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async accessAllUserOrdersInfo() {
    try {
      const result = await accessAllUserOrdersInfoFromDB();
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

//【函式處理區】
//------------------------------------------------------------------------------>
function getAllProductFromDB(categoryId) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT * FROM spproducts WHERE product_category_id=? AND (product_online_status = "online")`;
      conn.query(sql, [categoryId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}

function accessUserOrdersFromDB(categoryId) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT spMerchantrade.trade_id , spMerchantrade.trade_date , spMerchantrade.trade_process_state , spMerchantrade.trade_productNum , spMerchantrade.trade_payment_type,spMerchantrade.trade_is_established , spMerchantrade.trade_total_amount  FROM spMerchantrade INNER JOIN splinkUsersAndTrades ON spMerchantrade.trade_id = splinkUsersAndTrades.trade_id WHERE splinkUsersAndTrades.user_id = ? AND spMerchantrade.trade_is_established = "成立";`;
      conn.query(sql, [categoryId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}

function accessOrderWithDetailedInfoFromDB(merchantradeValue) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT spMerchantrade.trade_id , splinkTradesAndProducts.product_id , splinkTradesAndProducts.product_order_quantity , splinkTradesAndProducts.product_total_amount , spMerchantrade.trade_is_established FROM spMerchantrade INNER JOIN splinkTradesAndProducts ON spMerchantrade.trade_id = splinkTradesAndProducts.trade_id WHERE spMerchantrade.trade_id= ? AND spMerchantrade.trade_is_established = "成立";`;
      conn.query(sql, [merchantradeValue], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}

function sortByPricesAndNeedsFromDB(bundleQueryInfo) {
  const { categoryId, priceRange, priceSorting } = bundleQueryInfo;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT * FROM spproducts WHERE product_category_id= ? AND (product_online_status = "online") AND ${feedbackProductPriceFilter(
        priceRange
      )} ORDER BY product_price ${feedbackProductSortFilter(priceSorting)}`;

      conn.query(sql, [categoryId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}

function sortByPricesFromDB(bundleQueryInfo) {
  const { categoryId, priceRange } = bundleQueryInfo;

  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT * FROM spproducts WHERE product_category_id= ? AND (product_online_status = "online") AND ${feedbackProductPriceFilter(
        priceRange
      )}`;
      conn.query(sql, [categoryId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}

function sortByNeedsFromDB(bundleQueryInfo) {
  const { categoryId, priceSorting } = bundleQueryInfo;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT * FROM spproducts WHERE product_category_id=? AND (product_online_status = "online") ORDER BY product_price ${feedbackProductSortFilter(
        priceSorting
      )}`;

      conn.query(sql, [categoryId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}

function getOrderProductFromDB(productIdList) {
  const itemOrderList = productIdList.length;
  const querySign = `?`;
  const mark = ",";
  let combinationQuerySign = "";
  for (let i = 1; i <= itemOrderList; i++) {
    if (i === itemOrderList) {
      combinationQuerySign += querySign;
      break;
    }
    combinationQuerySign += querySign + mark;
  }
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT * FROM spproducts WHERE product_id IN(${combinationQuerySign}) AND (product_online_status = "online")`;
      conn.query(sql, productIdList, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}

function storeUserOrdersInMerchantradeFromDB(orderInfo) {
  const {
    merchantTradeNo,
    tradeDate,
    paymentDate,
    totalItemNum,
    paymentType,
    tradeAmt,
  } = orderInfo;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `INSERT INTO spMerchantrade(trade_id ,trade_date ,trade_payment_date,trade_productNum ,trade_process_state ,trade_payment_type ,trade_is_established  ,trade_total_amount)
      VALUES (?,?,?,?,"處理中",?,"成立",?) `;
      conn.query(
        sql,
        [
          merchantTradeNo,
          tradeDate,
          paymentDate,
          totalItemNum,
          paymentType,
          tradeAmt,
        ],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
      pool.releaseConnection(conn);
    });
  });
}

function storeUserOrdersInUsersAndTradesFromDB(userID, merchantTradeNo) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `INSERT INTO splinkUsersAndTrades( user_id,trade_id )
      VALUES (?,?) `;
      conn.query(sql, [userID, merchantTradeNo], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}

function storeUserOrdersInTradesAndProductsFromDB(
  merchantTradeNo,
  tradeItemList
) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `INSERT INTO splinkTradesAndProducts( trade_id , product_id, product_order_quantity,product_total_amount )
      VALUES ${feedbackTradeProductInsertInfo(
        merchantTradeNo,
        tradeItemList
      )} `;
      conn.query(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}

function storeUserOrdersEachProductNumInSpproductsFromDB(productItem) {
  const { itemKey, itemNum } = productItem;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `UPDATE spproducts SET product_sales_quantity = product_sales_quantity + ? WHERE product_id = ?;`;
      conn.query(sql, [itemNum, itemKey], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}

function accessAllUserOrdersInfoFromDB() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT splinkUsersAndTrades.user_id , ( SELECT user_name FROM spusers WHERE user_id = splinkUsersAndTrades.user_id) , spMerchantrade.trade_id, spMerchantrade.trade_date , spMerchantrade.trade_process_state , spMerchantrade.trade_productNum , spMerchantrade.trade_payment_type,spMerchantrade.trade_is_established , spMerchantrade.trade_total_amount FROM spMerchantrade inner join splinkUsersAndTrades on spMerchantrade.trade_id = splinkUsersAndTrades.trade_id;`;
      conn.query(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
      pool.releaseConnection(conn);
    });
  });
}
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = productModel;
