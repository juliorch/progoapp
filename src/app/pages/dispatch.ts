import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Store } from '../core/store';
import { Icon } from '../shared/icon';
import { StatusBadge } from '../shared/status-badge';

@Component({selector:'app-dispatch',standalone:true,imports:[FormsModule,RouterLink,StatusBadge,Icon],templateUrl:'./dispatch.html'})
export class Dispatch {store=inject(Store);filter=signal('Todos');drivers:Record<string,string>={};items=computed(()=>this.store.orders().filter(o=>['Recibido','En almacén'].includes(o.status)&&(this.filter()==='Todos'||o.status===this.filter())));dispatch(id:string){this.store.update(id,'En camino',this.drivers[id]);}}
