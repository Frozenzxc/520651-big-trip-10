export default class Points {
  constructor() {
    this._cards = [];
  }

  getPoints() {
    return this._cards;
  }

  setPoints(cards) {
    this._cards = Array.from(cards);
  }

  updatePoint(id, card) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));

    //this._callHandlers(this._filterChangeHandlers);

    return true;
  }
}
