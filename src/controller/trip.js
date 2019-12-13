import {render, RenderPosition, replace} from "../utils/render";
import {
  Card,
  CardEdit,
  NoCards,
  TripDays,
  TripList,
  Sort
} from "../components/index";
import {SortType} from "../components/index";
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

const renderCards = (cards, tripEventList) => {
  cards.forEach((card) => {
    renderCard(card, tripEventList);
  });
};

const renderCardsByDays = (container, cards) => {
  Array.from(tripDates).forEach((it, index) => {
    const trip = new TripDays(it, index + 1);
    render(container.getElement(), trip, RenderPosition.BEFOREEND);
    const tripEventsList = trip.getElement().querySelector(`.trip-events__list`);
    filterCardByEventDate(cards, it).forEach((card) => {
      renderCard(card, tripEventsList);
    });
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noCards = new NoCards();
    this._sort = new Sort();
  }

  render(cards) {
    const container = this._container;
    const tripList = new TripList();

    if (!cards.length) {
      render(container, this._noCards, RenderPosition.BEFOREEND);
    }
    render(container, this._sort, RenderPosition.BEFOREEND);
    render(container, tripList, RenderPosition.BEFOREEND);
    renderCardsByDays(tripList, cards);


    this._sort.setSortTypeChangeHandler((sortType) => {
      let sortedCards = [];

      switch (sortType) {
        case SortType.TIME:
          sortedCards = cards.slice().sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));
          break;
        case SortType.PRICE:
          sortedCards = cards.slice().sort((a, b) => b.price - a.price);
          break;
        case SortType.DEFAULT:
          sortedCards = cards.slice();
          break;
      }

      tripList.getElement().innerHTML = ``;

      if (sortType === SortType.DEFAULT) {
        renderCardsByDays(tripList, sortedCards);
      }
      const trip = new TripDays(0, 1);
      render(tripList.getElement(), trip, RenderPosition.BEFOREEND);
      const tripEventsList = trip.getElement().querySelector(`.trip-events__list`);
      renderCards(sortedCards, tripEventsList);
    });
  }
}
