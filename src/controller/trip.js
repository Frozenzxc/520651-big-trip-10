import {render, RenderPosition} from "../utils/render";
import {
  NoCards,
  TripDays,
  TripList,
  Sort
} from "../components/index";
import {SortType} from "../components/index";
import {tripDates} from "../mock/card";
import PointController from "./point";

const filterCardByEventDate = (cards, tripDate) => {
  return cards.filter((card) => new Date(card.startTime).toDateString() === tripDate);
};

const renderCards = (tripEventList, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const pointController = new PointController(tripEventList, onDataChange, onViewChange);
    pointController.render(card);

    return pointController;
  });
};

const renderCardsByDays = (container, cards, onDataChange, onViewChange) => {
  let controllers = [];
  Array.from(tripDates).forEach((it, index) => {
    const trip = new TripDays(it, index + 1);
    render(container.getElement(), trip, RenderPosition.BEFOREEND);
    const tripEventsList = trip.getElement().querySelector(`.trip-events__list`);
    filterCardByEventDate(cards, it).forEach((card) => {
      const pointController = new PointController(tripEventsList, onDataChange, onViewChange);
      pointController.render(card);

      controllers.push(pointController);
      return controllers;
    });
  });
  return controllers;
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._cards = [];
    this._pointControllers = [];
    this._noCards = new NoCards();
    this._sort = new Sort();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(cards) {
    this._cards = cards;
    const tripList = new TripList();

    if (!cards.length) {
      render(this._container, this._noCards, RenderPosition.BEFOREEND);
    }
    render(this._container, this._sort, RenderPosition.BEFOREEND);
    render(this._container, tripList, RenderPosition.BEFOREEND);

    const allCards = renderCardsByDays(tripList, cards, this._onDataChange, this._onViewChange);

    this._pointControllers = this._pointControllers.concat(allCards);

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
        renderCardsByDays(tripList, sortedCards, this._onDataChange, this._onViewChange);
      }
      const trip = new TripDays();
      render(tripList.getElement(), trip, RenderPosition.BEFOREEND);
      const tripEventsList = trip.getElement().querySelector(`.trip-events__list`);
      renderCards(tripEventsList, sortedCards, this._onDataChange, this._onViewChange);
    });
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    pointController.render(this._cards[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
}
