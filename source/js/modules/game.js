const counter = document.querySelector(`.game__counter`);
const minEl = counter.querySelector(`.minutes`);
const secEl = counter.querySelector(`.seconds`);
const maxTime = 5 * 60 * 1000;
let remainTime = maxTime;
let reqId;

function getValue(value) {
  return String(value).length === 1 ? `0${value}` : value;
}

function setTimer(setTime) {
  const minuteVal = Math.floor(setTime / (60 * 1000));
  const seccondVal = Math.floor((setTime % (60 * 1000)) / 1000);

  minEl.innerText = getValue(minuteVal);
  secEl.innerText = getValue(seccondVal);
}

function runTimer(callback) {
  let now;
  let then = Date.now();
  let elapsed;

  const tick = () => {
    reqId = requestAnimationFrame(tick);

    now = Date.now();
    elapsed = now - then;

    if (remainTime <= 0) {
      cancelAnimationFrame(reqId);
      if (callback) {
        callback();
      }
    } else if (elapsed >= 1000) {
      then = now - (elapsed % 1000);
      remainTime -= 1000;
      setTimer(remainTime);
    }
  };

  reqId = requestAnimationFrame(tick);
}

function resetTimer() {
  if (reqId) {
    cancelAnimationFrame(reqId);
    setTimer(maxTime);
    reqId = null;
    remainTime = maxTime;
  }
}

export {
  runTimer,
  resetTimer
};
