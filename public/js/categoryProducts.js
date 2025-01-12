const navCartInfoElm = document.querySelector("#userCart"); // 導覽頁購物車
const interfaceCartInfoElm = document.querySelector("#cartStatus"); // 頁面購物車狀態

//更新商品元素陳列方式
const applyFilterElm = document.querySelector("#applyFilter");
applyFilterElm.addEventListener("click", () => {
  const categoryValueElm = document.querySelector("#categoryValue");
  const PriceRangeElm = document.querySelector("#PriceRange");
  const PriceSortingElm = document.querySelector("#PriceSorting");
  const catrgoryIDList = ["A1000", "B2000", "C3000"];
  const judgeUserInputText = catrgoryIDList.indexOf(categoryValueElm.innerText);
  if (judgeUserInputText === -1) {
    const queryText = `searchValue=${categoryValueElm.innerText}&priceRange=${PriceRangeElm.value}&priceSorting=${PriceSortingElm.value}`;
    const setCategoryPagepath = `https://cliffweb.zeabur.app/search?${queryText}`;
    window.location.href = setCategoryPagepath;
  } else {
    const queryText = `cid=${categoryValueElm.innerText}&priceRange=${PriceRangeElm.value}&priceSorting=${PriceSortingElm.value}`;
    const setCategoryPagepath = `https://cliffweb.zeabur.app/category/goods_list?${queryText}`;
    window.location.href = setCategoryPagepath;
  }
});

const allProductElmList = Array.from(
  document.querySelectorAll("#merchandiseContent .productBox")
); //取得後端傳送全部商品資料
const prevElm = document.querySelector("#prev");
const nextElm = document.querySelector("#next");
let currentPage = 1; // 當前頁數
displayItems(); //展示商品卡
displayCartStatus(); //展示購物車內容

//展示資料庫回傳商品列
function displayItems() {
  const itemsPerPage = 9; // 每頁顯示的項目數
  const itemContentElm = document.querySelector("#merchandiseContent");
  const pageInfo = document.querySelector("#page-info"); // 用於顯示頁數資訊的 <span>

  const startItemElm = (currentPage - 1) * itemsPerPage;
  const endItemElm = startItemElm + itemsPerPage;
  const paginatedItemElm = allProductElmList.slice(startItemElm, endItemElm);

  const paginatedItemElmList = paginatedItemElm
    .map((item) => item.outerHTML)
    .join("");
  itemContentElm.innerHTML = paginatedItemElmList;
  // 更新頁數資訊
  pageInfo.innerHTML = `<p>第 ${currentPage} 頁，共 ${Math.ceil(
    allProductElmList.length / itemsPerPage
  )}頁</p>`;
  // 更新按鈕狀態
  prevElm.disabled = currentPage === 1;
  nextElm.disabled =
    currentPage === Math.ceil(allProductElmList.length / itemsPerPage);
}

//更新頁面頁籤
function changePage(direction) {
  currentPage += direction; // 根據 direction 變更頁數
  displayItems(); // 更新頁面顯示
}

//展示初始購物車商品數
(function setNavCartInfo() {
  const navUserCartInfoElm = document.querySelector("#userCart");
  const userOrdersList = JSON.parse(sessionStorage.getItem("userOrderCart")); //從瀏覽器端取值
  if (!userOrdersList) {
    navUserCartInfoElm.innerText = 0;
  } else {
    navUserCartInfoElm.innerText = userOrdersList.length;
  }
})();

//添加到購物車
let orderCart = [];
function addToCart(itemElement) {
  const productBox = itemElement.parentElement.parentElement;
  const productKeyID = productBox.querySelector("#productID p").innerText;
  const productName = productBox.querySelector("#productName p").innerText;
  const productPrice = productBox.querySelector("#productPrice p").innerText;

  orderCart.push(productKeyID); // 更新用戶購物車商品
  const userOrdersList = sessionStorage.getItem("userOrderCart"); //從瀏覽器端取值
  let parsedUserOrdersList = JSON.parse(userOrdersList);
  if (!parsedUserOrdersList) {
    let orderCartForStore = JSON.stringify(orderCart);
    sessionStorage.setItem("userOrderCart", orderCartForStore); //發現是空值，把購物車值儲存進瀏覽器端
  } else {
    let [...copyOrderCart] = orderCart;
    const newProductKey = copyOrderCart.pop();
    parsedUserOrdersList.push(newProductKey);
    let orderCartForStore = JSON.stringify(parsedUserOrdersList);
    sessionStorage.setItem("userOrderCart", orderCartForStore);
  }
  const userOrdersListLength = JSON.parse(
    sessionStorage.getItem("userOrderCart")
  ); //從瀏覽器端取值
  updateCartStatus(productKeyID, productName, productPrice); //更新使用者看的購物
  navCartInfoElm.innerText = userOrdersListLength.length; // 更新導覽頁購物車
}

//展示用戶商品元素值
function displayCartStatus() {
  const orderCartList = sessionStorage.getItem("orderCartList"); //從瀏覽器端取值
  if (orderCartList) {
    interfaceCartInfoElm.innerHTML = orderCartList;
  }
}

//展示並更新購物車狀態
function updateCartStatus(productKeyID, productName, productPrice) {
  const orderCartList = sessionStorage.getItem("orderCartList"); //從瀏覽器端取值
  if (!orderCartList) {
    const newDiv = `<div class="modCenterFontStyle productBox back"><p>購物車清單</p></div>`;
    interfaceCartInfoElm.innerHTML = newDiv;
    const productcontainerElm = document.createElement("div"); // 建立置入購物車品項元素
    productcontainerElm.setAttribute("key", productKeyID);
    productcontainerElm.setAttribute("class", "divbackground");
    const itemText = `<span><button id="deleteProduct" class="modButtonElmStyle" onclick="deleteItem(this)"><p>刪除品項</p></button></span><span class="setProTextFontStyle"><p>品項:${productName}</p></span><span class="setProTextFontStyle"><p>費用:${productPrice}</p></span>`;
    productcontainerElm.innerHTML = itemText;
    interfaceCartInfoElm.appendChild(productcontainerElm);
    let AllProductContainerElm = Array.from(
      interfaceCartInfoElm.querySelectorAll("div")
    );
    let productContainerElmList = AllProductContainerElm.map(
      (item) => item.outerHTML
    ).join("");
    let orderCartListForStore = [];
    orderCartListForStore.push(productContainerElmList);
    sessionStorage.setItem("orderCartList", orderCartListForStore);
  } else {
    const productcontainerElm = document.createElement("div"); // 建立置入購物車品項元素
    productcontainerElm.setAttribute("key", productKeyID);
    productcontainerElm.setAttribute("class", "divbackground");
    const itemText = `<span><button id="deleteProduct" class="modButtonElmStyle" onclick="deleteItem(this)"><p>刪除品項</p></button></span><span class="setProTextFontStyle"><p>品項:${productName}</p></span><span class="setProTextFontStyle"><p>費用:${productPrice}</p></span>`;
    productcontainerElm.innerHTML = itemText;
    interfaceCartInfoElm.appendChild(productcontainerElm);
    let AllProductContainerElm = Array.from(
      interfaceCartInfoElm.querySelectorAll("div")
    );
    let productContainerElmList = AllProductContainerElm.map(
      (item) => item.outerHTML
    ).join("");

    let orderCartListForStore = [];
    orderCartListForStore.push(productContainerElmList);
    sessionStorage.setItem("orderCartList", orderCartListForStore);
  }
}

//刪除特定商品元素
function deleteItem(prodContElm) {
  const userOrdersList = sessionStorage.getItem("userOrderCart"); //取用戶購物車值
  let parsedUserOrdersList = JSON.parse(userOrdersList);

  const deleteProductElm = prodContElm.parentElement.parentElement; //取慾刪除商品元素

  const deleteKey = deleteProductElm.getAttribute("key"); //取慾刪除商品ID

  const productKeyIndex = orderCart.indexOf(deleteKey); //比對 當前頁面購物車  商品ID 位置
  const userOrdersKeyIndex = parsedUserOrdersList.indexOf(deleteKey); //比對 瀏覽器用戶購物車 商品ID 位置

  orderCart.splice(productKeyIndex, 1); // 移除 當前頁面購物車 1 個元素
  parsedUserOrdersList.splice(userOrdersKeyIndex, 1); //  移除 瀏覽器用戶購物車 1 個元素

  let orderCartForStore = JSON.stringify(parsedUserOrdersList);
  sessionStorage.setItem("userOrderCart", orderCartForStore); //存用戶購物車值

  interfaceCartInfoElm.removeChild(deleteProductElm); // 移除 慾刪除商品元素
  navCartInfoElm.innerText = parsedUserOrdersList.length; // 更新導覽頁購物車 (從瀏覽器用戶購物車值)
  let AllProductContainerElm = Array.from(
    interfaceCartInfoElm.querySelectorAll("div")
  ); //存取 當前全部商品元素
  let productContainerElmList = AllProductContainerElm.map(
    (item) => item.outerHTML
  ).join("");
  let orderCartListForStore = [];
  orderCartListForStore.push(productContainerElmList);
  sessionStorage.setItem("orderCartList", orderCartListForStore); //存用戶商品元素值
}

//送出用戶購物車清單
function sendCartItem() {
  const userOrdersList = sessionStorage.getItem("userOrderCart"); //取用戶購物車值
  let parsedUserOrdersList = JSON.parse(userOrdersList);
  const finalOrderCart = parsedUserOrdersList.join(",");
  const encodefinalOrderCart = encodeURIComponent(finalOrderCart);
  window.location.href = `https://cliffweb.zeabur.app/checkout/?cart=${encodefinalOrderCart}`;
  sessionStorage.clear();
}

document.querySelector("#controlUserCart").addEventListener("click", () => {
  document.querySelector("#cartStatus").classList.toggle("visibilityElm");
});
