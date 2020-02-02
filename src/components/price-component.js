import AbstractSmartComponent from "./abstract-smart-component";

const createPriceTemplate = () => {
  return (`<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
  </p>`);
};

export default class PriceComponent extends AbstractSmartComponent {
  constructor() {
    super();

    this._tripPrice = this.getElement().querySelector(`.trip-info__cost-value`);
  }

  getTemplate() {
    return createPriceTemplate();
  }

  setTotalPrice(price) {
    this._tripPrice.textContent = price;
  }
}
