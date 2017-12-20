const { Indicator } = require('../../TinyTrader'); // eslint-disable-line
const { Decimal } = require('decimal.js');

class SMA extends Indicator {
  constructor(name, { period }) {
    super(name);
    this._period = period;
  }

  next() {
    if (this.current < this._period - 1) return null;
    let val = 0;
    const range = this.ticks.slice(
      this.current - this._period + 1,
      this.current + 1
    );
    if (this.current === this._period - 1) {
      const sum = range.reduce((s, tick, idx) => Decimal.add(s, tick.close), 0);
      val = Decimal.div(sum, this._period);
    } else {
      const multiplier = new Decimal(2 / (this._period + 1));
      const curClose = this.ticks[this.current].close;
      const preEMA = this.ticks[this.current - 1].indicators[this.name].val;
      val = Decimal.sub(curClose, preEMA).mul(multiplier).plus(preEMA);
    }

    let up = false;
    let down = false;
    if (this.current > this._period * 2) {
      up = val.gt(range[this._period - 2].indicators[this.name].val);
      down = val.lt(range[this._period - 2].indicators[this.name].val);

      for (let i = this.period - 2; i > 0; i--) {
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
