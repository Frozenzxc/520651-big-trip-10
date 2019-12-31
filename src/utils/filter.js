import {FilterType} from "../const";
import {isFutureDate, isOverdueDate} from "./common";

const getFutureCards = (cards, date) => {
  return cards.filter((card) => {
    const startTime = card.startTime;

    return isFutureDate(startTime, date);
  });
};

const getPastCards = (cards, date) => {
  return cards.filter((card) => {
    const startTime = card.startTime;

    return isOverdueDate(startTime, date);
  });
};

const getCardsByFilter = (cards, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return cards;
    case FilterType.FUTURE:
      return getFutureCards(cards, nowDate);
    case FilterType.PAST:
      return getPastCards(cards, nowDate);
  }

  return cards;
};

export {getCardsByFilter};
