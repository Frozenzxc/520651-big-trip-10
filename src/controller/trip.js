import {render, RenderPosition} from "../utils/render";
import {
  NoCards,
  TripDays,
  TripList,
  Sort
} from "../components/index";
import {SortType} from "../components/index";
import PointController, {EmptyCard, Mode as PointControllerMode} from "./point";
import {getTripDates} from "../utils/common";

const renderCards = (container, cards, onDataChange, onViewChange, dates, mode, isSortedByDefault) => {
  let controllers = [];

  const tripDates = isSortedByDefault ? [...getTripDates(cards)] : [true];

  tripDates.forEach((it, index) => {
    const day = isSortedByDefault ? new TripDays(it, index + 1) : new TripDays();

    cards
      .filter((card) => {
        return isSortedByDefault ? new Date(card.startTime).toDateString() === it : card;
      })
      .forEach((card) => {
        const pointController = new PointController(day.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange);
        pointController.render(card, mode);

        controllers.push(pointController);
      });
    render(container.getElement(), day, RenderPosition.BEFOREEND);
  });

  return controllers;
};

export default class TripController {
  constructor(container, pointModel) {
    this._container = container;
    this._pointModel = pointModel;

    this._showedCardControllers = [];
    this._creatingCard = null;
    this._isSortedByDefault = true;

    this._noCards = new NoCards();
    this._sort = new Sort();
    this._tripList = new TripList();
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const cards = this._pointModel.getPoints();

    if (!cards.length) {
      render(this._container, this._noCards, RenderPosition.BEFOREEND);
    }
    render(this._container, this._sort, RenderPosition.BEFOREEND);
    render(this._container, this._tripList, RenderPosition.BEFOREEND);

    this._renderCards(cards);

    this._sort.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  createCard() {
    if (this._creatingCard) {
      return;
    }

    this._creatingCard = new PointController(this._container.querySelector(`.trip-events__list`), this._onDataChange, this._onViewChange);
    this._creatingCard.render(EmptyCard, PointControllerMode.ADDING);
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyCard) {
      this._creatingCard = null;
      if (newData === null) {
        pointController.destroy();
        this._updateCards();
      } else {
        this._pointModel.addPoint(newData);
        pointController.render(newData, PointControllerMode.DEFAULT);

        const destroyedCard = this._showedCardControllers.pop();
        destroyedCard.destroy();

        this._showedCardControllers = [].concat(pointController, this._showedCardControllers);
      }
    } else if (newData === null) {
      this._pointModel.removePoint(oldData.id);
      this._updateCards();
    } else {
      const isSuccess = this._pointModel.updatePoint(oldData.id, newData);
      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];
    const cards = this._pointModel.getPoints();

    switch (sortType) {
      case SortType.TIME:
        this._isSortedByDefault = false;
        sortedCards = cards.slice().sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));
        break;
      case SortType.PRICE:
        this._isSortedByDefault = false;
        sortedCards = cards.slice().sort((a, b) => b.price - a.price);
        break;
      case SortType.DEFAULT:
        this._isSortedByDefault = true;
        sortedCards = cards.slice();
        break;
    }

    this._removeCards();
    this._renderCards(sortedCards, this._isSortedByDefault);
  }

  _removeCards() {
    this._tripList.getElement().innerHTML = ``;
    this._showedCardControllers.forEach((it) => it.destroy());
    this._showedCardControllers = [];
  }

  _renderCards(cards) {
    const dates = getTripDates(cards);
    const newCards = renderCards(this._tripList, cards, this._onDataChange, this._onViewChange, dates, PointControllerMode.DEFAULT, this._isSortedByDefault);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
  }

  _updateCards() {
    this._removeCards();
    this._renderCards(this._pointModel.getPoints());
  }

  _onFilterChange() {
    this._updateCards();
  }
}
