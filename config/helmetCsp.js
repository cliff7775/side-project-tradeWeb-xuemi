module.exports = {
  directives: {
    "default-src": ["'self'"],
    // 允許從自己網站和指定的外部來源加載腳本
    "script-src": ["'self'"],
    // 根據需要可以添加其他資源的來源設置
    "style-src": ["'self'"], // 允許從 Google Fonts 加載樣式
    "img-src": ["'self'"], // 允許從外部來源加載圖片
    "font-src": ["'self'"],
    "connect-src": ["'self'"],
    "script-src-attr": ["'self'", "'unsafe-inline'"],
    "script-src-elem": [
      "'self'",
      "https://www.googletagmanager.com/gtag/",
      "https://cdn.jsdelivr.net/npm/chart.js",
    ],
    "frame-src": ["'self'"],
  },
};
