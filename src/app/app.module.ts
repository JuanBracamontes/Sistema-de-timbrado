import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Componentes
import { AppComponent } from './app.component';
import {HeaderComponent} from './shared/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { ComponentesComponent } from './components/componentes.component';
import { TimbradogrupalComponent } from './components/timbradogrupal/timbradogrupal.component';
import { CancelarComponent } from './components/cancelar/cancelar.component';
import { CancelacionesEPComponent } from './components/cancelaciones-ep/cancelaciones-ep.component';

//Rutas
import {APP_ROUTES} from './app.routes';
import {ApiService} from './services/api.service';
import {GlobalService} from './services/globals.service';

//Adicionales
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AlertService} from './services/sweetalert';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {Broadcaster} from '../assets/js/broadcaster';
import {timbarPagosComponent} from './components/Pagos/timbrar-pagos';
import {BsDatepickerModule} from 'ngx-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SidebarComponent,
    LoginComponent,
    ComponentesComponent,
    timbarPagosComponent,
    CancelarComponent,
    TimbradogrupalComponent,
    CancelacionesEPComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PerfectScrollbarModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    AlertService,
    ApiService,
    GlobalService,
    Broadcaster,
    HomeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
