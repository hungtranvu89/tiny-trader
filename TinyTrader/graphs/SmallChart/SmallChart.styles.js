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
