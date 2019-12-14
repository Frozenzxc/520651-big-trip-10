import AbstractComponent from "./abstract-component";

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

export default class Menu extends AbstractComponent {
  constructor(menuTabs) {
    super();
    this._menuTabs = menuTabs;
  }

  getTemplate() {
    return createMenuTemplate(this._menuTabs);
  }
}
