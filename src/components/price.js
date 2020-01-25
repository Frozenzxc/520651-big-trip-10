import AbstractSmartComponent from "./abstract-smart-component";

const createPriceTemplate = () => {
  return (`<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
  </p>`);
};

export default class Price extends AbstractSmartComponent {
  constructor() {
    super();

  }

  getTemplate() {
    return createPriceTemplate();
  }

  setTotalPrice(price) {
    this.getElement().querySelector(`.trip-info__cost-value`).textContent = price;
  }
}
