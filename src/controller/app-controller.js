import {render, RenderPosition} from "../utils/render";
import {
  MenuComponent, PriceComponent,
  RouteComponent,
  StatisticsComponent,
  TripEventsComponent,
} from "../components/index";
import TripController from "./trip-controller";
import PointModel from "../models/points-model";
import FilterController from "./filter-controller";
import {MenuItem} from "../components/index";
import Api from "../api/index";
import Backup from "../api/backup";
import Provider from "../api/provider";
import "flatpickr/dist/flatpickr.css";
import {getRandomString} from "../utils/common";

const BACKUP_PREFIX = `big-trip-cache`;
const BACKUP_VER = `v1`;
const BACKUP_NAME = `${BACKUP_PREFIX}-${BACKUP_VER}`;

const AUTHORIZATION = `Basic ` + getRandomString();
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

export default class AppController {
  constructor() {
    this._api = new Api(END_POINT, AUTHORIZATION);
    this._backup = new Backup(BACKUP_NAME, window.localStorage);
    this._apiWithProvider = new Provider(this._api, this._backup);
    this._siteMenuComponent = new MenuComponent();

    this._pointModel = new PointModel();
    this._tripEvents = new TripEventsComponent();
    this._priceComponent = new PriceComponent();
    this._routeComponent = new RouteComponent();

    this._trip = new TripController(this._tripEvents, this._pointModel, this._apiWithProvider);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._trip.setPriceChangeHandler(this._priceChangeHandler);
    this._routeChangeHandler = this._routeChangeHandler.bind(this);
    this._trip.setRouteChangeHandler(this._routeChangeHandler);
  }

  render() {
    this._statisticsComponent = new StatisticsComponent(this._pointModel);
    const siteMainElement = document.querySelector(`.page-main`);
    const mainElementContainer = siteMainElement.querySelector(`.page-body__container`);
    const siteHeaderControls = document.querySelector(`.trip-controls`);
    const filterController = new FilterController(siteHeaderControls, this._pointModel);
    const tripRoute = document.querySelector(`.trip-info`);

    this._setEventAddBtn();

    render(siteHeaderControls, this._siteMenuComponent, RenderPosition.BEFOREEND);
    render(mainElementContainer, this._tripEvents, RenderPosition.BEFOREEND);
    render(mainElementContainer, this._statisticsComponent, RenderPosition.BEFOREEND);

    this._statisticsComponent.hide();

    this._setSiteNavigation();


    this._apiWithProvider.getData()
      .then((points) => {
        this._pointModel.setPoints(points);
        render(tripRoute, this._routeComponent, RenderPosition.AFTERBEGIN);
        this._routeComponent.setRoute(points);
        filterController.render();
        render(tripRoute, this._priceComponent, RenderPosition.BEFOREEND);
        this._trip.render();
        this._priceComponent.setTotalPrice(this._trip.getTotalPrice());
      });
  }

  registerSW() {
    window.addEventListener(`load`, () => {
      navigator.serviceWorker.register(`/sw.js`)
        .then(() => {
        }).catch(() => {
        });
    });
  }

  syncSW() {
    window.addEventListener(`online`, () => {
      document.title = document.title.replace(` [offline]`, ``);
      if (!this._apiWithProvider.getSynchronize()) {
        this._apiWithProvider.sync()
          .then(() => {
          })
          .catch(() => {
          });
      }
    });
  }

  isOffline() {
    window.addEventListener(`offline`, () => {
      document.title += ` [offline]`;
    });
  }

  _setEventAddBtn() {
    const eventAddBtn = document.querySelector(`.trip-main__event-add-btn`);
    eventAddBtn.addEventListener(`click`, () => {
      this._trip.onNewEventClick();
      this._trip.createCard();
    });
  }

  _setSiteNavigation() {
    this._siteMenuComponent.setOnClick((menuItem) => {
      switch (menuItem) {
        case MenuItem.STATS:
          this._trip.hide();
          this._statisticsComponent.show();
          break;
        case MenuItem.TABLE:
          this._statisticsComponent.hide();
          this._trip.show();
          break;
      }
    });
  }

  _priceChangeHandler() {
    this._priceComponent.setTotalPrice(this._trip.getTotalPrice());
  }

  _routeChangeHandler() {
    this._routeComponent.setRoute(this._trip.getPoints());
  }
}
