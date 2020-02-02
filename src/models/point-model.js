export default class PointModel {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.price = data[`base_price`];
    this.startTime = new Date(data[`date_from`]);
    this.endTime = new Date(data[`date_to`]);
    this.destination = data[`destination`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`];
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'base_price': this.price,
      'date_from': this.startTime.toISOString(),
      'date_to': this.endTime.toISOString(),
      'destination': this.destination,
      'is_favorite': this.isFavorite,
      'offers': this.offers
    };
  }

  static parsePoint(point) {
    return new PointModel(point);
  }

  static parsePoints(points) {
    return points.map(PointModel.parsePoint);
  }

  static clone(point) {
    return new PointModel(point.toRAW());
  }
}
