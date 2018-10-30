import { Component, OnInit, Input } from '@angular/core';
import {GlobalService} from '../../services/globals.service';
import {Router} from '@angular/router';
import {Broadcaster} from '../../../assets/js/broadcaster';
import {ApiService} from '../../services/api.service';
import {reject} from 'q';
import {Consulta} from '../../interfaces/consulta.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sucursal_seleccionada:boolean=false;
  nombre = sessionStorage.getItem('Nombre');
  query:string;
  datos:any[]=[];
  sociedad:string;
  folios:any[]=[];
  borrados:any [] = [];
  constructor( private router: Router,
               private _GS:GlobalService,
               private broadcaster:Broadcaster,
               private apiService:ApiService) {

    if(this._GS.validar_campos(this.nombre)){
      this.router.navigate(['login']);
    }else {
        console.clear();
    }

  }

  ngOnInit() {

    //broadcaster listening for query
      this.broadcaster.on<string>('Consulta').subscribe((info:Consulta)=>{
            // Validando si los arreglos contienen algun valor hay que limpiarlos
            if(this._GS.validarArreglo(this.datos)){
              this.datos = [];
            }

            if(this._GS.validarArreglo(this.folios)){
              this.folios = [];
            }

            this.query = info['data'].consulta;
            this.sociedad = info['data'].sociedad;
            this.sucursal_seleccionada = true;
            this.obtenerDatos();

      });

  }

  addPago(folio:number,uuid:string, index:number,nombre:string){
    let pago = {
      folio:folio,
      uuid:uuid,
      posicion:index,
      nombre:nombre
    };

    if(this.folios.length == 0){
      this.folios.push(pago);
    }else{
      for(let i=0; i<this.folios.length;i++){
          if(this.folios[i].folio == folio){
            if(this.folios[i].uuid == uuid){
              this.folios.splice(i,1);
              return;
            }
          }
      }
      this.folios.push(pago);
    }
  }



 /* timbrarPagos(){
    debugger;
        let cont = 0;
        this.apiService.timbrarAstral10(this.folios).then((resolve:any)=>{
          debugger;
          this.obtenerDatos();
          this.folios = [];


        }).catch((error:any)=>{
          console.log("Timbrado Fallido");
        })

  }*/

  obtenerDatos(){
    this.apiService.consultaBdAstral10(this.query).then((response:any)=>{
      this.datos = response;
      // console.log(this.datos);
    },(error:any)=>{
      console.log(error);
    })
  }

  NavegarTimbrado(suc:string){
    this.router.navigate(['timbrar',suc]);
  }

  NavegarCancelaciones(){
    this.router.navigate(['Cancelaciones']);
  }

  NavegarTimbradoGrupal(){
    this.router.navigate(['TimbradoGrupal']);
  }



}
