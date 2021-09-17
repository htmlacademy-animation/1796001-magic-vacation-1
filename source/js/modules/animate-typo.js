class animateTypo {
  constructor(
      elemSelector,
      timer,
      randomDelay,
      prop) {
    this._TIME_SPACE = 100;

    this._elemSelector = elemSelector;
    this._timer = timer;
    this._randomDelay = randomDelay;
    this._prop = prop;

    this._elements = [...document.querySelectorAll(this._elemSelector)];
  }

  createLetterElement(letter, idx, length) {
    const elem = document.createElement(`span`);
    elem.textContent = letter;
    elem.style.transitionProperty = this._prop;
    elem.style.transitionDuration = `${this._timer}ms`;
    elem.style.transitionTimingFunction = `ease`;

    if (this._randomDelay) {
      const delay = (Math.abs((idx % length) - (length - 3)) * Math.trunc(Math.random() * 60 + 60));
      elem.style.transitionDelay = `${delay}ms`;
    }

    return elem;
  }

  prepareText() {
    if (!this._elements.length) {
      return;
    }

    this._elements.forEach((element) => {
      const text = element.textContent.trim().split(` `).filter((word) => word);

      const content = text.reduce((fragmentParent, word, idx) => {
        const wordElement = word.split(``).reduce((fragment, letter, i) => {
          fragment.appendChild(this.createLetterElement(letter, i, word.length));
          return fragment;
        }, document.createDocumentFragment());
        if (!((idx + 1) % 2)) {
          fragmentParent.appendChild(document.createTextNode(` `));
        }
        const wordContainer = document.createElement(`span`);
        wordContainer.classList.add(`word-text`);
        wordContainer.appendChild(wordElement);
        fragmentParent.appendChild(wordContainer);
        return fragmentParent;
      }, document.createDocumentFragment());

      element.innerHTML = ``;
      element.appendChild(content);
    });
  }
}

export default animateTypo;
