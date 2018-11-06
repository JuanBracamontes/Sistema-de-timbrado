import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../../services/globals.service';
import {AlertService} from '../../services/sweetalert';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-timbradogrupal',
  templateUrl: './timbradogrupal.component.html',
  styleUrls: ['./timbradogrupal.component.css']
})
export class TimbradogrupalComponent implements OnInit {

  rfc:string = 'DIC860428M2A';
  datos = [];
  folios = [];
  query:string = '';
  constructor(private _GS:GlobalService,
              private alertService:AlertService,
              private _apiService:ApiService) { }

  ngOnInit() {
  }

  getQueryTimbradoGrupal(){
      this.query = this._GS.PagosQueryTimbradoGrupal(this.rfc);
      this._apiService.consultaBdAstral10(this.query).then((response:any)=>{
        this.datos = response;
        console.log(this.datos);
      },(error:any)=>{
        this.alertService.errorMessage('Error en la consulta',error);
      });
  }

  validateField(){
    if(this._GS.validar_campos(this.rfc)){
        this.alertService.errorMessage('Campo Vacio','Llene el campo RFC');
    }else{
      this.getQueryTimbradoGrupal();
    }
  }

  addPago(folio: number) {

    if (this.folios.length == 0) {
      this.folios.push(folio);
    } else {
      for (let i = 0; i < this.folios.length; i++) {
        if (this.folios[i] == folio) {
          this.folios.splice(i, 1);
          return;
        }
      }
      this.folios.push(folio);
    }
  }

  timbrarPagos(){
    let foliosConvertidos = this.convertDocnums();
    this._apiService.timbrarGrupalAstral10(foliosConvertidos).then((resolve:any)=>{
      this.folios = [];
      this.obtenerDatos();
    }).catch((error:any)=>{
      this.alertService.errorMessage('Error al timbrar',error);
    })
  }

  convertDocnums(){
    let cadena = "";
    let folio = "";
    for(let i=0; i<this.folios.length;i++){
        if(i +1 == this.folios.length){
            folio = "'"+this.folios[i]+"'";
        }else{
            folio = "'"+this.folios[i]+"'"+",";
        }
        cadena += folio;
    }
    return cadena;
  }

  obtenerDatos(){
    if(this.query != ''){
      this._apiService.consultaBdAstral10(this.query).then((response: any) => {
        this.datos = response;
      }, (error: any) => {
        console.log(error);
      });
    }
  }

  borrarDatos(){
    this.datos = [];
    this.folios = [];
  }


}
