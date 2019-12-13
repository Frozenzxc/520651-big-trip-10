import AbstractComponent from "./abstract-component";

const createTripsTemplate = (board, dayCount) => {
  return (
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${dayCount}</span>
          <time class="day__date" datetime="${board ? (new Date(board)) : ``}">${board ? (new Date(board).toDateString().substr(4, 6)) : ` `}</time>
        </div>
        <ul class="trip-events__list"></ul>
      </li>`
  );
};

export default class TripDays extends AbstractComponent {
  constructor(board, dayCount) {
    super();
    this._board = board;
    this._dayCount = dayCount;
  }

  getTemplate() {
    return createTripsTemplate(this._board, this._dayCount);
  }
}
