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

const renderCards = (container, cards, onDataChange, onViewChange, mode, isSortedByDefault) => {
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
    this._onPointDataChange = this._onPointDataChange.bind(this);

    this._pointModel.setFilterChangeHandler(this._onFilterChange);
    this._pointModel.setDataChangeHandler(this._onPointDataChange);
  }

  render() {
    const cards = this._pointModel.getPoints();

    if (!cards.length) {
      render(this._container, this._noCards, RenderPosition.BEFOREEND);
    }
    render(this._container, this._sort, RenderPosition.BEFOREEND);
    render(this._container, this._tripList, RenderPosition.BEFOREEND);

    this._showedCardControllers = renderCards(
        this._tripList,
        this._pointModel.getPoints(),
        this._onDataChange,
        this._onViewChange,
        PointControllerMode.DEFAULT,
        this._isSortedByDefault
    );

    this._sort.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  createCard() {
    if (this._creatingCard) {
      return;
    }

    this._creatingCard = new PointController(this._container, this._onDataChange, this._onViewChange);
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

        this._showedCardControllers = [].concat(pointController, this._showedCardControllers);
        this._updateCards();
      }
    } else if (newData === null) {
      this._pointModel.removePoint(oldData.id);
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
    this._showedCardControllers = renderCards(
        this._tripList,
        sortedCards,
        this._onDataChange,
        this._onViewChange,
        PointControllerMode.DEFAULT,
        this._isSortedByDefault
    );
  }

  _removeCards() {
    this._tripList.getElement().innerHTML = ``;
    this._showedCardControllers.forEach((it) => it.destroy());
    this._showedCardControllers = [];
  }

  _updateCards() {
    this._removeCards();
    this._showedCardControllers = renderCards(
        this._tripList,
        this._pointModel.getPoints(),
        this._onDataChange,
        this._onViewChange,
        PointControllerMode.DEFAULT,
        this._isSortedByDefault
    );
  }

  _onFilterChange() {
    this._updateCards();
  }

  _onPointDataChange() {
    this._updateCards();
  }
}
