(function setNavCartInfo() {
  const navCartInfoElm = document.querySelector("#userCart");
  const userOrdersList = JSON.parse(sessionStorage.getItem("userOrderCart")); //從瀏覽器端取值
  if (!userOrdersList) {
    navCartInfoElm.innerText = 0;
  } else {
    navCartInfoElm.innerText = userOrdersList.length;
  }
})();

function sendCartItem() {
  const userOrdersList = sessionStorage.getItem("userOrderCart"); //從瀏覽器端取值
  let parsedUserOrdersList = JSON.parse(userOrdersList);
  const finalOrderCart = parsedUserOrdersList.join(",");
  const encodefinalOrderCart = encodeURIComponent(finalOrderCart);
  window.location.href = `https://cliffweb.zeabur.app/checkout/?cart=${encodefinalOrderCart}`;
  sessionStorage.clear();
}
