import { AccountService } from './../../account/account.service';
import { IBasket } from './../../shared/models/basket';
import { Observable } from 'rxjs';
import { BasketService } from './../../basket/basket.service';
import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/shared/models/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  
  currentUser$: Observable<IUser>;
  basket$: Observable<IBasket>;

  constructor(private basketService: BasketService,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.currentUser$ = this.accountService.currentUserSource$;
  }

  logout() {
    this.accountService.logout();
  }

}
