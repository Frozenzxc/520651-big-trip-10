export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.price = data[`base_price`];
    this.startTime = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.endTime = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.destination = data[`destination`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`];
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'base_price': this.price,
      'date_from': this.startTime ? this.startTime.toISOString() : null,
      'date_to': this.endTime ? this.endTime.toISOString() : null,
      'destination': this.destination,
      'is_favorite': this.isFavorite,
      'offers': this.offers
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
