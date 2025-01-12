async function updateUserInfo() {
  const usernameElmValue = document.querySelector("#username").value;
  const userbirthdayElmValue = document.querySelector("#userbirthday").value;
  const usergenderElmValue = document.querySelector("#usergender").value;
  const bundleMemberInfo = {
    username: usernameElmValue,
    userbirthday: userbirthdayElmValue,
    usergender: usergenderElmValue,
  };

  const response = await fetch(
    "https://cliffweb.zeabur.app/member/updateMemberInfo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(bundleMemberInfo),
    }
  );

  if (!response.status) {
    alert("發生錯誤");
    return;
  }
  const messageFromServer = await response.text();
  alert(messageFromServer);
}
