const STATUS = require('./Constants').ORDER_STATUS;
const moment = require('moment'); // eslint-disable-line

class Order {
  /**
   * 
   * @param {{size: number, type: ORDER_TYPE, price: Decimal, date:moment()}} param0 
   */
  constructor({ size = 1, type, price, date }) {
    this._size = size;
    this._price = price;
    this._date = date;
    this.status = STATUS.WAITING;
    this._type = type;
    this._executed = null;
  }

  get type() {
    return this._type;
  }

  get size() {
    return this._size;
  }

  get date() {
    return this._date;
  }

  get price() {
    return this._price;
  }

  set executed(executed) {
    this._executed = executed;
  }

  /**
   * @return {{price:Decimal,value:Decimal,commission:number,size:number,date:moment}}
   */
  get executed() {
    return this._executed;
  }
}

module.exports = Order;
