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
import API from "./api";

const AUTHORIZATION = `Basic ad5w543ik36234a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);

const siteMenuComponent = new Menu();

const pointModel = new PointModel();
const tripEvents = new TripEvents();

const statisticsComponent = new Statistics(pointModel);
const siteMainElement = document.querySelector(`.page-main`);
const mainElementContainer = siteMainElement.querySelector(`.page-body__container`);
const siteHeaderControls = document.querySelector(`.trip-controls`);
const filterController = new FilterController(siteHeaderControls, pointModel);
const trip = new TripController(tripEvents, pointModel, api);
const tripRoute = document.querySelector(`.trip-info`);
const tripCost = document.querySelector(`.trip-info__cost-value`);

const eventAddBtn = document.querySelector(`.trip-main__event-add-btn`);
eventAddBtn.addEventListener(`click`, () => {
  trip.createCard();
});

render(siteHeaderControls, siteMenuComponent, RenderPosition.BEFOREEND);
render(mainElementContainer, tripEvents, RenderPosition.BEFOREEND);
render(mainElementContainer, statisticsComponent, RenderPosition.BEFOREEND);

filterController.render();

statisticsComponent.hide();

render(tripRoute, new Route(cards), RenderPosition.AFTERBEGIN);

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

api.getData()
  .then((points) => {
    pointModel.setPoints(points);
    trip.render();
  });

