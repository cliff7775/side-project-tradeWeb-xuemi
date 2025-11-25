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



!\[image](data:image/jpeg;base64,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)

