import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DatePipe, CurrencyPipe } from '@angular/common';
import { Store } from '../core/store';
import { Icon } from '../shared/icon';
import { StatusBadge } from '../shared/status-badge';

@Component({selector:'app-dashboard',standalone:true,imports:[RouterLink,DatePipe,CurrencyPipe,Icon,StatusBadge],templateUrl:'./dashboard.html'})
export class Dashboard { store=inject(Store);
 quickLinks=computed(()=>this.store.isClient() ? [
 {path:'/catalogo',icon:'box',title:'Catálogo de productos',sub:'Consulta disponibilidad y compra'},
 {path:'/carrito',icon:'cart',title:'Mi carrito',sub:'Revisa y confirma tu orden'},
 {path:'/pedidos',icon:'list',title:'Mis pedidos e historial',sub:'Consulta el estado de tus compras'}] : [
 {path:'/catalogo',icon:'box',title:'Consultar inventario',sub:'Disponibilidad y cantidades'},
 {path:'/despachos',icon:'list',title:'Preparar despachos',sub:'Organiza los pedidos pendientes'},
 {path:'/entregas',icon:'truck',title:'Gestionar entregas',sub:'Actualiza cada recorrido'}]);
recent=computed(()=>this.store.orders().slice(0,4));active=computed(()=>this.store.orders().filter(o=>o.status!=='Entregado').length);moving=computed(()=>this.store.orders().filter(o=>o.status==='En camino').length);done=computed(()=>this.store.orders().filter(o=>o.status==='Entregado').length); }
