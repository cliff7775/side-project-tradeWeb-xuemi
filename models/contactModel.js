//【引用模組功能】
//------------------------------------------------------------------------------>
const mysql = require("mysql2"); // 引用 Mysql模組
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const dbConfig = require("../config/mysqlDb.js");
//【設定參數並實例化】
//------------------------------------------------------------------------------>
const pool = mysql.createPool(dbConfig);

//【資料庫查詢】
//------------------------------------------------------------------------------>
class contactModel {
  async checkUserMail(userEmail) {
    try {
      const result = await queryUserEmailFromDB(userEmail);
      return result;
    } catch (error) {
      return error;
    }
  }

  async updateUserPassWord(randomPassword, userID) {
    try {
      const result = await updateUserPasswordFromDB(randomPassword, userID);
      return result;
    } catch (error) {
      return error;
    }
  }
}
//【函式處理區】
//------------------------------------------------------------------------------>
function queryUserEmailFromDB(userEmail) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql =
        " SELECT user_id, user_name , user_email FROM spusers WHERE user_email = ?";
      conn.query(sql, [userEmail], (err, rows) => {
        //reject(err); 碰到這方法會執行 慎用!
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

function updateUserPasswordFromDB(randomPassword, userID) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = "UPDATE spusers SET user_password = ? WHERE user_id = ?";
      conn.query(sql, [randomPassword, userID], (err, rows) => {
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
module.exports = contactModel;
