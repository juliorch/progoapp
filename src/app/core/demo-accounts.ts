import { User } from './models';
export const DEMO_ACCOUNTS: (User & {password:string})[] = [
 {id:'cliente-01',email:'cliente@progo.pe',password:'Cliente123!',name:'Andres Martinez',company:'Supermercados TOTTOS',address:'Av. La Marina 420, San Miguel, Lima',role:'cliente'},
 {id:'cliente-02',email:'cliente2@progo.pe',password:'Cliente123!',name:'Ana Torres',company:'Minimarket San Juan',address:'Jr. Huallaga 238, Cercado',role:'cliente'},
 {id:'admin-01',email:'admin@progo.pe',password:'Admin123!',name:'Julio Rojas',company:'PROVIALIM S.A.C.',address:'',role:'administrador'}
];
export const STOCK_RULES = { lowBelow:70 }; // 0: agotado; 1..69: bajo; >=70: disponible.
export function publicUser(id:string):User|null {
 const account=DEMO_ACCOUNTS.find(a=>a.id===id);if(!account)return null;
 const {password,...user}=account;return user;
}