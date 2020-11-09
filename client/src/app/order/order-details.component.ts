import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from '../basket/basket.service';
import { IOrder } from '../shared/models/order';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  order: IOrder;
  constructor(private orderService: OrderService,
              private activatedRouter: ActivatedRoute,
              private bcService: BreadcrumbService) {
              this.bcService.set('@orderDetails', '');
     }

     ngOnInit(): void {
      this.loadOrder();
    }
  
    loadOrder() {
      this.orderService.getOrder(+this.activatedRouter.snapshot.paramMap.get('id'))
      .subscribe( order => {
        this.order = order;
        this.bcService.set('@orderDetails', `Order#${order.id}-${order.status}`);
      }, error => {
        console.log(error);
      });
    }

}
