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
class registerModel {
  async addNewUser(userRegisterInfo) {
    try {
      const result = await addNewUserFromDB(userRegisterInfo);
      return result;
    } catch (error) {
      return error;
    }
  }

  async authenticationUser(usermail) {
    try {
      const result = await authenticationUserFromDB(usermail);
      return result;
    } catch (error) {}
  }
}

//【函式處理區】
//------------------------------------------------------------------------------>
function addNewUserFromDB(userRegisterInfo) {
  const { username, usermail, userpassword } = userRegisterInfo;

  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `INSERT INTO spusers(user_id, user_name, user_email, user_password, user_role_id, user_gender_id) VALUES (UUID(),?,?,?,1,1)`;
      conn.query(sql, [username, usermail, userpassword], (err, rows) => {
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

function authenticationUserFromDB(usermail) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT spusers.user_id , spusers.user_name , user_role.role_name FROM spusers INNER JOIN user_role ON spusers.user_role_id = user_role.role_id WHERE user_email = ?`;
      conn.query(sql, [usermail], (err, rows) => {
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
module.exports = registerModel;
