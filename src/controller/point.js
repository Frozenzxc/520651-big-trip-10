import AbstractComponent from "../components/abstract-component";
import {render, RenderPosition, replace} from "../utils/render";
import {Card, CardEdit} from "../components";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
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
  }

  render(card) {
    this._cardComponent = new Card(card);
    this._cardEditComponent = new CardEdit(card);

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardEditComponent.setSubmitHandler(this._replaceEditToCard);

    this._cardEditComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }

  _replaceEditToCard() {
    this._cardEditComponent.reset();

    replace(this._cardComponent, this._cardEditComponent);
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
      this._replaceEditToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
