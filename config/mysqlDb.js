module.exports = {
  host: "請填值",
  user: "請填值",
  port: "請填值",
  password: "請填值",
  database: "請填值",
  waitForConnections: true, //當連線池中的所有連線都被佔用時，是否等待連線變得可用。設定為 true 表示會等待
  connectionLimit: 10, //設定為 10 表示連線池最多可以同時擁有 10 個連線。
  idleTimeout: 60000, //空閒連線的超時時間，以毫秒為單位。設定為 60000 毫秒（60 秒）表示，如果連線在 60 秒內沒有被使用，它將被關閉和移除。
  queueLimit: 0, //佇列中等待連接的最大數量。設定為 0 表示沒有限制，即無限制地排隊等待連線。
  enableKeepAlive: true, //啟用 TCP 連線的 Keep-Alive 機制。設定為 true 表示啟用，這可以幫助偵測並保持連線的活躍性。
  keepAliveInitialDelay: 0, //在啟用 Keep-Alive 機制時，初始的延遲時間，以毫秒為單位。設定為 0 表示不設定延遲，即立即開始 Keep-Alive 偵測。
};
