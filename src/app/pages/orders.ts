import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Store } from '../core/store';
import { Icon } from '../shared/icon';
import { StatusBadge } from '../shared/status-badge';

@Component({selector:'app-orders',standalone:true,imports:[FormsModule,RouterLink,DatePipe,CurrencyPipe,StatusBadge,Icon],templateUrl:'./orders.html'})
export class Orders {store=inject(Store);query=signal('');view=signal('Todos');filter=signal('Todos');states=['Todos','Recibido','En almacén','En camino','Entregado'];items=computed(()=>this.store.orders().filter(o=>(this.view()==='Todos'||(this.view()==='Historial'?o.status==='Entregado':o.status!=='Entregado'))&&(this.filter()==='Todos'||o.status===this.filter())&&(o.id+' '+o.client).toLowerCase().includes(this.query().trim().toLowerCase())));}
