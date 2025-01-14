const { createClient } = require("redis");

async function createSessionClient() {
  const client = await createClient({
    url: "請填值",
    password: "請填值",
    socket: {
      reconnectStrategy: function (retries) {
        if (retries > 20) {
          console.log(
            "Too many attempts to reconnect. Redis connection was terminated"
          );
          return new Error("Too many retries.");
        } else {
          return retries * 500;
        }
      },
    },
    connectTimeout: 10000,
  })
    .on("error", (err) => console.log("Redis 客戶端 發生錯誤", err))
    .on("connect", () => {
      console.log("SessionRedis 客戶端已連接");
    })
    .connect();

  return client;
}
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = createSessionClient;
