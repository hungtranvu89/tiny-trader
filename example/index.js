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

trader.cash = 10000;

trader.fixSize = 1;

// trader.optStrategy(Dummy, {
//   exitBars: _.range(3, 8),
//   smaPeriod: _.range(3, 8)
// });

// trader.run();

// trader.setStrategy(JustHammer, { headPercent: 1 });
trader.setStrategy(Dummy, { exitBars: 5, smaPeriod: 3 });

trader.run();

const liveTrader = new tnt.Trader('live');
liveTrader.cash = 10000;

liveTrader.setStrategy(Dummy, { exitBars: 5, smaPeriod: 3 });
ticks.forEach(t => {
  liveTrader.addData([t]);
  liveTrader.run();
});

trader.plot('report.html', { type: 'ohlc' });
