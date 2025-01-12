(() => {
  const successUserLoginInfoElm = document.querySelector(
    "#successUserLoginInfo"
  );
  const serverFeedbackMessage = successUserLoginInfoElm.innerText;
  if (serverFeedbackMessage) {
    alert(serverFeedbackMessage);
    successUserLoginInfoElm.innerHTML = "";
  }
})();
