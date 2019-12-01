const getTripRoutes = (cards) => {
  if (cards.length < 3) {
    return cards[0].destination + ` - ` + cards[1].destination + ` - ` + cards[2].destination;
  }
  return cards[0].destination + ` - ... - ` + cards[cards.length - 1].destination;
};

const createRouteTemplate = (cards) => {
  return (
    `<div class="trip-info__main">
        <h1 class="trip-info__title">${getTripRoutes(cards)}</h1>
        <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
    </div>`
  );
};

export {createRouteTemplate};
