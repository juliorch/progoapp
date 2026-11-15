import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Store } from './core/store';
import { Icon } from './shared/icon';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,Icon],templateUrl:'./app.html'})
export class App {
 store=inject(Store); router=inject(Router); menu=signal(false);
 url=toSignal(this.router.events.pipe(filter(e=>e instanceof NavigationEnd),map(e=>(e as NavigationEnd).urlAfterRedirects)),{initialValue:this.router.url});
 private allLinks=[{path:'/inicio',label:'Inicio',icon:'home'},{path:'/catalogo',label:'Catálogo',icon:'box'},{path:'/carrito',label:'Carrito',icon:'cart'},{path:'/pedidos',label:'Mis pedidos',icon:'list'},{path:'/despachos',label:'Despachos',icon:'box'},{path:'/entregas',label:'Entregas',icon:'truck'}];
 readonly links=computed(()=>this.allLinks.filter(link=>this.store.isClient()? !['/despachos','/entregas'].includes(link.path):!['/carrito','/pedidos'].includes(link.path)));
 logout(){this.menu.set(false);this.store.logout();this.router.navigateByUrl('/login');}
}
