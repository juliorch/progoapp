import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Store } from '../core/store';
import { Icon } from '../shared/icon';

import { ProductImage } from '../shared/product-image';
@Component({selector:'app-cart',standalone:true,imports:[FormsModule,RouterLink,CurrencyPipe,Icon,ProductImage],templateUrl:'./cart.html'})
export class Cart {store=inject(Store);router=inject(Router);client=this.store.user()?.company??'';address=this.store.user()?.address??'';confirm(valid:boolean|null){if(!valid)return;const order=this.store.checkout(this.client,this.address);if(order)this.router.navigate(['/pedidos',order.id]);}}
