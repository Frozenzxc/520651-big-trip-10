import {render, RenderPosition} from "../utils/render";
import {
  NoCards,
  TripDays,
  TripList,
  Sort
} from "../components/index";
import {SortType} from "../components/index";
import PointController, {EmptyCard, Mode} from "./point";
import {getTripDates} from "../utils/common";
import moment from "moment";

const renderCards = (container, cards, onDataChange, onViewChange, mode, isSortedByDefault) => {
  let controllers = [];

  const tripDates = isSortedByDefault ? [...getTripDates(cards)].sort((a, b) => a - b) : [true];

  tripDates.forEach((it, index) => {
    const day = isSortedByDefault ? new TripDays(moment().dayOfYear(it), index + 1) : new TripDays();

    cards
      .filter((card) => {
        return isSortedByDefault ? moment(card.startTime).dayOfYear() === it : card;
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

const getTotalPrice = (cards) => {
  return cards.reduce((sum, card) => {
    return sum + parseFloat(card.price) + card.offers.reduce((offerCost, it) => {
      return offerCost + parseFloat(it.price);
    }, 0);
  }, 0);
};

export default class TripController {
  constructor(container, pointModel, api) {
    this._container = container;
    this._pointModel = pointModel;
    this._api = api;

    this._emptyCard = Object.assign({}, EmptyCard);
    this._showedCardControllers = [];
    this._creatingCard = null;
    this._isSortedByDefault = true;
    this._totalPrice = null;

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

    this._priceChangeHandlers = [];
    this._routeChangeHandlers = [];
  }

  render() {
    const container = this._container.getElement();
    const cards = this._pointModel.getPoints();

    if (!cards.length) {
      render(container, this._noCards, RenderPosition.BEFOREEND);
    }
    render(container, this._sort, RenderPosition.BEFOREEND);
    render(container, this._tripList, RenderPosition.BEFOREEND);
    this._totalPrice = getTotalPrice(cards);

    this._showedCardControllers = renderCards(
        this._tripList,
        this._pointModel.getPoints(),
        this._onDataChange,
        this._onViewChange,
        Mode.DEFAULT,
        this._isSortedByDefault
    );
    this._sort.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  createCard() {
    if (this._creatingCard) {
      return;
    }
    //this._onViewChange();
    this._creatingCard = new PointController(this._tripList.getElement(), this._onDataChange, this._onViewChange);
    this._creatingCard.render(this._emptyCard, Mode.ADDING);
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }

  setPriceChangeHandler(handler) {
    this._priceChangeHandlers.push(handler);
  }

  setRouteChangeHandler(handler) {
    this._routeChangeHandlers.push(handler);
  }

  getTotalPrice() {
    return this._totalPrice;
  }

  getPoints() {
    return this._pointModel.getPoints();
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === this._emptyCard) {
      this._creatingCard = null;
      if (newData === null) {
        pointController.destroy();
        this._updateCards();
      } else {
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointModel.addPoint(pointModel);

            this._showedCardControllers = [].concat(pointController, this._showedCardControllers);

            this._emptyCard = Object.assign({}, EmptyCard);
            this._updateCards();
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointModel.removePoint(oldData.id);

          this._updateCards();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          const isSuccess = this._pointModel.updatePoint(oldData.id, pointModel);
          if (isSuccess) {
            pointController.render(pointModel, Mode.DEFAULT);
            this._updateCards();
          }
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onViewChange() {

    this._showedCardControllers.forEach((it) => {
      console.log(it);
      it.setDefaultView();
    });
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
        Mode.DEFAULT,
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
        Mode.DEFAULT,
        this._isSortedByDefault
    );
    this._totalPrice = getTotalPrice(this._pointModel.getPoints());
    this._callHandlers(this._priceChangeHandlers);
    this._callHandlers(this._routeChangeHandlers);
  }

  _onFilterChange() {
    this._updateCards();
  }

  _onPointDataChange() {
    this._updateCards();
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
