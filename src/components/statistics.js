import AbstractSmartComponent from "./abstract-smart-component";

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const calcPriceByType = (cards, type) => {
  return cards
    .filter((it) => it.type === type)
    .reduce((sum, it) => sum + it.price, 0);
};

const renderPriceChart = (priceCtx, cards) => {
  const types = cards
    .map((card) => card.type)
    .filter(getUniqItems);
  return new window.Chart(priceCtx, {
    plugins: [window.ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: types.map((type) => calcPriceByType(cards, type)),
        backgroundColor: `#ffffff`,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          }
        }]
      },
      /*tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },*/
      title: {
        display: true,
        text: `MONEY`,
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
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(cards) {
    super();
    this._cards = cards;

    this._priceChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  /*show() {
    super.show();

    this.rerender(this._tasks, this._dateFrom, this._dateTo);
  }

  recoveryListeners() {}

  rerender(tasks, dateFrom, dateTo) {
    this._tasks = tasks;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    super.rerender();

    this._renderCharts();
  }*/

  _renderCharts() {
    const element = this.getElement();

    /*const daysCtx = element.querySelector(`.statistic__days`);
    const tagsCtx = element.querySelector(`.statistic__tags`);*/
    const priceCtx = element.querySelector(`.statistics__chart--money`);

    this._resetCharts();

    /*this._daysChart = renderDaysChart(daysCtx, this._tasks.getTasks(), this._dateFrom, this._dateTo);
    this._tagsChart = renderTagsChart(tagsCtx, this._tasks.getTasks());*/
    this._priceChart = renderPriceChart(priceCtx, this._cards.getPoints());
  }

  _resetCharts() {
    /*if (this._daysChart) {
      this._daysChart.destroy();
      this._daysChart = null;
    }

    if (this._tagsChart) {
      this._tagsChart.destroy();
      this._tagsChart = null;
    }
*/
    if (this._priceChart) {
      this._priceChart.destroy();
      this._priceChart = null;
    }
  }

};
