import {createMenuTemplate} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createTripsTemplate} from "./components/trip-list";
import {createSortTemplate} from "./components/sort";
import {createEventAddTemplate} from "./components/event-add";
import {createCardTemplate} from "./components/card";
import {createRouteTemplate} from "./components/route";
import {createCardEditTemplate} from "./components/card-editor";

const CARD_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderControls = document.querySelector(`.trip-controls`);

render(siteHeaderControls, createMenuTemplate());
render(siteHeaderControls, createFilterTemplate());

const tripBoard = document.querySelector(`.trip-events`);

render(tripBoard, createSortTemplate());
render(tripBoard, createEventAddTemplate());
render(tripBoard, createTripsTemplate());

const tripList = tripBoard.querySelector(`.trip-events__list`);

render(tripList, createCardEditTemplate());
new Array(CARD_COUNT).fill(``).forEach(() => {
  render(tripList, createCardTemplate());
});

const tripRoute = document.querySelector(`.trip-info`);

render(tripRoute, createRouteTemplate(), `afterbegin`);
