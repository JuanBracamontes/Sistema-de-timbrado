import {Component, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router';
import {GlobalService} from '../../services/globals.service';
import {Broadcaster} from '../../../assets/js/broadcaster';
import {Consulta} from '../../interfaces/consulta.interface';
import {HomeComponent} from '../../components/home/home.component';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent{
  query:string;
  datos:Consulta = {
    sociedad:'',
    consulta:''
  };
  name:any = sessionStorage.getItem('Nombre');
  Facturacion:number;
  Timbrado:number;
  Cancelacion:number;
  Hermosillo:number;
  Tijuana:number;
  LaPaz:number;
  Guadalajara:number;
  Monterrey:number;
  Noroeste:number;

  openOptions:boolean  = false;

  constructor(private router:Router,
              private _GS:GlobalService,
              private broadcaster:Broadcaster,
              private apiService:ApiService,
              private hc:HomeComponent) {

    this.obtenerPermisos();

  }

  cerrar_sesion(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  obtenerPermisos() {
    let consulta = this._GS.PermisosQuery(this.name);
    this.apiService.Consultas(consulta).then((response:any)=>{
      this.Facturacion = response[0].Facturacion;
      this.Cancelacion = response[0].Cancelaciones;
      this.Timbrado = response[0].Timbrado;
      this.Hermosillo = response[0].Hermosillo;
      this.Tijuana = response[0].Tijuana;
      this.LaPaz = response[0].LaPaz;
      this.Guadalajara = response[0].Guadalajara;
      this.Monterrey = response[0].Monterrey;
      this.Noroeste = response[0].Noroeste;
    }).catch((err:any)=>{
      console.warn(err);
    });
  }

  goToSelectFunctions(suc:string){
    this.hc.NavegarTimbrado(suc);
  }

  irCancelaciones(){
    this.hc.NavegarCancelaciones();
  }

  changeBoolean(){
    this.openOptions = !this.openOptions;
  }

}
