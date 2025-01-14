const nameElm = document.querySelector("#name");
const mailElm = document.querySelector("#mail");
const phoneElm = document.querySelector("#phone");
const subjectElm = document.querySelector("#subject");
const contentElm = document.querySelector("#textareacontent");
const fileElm = document.querySelector("#filemessage");
const progressNumElm = document.querySelector("#progressbarNum");
const progressAnimeElm = document.querySelector("#progressbarAnime");
const uploadElm = document.querySelector("#strupload");
uploadElm.addEventListener("click", () => {
  const mailValue = mailElm.value;
  if (!mailValue) {
    alert("信箱不能為空");
    return;
  }
  let parseMailValue = [];
  parseMailValue = [...mailValue];
  const resultOfMailCheck = parseMailValue.indexOf("@");
  if (resultOfMailCheck === -1) {
    alert("信箱格式不對");
    return;
  }
  const theFile = fileElm.files[0];
  const fileReader = new FileReader();
  fileReader.onload = async (e) => {
    const fileName = encodeURIComponent(theFile.name);
    const chunk_size = 10000;
    const chunkCount = Math.ceil(e.target.result.byteLength / chunk_size);

    for (let chunkId = 0; chunkId < chunkCount + 1; chunkId++) {
      const chunk = e.target.result.slice(
        chunkId * chunk_size,
        chunkId * chunk_size + chunk_size
      );

      await fetch(
        "https://cliffweb.zeabur.app/contact/sendUserMessageWithFile",
        {
          method: "POST",
          headers: {
            "content-type": "application/octet-stream",
            "content-length": chunk.length,
            size: e.target.result.byteLength,
            "file-name": fileName,
          },
          body: chunk,
        }
      );
      const completePercentage = Math.floor((chunkId * 100) / chunkCount);
      progressNumElm.textContent = `${completePercentage}`;
      progressAnimeElm.setAttribute("value", completePercentage);
    }
    (async () => {
      const nameValue = nameElm.value;
      const mailValue = mailElm.value;
      const phoneValue = phoneElm.value;
      const subjectValue = subjectElm.value;
      const contentValue = contentElm.value;
      let body = {
        username: nameValue,
        usermail: mailValue,
        userphone: phoneValue,
        mailSubject: subjectValue,
        userFeedBack: contentValue,
      };
      console.log(body);

      const response = await fetch(
        "https://cliffweb.zeabur.app/contact/sendUserMessageWithFile",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "file-name": fileName,
          },
          body: JSON.stringify(body),
        }
      );
      const serverReturnMessage = await response.text();
      alert(serverReturnMessage);
    })();
  };

  if (theFile) {
    fileReader.readAsArrayBuffer(theFile);
  } else {
    contactUsFormatMessage();
  }
  async function contactUsFormatMessage() {
    const nameValue = nameElm.value;
    const mailValue = mailElm.value;
    const phoneValue = phoneElm.value;
    const subjectValue = subjectElm.value;
    const contentValue = contentElm.value;
    let body = {
      username: nameValue,
      usermail: mailValue,
      userphone: phoneValue,
      mailSubject: subjectValue,
      userFeedBack: contentValue,
    };
    console.log(body);
    const response = await fetch(
      "https://cliffweb.zeabur.app/contact/sendUserMessage",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const serverReturnMessage = await response.text();
    alert(serverReturnMessage);
  }
});
