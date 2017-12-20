const { Indicator } = require('../../TinyTrader'); // eslint-disable-line
const { Decimal } = require('decimal.js');

class JHammer extends Indicator {
  constructor(
    name,
    { headPercent = 5, tailPercent = 65, expectPercent = 105 }
  ) {
    super(name);
    this._params = { headPercent, tailPercent, expectPercent };
  }

  next() {
    const tick = this.ticks[this.current];
    const length = Decimal.sub(tick.high, tick.low);
    const barTop = Decimal.max(tick.open, tick.close);
    const barBot = Decimal.min(tick.open, tick.close);
    const headPercent = Decimal.div(
      Decimal.sub(tick.high, barTop) * 100,
      length
    );

    if (headPercent.gt(this._params.headPercent)) return null;

    const tailPercent = Decimal.div(
      Decimal.sub(barBot, tick.low) * 100,
      length
    );

    if (tailPercent.gt(this._params.tailPercent)) {
      const expectHigh = Decimal.div(
        Decimal.mul(length, this._params.expectPercent),
        100
      );
      return {
        sellTarget: Decimal.add(barTop, expectHigh)
      };
    }
    return null;
  }
}

module.exports = JHammer;
