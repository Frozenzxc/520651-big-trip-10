import {FilterType} from "../const";
import {getCardsByFilter} from "../utils/filter";
import {tripDates} from "../mock/card";

export default class Points {
  constructor() {
    this._cards = [];
    this._tripDates = Array.from(tripDates);
    this._activeFilterType = FilterType.EVERYTHING;

    this._filterChangeHandlers = [];
  }

  getPoints() {
    return getCardsByFilter(this._cards, this._activeFilterType);
  }

  getPointsAll() {
    return this._cards;
  }

  setPoints(cards) {
    this._cards = Array.from(cards);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  addPoint(card) {
    this._cards = [].concat(card, this._cards);
    this._callHandlers(this._filterChangeHandlers);
  }

  updatePoint(id, card) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));

    this._callHandlers(this._filterChangeHandlers);

    return true;
  }

  removePoint(id) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), this._cards.slice(index + 1));

    this._callHandlers(this._filterChangeHandlers);

    return true;
  }
}
