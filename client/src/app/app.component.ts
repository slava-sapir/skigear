import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';
import { IPagination } from './shared/models/pagination';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from './shared/models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SkiGear';

  constructor(private basketService: BasketService,
              private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadBasket();
   }

   loadCurrentUser() {

    const token = localStorage.getItem('token');
    
    this.accountService.loadCurrentUser(token).subscribe( (user) => {
      if(user === null) { console.log('No curent user loaded')}
          else  console.log('Current user loaded');
    }, error => {
      console.log(error);
    });

   }

   loadBasket() {
    const basketId = localStorage.getItem('basket_Id');
    if (basketId) {
      this.basketService.getBasket(basketId).subscribe( () => {
        console.log('initialize basket');
      }, error => {
        console.log(error);
      });
    }
   }


  }
