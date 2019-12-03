const createMenuTemplate = (menuTabs) => {

  return (
    `<h2 class="visually-hidden">Switch trip view</h2>
     <nav class="trip-controls__trip-tabs  trip-tabs">
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

export {createMenuTemplate};
