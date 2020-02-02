import AbstractComponent from "./abstract-component";

const createTripListTemplate = () => {

  return (`<ul class="trip-days"></ul>`);
};

export default class TripListComponent extends AbstractComponent {
  getTemplate() {
    return createTripListTemplate();
  }
}
