import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Store } from '../core/store';
import { Icon } from '../shared/icon';

import { ProductImage } from '../shared/product-image';
import { StockBadge } from '../shared/stock-badge';
@Component({selector:'app-product',standalone:true,imports:[FormsModule,RouterLink,CurrencyPipe,Icon,ProductImage,StockBadge],templateUrl:'./product.html'})
export class Product {store=inject(Store);route=inject(ActivatedRoute);product=this.store.products.find(p=>p.id===Number(this.route.snapshot.paramMap.get('id')));qty=1;add(){if(this.product&&this.store.add(this.product.id,Number(this.qty))){this.store.notify('Producto añadido al carrito.');this.qty=1;}}}
