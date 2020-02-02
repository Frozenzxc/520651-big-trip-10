import flatpickr from "flatpickr";
import AbstractSmartComponent from "./abstract-smart-component";
import StoreModel from "../models/store-model";
import {setDateTimeAttr, formatCardTitle} from "../utils/common";
import debounce from "lodash/debounce";

const DEBOUNCE_TIMEOUT = 500;

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const createOfferMarkup = (card, availableOffers) => {
  const index = availableOffers.findIndex((it) => it.type === card.type);

  const offers = availableOffers[index].offers;
  card.offers.forEach((it) => {
    const offerIndex = availableOffers[index].offers.findIndex((item) => item.title === it.title);

    if (offerIndex === -1) {
      offers.push(it);
    }
  });

  return offers.map((offer, offerIndex) => {
    let isCheckedOffer = ``;
    card.offers.forEach((it) => {
      if (offer.title === it.title) {
        isCheckedOffer = `checked`;
        offer.price = it.price;
      }
    });
    return (
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${card.type}-${offerIndex + 1}" type="checkbox" name="event-offer-${card.type}" ${isCheckedOffer}>
          <label class="event__offer-label" for="event-offer-${card.type}-${offerIndex + 1}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
           </label>
          </div>`
    );
  })
  .join(`\n`);
};

const createCardEditTemplate = (card, options = {}) => {
  const {externalData, offers} = options;

  const offerList = createOfferMarkup(card, offers);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

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
                          ${formatCardTitle(card)}
                        </label>
                        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${card.destination.name ? card.destination.name : ``}" list="destination-list-1" required>
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
                        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${setDateTimeAttr(card.startTime)}">
                        &mdash;
                        <label class="visually-hidden" for="event-end-time-1">
                          To
                        </label>
                        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${setDateTimeAttr(card.startTime)}">
                      </div>

                      <div class="event__field-group  event__field-group--price">
                        <label class="event__label" for="event-price-1">
                          <span class="visually-hidden">${card.price}</span>
                          &euro;
                        </label>
                        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${card.price}">
                      </div>

                      <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
                      <button class="event__reset-btn" type="reset">${deleteButtonText}</button>

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
                    ${offerList || card.destination ? `
                    <section class="event__details">
                    ${offerList ? `<section class="event__section  event__section--offers">
                        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                        <div class="event__available-offers">
                        ${offerList}
                        </div>
                      </section>` : ``}
                    ${card.destination ? `<section class="event__section  event__section--destination">
                        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                        <p class="event__destination-description">${card.destination.description}</p>
                        ${card.destination.pictures ? `<div class="event__photos-container">
                          <div class="event__photos-tape">
                            ${card.destination.pictures.map((it) => (`<img class="event__photo" src="${it.src}" alt="${it.description}">`))
    }

                          </div>
                        </div>` : ``}
                      </section>` : ``}
                    </section>` : ``}
                  </form>`
  );
};

export default class CardEdit extends AbstractSmartComponent {
  constructor(card) {
    super();
    this._card = card;
    this._oldCard = Object.assign({}, this._card);
    this._flatpickr = null;
    this._submitButtonClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._editCloseButtonClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._externalData = DefaultData;
    this._destinations = StoreModel.getAllDestinations();
    this._offers = StoreModel.getOffers();

    this._deleteBtn = this.getElement().querySelector(`.event__reset-btn`);
    this._favoriteBtn = this.getElement().querySelector(`#event-favorite-1`);

    this._applyFlatpickr();
    this._subscribeOnEvents();
    this.setDestinations(this._destinations);
  }

  getTemplate() {
    return createCardEditTemplate(this._card, {
      externalData: this._externalData,
      offers: this._offers,
    });
  }

  recoveryListeners() {
    this.setEditCloseButtonClickHandler(this._editCloseButtonClickHandler);
    this.setSubmitHandler(this._submitButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this._subscribeOnEvents();
    this.setDestinations(this._destinations);
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);
    return {
      form: formData,
      offers: this._card.offers
    };
  }

  resetForm() {
    this._card = this._oldCard;
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitButtonClickHandler = handler;
  }

  setEditCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._editCloseButtonClickHandler = handler;
  }

  setDestinations(allDestinations) {
    const container = this.getElement().querySelector(`#destination-list-1`);
    if (allDestinations !== null) {
      container.innerHTML = ``;
      allDestinations.map((it) => {
        const opt = document.createElement(`option`);
        container.append(opt);
        opt.value = it.name;
      });
    }
  }

  deleteCardCloseButton() {
    this.getElement().querySelector(`.event__rollup-btn`).remove();
  }

  clearCardOffers() {
    this.getElement().querySelector(`.event__details`).remove();
  }

  reset() {
    this.rerender();
  }

  setDeleteButtonClickHandler(handler) {
    this._deleteBtn.addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this._favoriteBtn.addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
    this._card.isFavorite = this._favoriteBtn.checked;
    this._favoriteButtonClickHandler = handler;
  }

  getFavorite() {
    return this._card;
  }

  disableForm() {
    const form = this.getElement();
    const elements = Array.from(form.elements);
    elements.forEach((elm) => {
      elm.readOnly = true;
    });
  }

  activateForm() {
    const form = this.getElement();
    const elements = Array.from(form.elements);
    elements.forEach((elm) => {
      elm.readOnly = false;
    });
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    const startTimeElement = this.getElement().querySelector(`#event-start-time-1`);
    this._flatpickr = flatpickr(startTimeElement, {
      allowInput: true,
      enableTime: true,
      dateFormat: `d/m/Y H:i`,
      defaultDate: this._card.startTime,
    });

    const endTimeElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickr = flatpickr(endTimeElement, {
      allowInput: true,
      enableTime: true,
      dateFormat: `d/m/Y H:i`,
      defaultDate: this._card.endTime,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`)
      .addEventListener(`change`, (evt) => {
        const index = this._offers.findIndex((it) => it.type === evt.target.value);
        this._card.type = evt.target.value;
        this._card.offers = this._offers[index].offers;

        this.rerender();
      });

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const index = this._destinations.findIndex((it) => it.name === evt.target.value);
        if (index >= 0) {
          this._card.destination = this._destinations[index];
          this.rerender();
        } else {
          evt.target.setCustomValidity(`Выберите точку назначения из списка`);
        }
      });

    element.querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, () => {
        this._card.isFavorite = !this._card.isFavorite;
        this._oldCard.isFavorite = this._card.isFavorite;
      });

    element.querySelector(`.event__input--price`)
      .addEventListener(`change`, (evt) => {
        this._card.price = Math.round(evt.target.value);
      });

    element.querySelector(`#event-start-time-1`)
      .addEventListener(`change`, (evt) => {
        this._card.startTime = evt.target.value;
      });

    element.querySelector(`#event-end-time-1`)
      .addEventListener(`change`, (evt) => {
        this._card.endTime = evt.target.value;
      });

    Array.from(element.querySelectorAll(`.event__offer-selector`))
      .forEach((it) => {
        it.querySelector(`.event__offer-checkbox`)
          .addEventListener(`change`, (evt) => {
            const title = it.querySelector(`.event__offer-title`).textContent;
            const price = it.querySelector(`.event__offer-price`).textContent;
            const newOffer = {
              title,
              price: +price
            };
            if (evt.target.checked) {
              if (!this._card.offers.includes(newOffer)) {
                this._card.offers.push(newOffer);
              }
            } else {
              const index = this._card.offers.findIndex((item) => item.title === title);
              this._card.offers = [].concat(this._card.offers.slice(0, index), this._card.offers.slice(index + 1));
            }
          });
      });
  }
}
