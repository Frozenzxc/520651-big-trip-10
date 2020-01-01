import AbstractComponent from "./abstract-component";

const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

const ACTIVE_MENU_ITEM_CLASS = `trip-tabs__btn--active`;

const createMenuTemplate = () => {

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
     <h2 class="visually-hidden">Switch trip view</h2>
       <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-menu-item ="${MenuItem.TABLE}">Table</a>
       <a class="trip-tabs__btn" href="#" data-menu-item ="${MenuItem.STATS}">Stats</a>
     </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _setActiveItem(newActiveElm) {
    const oldActiveElm = this.getElement().querySelector(`.trip-tabs__btn--active`);
    oldActiveElm.classList.remove(`trip-tabs__btn--active`);
    newActiveElm.classList.add(`trip-tabs__btn--active`);
  }

  setOnClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      this._setActiveItem(evt.target);

      const activeMenuItem = evt.target.dataset.menuItem;

      handler(activeMenuItem);
    });
  }
}

export {MenuItem};
