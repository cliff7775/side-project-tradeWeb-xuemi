//【引用模組功能】
//------------------------------------------------------------------------------>
const { RateLimiterCluster } = require("rate-limiter-flexible");
//【設定參數並實例化】
//------------------------------------------------------------------------------>
const rateLimiterConsumeEveryReq = new RateLimiterCluster({
  keyPrefix: "handle_Request_ip_every_day", // Must be unique for each limiter
  points: 1000, //設置點數（points）
  duration: 1, //存儲時間（duration）
  // Custom
  blockDuration: 60 * 60 * 24, // 封鎖一天時間
  timeoutMs: 3000, // Promise is rejected, if master doesn't answer for 3 secs
});

//【進站請求-函式處理區】
//------------------------------------------------------------------------------>
async function handleEveryReq(req, res, next) {
  try {
    const rateLimiterRes = await rateLimiterConsumeEveryReq.consume(req.ip, 1);
    //console.log("成功消耗點數:", rateLimiterRes);
    next();
  } catch (rateLimiterRes) {
    console.error("無法消耗點數:", rateLimiterRes);
    // 處理點數不足的情況
    res.status(429).render("redirectUrl", {
      count: 60 * 60 * 24,
      message: "請求次數過多",
    });
  }
}

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = handleEveryReq;
