import PointModel from "../models/point-model";
import StoreModel from "../models/store-model";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const URLS = [`destinations`, `offers`, `points`];

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class Index {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getData() {

    const requests = URLS.map((it) => this._load({url: it}));
    return Promise.all(requests)
      .then((responses) => Promise.all(responses.map((it) => it.json())))
      .then((responses) => {
        const [destinations, offers, points] = responses;
        StoreModel.setAllDestinations(destinations);
        StoreModel.setOffers(offers);
        return points;
      })
      .then(PointModel.parsePoints);
  }

  getPoints() {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then(PointModel.parsePoints);
  }

  createPoint(point) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(point.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(PointModel.parsePoint);
  }

  updatePoint(id, point) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(point.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(PointModel.parsePoint);
  }

  deletePoint(id) {
    return this._load({
      url: `points/${id}`,
      method: Method.DELETE
    });
  }

  sync(points) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(points),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}

