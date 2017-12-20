const { Order, Strategy, ORDER_TYPE, ORDER_STATUS } = require('../../TinyTrader'); // eslint-disable-line
const HammerIndicator = require('../Indicators/Hammer');

class JHammer extends Strategy {
  constructor({ headPercent = 5, tailPercent = 65, expectPercent = 105 }) {
    super();
    this._ordering = null;
    this.addIndicator(
      new HammerIndicator('hammer', {
        headPercent,
        tailPercent,
        expectPercent
      })
    );
  }
  next() {
    if (this._ordering) return;
    if (this.trader.hold === 0) {
      if (this.ticks[this.current].indicators.hammer) {
        this._ordering = this.buy();
        this._sellTarget = this.ticks[
          this.current
        ].indicators.hammer.sellTarget;
      }
    } else {
      if (this.ticks[this.current].close.gte(this._sellTarget))
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
        console.log(
          `BUY EXECUTED, Price: ${price}, Cost: ${value}, Comm ${commission}`
        );
      } else {
        console.log(
          `SELL EXECUTED, Price: ${price}, Cost: ${value}, Comm ${commission}`
        );
      }
      console.log(
        `${this.ticks[this.current].date.format(
          'MMM Do YY'
        )} - Value: ${this.getValue()}`
      );
      this._ordering = null;
    }
  }

  onStop() {
    console.log(`stop  ${this.getValue()}`);
  }
}

module.exports = JHammer;
