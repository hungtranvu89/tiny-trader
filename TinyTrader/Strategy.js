const Order = require('./Order'); // eslint-disable-line
const Trader = require('./Trader'); // eslint-disable-line
const Indicator = require('./Indicator'); // eslint-disable-line

class Strategy {
  constructor(params) {
    this.trader = null;
    this.ticks = [];
    this.current = 0;
    this._indicators = [];
  }
  get indicators() {
    return this._indicators;
  }

  /**
   * 
   * @param {Order} order 
   */
  onOrder(order) {
    // console.log('order', order);
  }

  next() {
    // console.log('next', this.ticks[this.current]);
  }

  onStop() {
    // console.log('stop', this.getValue());
  }

  getValue() {
    return this.trader.getValue();
  }

  buy(params = {}) {
    const size = params.size;
    return this.trader.buy({
      size
    });
  }

  sell(params = {}) {
    const size = params.size;
    return this.trader.sell({
      size
    });
  }

  /**
   * 
   * @param {string} name will be add as prop of tick indicators
   * @param {Indicator} indicator 
   */
  addIndicator(indicator) {
    let indicatorName = indicator.name;
    if (this._indicators.findIndex(ind => ind.name === indicatorName) >= 0)
      indicatorName = indicatorName.concat('1');
    this._indicators.push(indicator);
  }
}

module.exports = Strategy;
