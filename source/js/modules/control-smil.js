function reset(svg) {
  const resetPoints = [...svg.querySelectorAll(`animate, animateMotion, animateTransform`)];

  resetPoints.forEach((elem) => {
    let clone = elem.cloneNode();
    elem.parentNode.replaceChild(clone, elem);
  });
}

function resetAndStart(svg, selector) {
  reset(svg);
  const animationPoint = document.querySelector(selector);
  animationPoint.beginElement();
}

export default function controlSmil(pageId) {
  switch (pageId) {
    case `prizes`:
      const svgPrize1 = document.querySelector(`#prize1`);
      const svgPrize2 = document.querySelector(`#prize2`);

      resetAndStart(svgPrize1, `#prize1StartPoint`);
      resetAndStart(svgPrize2, `#prize2StartPoint`);
      break;
  }
}
