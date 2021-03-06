const moment = require('moment');
const Decimal = require('decimal.js');

class Tick {
  constructor({
    date = new Date(),
    open = 0,
    high = 0,
    low = 0,
    close = 0,
    volume = 0
  }) {
    this._date = moment(date);
    this._open = new Decimal(open);
    this._high = new Decimal(high);
    this._low = new Decimal(low);
    this._close = new Decimal(close);
    this._volume = volume;
    this._indicators = {};
  }

  get date() {
    return this._date;
  }
  /**
   * @returns {Decimal.Instance}
   */
  get open() {
    return this._open;
  }
  /**
   * @returns {Decimal.Instance}
   */
  get high() {
    return this._high;
  }
  /**
   * @returns {Decimal.Instance}
   */
  get low() {
    return this._low;
  }
  /**
   * @returns {Decimal.Instance}
   */
  get close() {
    return this._close;
  }
  /**
   * @returns {number}
   */
  get volume() {
    return this._volume;
  }
  get indicators() {
    return {
      ...this._indicators
    };
  }

  setIndicatorValue(name, value) {
    this._indicators[name] = value;
  }
}

module.exports = Tick;
