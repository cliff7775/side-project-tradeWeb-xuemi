//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const pool = require("./pool.js");
const {
  feedbackProductPriceFilter,
  feedbackProductSortFilter,
} = require("../function/specificFunction/queryProductFilter.js");
//【資料庫查詢】
//------------------------------------------------------------------------------>
class searchModel {
  async queryUserInput(queryValue) {
    try {
      const result = await queryUserInputTextFromDB(queryValue);

      return result;
    } catch (error) {}
  }

  async sortByPricesAndNeeds(bundleQueryInfo) {
    try {
      const result = await sortByPricesAndNeedsFromDB(bundleQueryInfo);
      return result;
    } catch (error) {}
  }

  async sortByPrices(bundleQueryInfo) {
    try {
      const result = await sortByPricesFromDB(bundleQueryInfo);
      return result;
    } catch (error) {}
  }

  async sortByNeeds(bundleQueryInfo) {
    try {
      const result = await sortByNeedsFromDB(bundleQueryInfo);
      return result;
    } catch (error) {}
  }
}

//【函式處理區】
//------------------------------------------------------------------------------>

function queryUserInputTextFromDB(queryValue) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT product_id,product_name,product_price FROM spproducts WHERE product_name LIKE "%${queryValue}%";`;
      conn.query(sql, [queryValue], (err, rows) => {
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
  const { searchText, priceRange, priceSorting } = bundleQueryInfo;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT product_id,product_name,product_price FROM spproducts WHERE product_name LIKE "%${searchText}%" AND (product_online_status = "online") AND ${feedbackProductPriceFilter(
        priceRange
      )} ORDER BY product_price ${feedbackProductSortFilter(priceSorting)} ;`;
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

function sortByPricesFromDB(bundleQueryInfo) {
  const { searchText, priceRange } = bundleQueryInfo;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT product_id,product_name,product_price FROM spproducts WHERE product_name LIKE "%${searchText}%" AND (product_online_status = "online") AND ${feedbackProductPriceFilter(
        priceRange
      )};`;
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

function sortByNeedsFromDB(bundleQueryInfo) {
  const { searchText, priceSorting } = bundleQueryInfo;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT product_id,product_name,product_price FROM spproducts WHERE product_name LIKE "%${searchText}%" AND (product_online_status = "online") ORDER BY product_price ${feedbackProductSortFilter(
        priceSorting
      )};`;
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
module.exports = searchModel;
