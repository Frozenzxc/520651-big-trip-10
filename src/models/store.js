export default class Store {
  constructor() {
    this._destinations = [];
    this._offers = [];
  }

  static setAllDestinations(data) {
    this._destinations = data;
  }

  static setOffers(data) {
    this._offers = data;
  }

  static getAllDestinations() {
    return this._destinations;
  }

  static getOffers() {
    return this._offers;
  }
}
