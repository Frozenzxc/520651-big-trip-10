import moment from "moment";

const HOUR_PER_MS = 3600000;
const DAY_PER_MS = 86400000;

const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

const setDateTimeAttr = (date) => {
  return moment(date).format(moment.HTML5_FMT.DATETIME_LOCAL);
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
  return new Set(cards.map((it) => new Date(it.startTime).toDateString()));
};

const isOverdueDate = (startTime, date) => {
  return startTime < Date.parse(date);
};

const isFutureDate = (startTime, date) => {
  return startTime >= Date.parse(date);
};

export {formatTime, getDuration, setDateTimeAttr, isOverdueDate, isFutureDate, getTripDates};
