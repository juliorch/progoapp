import { Component, input, signal } from '@angular/core';
@Component({selector:'app-product-image',standalone:true,template:`<img [src]="failed() ? 'img/producto-placeholder.svg' : src()" [alt]="alt()" (error)="failed.set(true)" loading="lazy">`,styles:[`:host{display:block;width:100%;height:100%}img{width:100%;height:100%;object-fit:contain}`]})
export class ProductImage { src=input('');alt=input('Producto');failed=signal(false); }
