import {createElement} from "../util";

const createTripsTemplate = (board, dayCount) => {
  return (
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${dayCount}</span>
          <time class="day__date" datetime="${(new Date(board))}">${(new Date(board).toDateString().substr(4, 6))}</time>
        </div>
        <ul class="trip-events__list"></ul>
      </li>`
  );
};

export default class TripDays {
  constructor(board, dayCount) {
    this._board = board;
    this._dayCount = dayCount;
    this._element = null;
  }

  getTemplate() {
    return createTripsTemplate(this._board, this._dayCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
