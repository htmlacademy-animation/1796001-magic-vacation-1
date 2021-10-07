const counters = [...document.querySelectorAll(`.prizes__desc b`)];
const FPS = 12;
const F_INTERVAL = 1000 / FPS;
const MAX_F = 6;

let reqId;

function setCount(elem, setValue) {
  elem.innerText = setValue;
}

function runCounter(elem, startValue = 0, callback) {
  let finalValue = parseInt(elem.innerText, 10);
  let step = Math.ceil((finalValue - startValue) / MAX_F);
  let passedValue = startValue;
  let now;
  let then = Date.now();
  let elapsed;

  elem.dataset.defaultValue = finalValue;
  setCount(elem, startValue);

  const tick = () => {
    reqId = requestAnimationFrame(tick);
    now = Date.now();
    elapsed = now - then;

    if (elapsed >= F_INTERVAL) {
      then = now - (elapsed % F_INTERVAL);
      passedValue += step;

      if (passedValue >= finalValue) {
        setCount(elem, finalValue);
        cancelAnimationFrame(reqId);
        if (callback) {
          callback();
        }
      } else {
        setCount(elem, passedValue);
      }
    }
  };

  reqId = requestAnimationFrame(tick);
}

function runCounters() {
  counters.forEach((elem) => {
    runCounter(elem, parseInt(elem.dataset.start, 10) || 1);
  });
}

function resetCounters() {
  counters.forEach((elem) => {
    const defaultValue = elem.dataset.defaultValue;

    if (reqId && defaultValue) {
      cancelAnimationFrame(reqId);
      setCount(elem, defaultValue);
      reqId = null;
    }
  });
}

export {
  runCounters,
  resetCounters,
};
