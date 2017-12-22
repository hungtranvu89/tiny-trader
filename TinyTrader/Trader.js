const Decimal = require('decimal.js');
const Strategy = require('./Strategy'); // eslint-disable-line
const Tick = require('./Tick'); // eslint-disable-line
const Indicator = require('./Indicator'); // eslint-disable-line
const Order = require('./Order');
const graph = require('./graphs/graph');
const { ORDER_TYPE, ORDER_STATUS } = require('./Constants');

class Trader {
  constructor() {
    this._cash = new Decimal(0);
    this._strategy = null;
    this._ticks = [];
    this._orders = [];
    this._strategies = [];
    this._hold = 0;
    this._current = -1;
    this._opting = false;
    this.fixSize = undefined;
    this.commission = 0;
  }
  get cash() {
    return this._cash;
  }
  set cash(c) {
    this._cash = new Decimal(c);
  }
  get hold() {
    return this._hold;
  }
  /**
   * @param {typeof Strategy} UserStrategy
   * @param {Object} params
   */
  setStrategy(UserStrategy, params = {}) {
    this._strategy = new UserStrategy(params);
    this._strategy.trader = this;
    this._opting = false;
  }

  /**
   * @param {typeof Strategy} UserStrategy
   */
  optStrategy(UserStrategy, params = {}) {
    let paramsArray = [];
    Object.entries(params).forEach(entry => {
      let values = entry[1];
      if (!values.forEach) values = [values];
      const newTable = [];
      values.forEach(value => {
        if (paramsArray.length === 0) {
          newTable.push({
            [entry[0]]: value
          });
        } else {
          paramsArray.forEach(params => {
            newTable.push({
              ...params,
              [entry[0]]: value
            });
          });
        }
      });
      paramsArray = newTable.slice();
      newTable.length = 0;
    });
    this._strategies = paramsArray.map(params => {
      const strategy = new UserStrategy(params);
      strategy.trader = this;
      return strategy;
    });
    this._opting = true;
  }

  /**
   * 
   * @param {[Tick]} ticks 
   */
  addData(ticks) {
    this._ticks = this._ticks.concat(
      ticks.slice().sort((a, b) => a.date.diff(b.date))
    );
  }

  run() {
    if (!this._opting) return this._run();
    this._strategies.forEach(strategy => {
      const saved = {
        cash: this.cash,
        strategy: this._strategy,
        orders: this._orders.slice(),
        hold: this._hold,
        current: this._current
      };

      this._strategy = strategy;
      this._run();

      this.cash = saved.cash;
      this._strategy = saved.strategy;
      this._orders = saved.orders.slice();
      this._hold = saved.hold;
      this._current = saved.current;
    });
  }

  _run() {
    // hide future data from strategy
    this._strategy.ticks.length = 0;
    this._strategy.ticks = [];
    this._strategy.indicators.forEach(ind => {
      ind.ticks = [];
    });
    this._ticks.forEach((tick, tickIdx) => {
      // run all data for indicators
      this._strategy.indicators.forEach(ind => {
        ind.ticks.push(tick);
        ind.current = tickIdx;
        tick.setIndicatorValue(ind.name, ind.next());
      });

      if (tickIdx < this._current) {
        // refetch old data
        this._strategy.ticks.push(tick);
      } else {
        // run resume
        // time begin
        this._strategy.ticks.push(tick);
        this._strategy.current = tickIdx;

        // process pre next
        this._processOrders(tick);
        // process next
        this._processNext(tick, tickIdx);

        // time passed
        this._current = tickIdx;
      }
    });

    this._strategy.onStop();
  }

  _processOrders(tick) {
    this._orders.forEach(
      /**
       * @param {Order} order
       */
      order => {
        // force forward
        if (order.type === ORDER_TYPE.BUY) {
          this._makeLongTrade(order, tick);
        }
        if (order.type === ORDER_TYPE.SELL) {
          this._makeShortTrade(order, tick);
        }
      }
    );
    this._orders = [];
  }

  /**
   * 
   * @param {Order} order 
   * @param {Tick} tick 
   */
  _makeLongTrade(order, tick) {
    const commission = this.commission;
    // buy at open
    const price = tick.open;
    let value = price.mul(order.size);
    let size = order.size;
    if (value.gt(this.cash)) {
      size = this.cash.div(price).floor().toNumber();
      value = price.mul(size);
    }
    if (size > 0) {
      this.cash = this.cash.sub(value.plus(commission));
      this._hold += size;
      // force forward
      order.status = ORDER_STATUS.COMPLETED;
      order.executed = {
        price,
        value,
        commission
      };
      this._strategy.onOrder(order);
    }
  }

  /**
   * 
   * @param {Order} order 
   * @param {Tick} tick 
   */
  _makeShortTrade(order, tick) {
    if (this._hold > 0) {
      const commission = this.commission;
      // sell at open
      const price = tick.open;
      let value = price.mul(order.size);
      let size = order.size;

      if (size > this._hold) {
        size = this._hold;
        value = price.mul(size);
      }

      this.cash = this.cash.plus(value.sub(commission));
      this._hold -= size;
      // force forward
      order.status = ORDER_STATUS.COMPLETED;
      order.executed = {
        price,
        value,
        commission
      };
      this._strategy.onOrder(order);
    }
  }

  _processNext(tick, tickIdx) {
    this._strategy.next();
  }

  buy({ size }) {
    const orderSize = size || this.fixSize || 1;
    return this._orders.push(
      new Order({ size: orderSize, type: ORDER_TYPE.BUY })
    );
  }

  sell({ size }) {
    const orderSize = size || this.fixSize || this._hold;
    return this._orders.push(
      new Order({ size: orderSize, type: ORDER_TYPE.SELL })
    );
  }

  getValue() {
    const plusHold =
      !this._hold || this._current < 0
        ? 0
        : this._ticks[this._current].close.mul(this._hold);
    return this.cash.plus(plusHold);
  }

  plot(path, opt = {}) {
    const { width = 1000, height = 800 } = opt;
    if (!path) throw new URIError('Path must be provided');
    return graph.plot(this._ticks, width, height, path);
  }
}

module.exports = Trader;
