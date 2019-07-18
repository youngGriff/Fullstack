import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PositionsService} from "../../shared/services/positions.service";
import {Observable} from "rxjs";
import {Position} from "../../shared/interfaces";
import {map, switchMap} from "rxjs/operators";
import {OrderService} from "../order.service";
import {MaterialService} from "../../shared/classes/material.service";


@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {
  positions$: Observable<Position[]>;

  constructor(private route: ActivatedRoute,
              private orderService: OrderService,
              private positionService: PositionsService) {
  }

  ngOnInit() {
    /*const id = this.route.snapshot.params['id'];
    console.log(id);
    this.positions$ = this.positionService.fetch(id);*/
    this.positions$ = this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.positionService.fetch(params['id'])
        }),
        map((positions: Position[]) => {
          return positions.map(pos => {
            pos.quantity = 1;
            return pos
          })
        })
      )
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Добавлено x${position.quantity}` )
    this.orderService.add(position)
  }
}
