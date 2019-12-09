import {createElement} from "../util";

const createMenuTemplate = (menuTabs) => {

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
     <h2 class="visually-hidden">Switch trip view</h2>
       ${menuTabs
      .map(({name, isActive}) => {
        return (
          `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`
        );
      })
      .join(`\n`)
    }
     </nav>`
  );
};

export default class Menu {
  constructor(menuTabs) {
    this._menuTabs = menuTabs;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._menuTabs);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
