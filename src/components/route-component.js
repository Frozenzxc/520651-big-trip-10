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

export default class RouteComponent extends AbstractComponent {
  constructor() {
    super();

    this._tripTitle = this.getElement().querySelector(`.trip-info__title`);
    this._tripDates = this.getElement().querySelector(`.trip-info__dates`);
  }

  getTemplate() {
    return createRouteTemplate();
  }

  setRoute(cards) {
    this._tripTitle.textContent = getTripRoutes(cards);
    this._tripDates.textContent = (new Date(cards[0].startTime)).toDateString().substr(4, 6) + ` - ` + (new Date(cards[cards.length - 1].endTime)).toDateString().substr(4, 6);
  }
}
