import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Order, OrderStatus, User } from './models';
import { PRODUCTS } from './products';
import { DEMO_ACCOUNTS, STOCK_RULES, publicUser } from './demo-accounts';
const round = (n:number) => Math.round((n + Number.EPSILON)*100)/100;
function read<T>(key:string, fallback:T):T { try { const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
function seed(): Order[] {
  return [
    ['ORD-2026-091','Supermercado Central','Av. La Marina 420, San Miguel','Jorge Huanca','En camino',1,14],
    ['ORD-2026-021','Minimarket San Juan','Jr. Huallaga 238, Cercado','Luis Quispe','En almacén',2,22],
    ['ORD-2026-051','Bodega El Progreso','Calle Los Pinos 112, Surco','Pedro Vargas','Entregado',4,9],
    ['ORD-2026-092','Bodega Santa Rosa','Av. Universitaria 920, San Miguel','Jorge Huanca','Recibido',3,12],
  ].map((v,i) => {
    const p=PRODUCTS.find(p=>p.id===v[5])!; const qty=Number(v[6]); const subtotal=round(p.price*qty); const date=new Date(2026,10,14,8+i).toISOString();
    const status=v[4] as OrderStatus; const steps:OrderStatus[]=['Recibido','En almacén','En camino','Entregado'];
    return {id:String(v[0]),customerId:i===0||i===2?'cliente-01':'cliente-02',client:String(v[1]),address:String(v[2]),driver:String(v[3]),created:date,status,lines:[{productId:p.id,name:p.name,price:p.price,qty}],subtotal,tax:round(subtotal*.18),total:round(subtotal+round(subtotal*.18)),priority:i%2?'Media':'Alta',notes:'',history:steps.slice(0,steps.indexOf(status)+1).map(status=>({status,date}))} as Order;
  });
}
function loadOrders():Order[] {
 const current=read<Order[]|null>('progo.orders.v2',null);
 if(Array.isArray(current))return current;
 const legacy=read<Order[]|null>('progo.orders.v1',null);
 
 return Array.isArray(legacy)?legacy.map(o=>({...o,customerId:o.customerId||'legacy-unassigned'})):seed();
}
function restoreUser():User|null {
 try { const id=sessionStorage.getItem('progo.session.v2');return id?publicUser(id):null; } catch { return null; }
}
@Injectable({providedIn:'root'})
export class Store {
 readonly products=PRODUCTS;
 private readonly currentUser=signal<User|null>(restoreUser());
 readonly user=this.currentUser.asReadonly();
 readonly session=computed(()=>this.user()!==null);
 readonly isClient=computed(()=>this.user()?.role==='cliente');
 readonly isAdmin=computed(()=>this.user()?.role==='administrador');
 readonly roleLabel=computed(()=>this.isAdmin()?'Jefe de almacén':'Cliente');
 readonly initials=computed(()=>this.user()?.name.split(' ').slice(0,2).map(n=>n[0]).join('')??'');
 private readonly allOrders=signal<Order[]>(loadOrders());
 readonly orders=computed(()=>this.isAdmin()?this.allOrders():this.isClient()?this.allOrders().filter(o=>o.customerId===this.user()!.id):[]);
 private readonly carts=signal<Record<string,CartItem[]>>(read('progo.carts.v2',{}));
 readonly cart=computed(()=>this.isClient()?(this.carts()[this.user()!.id]??[]):[]);
 private readonly sold=signal<Record<number,number>>(read('progo.sold.v1',{}));
 readonly message=signal('');
 private timer?:ReturnType<typeof setTimeout>;
 readonly count=computed(()=>this.cart().reduce((sum,c)=>sum+c.qty,0));
 readonly cartLines=computed(()=>this.cart().map(c=>({...c,product:this.products.find(p=>p.id===c.id)!})).filter(c=>c.product));
 readonly subtotal=computed(()=>round(this.cartLines().reduce((sum,c)=>sum+c.qty*c.product.price,0)));
 readonly tax=computed(()=>round(this.subtotal()*.18));
 readonly total=computed(()=>round(this.subtotal()+this.tax()));
 constructor(){this.save();}
 available(id:number) {return Math.max(0,(this.products.find(p=>p.id===id)?.avail??0)-(this.sold()[id]??0));}
 remaining(id:number) {return Math.max(0,this.available(id)-(this.cart().find(c=>c.id===id)?.qty??0));}
 stockState(id:number):'green'|'yellow'|'red' {const n=this.available(id);return n===0?'red':n<STOCK_RULES.lowBelow?'yellow':'green';}
 stockLabel(id:number) {return {green:'Disponible',yellow:'Stock bajo',red:'Agotado'}[this.stockState(id)];}
 orderLink(id:string) {return this.isAdmin()?['/operacion/pedidos',id]:['/pedidos',id];}
 notify(text:string) {this.message.set(text);clearTimeout(this.timer);this.timer=setTimeout(()=>this.message.set(''),4500);}
 private save() {
  try {localStorage.setItem('progo.carts.v2',JSON.stringify(this.carts()));localStorage.setItem('progo.orders.v2',JSON.stringify(this.allOrders()));localStorage.setItem('progo.sold.v1',JSON.stringify(this.sold()));}
  catch {this.notify('No se pudo guardar en este navegador. Los cambios se conservarán solo durante esta sesión.');}
 }
 login(email:string,password:string):boolean {
  const account=DEMO_ACCOUNTS.find(a=>a.email===email.trim().toLowerCase()&&a.password===password);
  if(!account)return false;
  this.currentUser.set(publicUser(account.id));
  try {sessionStorage.setItem('progo.session.v2',account.id);sessionStorage.removeItem('progo.session');}catch {this.notify('La sesión no se conservará al recargar.');}
  return true;
 }
 logout() {
  this.currentUser.set(null);clearTimeout(this.timer);this.message.set('');
  try {sessionStorage.removeItem('progo.session.v2');sessionStorage.removeItem('progo.session');}catch {}
 }
 private requireClient():boolean {if(this.isClient())return true;this.notify('Solo los clientes pueden realizar compras.');return false;}
 private writeCart(items:CartItem[]) {const id=this.user()!.id;this.carts.update(c=>({...c,[id]:items}));}
 add(id:number,qty=1):boolean {
  if(!this.requireClient())return false;
  if(!this.products.some(p=>p.id===id)||!Number.isInteger(qty)||qty<1||qty>this.remaining(id)){this.notify('No se puede añadir esa cantidad. Revisa la disponibilidad del producto.');return false;}
  const exists=this.cart().some(c=>c.id===id);
  this.writeCart(exists?this.cart().map(c=>c.id===id?{...c,qty:c.qty+qty}:c):[...this.cart(),{id,qty}]);
  this.save();return true;
 }
 change(id:number,delta:number) {
  if(!this.requireClient()||!Number.isInteger(delta))return;
  if(delta>0){this.add(id,delta);return;}
  this.writeCart(this.cart().map(c=>c.id===id?{...c,qty:c.qty+delta}:c).filter(c=>c.qty>0));this.save();
 }
 remove(id:number){if(!this.requireClient())return;this.writeCart(this.cart().filter(c=>c.id!==id));this.save();}
 checkout(client:string,address:string):Order|null {
  if(!this.requireClient())return null;
  if(!client.trim()||!address.trim()||!this.cartLines().length)return null;
  if(this.cartLines().some(c=>c.qty>this.available(c.id))){this.notify('No hay disponibilidad para completar el pedido. Revisa las cantidades solicitadas.');return null;}
  const now=new Date().toISOString();
  const order:Order={id:'ORD-'+new Date().getFullYear()+'-'+crypto.randomUUID().slice(0,8).toUpperCase(),customerId:this.user()!.id,client:client.trim(),address:address.trim(),driver:'Por asignar',created:now,status:'Recibido',lines:this.cartLines().map(c=>({productId:c.id,name:c.product.name,price:c.product.price,qty:c.qty})),subtotal:this.subtotal(),tax:this.tax(),total:this.total(),priority:'Media',notes:'',history:[{status:'Recibido',date:now}]};
  this.sold.update(s=>{const next={...s};for(const c of this.cart())next[c.id]=(next[c.id]??0)+c.qty;return next;});
  this.allOrders.update(list=>[order,...list]);this.writeCart([]);this.save();this.notify('Pedido registrado correctamente.');return order;
 }
 update(id:string,status:OrderStatus,driver?:string,notes?:string):boolean {
  if(!this.isAdmin()){this.notify('Solo el jefe de almacén puede actualizar pedidos.');return false;}
  const current=this.allOrders().find(o=>o.id===id);if(!current)return false;
  const next:Record<OrderStatus,OrderStatus|null>={'Recibido':'En almacén','En almacén':'En camino','En camino':'Entregado','Entregado':null};
  if(next[current.status]!==status){this.notify('Ese cambio de estado no está permitido.');return false;}
  const assigned=driver?.trim()||current.driver;
  if(status==='En camino'&&(!assigned||assigned==='Por asignar')){this.notify('Asigna un conductor antes de despachar.');return false;}
  this.allOrders.update(list=>list.map(o=>o.id===id?{...o,status,driver:assigned,notes:notes===undefined?o.notes:notes.trim(),history:[...o.history,{status,date:new Date().toISOString()}]}:o));
  this.save();this.notify('Estado actualizado a '+status+'.');return true;
 }
}
