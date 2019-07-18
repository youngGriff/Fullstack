import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Order} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() orders: Order[];
  @ViewChild('modal') modalRef;
  modalInstance: MaterialInstance;
  selectedOrder: Order;

  constructor() {
  }

  ngOnInit() {
  }

  computePrice(order: Order) {
    return order.list.reduce((total, current) => {
      return total + (current.cost * current.quantity)
    }, 0);
  }

  ngAfterViewInit(): void {
    this.modalInstance = MaterialService.initModal(this.modalRef.nativeElement);
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
    this.modalInstance.open();
  }

  ngOnDestroy(): void {
    this.modalInstance.destroy();
  }

  close() {
    this.modalInstance.close();
  }
}
