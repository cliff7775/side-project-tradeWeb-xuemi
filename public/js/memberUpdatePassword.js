async function updateUserPW() {
  const oldPwdElmValue = document.querySelector("#oldPwd").value;
  const newPwdElmValue = document.querySelector("#newPwd").value;
  const newPwdAgainElmValue = document.querySelector("#newPwdAgain").value;
  if (!oldPwdElmValue) {
    alert("舊密碼輸入欄不能為空值");
    return;
  }
  if (newPwdElmValue !== newPwdAgainElmValue) {
    alert("新密碼欄位輸入不匹配");
    return;
  }
  const header = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const bundlePwdInfo = {
    oldPwd: oldPwdElmValue,
    newPwd: newPwdElmValue,
    newPwdAgain: newPwdAgainElmValue,
  };
  const response = await fetch("https://cliffweb.zeabur.app/member/reset_pwd", {
    method: "POST",
    headers: header,
    body: new URLSearchParams(bundlePwdInfo),
  });
  if (!response.status) alert("發生錯誤");
  const messageFromServer = await response.text();
  alert(messageFromServer);
}
