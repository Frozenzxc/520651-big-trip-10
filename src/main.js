import {cards} from "./mock/card";
import {render, RenderPosition} from "./utils/render";
import {
  Menu,
  Route,
  Statistics,
  TripEvents,
} from "./components/index";
import TripController from "./controller/trip";
import PointModel from "./models/points";
import FilterController from "./controller/filter";
import {MenuItem} from "./components/index";

const siteMenuComponent = new Menu();

const pointModel = new PointModel();
const tripEvents = new TripEvents();
pointModel.setPoints(cards);
const statisticsComponent = new Statistics(pointModel);
const siteMainElement = document.querySelector(`.page-main`);
const mainElementContainer = siteMainElement.querySelector(`.page-body__container`);
const siteHeaderControls = document.querySelector(`.trip-controls`);

render(siteHeaderControls, siteMenuComponent, RenderPosition.BEFOREEND);

const eventAddBtn = document.querySelector(`.trip-main__event-add-btn`);
eventAddBtn.addEventListener(`click`, () => {
  trip.createCard();
});

render(mainElementContainer, tripEvents, RenderPosition.BEFOREEND);
render(mainElementContainer, statisticsComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(siteHeaderControls, pointModel);
filterController.render();

const trip = new TripController(tripEvents, pointModel);

statisticsComponent.hide();
trip.render();

const tripRoute = document.querySelector(`.trip-info`);

render(tripRoute, new Route(cards), RenderPosition.AFTERBEGIN);

const tripCost = document.querySelector(`.trip-info__cost-value`);

tripCost.textContent = cards.reduce((sum, it) => {
  return sum + parseFloat(it.price);
}, 0);

siteMenuComponent.setOnClick((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      trip.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TABLE:
      statisticsComponent.hide();
      trip.show();
      break;
  }
});

