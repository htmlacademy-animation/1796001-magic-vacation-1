const counter = document.querySelector(`.game__counter`);
const minEl = counter.querySelector(`.minutes`);
const secEl = counter.querySelector(`.seconds`);
const FPS = 1;
const F_INTERVAL = 1000 / FPS;
const DURATION = 5 * 60 * 1000;

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
  let start = Date.now();
  let now;
  let then = start;
  let elapsed;

  const tick = () => {
    reqId = requestAnimationFrame(tick);
    now = Date.now();
    elapsed = now - then;

    const remainTime = DURATION - (now - start);

    if (remainTime < 0) {
      cancelAnimationFrame(reqId);
      if (callback) {
        callback();
      }
    } else if (elapsed >= F_INTERVAL) {
      then = now - (elapsed % F_INTERVAL);
      setTimer(remainTime);
    }
  };

  reqId = requestAnimationFrame(tick);
}

function resetTimer() {
  if (reqId) {
    cancelAnimationFrame(reqId);
    setTimer(DURATION);
    reqId = null;
  }
}

export {
  runTimer,
  resetTimer
};
