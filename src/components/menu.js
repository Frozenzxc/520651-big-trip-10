const createTabMarkup = (tabs) => {
  return tabs
    .map((tab) => {
      return (
        `<a class="trip-tabs__btn ${tab.isActive ? `trip-tabs__btn--active` : ``}" href="#">${tab.name}</a>`
      );
    })
    .join(`\n`);
};


const createMenuTemplate = (menu) => {
  const tabList = createTabMarkup(Array.from(menu));
  return (
    `<h2 class="visually-hidden">Switch trip view</h2>
     <nav class="trip-controls__trip-tabs  trip-tabs">
       ${tabList}
     </nav>`
  );
};

export {createMenuTemplate};
