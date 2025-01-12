function returnUserFeedBackMailFormat(
  username,
  useremail,
  userphone,
  mailSubject,
  userrtext
) {
  const defaultMessage = "未填值";
  const usernameCnt = username || defaultMessage;
  const useremailCnt = useremail || defaultMessage;
  const userphoneCnt = userphone || defaultMessage;
  const mailSubjectCnt = mailSubject || defaultMessage;
  const userCnt = userrtext || defaultMessage;
  const boxContainerStyle = `width:400px;height:300px;`;
  const contentContainerStyle = `width:100%;height:100%;background-color:whitesmoke;position:relative;top:50%;left:50%;transform:translate(-50%,-50%);`;
  const labelContainerStyle = `display:inline-block;border-style:ridge;width:35%;`;
  const userInfoContainerStyle = `display:inline-block;width:62%;border-style:ridge;background-color:white;`;
  return `<div style=${boxContainerStyle} >
    <div style=${contentContainerStyle}>
        <div style=${labelContainerStyle}>姓名:</div><div style=${userInfoContainerStyle}>${usernameCnt}</div>
        <div style=${labelContainerStyle}>電子郵件:</div><div style=${userInfoContainerStyle}>${useremailCnt}</div>
        <div style=${labelContainerStyle}>聯絡電話:</div><div style=${userInfoContainerStyle}>${userphoneCnt}</div>
        <div style=${labelContainerStyle}>內容反應:</div><div style=${userInfoContainerStyle}>${mailSubjectCnt}</div>
        <div style="display:inline-block; border-style: ridge;  width:98.5%;  ">備註說明:</div>
        <div style="display:inline-block; border-style: ridge; background-color:white; width:98.5%; height:160px; word-break:break-all; ">
            ${userCnt}
        </div>
    </div>
    
</div>`;
}

function returnUpdatePassWordMailFormat(username, new_password) {
  return `${username} 您好，

您的密碼已重置。以下是您的新密碼：

新密碼：${new_password}

請使用此密碼登錄您的帳戶，並建議您在登錄後立即更改密碼以確保帳戶安全。

如果您未要求重置密碼，請立即聯絡我們的客服團隊以保護您的帳戶。

若有任何問題，請隨時聯絡我們。`;
}

function commonMessageFormat(userInfoBox) {
  const { username, usermail, userphone, mailSubject, userFeedBack } =
    userInfoBox;
  return {
    from: usermail,
    to: "sideprojecttradeweb@gmail.com",
    subject: `Hello `,
    html: returnUserFeedBackMailFormat(
      username,
      usermail,
      userphone,
      mailSubject,
      userFeedBack
    ),
  };
}

function messageWithFileFormat(userInfoBox) {
  const { username, usermail, userphone, mailSubject, userFeedBack, fileName } =
    userInfoBox;
  return {
    from: usermail,
    to: "sideprojecttradeweb@gmail.com",
    subject: `Hello `,
    html: returnUserFeedBackMailFormat(
      username,
      usermail,
      userphone,
      mailSubject,
      userFeedBack
    ),
    attachments: [
      {
        filename: fileName,
        path: `./fileStore/${fileName}`,
      },
    ],
  };
}

function messageWithPassWordFormat(bundleUserInfo, new_password) {
  const { username, usermail } = bundleUserInfo;
  return {
    from: "sideprojecttradeweb@gmail.com",
    to: usermail,
    subject: `新密碼通知`,
    text: returnUpdatePassWordMailFormat(username, new_password),
  };
}

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = {
  commonMessageFormat,
  messageWithFileFormat,
  messageWithPassWordFormat,
};
