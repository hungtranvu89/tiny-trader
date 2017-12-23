// const d3 = require('d3');
const d3n = require('d3-node');
const d3 = d3n().d3;
const techan = require('techan');
const styles = require('./candle.styles');

const margin = { top: 20, right: 20, bottom: 30, left: 50 };

const orient = d => (d.type.startsWith('buy') ? 'up' : 'down');

/**
 * 
 * @param {{svg:Selection, data:[object]}} args 
 */
const render = args => {
  const { svg, data = [], trades = [] } = args;

  const width = svg.attr('width') - margin.left - margin.right;
  const height = svg.attr('height') - margin.top - margin.bottom;

  const x = techan.scale.financetime().range([0, width]);

  const y = d3.scaleLinear().range([height, 0]);

  const candlestick = techan.plot.candlestick().xScale(x).yScale(y);

  const tradearrow = techan.plot
    .tradearrow()
    .xScale(x)
    .yScale(y)
    .orient(orient);

  const xAxis = d3.axisBottom().scale(x);

  const yAxis = d3.axisLeft().scale(y);

  const accessor = candlestick.accessor();

  const dt = data.sort(function(a, b) {
    return d3.ascending(accessor.d(a), accessor.d(b));
  });

  const plot = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  plot.append('g').attr('class', 'candlestick');

  plot.append('g').attr('class', 'tradearrow');

  plot
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

  plot
    .append('g')
    .attr('class', 'y axis')
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Price ($)');

  // Data to display initially
  // Only want this button to be active if the data has loaded

  x.domain(dt.map(candlestick.accessor().d));
  y.domain(techan.scale.plot.ohlc(dt, candlestick.accessor()).domain());

  plot.selectAll('g.candlestick').datum(dt).call(candlestick);
  plot.selectAll('g.tradearrow').datum(trades).call(tradearrow);
  plot.selectAll('g.x.axis').call(xAxis);
  plot.selectAll('g.y.axis').call(yAxis);

  return plot;
};

module.exports = {
  render,
  styles
};
