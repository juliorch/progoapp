import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Store } from '../core/store';
import { Icon } from '../shared/icon';


@Component({selector:'app-login',standalone:true,imports:[FormsModule,RouterLink,Icon],templateUrl:'./login.html'})
export class Login { store=inject(Store);router=inject(Router);email='';password='';submitted=false;error='';logoMissing=false;
 enter(valid:boolean|null){this.submitted=true;this.error='';if(!valid)return;if(this.store.login(this.email,this.password)){this.password='';this.router.navigateByUrl('/inicio');}else{this.error='Correo o contraseña incorrectos.';}}
}
