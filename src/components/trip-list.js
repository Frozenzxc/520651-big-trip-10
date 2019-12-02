const createTripsTemplate = (cards) => {
  return (
    `<ul class="trip-days">
        <li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">1</span>
            <time class="day__date" datetime="${(cards[0].startTime)}">${(cards[0].startTime).toDateString().substr(4, 6)}</time>
          </div>
          <ul class="trip-events__list"></ul>
        </li>
    </ul>`
  );
};

export {createTripsTemplate};
