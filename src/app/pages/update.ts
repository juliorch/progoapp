import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Store } from '../core/store';

import { StatusBadge } from '../shared/status-badge';

@Component({selector:'app-update',standalone:true,imports:[FormsModule,RouterLink,StatusBadge],templateUrl:'./update.html'})
export class Update {store=inject(Store);route=inject(ActivatedRoute);router=inject(Router);id=this.route.snapshot.paramMap.get('id');order=computed(()=>this.store.orders().find(o=>o.id===this.id));notes=this.order()?.notes??'';confirmed=false;save(){if(this.id&&this.confirmed&&this.store.update(this.id,'Entregado',undefined,this.notes))this.router.navigate(this.store.orderLink(this.id));}}
