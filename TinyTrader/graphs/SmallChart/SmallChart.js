const techan = require('techan');
const styles = require('./SmallChart.styles');

class SmallChart {
  constructor({ name, data, trades, d3, width, height, type = 'candle' }) {
    this.dim = {
      width: width,
      height: height,
      margin: { top: 25, right: 50, bottom: 25, left: 50 },
      plot: { width: null, height: null },
      ohlc: { height: null },
      indicator: { height: null, padding: null, top: null, bottom: null }
    };

    this.dim.plot.width =
      this.dim.width - this.dim.margin.left - this.dim.margin.right;
    this.dim.plot.height =
      this.dim.height - this.dim.margin.top - this.dim.margin.bottom;
    this.dim.ohlc.height = this.dim.plot.height;
    this.dim.indicator.height = this.dim.plot.height * 0.144444;
    this.dim.indicator.padding = this.dim.plot.height * 0.01111111111;
    this.dim.indicator.top = this.dim.ohlc.height + this.dim.indicator.padding;
    this.dim.indicator.bottom =
      this.dim.indicator.top +
      this.dim.indicator.height +
      this.dim.indicator.padding;

    const xRange = [0, this.dim.plot.width],
      yRange = [this.dim.ohlc.height, 0],
      ohlcVerticalTicks = Math.min(10, Math.round(this.dim.height / 70)),
      xTicks = Math.min(10, Math.round(this.dim.width / 130));

    this.data = data;
    this.trades = trades;
    this.x = techan.scale.financetime().range(xRange);
    this.y = d3.scaleLinear().range(yRange);
    this.yPercent = this.y.copy();
    this.indicatorTop = d3
      .scaleLinear()
      .range([this.dim.indicator.top, this.dim.indicator.bottom]);
    this.yVolume = d3
      .scaleLinear()
      .range([yRange[0], yRange[0] - 0.2 * yRange[0]]);
    this.candlestick =
      type === 'ohlc'
        ? techan.plot.ohlc().xScale(this.x).yScale(this.y)
        : techan.plot.candlestick().xScale(this.x).yScale(this.y);
    const accessor = this.candlestick.accessor();
    this.data.sort((a, b) => d3.ascending(accessor.d(a), accessor.d(b)));
    this.volume = techan.plot
      .volume()
      .accessor(this.candlestick.accessor())
      .xScale(this.x)
      .yScale(this.yVolume);
    this.xAxis = d3.axisBottom(this.x).ticks(xTicks);
    this.xAxisTop = d3.axisTop(this.x).ticks(xTicks);
    this.timeAnnotation = techan.plot
      .axisannotation()
      .orient('bottom')
      .axis(this.xAxis)
      .format(d3.timeFormat('%Y-%m-%d'))
      .width(65)
      .translate([0, this.dim.plot.height]);

    this.timeAnnotationTop = techan.plot
      .axisannotation()
      .orient('top')
      .axis(this.xAxisTop)
      .format(d3.timeFormat('%Y-%m-%d'))
      .width(65);
    this.yAxis = d3.axisRight(this.y).ticks(ohlcVerticalTicks);
    this.ohlcAnnotation = techan.plot
      .axisannotation()
      .orient('right')
      .axis(this.yAxis)
      .format(d3.format(',.2f'))
      .translate([xRange[1], 0]);
    this.closeAnnotation = techan.plot
      .axisannotation()
      .orient('right')
      .accessor(this.candlestick.accessor())
      .axis(this.yAxis)
      .format(d3.format(',.2f'))
      .translate([xRange[1], 0]);
    this.percentAxis = d3
      .axisLeft(this.yPercent)
      .tickFormat(d3.format('+.1%'))
      .ticks(ohlcVerticalTicks);
    this.percentAnnotation = techan.plot
      .axisannotation()
      .orient('left')
      .axis(this.percentAxis);
    this.volumeAxis = d3
      .axisRight(this.yVolume)
      .tickFormat(d3.format(',.3s'))
      .ticks(Math.min(3, Math.round(this.dim.height / 150)));

    this.volumeAnnotation = techan.plot
      .axisannotation()
      .orient('right')
      .axis(this.volumeAxis)
      .width(35);

    this.tradeArrow = techan.plot
      .tradearrow()
      .xScale(this.x)
      .yScale(this.y)
      .orient(d => (d.type.startsWith('buy') ? 'up' : 'down'));

    this.name = name;
  }

  render(svg) {
    svg.attr('width', this.dim.width).attr('height', this.dim.height);
    const defs = svg.select('defs');

    defs
      .append('clipPath')
      .attr('id', 'ohlcClip')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.dim.plot.width)
      .attr('height', this.dim.ohlc.height);

    defs
      .selectAll('.indicatorClip')
      .data([0, 1])
      .enter()
      .append('clipPath')
      .attr('id', function(d, i) {
        return 'indicatorClip-' + i;
      })
      .attr('class', 'indicatorClip')
      .append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => this.indicatorTop(i))
      .attr('width', this.dim.plot.width)
      .attr('height', this.dim.indicator.height);

    const plot = svg
      .append('g')
      .attr('class', 'chart')
      .attr(
        'transform',
        'translate(' + this.dim.margin.left + ',' + this.dim.margin.top + ')'
      );

    plot
      .append('text')
      .attr('class', 'symbol')
      .attr('x', 5)
      .attr('y', 15)
      .text(this.name);

    plot
      .append('g')
      .attr('class', 'x axis bottom')
      .attr('transform', `translate(0,${this.dim.plot.height})`);

    plot.append('g').attr('class', 'x axis top');

    const ohlcSelection = plot
      .append('g')
      .attr('class', 'ohlc')
      .attr('transform', 'translate(0,0)');

    ohlcSelection
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${this.dim.plot.width},0)`);

    ohlcSelection.append('g').attr('class', 'closeValue annotation up');

    ohlcSelection
      .append('g')
      .attr('class', 'volume')
      .attr('clip-path', 'url(#ohlcClip)');

    ohlcSelection
      .append('g')
      .attr('class', 'candlestick')
      .attr('clip-path', 'url(#ohlcClip)');

    ohlcSelection.append('g').attr('class', 'percent axis');

    ohlcSelection.append('g').attr('class', 'volume axis');

    const tradeArrowSelection = plot.append('g').attr('class', 'tradearrow');

    const accessor = this.candlestick.accessor();
    this.x.domain(techan.scale.plot.time(this.data).domain());
    this.y.domain(techan.scale.plot.ohlc(this.data).domain());
    this.yPercent.domain(
      techan.scale.plot.percent(this.y, accessor(this.data)).domain()
    );
    this.yVolume.domain(techan.scale.plot.volume(this.data).domain());

    ohlcSelection
      .select('g.candlestick')
      .datum(this.data)
      .call(this.candlestick);
    ohlcSelection
      .select('g.closeValue.annotation')
      .datum([this.data[this.data.length - 1]])
      .call(this.closeAnnotation);
    ohlcSelection.select('g.volume').datum(this.data).call(this.volume);
    tradeArrowSelection.datum(this.trades).call(this.tradeArrow);

    svg.select('g.x.axis.bottom').call(this.xAxis);
    svg.select('g.x.axis.top').call(this.xAxisTop);
    svg.select('g.volume.axis').call(this.volumeAxis);
    svg.select('g.percent.axis').call(this.percentAxis);
    ohlcSelection.select('g.axis').call(this.yAxis);

    return {
      svg: ohlcSelection,
      plot: techan.plot,
      xScale: this.x,
      yScale: this.y
    };
  }
}

module.exports = {
  Chart: SmallChart,
  styles
};
