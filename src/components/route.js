import AbstractComponent from "./abstract-component";

const getTripRoutes = (cards) => {
  if (cards.length < 3) {
    return cards[0].destination + ` - ` + cards[1].destination + ` - ` + cards[2].destination;
  }
  return cards[0].destination + ` - ... - ` + cards[cards.length - 1].destination;
};

const createRouteTemplate = (cards) => {

  return (
    `<div class="trip-info__main">
        <h1 class="trip-info__title">${getTripRoutes(cards)}</h1>
        <p class="trip-info__dates">${(new Date(cards[0].startTime)).toDateString().substr(4, 6)}&nbsp;&mdash;&nbsp;${(new Date(cards[cards.length - 1].endTime)).toDateString().substr(4, 6)}</p>
    </div>`
  );
};

export default class Route extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createRouteTemplate(this._cards);
  }
}
