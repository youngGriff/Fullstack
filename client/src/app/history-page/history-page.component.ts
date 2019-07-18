import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Filter, Order} from "../shared/interfaces";
import {Subscription} from "rxjs";

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {

  isFilterVisible = false;
  @ViewChild('tooltip') tooltipRef: ElementRef;
  oSub: Subscription;
  tooltipInstance: MaterialInstance;
  private offset: number = 0;
  private limit: number = STEP;
  private orders: Order[] = [];

  private filter: Filter = {};
  loading = true;
  noMoreOrders = false;

  constructor(private ordersService: OrdersService) {
  }

  ngOnInit() {
    this.fetch();
  }

  ngAfterViewInit(): void {
    this.tooltipInstance = MaterialService.initTooltip(this.tooltipRef);
  }

  private fetch() {
    const params = {
      offset: this.offset,
      limit: this.limit,
      ...this.filter
    };
    this.oSub = this.ordersService.fetch(params)
      .subscribe((orders: Order[]) => {
        this.noMoreOrders = orders.length < STEP;
        this.orders = this.orders.concat(orders);
      }, () => {
      }, () => {
        this.loading = false;
      })
  }

  ngOnDestroy(): void {
    this.tooltipInstance.destroy();
    this.oSub.unsubscribe();
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }

  applyFilter($event: Filter) {
    console.log($event);
    this.offset = 0;
    this.orders = [];
    this.filter = $event;
    this.loading = true;
    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length > 0;
  }
}
