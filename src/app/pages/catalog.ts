import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Store } from '../core/store';
import { Icon } from '../shared/icon';

import { ProductImage } from '../shared/product-image';
import { StockBadge } from '../shared/stock-badge';
@Component({selector:'app-catalog',standalone:true,imports:[FormsModule,RouterLink,CurrencyPipe,Icon,ProductImage,StockBadge],templateUrl:'./catalog.html'})
export class Catalog {store=inject(Store);query=signal('');category=signal('Todos');categories=['Todos','Aceites','Granos','Lácteos','Bebidas'];items=computed(()=>this.store.products.filter(p=>(this.category()==='Todos'||p.cat===this.category())&&(p.name+' '+p.sku).toLocaleLowerCase().includes(this.query().trim().toLocaleLowerCase())));add(id:number){if(this.store.add(id))this.store.notify('Producto añadido al carrito.');}}
