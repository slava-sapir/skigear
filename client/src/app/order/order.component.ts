import { OrderService } from './order.service';
import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  orders: IOrder[];
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe( (orders: IOrder[]) => {
      this.orders = orders;
      console.log(orders);
    }, error => {
      console.log(error);
    });
  }

}
