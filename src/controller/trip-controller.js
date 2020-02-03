import {render, RenderPosition} from "../utils/render";
import {
  NoCardsComponent,
  TripDaysComponent,
  TripListComponent,
  SortComponent
} from "../components/index";
import {SortType} from "../components/index";
import PointController, {EmptyCard, Mode} from "./point-controller";
import {getTripDates} from "../utils/common";
import moment from "moment";

const renderCards = (container, cards, dataChangeHandler, viewChangeHandler, mode, isSortedByDefault) => {
  let controllers = [];

  const tripDates = isSortedByDefault ? [...getTripDates(cards)].sort((a, b) => a - b) : [true];

  tripDates.forEach((it, index) => {
    const day = isSortedByDefault ? new TripDaysComponent(moment().dayOfYear(it), index + 1) : new TripDaysComponent();

    cards
      .filter((card) => {
        return isSortedByDefault ? moment(card.startTime).dayOfYear() === it : card;
      })
      .forEach((card) => {
        const pointController = new PointController(day.getElement().querySelector(`.trip-events__list`), dataChangeHandler, viewChangeHandler);
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

    this._noCards = new NoCardsComponent();
    this._sort = new SortComponent();
    this._tripList = new TripListComponent();
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._pointDateChangeHandler = this._pointDateChangeHandler.bind(this);

    this._pointModel.setFilterChangeHandler(this._filterChangeHandler);


    this._priceChangeHandlers = [];
    this._routeChangeHandlers = [];
  }

  render() {
    const container = this._container.getElement();
    const cards = this._pointModel.getPoints();
    this._pointModel.setDataChangeHandler(this._pointDateChangeHandler);
    if (!cards.length) {
      render(container, this._noCards, RenderPosition.BEFOREEND);
    }
    render(container, this._sort, RenderPosition.BEFOREEND);
    render(container, this._tripList, RenderPosition.BEFOREEND);
    this._totalPrice = getTotalPrice(cards);

    this._showedCardControllers = renderCards(
        this._tripList,
        cards,
        this._dataChangeHandler,
        this._viewChangeHandler,
        Mode.DEFAULT,
        this._isSortedByDefault
    );
    this._sort.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  createCard() {
    if (this._creatingCard) {
      return;
    }

    this._creatingCard = new PointController(this._tripList.getElement(), this._dataChangeHandler, this._viewChangeHandler);
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

  onNewEventClick() {
    this._viewChangeHandler();
  }

  _dataChangeHandler(pointController, oldData, newData) {
    if (oldData === this._emptyCard || oldData === EmptyCard) {
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

  _viewChangeHandler() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _sortTypeChangeHandler(sortType) {
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
        this._dataChangeHandler,
        this._viewChangeHandler,
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
    const container = this._container.getElement();
    const cards = this._pointModel.getPoints();

    if (!cards.length) {
      render(container, this._noCards, RenderPosition.BEFOREEND);
    }
    this._showedCardControllers = renderCards(
        this._tripList,
        this._pointModel.getPoints(),
        this._dataChangeHandler,
        this._viewChangeHandler,
        Mode.DEFAULT,
        this._isSortedByDefault
    );
    this._totalPrice = getTotalPrice(this._pointModel.getPoints());
    this._callHandlers(this._priceChangeHandlers);
    this._callHandlers(this._routeChangeHandlers);
  }

  _filterChangeHandler() {
    this._updateCards();
    this._creatingCard = null;
  }

  _pointDateChangeHandler() {
    this._updateCards();
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
