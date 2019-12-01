import {formatTime, getDuration} from "../util";

const createOfferMarkup = (offers) => {
  return offers
    .map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.name}</span>
          +
          &euro;<span class="event__offer-price">${offer.price}</span>
         </li>`
      );
    })
    .join(`\n`);
};

const createCardTemplate = (card) => {
  let sum = 0;
  card.offers.forEach((it) => {
    sum += it.price;
  });
  const offerList = createOfferMarkup(Array.from(card.offers));
  return (
    `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${card.type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${card.type} to ${card.destination}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${card.startTime}">${formatTime(card.startTime)}</time>
              &mdash;
              <time class="event__end-time" datetime="${card.endTime}">${formatTime(card.endTime)}</time>
            </p>
            <p class="event__duration">${getDuration(card.startTime, card.endTime)}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${sum}</span>
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

export {createCardTemplate, createOfferMarkup};
