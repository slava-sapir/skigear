import { IDeliveryMethod } from './../shared/models/deliveryMethod';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;

  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();

  private basketTotal = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotal.asObservable();
  shipping = 0;

  constructor(private http: HttpClient) { }

  createPaymentIntent() {
    return this.http.post(this.baseUrl + 'payment/' + this.getCurrentBasketValue().id, {})
    .pipe(
      map(
        (basket: IBasket) => {
           this.basketSource.next(basket);
           console.log(this.getCurrentBasketValue());
        }
      )
    );
  }

  deleteLocalBasket(id: string) {
    this.basketSource.next(null);
    this.basketTotal.next(null);
    localStorage.removeItem('basket_Id');
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;
    this.calculateBasketTotal();
    this.setBasket(basket);
  }

  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id)
    .pipe(
      map( (basket: IBasket) => {
           this.basketSource.next(basket);
           this.shipping = basket.shippingPrice;
           this.calculateBasketTotal();
      })
    );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
        this.basketSource.next(response);
        this.calculateBasketTotal();
    }, error => {
       console.log(error);
    });
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex( x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex( x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
    basket.items[foundItemIndex].quantity--;
    this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
   const basket = this.getCurrentBasketValue();
   if (basket.items.some(i => i.id === item.id)) {
     basket.items = basket.items.filter(x => x.id !== item.id);
     if (basket.items.length > 0) {
     this.setBasket(basket);
     } else {
      this.deleteBasket(basket);
     }
   }
  }

  deleteBasket(basket: IBasket) {
   return  this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe( () => {
     this.basketSource.next(null);
     this.basketTotal.next(null);
     localStorage.removeItem('basket_Id');
   }, error => {
      console.log(error);
   });
  }

  calculateBasketTotal() {
    const basket = this.getCurrentBasketValue();
    const shipping = basket.shippingPrice;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotal.next({shipping, total, subtotal});
  }

  addItemToBasket(item: IProduct, quantity = 1) {
      const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
      const basket = this.getCurrentBasketValue() ?? this.createBasket();
      basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
      this.setBasket(basket);
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[]
   {
    const index = items.findIndex( i =>  i.id === itemToAdd.id );
    if ( index === -1) {
            itemToAdd.quantity = quantity;
            items.push(itemToAdd);
          } else {
            items[index].quantity += quantity;
          }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_Id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {

    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType,
      quantity
    };
  }
}
