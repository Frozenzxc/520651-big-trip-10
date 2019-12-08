import {cards, boards} from "./mock/card";
import {menu} from "./mock/menu";
import {filters} from "./mock/filter";
import {render, RenderPosition} from "./util";
import {
  Menu,
  Sort,
  Filter,
  Route,
  Card,
  CardEdit,
  Trips
} from "./components/index";

const siteHeaderControls = document.querySelector(`.trip-controls`);

render(siteHeaderControls, new Menu(menu).getElement(), RenderPosition.BEFOREEND);
render(siteHeaderControls, new Filter(filters).getElement(), RenderPosition.BEFOREEND);

const tripBoard = document.querySelector(`.trip-events`);

render(tripBoard, new Sort().getElement(), RenderPosition.AFTERBEGIN);

const tripDayList = tripBoard.querySelector(`.trip-days`);

const renderCard = (card, place) => {
  const cardComponent = new Card(card);
  const cardEditComponent = new CardEdit(card);

  const editButton = cardComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    place.replaceChild(cardEditComponent.getElement(), cardComponent.getElement());
  });

  const editForm = cardEditComponent.getElement();
  editForm.addEventListener(`submit`, () => {
    place.replaceChild(cardComponent.getElement(), cardEditComponent.getElement());
  });

  render(place, cardComponent.getElement(), RenderPosition.BEFOREEND);
};


let dayCount = 1;
boards.forEach((it) => {
  const trip = new Trips(it, dayCount);
  render(tripDayList, trip.getElement(), RenderPosition.BEFOREEND);
  const tripList = trip.getElement().querySelector(`.trip-events__list`);
  cards.forEach((card) => {
    if (card.startTime === it) {
      renderCard(card, tripList);
    }
  });
  dayCount++;
});

const tripRoute = document.querySelector(`.trip-info`);

render(tripRoute, new Route(cards).getElement(), RenderPosition.AFTERBEGIN);

const tripCost = document.querySelector(`.trip-info__cost-value`);

tripCost.textContent = cards.reduce((sum, it) => {
  return sum + parseFloat(it.price);
}, 0);

