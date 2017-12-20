const SMA = require('../Indicators/SimpleMovingAverage');
const EMA = require('../Indicators/ExponentialMovingAverage');

const {
  Strategy,
  Order,
  ORDER_TYPE,
  ORDER_STATUS
} = require('../../TinyTrader'); // eslint-disable-line

class Dummy extends Strategy {
  constructor({ exitBars = 5, smaPeriod }) {
    super();
    this._exitBars = exitBars;
    this._smaPeriod = smaPeriod;
    this._ordering = null;
    this.addIndicator(
      new SMA('sma', {
        period: smaPeriod
      })
    );
    this.addIndicator(
      new EMA('ema', {
        period: smaPeriod
      })
    );
  }
  next() {
    if (this._ordering) return;
    if (this.trader.hold === 0) {
      if (
        this.ticks[this.current].indicators.sma &&
        this.ticks[this.current].indicators.sma.up
      )
        this._ordering = this.buy();
    } else {
      if (this.current >= this._lastBuy + this._exitBars)
        this._ordering = this.sell();
    }
  }

  /**
   * 
   * @param {Order} order 
   */
  onOrder(order) {
    if (order.status === ORDER_STATUS.COMPLETED) {
      const { price, value, commission } = order.executed;
      if (order.type === ORDER_TYPE.BUY) {
        this._lastBuy = this.current;
        // console.log(
        //   `BUY EXECUTED, Price: ${price}, Cost: ${value}, Comm ${commission}`
        // );
      } else {
        // console.log(
        //   `SELL EXECUTED, Price: ${price}, Cost: ${value}, Comm ${commission}`
        // );
      }
      // console.log(
      //   `${this.ticks[this.current].date.format(
      //     'MMM Do YY'
      //   )} - Value: ${this.getValue()}`
      // );
      this._ordering = null;
    }
  }

  onStop() {
    console.log(
      `stop exitBars=${this._exitBars}, sma=${this
        ._smaPeriod}, VALUE=${this.getValue()}`
    );
  }
}

module.exports = Dummy;
