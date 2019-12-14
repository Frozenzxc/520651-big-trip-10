import AbstractComponent from "./abstract-component";

const createTripListTemplate = () => {

  return (`<ul class="trip-days"></ul>`);
};

export default class TripList extends AbstractComponent {
  getTemplate() {
    return createTripListTemplate();
  }
}
