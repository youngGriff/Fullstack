import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {filter, takeUntil} from "rxjs/operators";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderService} from "./order.service";
import {Category, Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../shared/services/categories.service";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  isRoot: boolean = true;
  destroy$ = new Subject<boolean>();
  oSub?: Subscription;
  model: MaterialInstance;

  @ViewChild('modal') modalRef: ElementRef;

  loading = false;
  category: Category;

  constructor(private router: Router,
              private ordersService: OrdersService,
              private categoriesService: CategoriesService,
              public orderService: OrderService) {

  }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events
      .pipe(takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        this.isRoot = this.router.url === '/order';
      })
  }


  ngAfterViewInit(): void {
    this.model = MaterialService.initModal(this.modalRef.nativeElement);
  }

  openModal() {
    this.model.open();
  }

  cancelModal() {
    this.model.close();
  }

  submit() {
    const order: Order = {
      list: this.orderService.list.map(item => {
        delete item._id;
        return item;
      }),
    };
    this.loading = true;
    this.oSub = this.ordersService.create(order)
      .subscribe(newOrder => {
          MaterialService.toast(`Заказ №${newOrder.order} был добавлен.`);
          this.orderService.clear();
        }, error => MaterialService.toast(error.error.message),
        () => {
          this.model.close();
          this.loading = false;

        });
    this.model.close();
  }

  removePosition(item: OrderPosition) {
    this.orderService.remove(item);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    this.model.destroy();

  }




}
