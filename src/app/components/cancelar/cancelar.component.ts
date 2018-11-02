import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../../services/globals.service';
import {AlertService} from '../../services/sweetalert';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-cancelar',
  templateUrl: './cancelar.component.html',
  styleUrls: ['./cancelar.component.css']
})

export class CancelarComponent implements OnInit {
  tipoDocumento:string = '';
  tabla:string;
  Folio:string;
  Motivo:string;
  datos = [];
  isActive:boolean = false;
  tab:number = 0;
  verMotivo:boolean = false;
  constructor(private _GS:GlobalService,
              private _alertService:AlertService,
              private _apiService:ApiService) { }

  goToValidateFields(){
    if(this._GS.validar_campos(this.tipoDocumento)){
      this._alertService.errorMessage('Campo no seleccionado','Seleccione un tipo de documento por cancelar');
    }else if(this._GS.validar_campos(this.Folio)){
        this._alertService.errorMessage('Campo Vacio','Introduzca el folio a cancelar');
    }else if(this._GS.validar_campos(this.Motivo)){
        this._alertService.errorMessage('Campo Vacio','Ingrese el motivo de la cancelacion')
    }else{
        this.getQueryCancelDocument(this.tipoDocumento,this.tabla,this.Folio);
    }
  }

  getTypeDocument(tipo:any,tab:any)
  {
    this.tab = tab;
    this.isActive = true;
    switch (tipo)
    {
      case 'Facturas':
        this.tipoDocumento = 'Factura';
        this.tabla = 'OINV';
        this.verMotivo = true;
        break;
      case 'NCredito':
        this.tipoDocumento = 'NCredito';
        this.tabla = 'ORIN';
        this.verMotivo = true;
        break;
      case 'NCargo':
        this.tipoDocumento = 'NCargo';
        this.tabla = 'OINV';
        this.verMotivo = true;
        break;
      case 'Pago':
        this.tipoDocumento = 'Pago';
        this.tabla = 'ORCT';
        this.verMotivo = true;
        break;
    }

  }

  getQueryCancelDocument(documento:string,tabla:string,folio:string){
    let query = this._GS.CancelarDocumentosQuery(documento,tabla,folio);
    this._apiService.consultaBdAstral10(query).then((response:any)=>{
      this.datos = response;
    },(error:any)=>{
      this._alertService.errorMessage('Error en la consulta',error);
    });
  }

  goToCancel(uuid:string){
    this._alertService.deleteItem().then((response:any)=>{
      if(response){
        this._apiService.cancelarDocumentoCFDI(uuid).then((response:any)=>{
          let usr = sessionStorage.getItem('Nombre');
          let consulta = this._GS.InsertDocumentosCancelados(this.Folio,this.Motivo,this.datos[0].UUID,usr);
          this._apiService.insertarDetalles(consulta).then(solved =>{
            this._alertService.successMesage('Cancelado Correctamente','');
            this.datos = [];
          }).catch(rejected =>{
            this._alertService.errorMessage('No se inserto',rejected);
          });
        }).catch((error:any)=>{
          this._alertService.errorMessage('Error al cancelar',error.mensaje);
          this.datos = [];
        })
      }
    })
  }

  clearFields(){
    this.datos = [];
    this.Folio = '';
    this.tabla = '';
    this.Motivo = '';
    this.tipoDocumento = '';
    this.isActive = false;
    this.tab = 0;
  }


  ngOnInit() {
  }

}
