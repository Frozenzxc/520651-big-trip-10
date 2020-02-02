import {FilterType} from "../const";
import {FilterComponent} from "../components";
import {render, replace, RenderPosition} from "../utils/render";

export default class FilterController {
  constructor(container, pointModel) {
    this._container = container;
    this._pointModel = pointModel;

    this._activeFilterType = FilterType.EVERYTHING;

    this._filterComponent = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType,
        isEnabled: !!this._pointModel.getPointsByFilter(filterType).length,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._filterChangeHandler);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _filterChangeHandler(filterType) {
    this._pointModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
