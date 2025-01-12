const counttimeElm = document.querySelector("#counttime p");
let timevalue = counttimeElm.innerText;

const timerID = setInterval(startCountdown, 1000);

function startCountdown() {
  timevalue -= 1;
  counttimeElm.innerHTML = timevalue;
  if (timevalue === 0) {
    clearInterval(timerID);
    window.location.href = `https://cliffweb.zeabur.app/login/`;
  }
}
