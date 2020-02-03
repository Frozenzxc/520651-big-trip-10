import AbstractComponent from "./abstract-component";

const TripLength = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3
};

const getTripRoutes = (cards) => {
  if (cards.length > TripLength.THREE) {
    return cards[0].destination.name + ` - ... - ` + cards[cards.length - 1].destination.name;
  } else if (cards.length === TripLength.THREE) {
    return cards[0].destination.name + ` - ` + cards[1].destination.name + ` - ` + cards[2].destination.name;
  } else if (cards.length === TripLength.TWO) {
    return cards[0].destination.name + ` - ` + cards[1].destination.name;
  } else if (cards.length === TripLength.ONE) {
    return cards[0].destination.name;
  } else {
    return `Маршрут не выбран`;
  }
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
    if (cards.length === 0) {
      this._tripDates.textContent = ``;
    } else if (cards.length === 1) {
      this._tripDates.textContent = (new Date(cards[0].startTime)).toDateString().substr(4, 6);
    } else {
      this._tripDates.textContent = (new Date(cards[0].startTime)).toDateString().substr(4, 6) + ` - ` + (new Date(cards[cards.length - 1].endTime)).toDateString().substr(4, 6);
    }
  }
}
