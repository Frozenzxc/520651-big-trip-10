const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return Date.parse(targetDate);
};

const MAX_OPTIONS = 3;

const generateOptions = (options) => {
  return options
    .filter(() => Math.random() > 0.5)
    .slice(0, getRandomIntegerNumber(0, MAX_OPTIONS));
};

const DESCRIPTION_LENGTH = 3;

const generateDescription = (desc) => {
  return desc
    .filter(() => Math.random() > 0.5)
    .slice(0, getRandomIntegerNumber(1, DESCRIPTION_LENGTH));
};

const tripType = [
  `bus`,
  `check-in`,
  `drive`,
  `flight`,
  `restaurant`,
  `ship`,
  `sightseeing`,
  `taxi`,
  `train`,
  `transport`,
  `trip`
];

const destinationWaypoint = [
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`
];

const tripDescription = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const additionalOptions = [
  {type: `luggage`, name: `Add luggage`, price: 10, isChecked: false},
  {type: `comfort`, name: `Switch to comfort class`, price: 150, isChecked: false},
  {type: `meal`, name: `Add meal`, price: 2, isChecked: false},
  {type: `seats`, name: `Choose seats`, price: 9, isChecked: false},
  {type: `train`, name: `Travel by train`, price: 40, isChecked: false}
];

const generateCard = () => {
  const startTime = getRandomDate();
  const endTime = startTime + getRandomIntegerNumber(10000000, 10000000);
  return {
    id: String(new Date() + Math.random()),
    type: getRandomArrayItem(tripType),
    destination: getRandomArrayItem(destinationWaypoint),
    startTime,
    endTime,
    offers: generateOptions(additionalOptions),
    description: generateDescription(tripDescription),
    price: getRandomIntegerNumber(100, 1000),
    isFavorite: Math.random() > 0.5
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

const CARD_COUNT = 16;

let cards = generateCards(CARD_COUNT);

cards.sort((a, b) => a.startTime > b.startTime ? 1 : -1);

const tripDates = new Set(cards.map((it) => new Date(it.startTime).toDateString()));

export {cards, tripDates};
