//【引用模組功能】
//------------------------------------------------------------------------------>
const mysql = require("mysql2"); // 引用 Mysql模組
//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const dbConfig = require("../config/mysqlDb.js");
const {
  feedbackUserUpdateFilter,
} = require("../function/specificFunction/queryUserFilter.js");
//【設定參數並實例化】
//------------------------------------------------------------------------------>
const pool = mysql.createPool(dbConfig);

//【資料庫查詢】
//------------------------------------------------------------------------------>
class loginModel {
  async accessUserInfo(userID) {
    try {
      const result = await accessUserInfoFromDB(userID);
      return result;
    } catch (error) {}
  }

  async validUserInfo(email) {
    try {
      const result = await validUserInfoFromDB(email);
      return result;
    } catch (error) {}
  }

  async validThirdPartyUserInfo(email) {
    try {
      const result = await validThirdPartyUserInfoFromDB(email);
      return result;
    } catch (error) {}
  }

  async updateUserInfo(userID, name) {
    try {
      const result = await updateUserInfoFromDB(userID, name);
      return result;
    } catch (error) {}
  }

  // async validUserPwd(oldPwd) {
  //   try {
  //     const result = await validUserPwdFromDB(oldPwd);
  //     return result;
  //   } catch (error) {}
  // }

  async updateUserWithNewInfo(bundleUserInfo) {
    try {
      const result = await updateUserWithNewInfoFromDB(bundleUserInfo);
      return result;
    } catch (error) {}
  }

  async updateUserPwd(bundleUserInfo) {
    try {
      const result = await updateUserPwdFromDB(bundleUserInfo);
      return result;
    } catch (error) {}
  }

  async createNewThirdPartyUser(bundleUserInfo) {
    try {
      const result = await createNewThirdPartyUserFromDB(bundleUserInfo);
      return result;
    } catch (error) {}
  }
}

//【函式處理區】
//------------------------------------------------------------------------------>
function accessUserInfoFromDB(userID) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT spusers.user_id , spusers.user_name , spusers.user_email , spusers.user_birthday , user_role.role_name , user_gender.gender_name , spusers.user_password  FROM spusers INNER JOIN user_role ON spusers.user_role_id = user_role.role_id INNER JOIN user_gender ON spusers.user_gender_id = user_gender.gender_id WHERE spusers.user_id = ? `;
      conn.query(sql, [userID], (err, rows) => {
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

function validUserInfoFromDB(email) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT spusers.user_id , spusers.user_name , user_role.role_name , spusers.user_password FROM spusers INNER JOIN user_role ON spusers.user_role_id = user_role.role_id WHERE spusers.user_email = ?`;
      conn.query(sql, [email], (err, rows) => {
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

function validThirdPartyUserInfoFromDB(email) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `SELECT spusers.user_id , spusers.user_name , user_role.role_name FROM spusers INNER JOIN user_role ON spusers.user_role_id = user_role.role_id WHERE spusers.user_email = ?`;
      conn.query(sql, [email], (err, rows) => {
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

function updateUserInfoFromDB(userID, name) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `UPDATE spusers SET user_name=? WHERE user_id = ?`;
      conn.query(sql, [name, userID], (err, rows) => {
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

// function validUserPwdFromDB(oldPwd) {
//   return new Promise((resolve, reject) => {
//     pool.getConnection((err, conn) => {
//       const sql = `SELECT * FROM spusers WHERE user_password = ?`;
//       conn.query(sql, [oldPwd], (err, rows) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(rows);
//         }
//       });
//       pool.releaseConnection(conn);
//     });
//   });
// }

function updateUserWithNewInfoFromDB(bundleUserInfo) {
  const { userID, ...data } = bundleUserInfo;
  const prepareUserInsertInfo = feedbackUserUpdateFilter(data);
  const insertSignUserInfo = prepareUserInsertInfo.replace(/\)\(/g, "),(");
  const finishUserInsertInfo = insertSignUserInfo.replace(/\(|\)/g, "");
  console.log("finishUserInsertInf", finishUserInsertInfo);
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `UPDATE spusers SET ${finishUserInsertInfo} WHERE user_id = ?`;
      conn.query(sql, [userID], (err, rows) => {
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

function updateUserPwdFromDB(bundleUserInfo) {
  const { userID, userpassword } = bundleUserInfo;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `UPDATE spusers SET user_password=? WHERE user_id = ?`;
      conn.query(sql, [userpassword, userID], (err, rows) => {
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

function createNewThirdPartyUserFromDB(bundleUserInfo) {
  const { username, usermail, userpassword } = bundleUserInfo;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const sql = `INSERT INTO spusers(user_id,user_name,user_email,user_password,user_role_id) VALUES (UUID(),?,?,?,1)`;
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
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = loginModel;
