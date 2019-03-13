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

  rfc:string = '';
  datos = [];
  folios = [];
  query:string = '';
  allDataSelected:boolean = false;
  TotalAcumulado:number = 0;
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
          this.datos = [];
          this.folios = [];
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

  addPago(folio: number,monto:any) {
    let pago = {
      folio:folio,
      monto:monto
    };

    if (this.folios.length == 0) {
      this.TotalAcumulado = this.convertStringToNumber(pago.monto);
      this.folios.push(pago);
    } else {
      for (let i = 0; i < this.folios.length; i++) {
        if (this.folios[i].folio == folio) {
          this.TotalAcumulado =  this.TotalAcumulado - this.convertStringToNumber(this.folios[i].monto);
          this.folios.splice(i, 1);
          return;
        }
      }

      this.TotalAcumulado += this.convertStringToNumber(pago.monto);
      this.folios.push(pago);
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
      if(!this.allDataSelected){
          for(let i=0; i<this.folios.length;i++){
              if(i +1 == this.folios.length){
                  folio = "'"+this.folios[i].folio+"'";
              }else{
                  folio = "'"+this.folios[i].folio+"'"+",";
              }
              cadena += folio;
          }
      }else if(this.allDataSelected){
        for(let i=0; i<this.folios.length;i++){
          if(i +1 == this.folios.length){
              folio = "'"+this.folios[i]+"'";
          }else{
              folio = "'"+this.folios[i]+"'"+",";
          }
          cadena += folio;
      }
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

  selectAll(){
    this.allDataSelected = !this.allDataSelected;
    if(this.allDataSelected){
      for(let i=0; i<this.datos.length;i++){
        this.folios.push(this.datos[i].NumPago);
        this.TotalAcumulado += this.convertStringToNumber(this.datos[i].Total);
      }
    }else{
      this.folios = [];
      this.TotalAcumulado = 0;
    }
  }

  formatNumber(numero:any){
    return numero.toFixed(2);
  }

  convertStringToNumber(stringNumber:any){
     stringNumber = parseFloat(stringNumber.replace(/,/g, ''));
     return stringNumber;
  }


}
