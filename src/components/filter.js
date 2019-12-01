const createFilterMarkup = (filters) => {
  return filters
    .map((filter) => {
      return (
        `<div class="trip-filters__filter">
          <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${filter.isChecked ? `checked` : ``}>
          <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name.charAt(0).toUpperCase() + filter.name.substr(1)}</label>
        </div>`
      );
    })
    .join(`\n`);
};

const createFilterTemplate = (filters) => {
  const filterList = createFilterMarkup(Array.from(filters));
  return (
    `<h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filterList}
  
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
};

export {createFilterTemplate};
