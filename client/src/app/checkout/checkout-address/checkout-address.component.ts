import { ToastrService } from 'ngx-toastr';
import { IAddress } from './../../shared/models/address';
import { AccountService } from './../../account/account.service';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { IDeliveryMethod } from 'src/app/shared/models/deliveryMethod';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {

  @Input() checkoutForm: FormGroup;

  constructor(private accountService: AccountService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  saveUserAddress() {
    return this.accountService.updateUserAddress(this.checkoutForm.get('addressForm').value)
    .subscribe( () => { 
      this.toastr.success('Address saved');
     }, error => { 
       this.toastr.error(error.message);
       console.log(error)}
    );
  }

 
}
