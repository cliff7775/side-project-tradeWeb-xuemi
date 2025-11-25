#### 📌 1. 專案簡介

一個以 Node.js + Express 打造的小型電商網站，整合會員系統、購物流程、金流串接、第三方登入與後台銷售管理，完整實作電子商務核心功能。







#### 📌 2. 功能特色

###### 🔐 使用者與安全



1. 會員註冊 / 登入 
2. 密碼加密（bcrypt / crypto）
3. Session + JWT 雙認證架構
4. CSRF 防護、Helmet 安全標頭
5. Rate Limiter 防暴力攻擊
6. Cookie 管理與存取控制



###### 🛍 電商核心功能



1. 商品展示與瀏覽
2. 加入購物車、購物流程
3. 訂單建立與查詢
4. 綠界金流（ECPay）付款整合



###### 📊 後台 Dashboard（管理端）



1. 訂單管理 Dashboard（銷售記錄 / 狀態）
2. 使用者訂單查詢後台



###### 🔗 第三方登入（OAuth 2.0）



1. Google OAuth 2.0
2. LINE Login



###### ✉️ 系統通知



1. Nodemailer 寄送註冊/訂單相關通知信件





#### 📌 3. 專案使用技術



##### Backend Framework

* express：輕量高效的 Node.js Web 伺服器框架。
* cluster：利用多核心CPU分散負載，提升伺服器效能。
* express-handlebars：Handlebars 模板引擎整合 Express。
* body-parser：解析請求內容，取得表單與 JSON 資料。
* cookie-parser：解析 Cookie，方便用戶狀態管理。





##### Security \& Auth

* helmet：提供安全性標頭，強化網站防護。
* csrf：提供 CSRF 防護機制，避免跨站請求攻擊。
* express-session：管理使用者 Session 狀態的中介軟體。
* connect-redis：以 Redis 儲存 Session，提高效能穩定。
* crypto / bcrypt :  密碼加密。
* jsonwebtoken：產生與驗證 JWT，用於身份驗證。
* rate-limiter-flexible：限制 API 請求頻率，防暴力攻擊。





##### Database \& Cache

* mysql2：高效 MySQL 連線工具，支援 Promise。
* redis：高效記憶體資料庫，用於快取與 Session。







##### Integration

* ecpay\_aio\_nodejs：整合綠界金流服務的 API 套件。
* googleapis：存取 Google API 的官方工具套件。
* nodemailer：寄送電子郵件的 Node.js 工具。







##### Utility

* fs / path / buffer : 系統檔案與路徑處理
* perf\_hooks : 效能監控
* nodemon：自動監控程式變更並重新啟動伺服器。







#### 📌 4. 系統架構圖



Client

&nbsp; │

&nbsp; ▼

Express Router

&nbsp; │

&nbsp; ▼

Controller ──► Service ──► MySQL (商品 / 訂單 / 使用者)

&nbsp; │              │

&nbsp; │              └──► Redis (Session / Cache)

&nbsp; │

&nbsp; ├──► ECPay (金流)

&nbsp; ├──► Google OAuth / LINE Login

&nbsp; └──► Nodemailer (Email)











##### 📌 7. 截圖



!\[GitHub 專案縮圖](https://www.youtube.com/s/desktop/33c3234b/img/favicon\_32x32.png)

