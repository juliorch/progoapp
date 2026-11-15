import { Component, inject, input } from '@angular/core';
import { Store } from '../core/store';
@Component({selector:'app-stock',standalone:true,template:`<span class="stock-indicator" [class.stock-green]="store.stockState(id())==='green'" [class.stock-yellow]="store.stockState(id())==='yellow'" [class.stock-red]="store.stockState(id())==='red'"><span class="stock-dot" aria-hidden="true"></span>{{store.stockLabel(id())}}</span>@if(store.isAdmin()){<small class="stock-quantity">{{store.available(id())}} unidades</small>}`})
export class StockBadge {store=inject(Store);id=input.required<number>();}
