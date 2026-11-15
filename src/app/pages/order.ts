import { Component, inject, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { DatePipe, CurrencyPipe } from '@angular/common';
import { Store } from '../core/store';
import { Icon } from '../shared/icon';
import { StatusBadge } from '../shared/status-badge';

@Component({selector:'app-order',standalone:true,imports:[RouterLink,DatePipe,CurrencyPipe,StatusBadge,Icon],templateUrl:'./order.html'})
export class OrderPage {store=inject(Store);route=inject(ActivatedRoute);id=this.route.snapshot.paramMap.get('id');order=computed(()=>this.store.orders().find(o=>o.id===this.id));steps=['Recibido','En almacén','En camino','Entregado'];index(){return this.steps.indexOf(this.order()?.status??'');}date(status:string){return this.order()?.history.find(h=>h.status===status)?.date;}}
