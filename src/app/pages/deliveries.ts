import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Store } from '../core/store';
import { Icon } from '../shared/icon';
import { StatusBadge } from '../shared/status-badge';

@Component({selector:'app-deliveries',standalone:true,imports:[FormsModule,RouterLink,StatusBadge,Icon],templateUrl:'./deliveries.html'})
export class Deliveries {store=inject(Store);filter=signal('Todos');items=computed(()=>this.store.orders().filter(o=>['En camino','Entregado'].includes(o.status)&&(this.filter()==='Todos'||o.status===this.filter())));}
