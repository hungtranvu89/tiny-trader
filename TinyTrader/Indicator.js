class Indicator {
  constructor(name, params) {
    this.name = name;
    this.ticks = [];
    this.current = 0;
  }

  /**
   * similar to strategy
   * return your result to add to data indicators
   * @return {any}
   */
  next() {
    return null;
  }
}

module.exports = Indicator;
