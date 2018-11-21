import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {GlobalService} from '../../services/globals.service';

@Component({
  selector: 'app-cancelaciones-ep',
  templateUrl: './cancelaciones-ep.component.html',
  styleUrls: ['./cancelaciones-ep.component.css']
})
export class CancelacionesEPComponent implements OnInit {

  datos = [];
  folios = [];
  constructor( private apiService:ApiService,
               private _GS:GlobalService) {
    this.obtenerDatos();
  }

  ngOnInit() {
  }

  obtenerDatos(){
    let query = this._GS.obtenerCancelacionesPendientes();
    this.apiService.Consultas(query).then((response:any)=>{
      this.datos = response;
      console.log(response);
    }).catch((error:any)=>{
      console.log(error);
    })
  }

  fechaFormato(fecha:any){
    return fecha.substring(0,10);
  }

  addFolio(folio: number,motivo:any) {
    let Docto = {
      folio:folio,
      motivo:motivo
    };

    if (this.folios.length == 0) {
      this.folios.push(Docto);
    } else {
      for (let i = 0; i < this.folios.length; i++) {
        if (this.folios[i].folio == folio) {
          if(this.folios[i].motivo == motivo){
            this.folios.splice(i, 1);
            return;
          }
        }
      }
      this.folios.push(Docto);
    }

  }


  actualizarCampo(){
    for(let i=0; i<this.folios.length;i++){
        let queryActualiza = this._GS.actualizarCampoEnProceso(this.folios[i].folio,this.folios[i].motivo);
        this.apiService.actualizaDbDefault(queryActualiza).then((resolve:any)=>{
          this.obtenerDatos();
          this.folios = [];
        }).catch((error:any)=>{
          console.error(error);
        })
    }
  }

}
