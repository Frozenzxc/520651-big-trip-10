import AbstractComponent from "./abstract-component";

const createNoCardsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};


export default class NoCardsComponent extends AbstractComponent {
  getTemplate() {
    return createNoCardsTemplate();
  }
}
