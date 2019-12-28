import {cards} from "./mock/card";
import {menu} from "./mock/menu";
import {filters} from "./mock/filter";
import {render, RenderPosition} from "./utils/render";
import {
  Menu,
  Filter,
  Route
} from "./components/index";
import TripController from "./controller/trip";
import PointModel from "./models/points";

const pointModel = new PointModel();
pointModel.setPoints(cards);

const siteHeaderControls = document.querySelector(`.trip-controls`);

render(siteHeaderControls, new Menu(menu), RenderPosition.BEFOREEND);
render(siteHeaderControls, new Filter(filters), RenderPosition.BEFOREEND);

const tripBoard = document.querySelector(`.trip-events`);

const trip = new TripController(tripBoard, pointModel);

trip.render();

const tripRoute = document.querySelector(`.trip-info`);

render(tripRoute, new Route(cards), RenderPosition.AFTERBEGIN);

const tripCost = document.querySelector(`.trip-info__cost-value`);

tripCost.textContent = cards.reduce((sum, it) => {
  return sum + parseFloat(it.price);
}, 0);


