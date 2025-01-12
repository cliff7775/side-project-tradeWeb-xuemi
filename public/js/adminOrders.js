const displaySpecificTradeDetailedInfoElm = document.querySelector(
  "#displaySpecificTradeDetailedInfo"
);
document
  .querySelector("#querySpecificTradeDetailedInfo")
  .addEventListener("click", async () => {
    const tradeNumValue = document.querySelector("#inputTradeNum").value;
    if (!tradeNumValue) {
      return;
    }
    const bundleMerchantradeInfo = {
      merchantradeValue: tradeNumValue,
    };
    const response = await fetch(
      "https://cliffweb.zeabur.app/admin/accordneed_rankuserOrders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(bundleMerchantradeInfo),
      }
    );

    const messageFromServer = await response.json();
    const orderProductsResultList = JSON.parse(messageFromServer);
    let allProductInfoContElm = "";
    for (const productItem of orderProductsResultList) {
      const productContElm = `<div class="modMultiProElmPosition">
            <div class="tradeProductID"><p>${productItem.product_id}</p></div><div class="tradeProductNum"><p>${productItem.product_order_quantity}</p></div><div class="tradeProductPrice"><p>${productItem.product_total_amount}</p></div>
            </div>`;
      allProductInfoContElm += productContElm;
    }
    const borderOrderDetailedElm = `<div class="modMultiProElmPosition"><div class="tradeProductID"><p>訂單產品編號</p></div><div class="tradeProductNum"><p>商品訂單數量</p></div><div class="tradeProductPrice"><p>商品訂單合計</p></div></div><div>${allProductInfoContElm}<div>`;
    displaySpecificTradeDetailedInfoElm.innerHTML = borderOrderDetailedElm;
  });
document
  .querySelector("#clearSpecificTradeDetailedInfo")
  .addEventListener("click", () => {
    displaySpecificTradeDetailedInfoElm.innerHTML = "";
  });

const allOrdersElmList = Array.from(
  document.querySelectorAll("#userOrdersContent .orderCard")
);
const prevElm = document.querySelector("#prev");
const nextElm = document.querySelector("#next");
let currentPage = 1; // 當前頁數
displayOrderItems();
//展示資料庫回傳訂單列
function displayOrderItems() {
  const itemsPerPage = 10; // 每頁顯示的項目數
  const itemContentElm = document.querySelector("#userOrdersContent");
  const pageInfo = document.querySelector("#page-info");

  const startItemElm = (currentPage - 1) * itemsPerPage;
  const endItemElm = startItemElm + itemsPerPage;
  const paginatedItemElm = allOrdersElmList.slice(startItemElm, endItemElm);

  const paginatedItemElmList = paginatedItemElm
    .map((item) => item.outerHTML)
    .join("");
  itemContentElm.innerHTML = paginatedItemElmList;

  // 更新頁數資訊
  pageInfo.innerHTML = `<p>第 ${currentPage} 頁，共 ${Math.ceil(
    allOrdersElmList.length / itemsPerPage
  )}頁</p>`;
  // 更新按鈕狀態
  prevElm.disabled = currentPage === 1;
  nextElm.disabled =
    currentPage === Math.ceil(allOrdersElmList.length / itemsPerPage);
}

function changePage(direction) {
  currentPage += direction; // 根據 direction 變更頁數
  displayOrderItems(); // 更新頁面顯示
}
