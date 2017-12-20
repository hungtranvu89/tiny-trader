const STATUS = require('./Constants').ORDER_STATUS;

class Order {
  constructor({ size = 1, type }) {
    this.size = size;
    this.status = STATUS.WAITING;
    this.type = type;
    this._executed = {};
  }

  set executed(executed) {
    this._executed = executed;
  }

  /**
   * @return {{price:Decimal,value:Decimal,commission:number}}
   */
  get executed() {
    return this._executed;
  }
}

module.exports = Order;
