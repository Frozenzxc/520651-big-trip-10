import nanoid from "nanoid";
import PointModel from "../models/point-model";

const getSyncedPoints =
  (items) => items.filter(({success}) => success).map(({payload}) => payload.point);

export default class Provider {
  constructor(api, backup) {
    this._api = api;
    this._backup = backup;
    this._isSynchronized = true;
  }

  getData() {
    if (this._isOnLine()) {
      return this._api.getData().then(
          (points) => {
            points.forEach((point) => this._backup.setItem(point.id, point.toRAW()));
            return points;
          }
      );
    }

    const storePoints = Object.values(this._backup.getAll());

    this._isSynchronized = false;

    return Promise.resolve(PointModel.parsePoints(storePoints));
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints().then(
          (points) => {
            points.forEach((point) => this._backup.setItem(point.id, point.toRAW()));
            return points;
          }
      );
    }
    const storePoints = Object.values(this._backup.getAll());

    this._isSynchronized = false;

    return Promise.resolve(PointModel.parsePoints(storePoints));
  }

  createPoint(point) {
    if (this._isOnLine()) {
      return this._api.createPoint(point).then(
          (newPoint) => {
            this._backup.setItem(newPoint.id, newPoint.toRAW());
            return newPoint;
          }
      );
    }

    const fakeNewPointId = nanoid();
    const fakeNewPoint = PointModel.parsePoint(Object.assign({}, point.toRAW(), {id: fakeNewPointId}));
    this._isSynchronized = false;

    this._backup.setItem(fakeNewPoint.id, Object.assign({}, fakeNewPoint.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewPoint);
  }

  updatePoint(id, point) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, point).then(
          (newPoint) => {
            this._backup.setItem(newPoint.id, newPoint.toRAW());
            return newPoint;
          }
      );
    }

    const fakeUpdatedPoint = point.parsePoint(Object.assign({}, point.toRAW(), {id}));
    this._isSynchronized = false;

    this._backup.setItem(id, Object.assign({}, fakeUpdatedPoint.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedPoint);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id).then(
          () => {
            this._backup.removeItem(id);
          }
      );
    }

    this._isSynchronized = false;
    this._backup.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storePoints = Object.values(this._backup.getAll());

      return this._api.sync(storePoints)
        .then((response) => {
          storePoints.filter((point) => point.offline).forEach((point) => {
            this._backup.removeItem(point.id);
          });

          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          [...createdPoints, ...updatedPoints].forEach((point) => {
            this._backup.setItem(point.id, point);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
