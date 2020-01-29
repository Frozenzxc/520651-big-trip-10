import moment from "moment";

const HOUR_PER_MS = 3600000;
const DAY_PER_MS = 86400000;
const AUTHOROZATION_STRING_LENGTH = 15;

const randomString = () => {
  let result = ``;
  const symbols = `0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM`;
  const maxPosition = symbols.length - 1;
  for (let i = 0; i < AUTHOROZATION_STRING_LENGTH; ++i) {
    let position = Math.floor(Math.random() * maxPosition);
    result = result + symbols.substring(position, position + 1);
  }
  return result;
};

const CHECKINPOINTS = [
  `sightseeing`,
  `restaurant`,
  `check-in`
];

const formatCardTitle = (card) => {
  if (CHECKINPOINTS.includes(card.type)) {
    return `${card.type} in`;
  }
  return `${card.type} to`;
};

const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

const setDateTimeAttr = (date) => {
  return moment(date).toISOString();
};

const formatAfterFlatpickr = (date) => {
  return moment(date, `DD/MM/YYYY HH:mm`);
};

const getDuration = (start, end) => {
  let startTime = moment(start);
  let endTime = moment(end);
  const diff = endTime.diff(startTime);

  if (diff < HOUR_PER_MS) {
    return moment(diff).format(`mm`) + `M`;
  } else if (diff < DAY_PER_MS) {
    return moment(diff).format(`HH`) + `H` + ` ` + moment(diff).format(`mm`) + `M`;
  } else {
    return moment(diff).format(`DD`) + `D` + ` ` + moment(diff).format(`HH`) + `H` + ` ` + moment(diff).format(`mm`) + `M`;
  }
};

const getTripDates = (cards) => {
  return new Set(cards.map((it) => moment(it.startTime).dayOfYear()));
};

const isOverdueDate = (startTime, date) => {
  return startTime < Date.parse(date);
};

const isFutureDate = (startTime, date) => {
  return startTime >= Date.parse(date);
};

export {formatTime, getDuration, setDateTimeAttr, isOverdueDate, isFutureDate, getTripDates, formatAfterFlatpickr, formatCardTitle, randomString};
