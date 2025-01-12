const emaildiv = document.querySelector("#inputemail");
const buttondiv = document.querySelector("#sendInfo");
buttondiv.addEventListener("click", async () => {
  const userEmail = emaildiv.value;
  const response = await fetch(
    "https://cliffweb.zeabur.app/contact/sendUpdateUserPassWord",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ userEmail: userEmail }),
    }
  );
  const message = await response.text();
  alert(message);
});
