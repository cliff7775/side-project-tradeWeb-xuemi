function currentTimeStamp() {
  const time = new Date();
  return time.toLocaleString();
}
//【函式暴露】
//------------------------------------------------------------------------------>
module.exports = currentTimeStamp;
