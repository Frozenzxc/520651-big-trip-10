import AbstractSmartComponent from "./abstract-smart-component";
import moment from "moment";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const SHOWING_BARS_COUNT_BY_TYPE = 6;
const SHOWING_BARS_COUNT_BY_TRANSPORT_TYPE = 4;
const SHOWING_BARS_COUNT_BY_DESTINATION = 4;
const EURO_SYMBOL = `\u20AC`;
const Transport = [
  `bus`,
  `drive`,
  `flight`,
  `ship`,
  `taxi`,
  `train`,
  `transport`,
];

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const calcPriceByType = (cards, type) => {
  return cards
    .filter((it) => it.type === type)
    .reduce((sum, it) => sum + it.price, 0);
};

const calcTransportTypeCount = (cards, type) => {
  return cards
    .filter((it) => it.type === type)
    .reduce((sum) => sum + 1, 0);
};

const getDuration = (start, end) => {
  let startTime = moment(start);
  let endTime = moment(end);
  const diff = endTime.diff(startTime);

  return moment(diff);
};

const calcTimeSpent = (cards, destination) => {
  return cards
    .filter((it) => it.destination.name === destination)
    .reduce((sum, it) => sum + getDuration(it.startTime, it.endTime), 0);
};

const renderPriceChart = (priceCtx, cards) => {
  const types = cards
    .map((card) => card.type)
    .filter(getUniqItems);
  const data = types.map((type) => {
    return {
      type,
      price: calcPriceByType(cards, type)
    };
  })
    .sort((a, b) => b.price - a.price);
  return new Chart(priceCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: data.map((it) => it.type.toUpperCase()).slice(0, SHOWING_BARS_COUNT_BY_TYPE),
      datasets: [{
        data: data.map((it) => it.price).slice(0, SHOWING_BARS_COUNT_BY_TYPE),
        backgroundColor: `#ffffff`,
        barThickness: 60,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          anchor: `end`,
          color: `#000000`,
          font: {
            family: `'Montserrat', 'Arial', 'sans-serif'`,
            size: 17,
            weight: 600,
            lineHeight: 21,
          },
          align: `start`,
          formatter(value) {
            return EURO_SYMBOL + ` ` + value;
          }
        }
      },
      scales: {
        display: false,
        xAxes: [{
          gridLines: {
            beginAtZero: true,
            display: false
          },
          ticks: {
            beginAtZero: true,
            display: false,
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontFamily: `'Montserrat', 'Arial', 'sans-serif'`,
            fontStyle: `normal`,
            fontSize: 17,
            fontColor: `#000000`,
          }
        }]
      },
      tooltips: {
        enabled: false
      },
      title: {
        display: true,
        text: `MONEY`,
        fontFamily: `'Montserrat', 'Arial', 'sans-serif'`,
        fontStyle: `bold`,
        fontSize: 28,
        fontColor: `#000000`,
        position: `left`,
      },
      legend: {
        display: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, cards) => {
  const data = Transport.map((type) => {
    return {
      type,
      count: calcTransportTypeCount(cards, type)
    };
  })
    .sort((a, b) => b.count - a.count);
  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: data.map((it) => it.type.toUpperCase()).slice(0, SHOWING_BARS_COUNT_BY_TRANSPORT_TYPE),
      datasets: [{
        data: data.map((it) => it.count).slice(0, SHOWING_BARS_COUNT_BY_TRANSPORT_TYPE),
        backgroundColor: `#ffffff`,
        barThickness: 60,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          anchor: `end`,
          color: `#000000`,
          font: {
            family: `'Montserrat', 'Arial', 'sans-serif'`,
            size: 17,
            weight: 600,
            lineHeight: 21,
          },
          align: `start`,
          formatter(value) {
            return value + `x`;
          }
        }
      },
      scales: {
        display: false,
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            beginAtZero: true,
            display: false,
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontFamily: `'Montserrat', 'Arial', 'sans-serif'`,
            fontStyle: `normal`,
            fontSize: 17,
            fontColor: `#000000`,
          }
        }]
      },
      tooltips: {
        enabled: false
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontFamily: `'Montserrat', 'Arial', 'sans-serif'`,
        fontStyle: `bold`,
        fontSize: 28,
        fontColor: `#000000`,
        position: `left`,
      },
      legend: {
        display: false,
      }
    }
  });
};

const renderTimeSpentChart = (timeSpentCtx, cards) => {
  const destinations = cards
    .map((card) => card.destination.name)
    .filter(getUniqItems);
  const data = destinations.map((destination) => {
    return {
      destination,
      duration: moment(calcTimeSpent(cards, destination)).format(`HH`)
    };
  })
    .sort((a, b) => b.duration - a.duration);
  return new Chart(timeSpentCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: data.map((it) => it.destination.toUpperCase()).slice(0, SHOWING_BARS_COUNT_BY_DESTINATION),
      datasets: [{
        data: data.map((it) => it.duration).slice(0, SHOWING_BARS_COUNT_BY_DESTINATION),
        backgroundColor: `#ffffff`,
        barThickness: 60,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          anchor: `end`,
          color: `#000000`,
          font: {
            family: `'Montserrat', 'Arial', 'sans-serif'`,
            size: 17,
            weight: 600,
            lineHeight: 21,
          },
          align: `start`,
          formatter(value) {
            return value + `H`;
          }
        }
      },
      scales: {
        display: false,
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            beginAtZero: true,
            display: false,
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontFamily: `'Montserrat', 'Arial', 'sans-serif'`,
            fontStyle: `normal`,
            fontSize: 17,
            fontColor: `#000000`,
          }
        }]
      },
      tooltips: {
        enabled: false
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontFamily: `'Montserrat', 'Arial', 'sans-serif'`,
        fontStyle: `bold`,
        fontSize: 28,
        fontColor: `#000000`,
        position: `left`,
      },
      legend: {
        display: false,
      }
    }
  });
};

const createStatsTemplate = () => {
  return (
    `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900" height="350"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900" height="250"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900" height="250"></canvas>
          </div>
        </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(cards) {
    super();
    this._cards = cards;

    this._priceChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._cards);
  }

  recoveryListeners() {}

  rerender(cards) {
    this._cards = cards;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const priceCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpentCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._priceChart = renderPriceChart(priceCtx, this._cards.getPoints());
    this._transportChart = renderTransportChart(transportCtx, this._cards.getPoints());
    this._timeSpentChart = renderTimeSpentChart(timeSpentCtx, this._cards.getPoints());
  }

  _resetCharts() {
    if (this._priceChart) {
      this._priceChart.destroy();
      this._priceChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpentChart) {
      this._timeSpentChart.destroy();
      this._timeSpentChart = null;
    }
  }
}
