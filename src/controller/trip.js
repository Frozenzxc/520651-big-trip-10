import {render, RenderPosition, replace} from "../utils/render";
import {
  Card,
  CardEdit,
  NoCards,
  TripDays
} from "../components/index";
import {tripDates} from "../mock/card";

const renderCard = (card, container) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToCard = () => {
    replace(cardComponent, cardEditComponent);
  };

  const replaceCardToEdit = () => {
    replace(cardEditComponent, cardComponent);
  };

  const cardComponent = new Card(card);
  const cardEditComponent = new CardEdit(card);

  cardComponent.setEditButtonClickHandler(() => {
    replaceCardToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  cardEditComponent.setSubmitHandler(replaceEditToCard);

  render(container, cardComponent, RenderPosition.BEFOREEND);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noCards = new NoCards();
  }

  render(cards) {
    const container = this._container;

    if (!cards.length) {
      render(container, this._noCards, RenderPosition.BEFOREEND);
    } else {
      Array.from(tripDates).forEach((it, index) => {
        const trip = new TripDays(it, index + 1);
        render(container, trip, RenderPosition.BEFOREEND);
        const tripList = trip.getElement().querySelector(`.trip-events__list`);
        cards.forEach((card) => {
          if (new Date(card.startTime).toDateString() === it) {
            renderCard(card, tripList);
          }
        });
      });
    }
  }
}
