const _ = require('lodash');
const input = require('./Data/USDTBTC.json');

const tnt = require('../TinyTrader');
const Dummy = require('./Strategies/Dummy');
const JustHammer = require('./Strategies/JustHammer');

const trader = new tnt.Trader('USDT-BTC');

const ticks = input.map(
  v =>
    new tnt.Tick({
      date: v.T,
      open: v.O,
      high: v.H,
      low: v.L,
      close: v.C,
      volume: v.V
    })
);

trader.addData(ticks);

trader.cash = 1000;

trader.fixSize = 1000;

// trader.optStrategy(Dummy, {
//   exitBars: _.range(3, 8),
//   smaPeriod: _.range(3, 8)
// });

// trader.run();

// trader.setStrategy(JustHammer, { headPercent: 1 });

// trader.run();

trader.plot('report.html');
