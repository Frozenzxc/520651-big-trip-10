const getEventPrice = (offers) => {
  let sum = 0;
  offers.forEach((it) => {
    sum += it.price;
  });
  return sum;
};

const getTotalPrice = (cards) => {
  let sum = 0;
  cards.forEach((it) => {
    sum += getEventPrice(it.offers);
  });
  return sum;
};

const createTotalPriceTemplate = (cards) => {
  const totalPrice = getTotalPrice(cards);
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>`
  );
};

export {createTotalPriceTemplate};
