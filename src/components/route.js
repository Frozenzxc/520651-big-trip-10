import AbstractComponent from "./abstract-component";

const getTripRoutes = (cards) => {
  if (cards.length < 3) {
    return cards[0].destination.name + ` - ` + cards[1].destination.name + ` - ` + cards[2].destination.name;
  }
  return cards[0].destination.name + ` - ... - ` + cards[cards.length - 1].destination.name;
};

const createRouteTemplate = () => {

  return (
    `<div class="trip-info__main">
        <h1 class="trip-info__title"></h1>
        <p class="trip-info__dates"></p>
    </div>`
  );
};

export default class Route extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createRouteTemplate();
  }

  setRoute(cards) {
    this.getElement().querySelector(`.trip-info__title`).textContent = getTripRoutes(cards);
    this.getElement().querySelector(`.trip-info__dates`).textContent = (new Date(cards[0].startTime)).toDateString().substr(4, 6) + ` - ` + (new Date(cards[cards.length - 1].endTime)).toDateString().substr(4, 6);
  }
}
