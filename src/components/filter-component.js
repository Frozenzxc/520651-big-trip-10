import AbstractComponent from "./abstract-component";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterTemplate = (filters) => {

  return (
    `<form class="trip-filters" action="#" method="get">
        <h2 class="visually-hidden">Filter events</h2>
        ${filters
      .map(({name, isChecked, isEnabled}) => {
        return (
          `<div class="trip-filters__filter">
          <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``} ${isEnabled ? `` : `disabled`}>
          <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
        </div>`
        );
      })
      .join(`\n`)
    }

        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
};

export default class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
