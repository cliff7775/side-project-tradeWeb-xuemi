//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const pool = require("./pool.js");
const {
  createPastTimeStmap,
  createCurrentTimeStmap,
} = require("../function/specificFunction/queryTimeFilter.js");
//【資料庫查詢】
//------------------------------------------------------------------------------>
class adminOrdersModel {
  async queryAllTradesStateRate() {
    try {
      const result = await queryAllTradesStateRateFromDB();
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async queryRegisterUserNum() {
    try {
      const result = await queryRegisterUserNumFromDB();
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async queryCalculateTotalTeadePrice() {
    try {
      const result = await queryCalculateTotalTeadePriceFromDB();
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async queryTopSaleProductNum() {
    try {
      const result = await queryTopSaleProductNumFromDB();
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async queryEachCategorySaleNum() {
    try {
      const result = await queryEachCategorySaleNumFromDB();
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async queryHeightCalculatePriceUsers() {
    try {
      const result = await queryHeightCalculatePriceUsersFromDB();
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async queryTopCategorySaleProductNum(categoryID) {
    try {
      const result = await queryTopCategorySaleProductNumFromDB(categoryID);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async accessSpecificTradeDetailedInfo(tradeNum) {
    try {
      const result = await accessSpecificTradeDetailedInfoFromDB(tradeNum);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async updateSpecificTradeState(tradeNum, tradeUpdateState) {
    try {
      const result = await updateSpecificTradeStateFromDB(
        tradeNum,
        tradeUpdateState
      );
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async accessAllTradesByState(tradeStateSort) {
    try {
      const result = await accessAllTradesByStateFromDB(tradeStateSort);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async accessAllTradesByDate(tradeDateSort) {
    try {
      const result = await accessAllTradesByDateFromDB(tradeDateSort);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async accessTradesBySpecificTime(tradeChoseDate) {
    try {
      const result = await accessTradesBySpecificTime(tradeChoseDate);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

//【函式處理區】
//------------------------------------------------------------------------------>
function queryAllTradesStateRateFromDB() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT count(*) as "總訂單", (select count(*) from spMerchantrade where trade_is_established = "成立") as "成立訂單數" , COUNT(*) - (SELECT COUNT(*) FROM spMerchantrade WHERE trade_is_established = '成立') AS "未成立訂單數" FROM spMerchantrade ;`;
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

function queryRegisterUserNumFromDB() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT count(*)  from spusers inner join user_role on spusers.user_role_id = user_role.role_id where user_role.role_name = "common";`;
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

function queryCalculateTotalTeadePriceFromDB() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT sum(trade_total_amount) as "總銷售額" FROM spMerchantrade;`;
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

function queryTopSaleProductNumFromDB() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT product_name , product_sales_quantity FROM spproducts ORDER BY product_sales_quantity DESC LIMIT 10;`;
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

function queryEachCategorySaleNumFromDB() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT product_category_id, SUM(product_sales_quantity)  FROM spproducts WHERE product_category_id IN("A1000","B2000","C3000") GROUP BY product_category_id;`;
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

function queryHeightCalculatePriceUsersFromDB() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT spusers.user_name , SUM(spMerchantrade.trade_total_amount) FROM spusers INNER JOIN splinkUsersAndTrades ON spusers.user_id = splinkUsersAndTrades.user_id INNER JOIN spMerchantrade ON splinkUsersAndTrades.trade_id = spMerchantrade.trade_id GROUP BY spusers.user_id LIMIT 3;`;
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

function queryTopCategorySaleProductNumFromDB(categoryID) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT product_name , product_sales_quantity FROM spproducts WHERE product_category_id = ? ORDER BY product_sales_quantity DESC LIMIT 5;`;
      conn.query(sql, [categoryID], (err, rows) => {
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

function accessSpecificTradeDetailedInfoFromDB(tradeNum) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT spMerchantrade.trade_id , splinkTradesAndProducts.product_id , splinkTradesAndProducts.product_order_quantity , splinkTradesAndProducts.product_total_amount , spMerchantrade.trade_is_established FROM spMerchantrade INNER JOIN splinkTradesAndProducts ON spMerchantrade.trade_id = splinkTradesAndProducts.trade_id WHERE spMerchantrade.trade_id= ? ;`;
      conn.query(sql, [tradeNum], (err, rows) => {
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

function updateSpecificTradeStateFromDB(tradeNum, tradeUpdateState) {
  let value = "";
  switch (tradeUpdateState) {
    case "true":
      value += "成立";
      break;
    case "false":
      value += "不成立";
  }

  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `UPDATE spMerchantrade SET trade_is_established = "${value}" WHERE trade_id = ? ;`;
      conn.query(sql, [tradeNum], (err, rows) => {
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

function accessAllTradesByStateFromDB(tradeStateSort) {
  let value = "";
  switch (tradeStateSort) {
    case "true":
      value += "成立";
      break;
    case "false":
      value += "不成立";
  }

  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT splinkUsersAndTrades.user_id , ( SELECT user_name FROM spusers WHERE user_id = splinkUsersAndTrades.user_id) , spMerchantrade.trade_id, spMerchantrade.trade_date , spMerchantrade.trade_process_state , spMerchantrade.trade_productNum , spMerchantrade.trade_payment_type,spMerchantrade.trade_is_established , spMerchantrade.trade_total_amount FROM spMerchantrade inner join splinkUsersAndTrades on spMerchantrade.trade_id = splinkUsersAndTrades.trade_id AND spMerchantrade.trade_is_established = "${value}";`;
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

function accessAllTradesByDateFromDB(tradeDateSort) {
  let value = "";
  switch (tradeDateSort) {
    case "latest":
      value += "DESC";
      break;
    case "Oldest":
      value += "ASC";
  }

  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT splinkUsersAndTrades.user_id , ( SELECT user_name FROM spusers WHERE user_id = splinkUsersAndTrades.user_id)  , spMerchantrade.trade_id, spMerchantrade.trade_date , spMerchantrade.trade_process_state , spMerchantrade.trade_productNum , spMerchantrade.trade_payment_type,spMerchantrade.trade_is_established , spMerchantrade.trade_total_amount FROM spMerchantrade INNER JOIN splinkUsersAndTrades on spMerchantrade.trade_id = splinkUsersAndTrades.trade_id ORDER BY spMerchantrade.trade_date ${value};`;
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

function accessTradesBySpecificTime(tradeChoseDate) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT splinkUsersAndTrades.user_id , ( SELECT user_name FROM spusers WHERE user_id = splinkUsersAndTrades.user_id)  , spMerchantrade.trade_id, spMerchantrade.trade_date , spMerchantrade.trade_process_state , spMerchantrade.trade_productNum , spMerchantrade.trade_payment_type,spMerchantrade.trade_is_established , spMerchantrade.trade_total_amount FROM spMerchantrade inner join splinkUsersAndTrades on spMerchantrade.trade_id = splinkUsersAndTrades.trade_id WHERE spMerchantrade.trade_date BETWEEN "${createPastTimeStmap(
        tradeChoseDate
      )}" AND "${createCurrentTimeStmap()}";`;
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
module.exports = adminOrdersModel;
