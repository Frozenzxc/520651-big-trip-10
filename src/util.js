const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDate = (date) => {
  const years = castTimeFormat(date.getFullYear());
  const months = castTimeFormat(date.getMonth());
  const days = castTimeFormat(date.getDate());
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${days}/${months}/${years.substr(-2)} ${hours}:${minutes}`;
};

const getDuration = (start, end) => {
  let duration = {};
  duration.hours = end.getHours() - start.getHours();
  duration.minutes = end.getMinutes() - start.getMinutes();
  if (duration.minutes < 0) {
    duration.hours = duration.hours - 1;
    duration.minutes += 60;
  }
  return duration.hours + `H` + ` ` + duration.minutes + `M`;
};

export {formatTime, getDuration, formatDate, createElement, RenderPosition, render};
