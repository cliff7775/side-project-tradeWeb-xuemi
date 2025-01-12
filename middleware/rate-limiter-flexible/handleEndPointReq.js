//【引用模組功能】
//------------------------------------------------------------------------------>
const { RateLimiterCluster } = require("rate-limiter-flexible");
//【設定參數並實例化】
//------------------------------------------------------------------------------>
const rateLimiterPreventEndPoint = new RateLimiterCluster({
  keyPrefix: "handle_Request_End_point_form",
  points: 4,
  duration: 60,
  // Custom
  blockDuration: 60 * 30, // 封鎖30分鐘
  timeoutMs: 3000, // Promise is rejected, if master doesn't answer for 3 secs
});
//【端點請求-函式處理區】
//------------------------------------------------------------------------------>
async function handleEndPointFormReq(req, res, next) {
  try {
    const rateLimiterRes = await rateLimiterPreventEndPoint.consume(req.ip, 1);
    console.log("表單成功消耗點數:", rateLimiterRes);
    next();
  } catch (rateLimiterRes) {
    // 處理點數不足的情況
    res
      .status(429)
      .render("redirectUrl", { count: 30, message: "表單提交次數過多" });
  }
}
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = handleEndPointFormReq;
