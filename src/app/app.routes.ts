import { inject } from '@angular/core';
import { Routes, Router, CanActivateFn } from '@angular/router';
import { Store } from './core/store';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { Catalog } from './pages/catalog';
import { Product } from './pages/product';
import { Cart } from './pages/cart';
import { Orders } from './pages/orders';
import { OrderPage } from './pages/order';
import { Dispatch } from './pages/dispatch';
import { Deliveries } from './pages/deliveries';
import { Update } from './pages/update';

const sessionGuard:CanActivateFn=()=>inject(Store).session()||inject(Router).createUrlTree(['/login']);
const clientGuard:CanActivateFn=()=>inject(Store).isClient()||inject(Router).createUrlTree(['/inicio']);
const adminGuard:CanActivateFn=()=>inject(Store).isAdmin()||inject(Router).createUrlTree(['/inicio']);
const ownerGuard:CanActivateFn=(route)=>{
 const store=inject(Store);const router=inject(Router);
 return (store.isClient()&&store.orders().some(o=>o.id===route.paramMap.get('id'))) || router.createUrlTree([store.isClient()?'/pedidos':'/inicio']);
};
export const routes:Routes=[
 {path:'login',component:Login},
 {path:'',canActivateChild:[sessionGuard],children:[
  {path:'inicio',component:Dashboard},{path:'catalogo',component:Catalog},
  {path:'catalogo/:id',component:Product},
  {path:'carrito',component:Cart,canActivate:[clientGuard]},
  {path:'pedidos',component:Orders,canActivate:[clientGuard]},
  {path:'pedidos/:id',component:OrderPage,canActivate:[ownerGuard]},
  {path:'operacion/pedidos/:id',component:OrderPage,canActivate:[adminGuard]},
  {path:'despachos',component:Dispatch,canActivate:[adminGuard]},
  {path:'entregas',component:Deliveries,canActivate:[adminGuard]},
  {path:'entregas/:id/actualizar',component:Update,canActivate:[adminGuard]},
  {path:'',pathMatch:'full',redirectTo:'inicio'}
 ]},{path:'**',redirectTo:'inicio'}
];
