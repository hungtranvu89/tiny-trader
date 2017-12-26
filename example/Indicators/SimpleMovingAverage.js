const { Indicator } = require('../../TinyTrader'); // eslint-disable-line
const { Decimal } = require('decimal.js');

class SMA extends Indicator {
  constructor(name, { period }) {
    super(name);
    this._period = period;
  }

  next() {
    if (this.current < this._period - 1) return null;
    const range = this.ticks.slice(
      this.current - this._period + 1,
      this.current + 1
    );

    const sum = range.reduce((s, tick, idx) => Decimal.add(s, tick.close), 0);
    const val = Decimal.div(sum, this._period);

    let up = false;
    let down = false;
    if (this.current > this._period * 2) {
      const prev = range.length - 2;
      up = val.gt(range[prev].indicators[this.name].val);
      down = val.lt(range[prev].indicators[this.name].val);

      for (let i = prev; i > 0; i--) {
        if (
          range[i].indicators[this.name] &&
          range[i - 1].indicators[this.name]
        ) {
          up =
            up &&
            range[i].indicators[this.name].val.gt(
              range[i - 1].indicators[this.name].val
            );
          down =
            down &&
            range[i].indicators[this.name].val.lt(
              range[i - 1].indicators[this.name].val
            );
        }
      }
    }

    return {
      val,
      up,
      down
    };
  }
}

module.exports = SMA;
