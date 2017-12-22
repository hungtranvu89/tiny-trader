const D3Node = require('d3-node');
const utils = require('../../utils');
const candleGraph = require('./candle');
const Tick = require('../Tick'); // eslint-disable-line

/**
 * 
 * @param {[Tick]} data 
 * @param {number} width 
 * @param {number} height 
 * @param {string} destination 
 */
const plot = (data, width, height, destination) => {
  const input = data.map(t => ({
    date: t.date.toDate(),
    open: t.open.toNumber(),
    high: t.high.toNumber(),
    low: t.low.toNumber(),
    close: t.close.toNumber(),
    volume: t.volume
  }));
  const d3n = new D3Node({ styles: candleGraph.styles });
  const svg = d3n.createSVG(width, height);
  candleGraph.render({ svg, data: input });
  return utils.writeFile(destination, d3n.html());
};

module.exports = {
  plot
};
