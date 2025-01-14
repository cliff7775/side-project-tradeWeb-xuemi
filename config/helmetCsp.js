module.exports = {
  directives: {
    // 允許從自己網站和指定的外部來源加載腳本
    "script-src": ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`], // 動態設置 nonce
    // 根據需要可以添加其他資源的來源設置
    "style-src": [
      "'self'",
      "https://fonts.googleapis.com",
      "https://www.googletagmanager.com",
    ], // 允許從 Google Fonts 加載樣式
    "img-src": [
      "'self'",
      "data:",
      "https://www.google.com.tw",
      "https://www.example.com",
      "https://www.googletagmanager.com",
      "https://fonts.gstatic.com",
    ], // 允許從外部來源加載圖片
    "font-src": ["'self'"],
    "connect-src": [
      "'self'",
      "https://analytics.google.com",
      "https://www.google-analytics.com",
      "https://www.google.com.tw",
      "https://stats.g.doubleclick.net",
    ],
    "script-src-attr": ["'unsafe-inline'"],
    "script-src-elem": [
      "'self'",
      (req, res) => `'nonce-${res.locals.cspNonce}'`,
      "https://www.googletagmanager.com/gtm.js",
      "https://www.googletagmanager.com/gtag/",
      "https://cdn.jsdelivr.net/npm/chart.js",
    ],
    "frame-src": ["'self'", "https://td.doubleclick.net/"],
  },
};
