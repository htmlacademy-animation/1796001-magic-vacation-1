function reset(svg) {
  const resetPoints = [...svg.querySelectorAll(`animate, animateMotion, animateTransform`)];

  resetPoints.forEach((elem) => {
    let clone = elem.cloneNode();
    elem.parentNode.replaceChild(clone, elem);
  });
}

export default function controlSmil(pageId) {
  switch (pageId) {
    case `prizes`:
      const svg = document.querySelector(`#prize1`);
      reset(svg);
      const animationPoint = document.querySelector(`#prize1StartPoint`);

      animationPoint.beginElement();
      break;
  }
}
