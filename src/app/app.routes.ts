import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {HomeComponent} from './components/home/home.component';
import {ComponentesComponent} from './components/componentes.component';
import { timbrarComponent} from './components/Timbrado/timbrar';
import {CancelarComponent} from './components/cancelar/cancelar.component';
import {TimbradogrupalComponent} from './components/timbradogrupal/timbradogrupal.component';
import {CancelacionesEPComponent} from './components/cancelaciones-ep/cancelaciones-ep.component';

const appRoutes: Routes = [
  {
    path: '',
    component:ComponentesComponent,
    children:[
      { path: 'home', component:HomeComponent },
      { path: 'timbrar/:sucursal', component:timbrarComponent },
      { path: 'TimbradoGrupal',component:TimbradogrupalComponent},
      { path: 'Cancelaciones', component:CancelarComponent },
      { path: 'CancelacionesEP', component:CancelacionesEPComponent },
      { path:'', redirectTo: '/home', pathMatch:'full' }
    ]
  },
  { path: 'login', component:LoginComponent  }

];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, {useHash:true});
