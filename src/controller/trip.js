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

const renderCards = (container, cards, onDataChange, onViewChange, isSortedByDefault = true) => {
  let controllers = [];
  if (isSortedByDefault) {
    Array.from(tripDates).forEach((it, index) => {
      const trip = new TripDays(it, index + 1);
      render(container.getElement(), trip, RenderPosition.BEFOREEND);
      const tripEventsList = trip.getElement().querySelector(`.trip-events__list`);
      filterCardByEventDate(cards, it).forEach((card) => {
        const pointController = new PointController(tripEventsList, onDataChange, onViewChange);
        pointController.render(card);

        controllers.push(pointController);
      });
    });
  } else {
    cards.forEach((card) => {
      const trip = new TripDays();
      render(container.getElement(), trip, RenderPosition.BEFOREEND);
      const tripEventsList = trip.getElement().querySelector(`.trip-events__list`);
      const pointController = new PointController(tripEventsList, onDataChange, onViewChange);
      pointController.render(card);

      controllers.push(pointController);
    });
  }
  return controllers;
};

export default class TripController {
  constructor(container, pointModel) {
    this._container = container;
    this._pointModel = pointModel;

    this._cards = [];
    this._pointControllers = [];
    this._noCards = new NoCards();
    this._sort = new Sort();
    this._tripList = new TripList();
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  render() {
    const cards = this._pointModel.getPoints();

    if (!cards.length) {
      render(this._container, this._noCards, RenderPosition.BEFOREEND);
    }
    render(this._container, this._sort, RenderPosition.BEFOREEND);
    render(this._container, this._tripList, RenderPosition.BEFOREEND);

    const allCards = renderCards(this._tripList, cards, this._onDataChange, this._onViewChange);

    this._pointControllers = this._pointControllers.concat(allCards);

    this._sort.setSortTypeChangeHandler(this._onSortTypeChange);
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

  _onSortTypeChange(sortType) {
    let sortedCards = [];
    const cards = this._pointModel.getPoints();
    let isSortedByDefault = true;
    switch (sortType) {
      case SortType.TIME:
        isSortedByDefault = false;
        sortedCards = cards.slice().sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));
        break;
      case SortType.PRICE:
        isSortedByDefault = false;
        sortedCards = cards.slice().sort((a, b) => b.price - a.price);
        break;
      case SortType.DEFAULT:
        isSortedByDefault = true;
        sortedCards = cards.slice();
        break;
    }

    this._tripList.getElement().innerHTML = ``;

    renderCards(this._tripList, sortedCards, this._onDataChange, this._onViewChange, isSortedByDefault);
  }
}
