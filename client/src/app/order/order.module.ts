import { OrderRoutingModule } from './order-routing.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderDetailsComponent } from './order-details.component';


@NgModule({
  declarations: [OrderComponent, OrderDetailsComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule
  ]
})
export class OrderModule { }
