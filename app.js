//【引用模組功能】
//------------------------------------------------------------------------------>
const express = require("express"); //引用 Middleware 中間件軟體
const helmet = require("helmet"); //引用 頭盔模組
const cluster = require("cluster"); //引用 叢集模組
const bodyParser = require("body-parser"); //引用 解析請求body資料
const crypto = require("crypto"); // 引用 加密模組
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { RateLimiterClusterMaster } = require("rate-limiter-flexible");
const { RedisStore } = require("connect-redis");

//【引用外部設定檔模組功能】
//------------------------------------------------------------------------------>
const createSessionClient = require("./config/redis/createSessionClient.js");

//【引用測試模組功能】
//------------------------------------------------------------------------------>
const { PerformanceObserver } = require("perf_hooks"); // 引用 效能_掛勾(監視器)模組
// 創建 PerformanceObserver 實例，監控工作子程序
const obs = new PerformanceObserver((lists) => {
  lists.getEntries().forEach((entry) => {
    const reqUrlPath = entry.detail;
    const processTime = (entry.duration / 1000).toFixed(4); // 轉換成秒，並限制小數點到4位

    //console.log(`請求 ${entry.name} 耗時: ${processTime}s 網址路徑: ${reqUrlPath.req.url}`);
  });
});

obs.observe({ entryTypes: ["http"] }); //監控 http 通訊
//------------------------------------------------------------------------------>

//【HTTP-請求處理塊】
//------------------------------------------------------------------------------>
if (cluster.isPrimary) {
  // 此主要程序區塊程式，僅在啟動時被執行一次
  console.log(`Primary Cluster ${process.pid} is running`);
  //------------------------------------------------------------------------------>
  cluster.fork(); // 創建 子程序 , 處理請求響應
  cluster.fork(); // 創建 子程序 , 處理請求響應
  new RateLimiterClusterMaster(); // 在 master process 建立實例，透過IPC通道接受來自 worker process 的訊息
  //------------------------------------------------------------------------------>
  const recordRequestResource = require("./function/processRequestResource.js");
  cluster.on("message", recordRequestResource);
  cluster.on(
    "fork",
    (worker) => {
      console.log(` Worker Cluster ${worker.process.pid} started`);
    } // 工作子程序正確啟動，觀測 pid 號
  );
  cluster.on("exit", (worker, code, signal) => {
    //當任何工作子程序結束時，cluster 模組會發出 "exit" 事件
    console.log("worker :", worker); //工作程序
    console.log("code :", code); //結束時的結束代碼
    console.log("signal :", signal); //導致程序被終止的訊號名稱
    cluster.fork();
  });
} else if (cluster.isWorker) {
  //------------------------------------------------------------------------------>
  const worker = cluster.worker; // 返回 工作子程序實例，完成後續和主程序的通訊

  console.log(` Worker Cluster ${worker.id} is actived`); // 觀看第幾號工作子程序啟動

  //【引用外部中間件模組功能】
  //------------------------------------------------------------------------------>
  const everyReqLimiterHandler = require("./middleware/rate-limiter-flexible/handleEveryReq.js"); //建立速率限制器並在每個請求上消耗積分
  const redirectUrlHandler = require("./middleware/handleRedirect.js"); //防止開放重定向處裡程式
  const userAccesslogHandler = require("./middleware/handleUserAccess.js"); // 設置網站用戶日誌功能
  const helmetCspConfig = require("./config/helmetCsp.js");
  const workerSendReqDataHandler = (req, res, next) => {
    // Worker執行緒 發送請求資源數據至 Master執行緒
    worker.send({
      originalUrl: req.originalUrl,
      cmd: "notifyRequest",
    });
    next();
  };

  //【引用外部Router模組功能】
  //------------------------------------------------------------------------------>
  const indexRouter = require("./routes/indexRouter.js");
  const registerRouter = require("./routes/registerRouter.js");
  const loginRouter = require("./routes/loginRouter.js");
  const categoryRouter = require("./routes/categoryRouter.js");
  const checkoutRouter = require("./routes/checkoutRouter.js");
  const contactRouter = require("./routes/contactRouter.js");
  const downloadRouter = require("./routes/downloadRouter.js");
  const searchRouter = require("./routes/searchRouter.js");
  const googleAuthenticateRouter = require("./routes/googleAuthenticateRouter.js");
  const lineAuthenticateRouter = require("./routes/lineAuthenticateRouter.js");
  const adminRouter = require("./routes/adminRouter.js");
  const memberRouter = require("./routes/memberRouter.js");
  const robotsRouter = require("./routes/robots.js"); //
  const sitemapRouter = require("./routes/sitemap.js"); //
  const noFoundHandlerRouter = require("./routes/noFoundRouter.js");
  const errorHandlerRouter = require("./routes/errorHandlerRouter.js");
  //【全局中間件設置】
  //------------------------------------------------------------------------------>
  (async () => {
    const sessionClient = await createSessionClient();
    const redisStore = new RedisStore({
      client: sessionClient,
      prefix: "userAccessKey:",
    });

    const app = express(); // 初始化 Express 應用
    //【引用外部設定檔模組功能】
    //------------------------------------------------------------------------------>
    const portConfig = require("./config/portConfig.js"); // 引入基礎環境設定
    const hbs = require("./config/express-handlebars.js"); // 引用視圖模板模組引擎設置參數
    //【模板引擎功能設置】
    //------------------------------------------------------------------------------>
    app.engine("handlebars", hbs.engine);
    app.set("view engine", "handlebars");
    app.set("views", "./views");

    app.use(everyReqLimiterHandler); // 制止DDOS攻擊
    app.use(redirectUrlHandler); // 防止開放重定向攻擊
    app.use(
      session({
        store: redisStore,
        secret: "請填值", // 秘密金鑰，請確保安全
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 30 * 60 * 1000 }, // 在 HTTP 和 HTTPS 下都可用
      })
    );
    app.use((req, res, next) => {
      res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
      next();
    }); //為每個請求動態生成新的 nonce 值
    app.use(
      helmet({
        xXssProtection: false,
        contentSecurityPolicy: helmetCspConfig,
      })
    ); //使用 helmet 中間件，自定義 Content-Security-Policy 標頭
    app.use((req, res, next) => {
      res.setHeader("X-Xss-Protection", "1");
      next();
    });
    app.use(workerSendReqDataHandler, express.static("public")); // 紀錄請求資源跟回應靜態檔案
    app.use(userAccesslogHandler); // 登記進站使用者
    app.use(bodyParser.json()); //
    app.use(bodyParser.urlencoded({ extended: false })); // 解析 application/x-www-form-urlencoded 格式的請求體
    app.use(cookieParser()); // 解析 cookie 攜帶值
    //【請求路徑處理】
    //------------------------------------------------------------------------------>
    app.use("/register", registerRouter); // 註冊流程響應
    app.use("/login", loginRouter); // 登記流程響應
    app.use("/category", categoryRouter); // 商品類流程響應
    app.use("/checkout", checkoutRouter); // 商品結帳頁流程響應
    app.use("/contact", contactRouter); // 聯絡流程響應
    app.use("/download", downloadRouter);
    app.use("/search", searchRouter); //
    app.use("/admin", adminRouter); // 管理者流程響應
    app.use("/member", memberRouter); // 會員流程響應
    app.use("/googleOauth2.0", googleAuthenticateRouter); //
    app.use("/linev2.1", lineAuthenticateRouter); //
    app.use("/robots.txt", robotsRouter); // robots.txt文件響應
    app.use("/sitemap.xml", sitemapRouter); // sitemap文件響應
    app.use(/^(?!\/$).*/, noFoundHandlerRouter); // 找不到頁面流程響應
    app.use("/", indexRouter); // 首頁流程響應
    app.use(errorHandlerRouter); // 錯誤流程
    //【伺服器監聽埠號】
    //------------------------------------------------------------------------------>
    app.listen(portConfig.port, () => {});
  })();
}
