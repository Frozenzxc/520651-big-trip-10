export default class StoreModel {
  constructor() {
    this._destinations = [];
    this._offers = [];
  }

  static setAllDestinations(destinations) {
    this._destinations = destinations;
  }

  static setOffers(offers) {
    this._offers = offers;
  }

  static getAllDestinations() {
    return this._destinations;
  }

  static getOffers() {
    return this._offers;
  }
}
