import {Injectable} from '@angular/core';
import {OrderPosition, Position} from "../shared/interfaces";

@Injectable()
export class OrderService {
  public list: OrderPosition[] = [];

  public price = 0;

  constructor() {
  }

  add(position: Position) {
    const orderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    });
    const candidate = this.list.find(p => p._id === orderPosition._id);
    if (!candidate) {
      this.list.push(orderPosition);
    } else {
      candidate.quantity += position.quantity
    }
    this.computedPrice();
  }

  remove(orderPosition: OrderPosition) {
    const findIndex = this.list
      .findIndex(p => p._id === orderPosition._id);
    if (findIndex !== -1) {
      this.list.splice(findIndex, 1);
    }
    this.computedPrice();
  }

  clear() {
    this.list = [];
    this.computedPrice();

  }

  private computedPrice() {
    this.price = this.list.reduce((total, item) => {
      return total + (item.quantity * item.cost)
    }, 0);
  }
}
