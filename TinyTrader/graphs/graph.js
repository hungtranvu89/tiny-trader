const D3Node = require('d3-node');
const utils = require('../../utils');
const candleGraph = require('./candle/candle');
const volumeGraph = require('./volume/volume');

const Tick = require('../Tick'); // eslint-disable-line
const Order = require('../Order'); // eslint-disable-line
const Constants = require('../Constants');

/**
 * 
 * @param {[Tick]} ticks
 * @param {[Order]} orders
 * @param {number} width 
 * @param {number} height 
 * @param {string} destination 
 */
const plot = (ticks, orders, width, height, destination) => {
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

  const d3n = new D3Node({
    styles: `${candleGraph.styles}${volumeGraph.styles}`
  });
  const svg = d3n.createSVG(width, height);
  candleGraph.render({ svg, data, trades });
  volumeGraph.render({ svg, data });
  return utils.writeFile(destination, d3n.html());
};

module.exports = {
  plot
};
