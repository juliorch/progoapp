import { Component, input } from '@angular/core';
@Component({selector:'app-status',standalone:true,template:`<span class="status-pill" [class.status-green]="value()==='Entregado'" [class.status-blue]="value()==='En camino'" [class.status-amber]="value()==='En almacén'">{{value()}}</span>`})
export class StatusBadge {value=input('Recibido');}
