function feedbackUserUpdateFilter(data) {
  const { username, userbirthday, usergender } = data;
  let value = "";
  switch (usergender) {
    case "Male":
      value += "(user_gender_id = 2)";
      break;
    case "Female":
      value += "(user_gender_id = 3)";
  }

  if (userbirthday) {
    value += `(user_birthday = "${userbirthday}")`;
  }

  if (username) {
    value += `(user_name = "${username}")`;
  }
  return value;
}

//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = { feedbackUserUpdateFilter };
