module.exports = {
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
};
