// const d3 = require('d3');
const d3n = require('d3-node');
const d3 = d3n().d3;
const techan = require('techan');
const styles = require('./volume.styles');

const margin = { top: 20, right: 20, bottom: 30, left: 50 };

/**
 * 
 * @param {{svg:Selection, data:[object]}} args 
 */
const render = args => {
  const { svg, data = [] } = args;

  const width = svg.attr('width') - margin.left - margin.right;
  const height = svg.attr('height') - margin.top - margin.bottom;

  const x = techan.scale.financetime().range([0, width]);

  const y = d3.scaleLinear().range([height, 0]);

  const volume = techan.plot
    .volume()
    .accessor(techan.accessor.ohlc()) // For volume bar highlighting
    .xScale(x)
    .yScale(y);

  const xAxis = d3.axisBottom().scale(x);

  var yAxis = d3.axisLeft(y).tickFormat(d3.format(',.3s'));

  const accessor = volume.accessor();

  const dt = data.sort(function(a, b) {
    return d3.ascending(accessor.d(a), accessor.d(b));
  });

  const plot = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  plot.append('g').attr('class', 'volume');

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
    .text('Volume');

  // Data to display initially
  // Only want this button to be active if the data has loaded

  x.domain(dt.map(volume.accessor().d));
  y.domain(techan.scale.plot.volume(dt, volume.accessor().v).domain());

  svg.selectAll('g.volume').datum(dt).call(volume);
  svg.selectAll('g.x.axis').call(xAxis);
  svg.selectAll('g.y.axis').call(yAxis);

  return plot;
};

module.exports = {
  render,
  styles
};
