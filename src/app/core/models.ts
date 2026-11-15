export interface Product { id:number; name:string; sku:string; cat:string; price:number; stock:string; unit:string; avail:number; img:string; imgDetail:string; desc:string; }
export type OrderStatus = 'Recibido' | 'En almacén' | 'En camino' | 'Entregado';
export interface CartItem { id:number; qty:number; }
export interface OrderLine { productId:number; name:string; price:number; qty:number; }
export interface Order { id:string; customerId:string; client:string; address:string; driver:string; created:string; status:OrderStatus; lines:OrderLine[]; subtotal:number; tax:number; total:number; priority:'Alta'|'Media'; notes:string; history:{status:OrderStatus; date:string}[]; }

export type UserRole = 'cliente' | 'administrador';
export interface User { id:string; email:string; name:string; company:string; address:string; role:UserRole; }
