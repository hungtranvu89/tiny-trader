const D3Node = require('d3-node');
const smallChart = require('./SmallChart/SmallChart');
const Tick = require('../Tick'); // eslint-disable-line
const Order = require('../Order'); // eslint-disable-line
const Constants = require('../Constants');

/**
 * 
 * @param {[Tick]} ticks
 * @param {[Order]} orders
 * @param {number} width 
 * @param {number} height
 */
const plot = (name, ticks, orders, width, height, indicators = []) => {
  const data = ticks.map(t => ({
    date: t.date.toDate(),
    open: t.open.toNumber(),
    high: t.high.toNumber(),
    low: t.low.toNumber(),
    close: t.close.toNumber(),
    volume: t.volume
  }));

  const trades = orders.filter(o => o.executed).map(o => ({
    date: o.executed.date.toDate(),
    type: o.type === Constants.ORDER_TYPE.BUY ? 'buy' : 'sell',
    price: o.executed.price.toNumber(),
    quantity: o.executed.size
  }));

  const styles =
    smallChart.styles + indicators.map(ind => ind.styles()).join('');

  const d3n = new D3Node({ styles });

  const chart = new smallChart.Chart({
    name,
    data,
    trades,
    d3: d3n.d3,
    width,
    height
  });
  // console.log(chart.name);

  const svg = d3n.createSVG();
  const plot = chart.render(svg, width, height);

  indicators.forEach(indPl => indPl.plot(plot));

  return d3n;
};

module.exports = {
  plot
};
