module.exports = `
html, body {
    height: 100%;
}

body {
    background-color: #f2f2f2;
}

svg {
    font: 10px sans-serif;
}

text.version {
    fill: #555555;
    font: 10px sans-serif;
}

.axis path,
.axis line {
    fill: none;
    stroke: #BBBBBB;
    shape-rendering: crispEdges;
}

text {
    fill: #DDDDDD;
}

path {
    fill: none;
    stroke-width: 1;
}

path.candle {
    stroke: #000000;
}

path.candle.body {
    stroke-width: 0;
}

path.candle {
    fill: #777777;
    stroke: #777777;
}

path.candle.up {
    fill: #00AA00;
    stroke: #00AA00;
}

path.candle.down {
    fill: #FF0000;
    stroke: #FF0000;
}

.closeValue.annotation.up path {
    fill: #00AA00;
}

path.volume {
    fill: #555555;
}

.indicator-plot path.line {
    fill: none;
    stroke-width: 1;
}

.ma-0 path.line {
    stroke: #1f77b4;
}

.ma-1 path.line {
    stroke: #aec7e8;
}

.ma-2 path.line {
    stroke: #ff7f0e;
}

button {
    position: absolute;
    right: 110px;
    top: 25px;
}

path.macd {
    stroke: #aec7e8;
}

path.signal {
    stroke: #FF9999;
}

path.zero {
    stroke: #BBBBBB;
    stroke-dasharray: 0;
    stroke-opacity: 0.5;
}

path.difference {
    fill: #777777;
}

path.rsi {
    stroke: #aec7e8;
}

path.overbought, path.oversold {
    stroke: #FF9999;
    stroke-dasharray: 5, 5;
}

path.middle, path.zero {
    stroke: #BBBBBB;
    stroke-dasharray: 5, 5;
}

.analysis path, .analysis circle {
    stroke: yellow;
    stroke-width: 0.7;
}

.interaction path, .interaction circle {
    pointer-events: all;
}

.interaction .body {
    cursor: move;
}

.trendlines .interaction .start, .trendlines .interaction .end {
    cursor: nwse-resize;
}

.trendline circle {
    stroke-width: 0;
    display: none;
}
.mouseover .trendline path {
    stroke-width: 1;
}

.mouseover .trendline circle {
    stroke-width: 1;
    fill: yellow;
    display: inline;
}

.supstance path {
    stroke-dasharray: 2, 2;
}

.supstances .interaction path {
    pointer-events: all;
    cursor: ns-resize;
}

.supstances .axisannotation {
    display: none;
}

.supstances .mouseover .axisannotation {
    display: inline;
}

.supstances .axisannotation path {
    fill: #806517;
    stroke: none;
}

.mouseover .supstance path {
    stroke-width: 1.5;
}

.crosshair {
    cursor: crosshair;
}

.crosshair path.wire {
    stroke: #555555;
    stroke-dasharray: 1, 1;
}

.crosshair .axisannotation path {
    fill: #777777;
}

path.tradearrow {
    stroke: none;
  }
  
  path.tradearrow.buy {
    fill: #0000FF;
  }
  
  path.tradearrow.buy-pending {
    fill-opacity: 0.2;
    stroke: #0000FF;
    stroke-width: 1.5;
  }
  
  path.tradearrow.sell {
    fill: #9900FF;
  }
  
  .tradearrow path.highlight {
    fill: none;
    stroke-width: 2;
  }
  
  .tradearrow path.highlight.buy,.tradearrow path.highlight.buy-pending {
    stroke: #0000FF;
  }
  
  .tradearrow path.highlight.buy-pending {
    fill: #0000FF;
    fill-opacity: 0.3;
  }
  
  .tradearrow path.highlight.sell {
    stroke: #9900FF;
  }
`;
