import {formatDate} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";

const createOfferMarkup = (offers) => {
  return offers
    .map(({type, name, price, isChecked}) => {
      return (
        `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}"
            ${isChecked ? `checked` : ``}>
            <label class="event__offer-label" for="event-offer-${type}-1">
                <span class="event__offer-title">${name}</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">${price}</span>
             </label>
            </div>`
      );
    })
.join(`\n`);
};

const createCardEditTemplate = (card) => {
  const offerList = createOfferMarkup(card.offers);
  return (
    `<form class="event  event--edit" action="#" method="post">
                    <header class="event__header">
                      <div class="event__type-wrapper">
                        <label class="event__type  event__type-btn" for="event-type-toggle-1">
                          <span class="visually-hidden">Choose event type</span>
                          <img class="event__type-icon" width="17" height="17" src="img/icons/${card.type}.png" alt="Event type icon">
                        </label>
                        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                        <div class="event__type-list">
                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Transfer</legend>

                            <div class="event__type-item">
                              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${card.type === `taxi` ? `checked` : ``}>
                              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${card.type === `bus` ? `checked` : ``}>
                              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${card.type === `train` ? `checked` : ``}>
                              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${card.type === `ship` ? `checked` : ``}>
                              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport" ${card.type === `transport` ? `checked` : ``}>
                              <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${card.type === `drive` ? `checked` : ``}>
                              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${card.type === `flight` ? `checked` : ``}>
                              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                            </div>
                          </fieldset>

                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Activity</legend>

                            <div class="event__type-item">
                              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${card.type === `check-in` ? `checked` : ``}>
                              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${card.type === `sightseeing` ? `checked` : ``}>
                              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${card.type === `restaurant` ? `checked` : ``}>
                              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                            </div>
                          </fieldset>
                        </div>
                      </div>

                      <div class="event__field-group  event__field-group--destination">
                        <label class="event__label  event__type-output" for="event-destination-1">
                          ${card.type} at
                        </label>
                        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${card.destination}" list="destination-list-1">
                        <datalist id="destination-list-1">
                          <option value="Amsterdam"></option>
                          <option value="Geneva"></option>
                          <option value="Chamonix"></option>
                        </datalist>
                      </div>

                      <div class="event__field-group  event__field-group--time">
                        <label class="visually-hidden" for="event-start-time-1">
                          From
                        </label>
                        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(new Date(card.startTime))}">
                        &mdash;
                        <label class="visually-hidden" for="event-end-time-1">
                          To
                        </label>
                        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(new Date(card.endTime))}">
                      </div>

                      <div class="event__field-group  event__field-group--price">
                        <label class="event__label" for="event-price-1">
                          <span class="visually-hidden">${card.price}</span>
                          &euro;
                        </label>
                        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${card.price}">
                      </div>

                      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                      <button class="event__reset-btn" type="reset">Delete</button>

                      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${card.isFavorite ? `checked` : ``}>
                      <label class="event__favorite-btn" for="event-favorite-1">
                        <span class="visually-hidden">Add to favorite</span>
                        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                        </svg>
                      </label>

                      <button class="event__rollup-btn" type="button">
                        <span class="visually-hidden">Open event</span>
                      </button>
                    </header>

                    <section class="event__details">

                      <section class="event__section  event__section--offers">
                        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                        <div class="event__available-offers">
                        ${offerList}
                        </div>
                      </section>

                      <section class="event__section  event__section--destination">
                        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                        <p class="event__destination-description">${card.description}</p>

                        <div class="event__photos-container">
                          <div class="event__photos-tape">
                            <img class="event__photo" src="http://picsum.photos/300/150?r=${Math.random()}" alt="Event photo">
                            <img class="event__photo" src="http://picsum.photos/300/150?r=${Math.random()}" alt="Event photo">
                            <img class="event__photo" src="http://picsum.photos/300/150?r=${Math.random()}" alt="Event photo">
                            <img class="event__photo" src="http://picsum.photos/300/150?r=${Math.random()}" alt="Event photo">
                            <img class="event__photo" src="http://picsum.photos/300/150?r=${Math.random()}" alt="Event photo">
                          </div>
                        </div>
                      </section>
                    </section>
                  </form>`
  );
};

export default class CardEdit extends AbstractSmartComponent {
  constructor(card) {
    super();
    this._card = card;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createCardEditTemplate(this._card);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`)
      .addEventListener(`change`, (evt) => {
        this._card.type = evt.target.value;

        this.rerender();
      });

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        this._card.destination = evt.target.value;

        this.rerender();
      });

    element.querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, () => {
        this._card.isFavorite = !this._card.isFavorite;

        this.rerender();
      });
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);
  }

  setEditCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }

  reset() {
    this.rerender();
  }
}
