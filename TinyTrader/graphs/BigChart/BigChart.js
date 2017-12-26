const techan = require('techan');
const styles = require('./BigChart.styles');

class BigChart {
  constructor({ name, data, trades, d3, preroll, width, height }) {
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
    this.dim.ohlc.height = this.dim.plot.height * 0.67777777;
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
    this.candlestick = techan.plot.candlestick().xScale(this.x).yScale(this.y);
    const accessor = this.candlestick.accessor();
    this.data.sort((a, b) => d3.ascending(accessor.d(a), accessor.d(b)));

    this.sma0 = techan.plot.sma().xScale(this.x).yScale(this.y);
    this.sma1 = techan.plot.sma().xScale(this.x).yScale(this.y);
    this.ema2 = techan.plot.ema().xScale(this.x).yScale(this.y);
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
    this.macdScale = d3
      .scaleLinear()
      .range([
        this.indicatorTop(0) + this.dim.indicator.height,
        this.indicatorTop(0)
      ]);

    this.rsiScale = d3
      .scaleLinear()
      .range([
        this.indicatorTop(1) + this.dim.indicator.height,
        this.indicatorTop(1)
      ]);
    this.macd = techan.plot.macd().xScale(this.x).yScale(this.macdScale);
    this.macdAxis = d3.axisRight(this.macdScale).ticks(3);
    this.macdAnnotation = techan.plot
      .axisannotation()
      .orient('right')
      .axis(this.macdAxis)
      .format(d3.format(',.2s'))
      .translate([xRange[1], 0]);

    this.macdAxisLeft = d3.axisLeft(this.macdScale).ticks(3);
    this.macdAnnotationLeft = techan.plot
      .axisannotation()
      .orient('left')
      .axis(this.macdAxisLeft)
      .format(d3.format(',.2s'));
    this.rsi = techan.plot.rsi().xScale(this.x).yScale(this.rsiScale);
    this.rsiAxis = d3.axisRight(this.rsiScale).ticks(3);
    this.rsiAnnotation = techan.plot
      .axisannotation()
      .orient('right')
      .axis(this.rsiAxis)
      .format(d3.format(',.2s'))
      .translate([xRange[1], 0]);

    this.rsiAxisLeft = d3.axisLeft(this.rsiScale).ticks(3);
    this.rsiAnnotationLeft = techan.plot
      .axisannotation()
      .orient('left')
      .axis(this.rsiAxisLeft)
      .format(d3.format(',.2s'));
    // this.ohlcCrosshair = techan.plot
    //   .crosshair()
    //   .xScale(this.x)
    //   .yScale(this.y)
    //   .xAnnotation([this.timeAnnotation, this.timeAnnotationTop])
    //   .yAnnotation([
    //     this.ohlcAnnotation,
    //     this.percentAnnotation,
    //     this.volumeAnnotation
    //   ])
    //   .verticalWireRange([0, this.dim.plot.height]);

    // this.macdCrosshair = techan.plot
    //   .crosshair()
    //   .xScale(this.x)
    //   .yScale(this.macdScale)
    //   .xAnnotation([this.timeAnnotation, this.timeAnnotationTop])
    //   .yAnnotation([this.macdAnnotation, this.macdAnnotationLeft])
    //   .verticalWireRange([0, this.dim.plot.height]);
    // this.rsiCrosshair = techan.plot
    //   .crosshair()
    //   .xScale(this.x)
    //   .yScale(this.rsiScale)
    //   .xAnnotation([this.timeAnnotation, this.timeAnnotationTop])
    //   .yAnnotation([this.rsiAnnotation, this.rsiAnnotationLeft])
    //   .verticalWireRange([0, this.dim.plot.height]);

    this.tradeArrow = techan.plot
      .tradearrow()
      .xScale(this.x)
      .yScale(this.y)
      .orient(d => (d.type.startsWith('buy') ? 'up' : 'down'));

    this.name = name;
    this.preroll = preroll;
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

    ohlcSelection
      .append('g')
      .attr('class', 'indicator sma ma-0')
      .attr('clip-path', 'url(#ohlcClip)');

    ohlcSelection
      .append('g')
      .attr('class', 'indicator sma ma-1')
      .attr('clip-path', 'url(#ohlcClip)');

    ohlcSelection
      .append('g')
      .attr('class', 'indicator ema ma-2')
      .attr('clip-path', 'url(#ohlcClip)');

    ohlcSelection.append('g').attr('class', 'percent axis');

    ohlcSelection.append('g').attr('class', 'volume axis');

    const [macdSelection, rsiSelection] = ['macd', 'rsi'].map(d =>
      plot.append('g').attr('class', `${d} indicator`)
    );

    [macdSelection, rsiSelection].forEach((selection, i) => {
      selection
        .append('g')
        .attr('class', 'axis right')
        .attr('transform', `translate(${this.dim.plot.width},0)`);

      selection
        .append('g')
        .attr('class', 'axis left')
        .attr('transform', 'translate(0,0)');

      selection
        .append('g')
        .attr('class', 'indicator-plot')
        .attr('clip-path', `url(#indicatorClip-${i})`);
    });

    const tradeArrowSelection = plot.append('g').attr('class', 'tradearrow');

    // const ohlcCrosshairSelection = plot
    //   .append('g')
    //   .attr('class', 'crosshair ohlc');

    // const macdCrosshairSelection = plot
    //   .append('g')
    //   .attr('class', 'crosshair macd');

    // const rsiCrosshairSelection = plot
    //   .append('g')
    //   .attr('class', 'crosshair rsi');

    const accessor = this.candlestick.accessor(),
      indicatorPreRoll = this.preroll,
      postRollData = this.data.slice(indicatorPreRoll); // Don't show where indicators don't have data

    this.x.domain(techan.scale.plot.time(this.data).domain());
    this.y.domain(techan.scale.plot.ohlc(postRollData).domain());
    this.yPercent.domain(
      techan.scale.plot
        .percent(this.y, accessor(this.data[indicatorPreRoll]))
        .domain()
    );
    this.yVolume.domain(techan.scale.plot.volume(postRollData).domain());

    const macdData = techan.indicator.macd()(this.data);
    this.macdScale.domain(techan.scale.plot.macd(macdData).domain());
    const rsiData = techan.indicator.rsi()(this.data);
    this.rsiScale.domain(techan.scale.plot.rsi(rsiData).domain());

    ohlcSelection
      .select('g.candlestick')
      .datum(this.data)
      .call(this.candlestick);
    ohlcSelection
      .select('g.closeValue.annotation')
      .datum([this.data[this.data.length - 1]])
      .call(this.closeAnnotation);
    ohlcSelection.select('g.volume').datum(this.data).call(this.volume);
    ohlcSelection
      .select('g.sma.ma-0')
      .datum(techan.indicator.sma().period(10)(this.data))
      .call(this.sma0);
    ohlcSelection
      .select('g.sma.ma-1')
      .datum(techan.indicator.sma().period(20)(this.data))
      .call(this.sma1);
    ohlcSelection
      .select('g.ema.ma-2')
      .datum(techan.indicator.ema().period(50)(this.data))
      .call(this.ema2);
    macdSelection.select('g.indicator-plot').datum(macdData).call(this.macd);
    rsiSelection.select('g.indicator-plot').datum(rsiData).call(this.rsi);
    tradeArrowSelection.datum(this.trades).call(this.tradeArrow);
    // ohlcCrosshairSelection.call(this.ohlcCrosshair);
    // macdCrosshairSelection.call(this.macdCrosshair);
    // rsiCrosshairSelection.call(this.rsiCrosshair);

    svg.select('g.x.axis.bottom').call(this.xAxis);
    svg.select('g.x.axis.top').call(this.xAxisTop);
    svg.select('g.volume.axis').call(this.volumeAxis);
    svg.select('g.percent.axis').call(this.percentAxis);
    ohlcSelection.select('g.axis').call(this.yAxis);
    macdSelection.select('g.axis.right').call(this.macdAxis);
    rsiSelection.select('g.axis.right').call(this.rsiAxis);
    macdSelection.select('g.axis.left').call(this.macdAxisLeft);
    rsiSelection.select('g.axis.left').call(this.rsiAxisLeft);
    // macdCrosshairSelection.select('g.axis.right').call(this.macdAxis);
    // rsiCrosshairSelection.select('g.axis.right').call(this.rsiAxis);
    // macdCrosshairSelection.select('g.axis.left').call(this.macdAxisLeft);
    // rsiCrosshairSelection.select('g.axis.left').call(this.rsiAxisLeft);
  }
}

module.exports = {
  Chart: BigChart,
  styles
};
