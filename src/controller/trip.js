import {render, RenderPosition, replace} from "../utils/render";
import {
  Card,
  CardEdit,
  NoCards,
  TripDays,
  TripList
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

const filterCardByEventDate = (cards, tripDate) => {
  return cards.filter((card) => new Date(card.startTime).toDateString() === tripDate);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noCards = new NoCards();
  }

  render(cards) {
    const container = this._container;
    const tripList = new TripList();

    if (!cards.length) {
      render(container, this._noCards, RenderPosition.BEFOREEND);
    }

    render(container, tripList, RenderPosition.BEFOREEND);

    Array.from(tripDates).forEach((it, index) => {
      const trip = new TripDays(it, index + 1);
      render(container, trip, RenderPosition.BEFOREEND);
      const tripEventsList = trip.getElement().querySelector(`.trip-events__list`);
      filterCardByEventDate(cards, it).forEach((card) => {
        renderCard(card, tripEventsList);
      });
    });
  }
}
