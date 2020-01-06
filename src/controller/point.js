import AbstractComponent from "../components/abstract-component";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {Card, CardEdit} from "../components";
import Point from "../models/point";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

const EmptyCard = {
  type: `taxi`,
  destination: ``,
  startTime: Date.parse(new Date()),
  endTime: Date.parse(new Date()),
  offers: [],
  description: ``,
  price: 0,
  isFavorite: false
};

const parseFormData = (formData) => {
  const desc = document.querySelector(`.event__destination-description`).textContent;
  let pictures = [];
  document.querySelectorAll(`.event__photo`).forEach((it) => {
    pictures.push({src: it.src, desc: it.alt});
  });

  return new Point({
    'type': formData.get(`event-type`),
    'destination': {
      'name': formData.get(`event-destination`),
      'description': desc,
      'pictures': pictures.map((it) => {
        return {
          'src': `` + it.src,
          'description': `` + it.desc,
        };
      }),
    },
    'date_from': formData.get(`event-start-time`),
    'date_to': formData.get(`event-end-time`),
    'offers': formData.getAll(`event-offer`),
    'base_price': Number(formData.get(`event-price`)),
    'is_favorite': Boolean(formData.get(`event-favorite`))
  });
};

export default class PointController extends AbstractComponent {
  constructor(container, onDataChange, onViewChange) {
    super();

    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._cardComponent = null;
    this._cardEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card, mode) {
    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;
    this._mode = mode;

    this._cardComponent = new Card(card);
    this._cardEditComponent = new CardEdit(card);

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardEditComponent.setEditCloseButtonClickHandler(() => {
      this._replaceEditToCard();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._cardEditComponent.getData();
      const data = parseFormData(formData);

      this._onDataChange(this, card, data);
      this._replaceEditToCard();
    });

    this._cardEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, card, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldCardEditComponent && oldCardComponent) {
          replace(this._cardComponent, oldCardComponent);
          replace(this._cardEditComponent, oldCardEditComponent);
          this._replaceEditToCard();
        } else {
          render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldCardEditComponent && oldCardComponent) {
          remove(oldCardComponent);
          remove(oldCardEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._cardEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }

  _replaceEditToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._cardEditComponent.reset();

    if (document.contains(this._cardEditComponent.getElement())) {
      replace(this._cardComponent, this._cardEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _replaceCardToEdit() {
    this._onViewChange();

    replace(this._cardEditComponent, this._cardComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyCard, null);
      }
      this._replaceEditToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  destroy() {
    remove(this._cardEditComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}

export {Mode, EmptyCard};
