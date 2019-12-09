import {formatTime, getDuration, createElement} from "../util";

const createOfferMarkup = (offers) => {
  return offers
    .map(({name, price}) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${name}</span>
          +
          &euro;<span class="event__offer-price">${price}</span>
         </li>`
      );
    })
    .join(`\n`);
};

const createCardTemplate = (card) => {

  const offerList = createOfferMarkup(card.offers);

  const startTime = new Date(card.startTime);
  const endTime = new Date(card.endTime);

  return (
    `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${card.type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${card.type} to ${card.destination}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${card.startTime}">${formatTime(startTime)}</time>
              &mdash;
              <time class="event__end-time" datetime="${card.endTime}">${formatTime(endTime)}</time>
            </p>
            <p class="event__duration">${getDuration(startTime, endTime)}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${card.price}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offerList}
          </ul>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
    </li>`
  );
};

export default class Card {
  constructor(cards) {
    this._cards = cards;
    this._element = null;
  }

  getTemplate() {
    return createCardTemplate(this._cards);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
