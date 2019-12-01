import {createMenuTemplate} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createTripsTemplate} from "./components/trip-list";
import {createSortTemplate} from "./components/sort";
import {createEventAddTemplate} from "./components/event-add";
import {createCardTemplate} from "./components/card";
import {createRouteTemplate} from "./components/route";
import {createCardEditTemplate} from "./components/card-editor";
import {cards} from "./mock/card";
import {menu} from "./mock/menu";
import {filters} from "./mock/filter";
import {createTotalPriceTemplate} from "./components/total-price";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderControls = document.querySelector(`.trip-controls`);

render(siteHeaderControls, createMenuTemplate(menu));
render(siteHeaderControls, createFilterTemplate(filters));

const tripBoard = document.querySelector(`.trip-events`);

render(tripBoard, createSortTemplate());
render(tripBoard, createEventAddTemplate());
render(tripBoard, createTripsTemplate());

const tripList = tripBoard.querySelector(`.trip-events__list`);

render(tripList, createCardEditTemplate(cards[0]));

const MAX_CARD = 4;

cards.slice(1, MAX_CARD).forEach((card) => render(tripList, createCardTemplate(card), `beforeend`));
const tripRoute = document.querySelector(`.trip-info`);

render(tripRoute, createRouteTemplate(cards));
render(tripRoute, createTotalPriceTemplate(cards));

