import throttle from 'lodash/throttle';

export default class FullPageScroll {
  constructor() {
    this.CHANGE_SCREEN_DURATION = 500;
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.backgroundElement = document.querySelector(`.background-screen`);
    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.withBackroundScreensNames = [`prizes`, `rules`, `game`];
    this.keepButtonScreensNames = [`rules`, `game`];
    this.keepFooterScreensNames = [`prizes`, `rules`];
    this.delayedHideScreensNames = [`rules`];
    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);
    document.body.addEventListener(`screenChanged`, ({detail}) => {
      setTimeout(() => this.onScreenChanged(detail), 0);
    });
    window.addEventListener(`load`, () => this.onLoad());
  }

  onScreenChanged({screenName}) {
    if (this.withBackroundScreensNames.includes(screenName)) {
      this.backgroundElement.classList.add(`active`);
    } else {
      this.backgroundElement.classList.remove(`active`);
    }

    if (this.keepButtonScreensNames.includes(screenName)) {
      if (!document.body.classList.contains(`active-button`)) {
        setTimeout(() => {
          document.body.classList.add(`active-button`);
        }, this.CHANGE_SCREEN_DURATION);
      }
    } else {
      document.body.classList.remove(`active-button`);
    }

    if (this.keepFooterScreensNames.includes(screenName)) {
      if (!document.body.classList.contains(`active-footer`)) {
        document.body.classList.add(`show-footer`);

        setTimeout(() => {
          document.body.classList.remove(`show-footer`);
          document.body.classList.add(`active-footer`);
        }, this.CHANGE_SCREEN_DURATION);
      }
    } else {
      document.body.classList.remove(`active-footer`);
    }
  }

  onLoad() {
    this.onUrlHashChanged(true);
    setTimeout(() => {
      document.body.classList.add(`loaded`);
    }, 0);
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged(isInitialRun) {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay(isInitialRun);
  }

  changePageDisplay(isInitialRun) {
    this.changeVisibilityDisplay(isInitialRun);
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay(isInitialRun) {
    const visibilityChangeDuration = isInitialRun === true ? 0 : this.CHANGE_SCREEN_DURATION;

    this.screenElements.forEach((screen) => {
      const additionHideDuration = visibilityChangeDuration && this.delayedHideScreensNames.includes(screen.id) ? 250 : 0;

      if (screen.classList.contains(`active`)) {
        setTimeout(() => {
          screen.classList.add(`screen--hidden`);
          screen.classList.remove(`show`);
        }, visibilityChangeDuration + additionHideDuration);
      } else {
        screen.classList.add(`screen--hidden`);
      }
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
      this.screenElements[this.activeScreen].classList.add(`show`);
    }, visibilityChangeDuration);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
