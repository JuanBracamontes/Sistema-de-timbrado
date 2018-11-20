import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {GlobalService} from '../../services/globals.service';
import {ApiService} from '../../services/api.service';
import {AlertService} from '../../services/sweetalert';
import {BsDatepickerModule} from 'ngx-bootstrap';

@Component({
  selector: 'app-timbrar-pagos',
  templateUrl: './timbrar-pagos.html',
  styleUrls: ['./timbrar-pagos.css']
})
export class timbarPagosComponent implements OnInit {

  opcion: boolean = false;
  funcionSeleccionada: string = '';
  sucursal: any;
  query: string;
  r1: string;
  r2: string;
  folios: any[] = [];
  datos: any[] = [];
  usuario: string;
  colorTabla: string;
  timbrando:boolean=false;
  idCheckbox:number;
  removeChecked:boolean = false;

  //PERMISOS
  NotasCredito: number;
  NotasCargo: number;
  Facturas: number;
  Pagos: number;


  constructor(private activatedRoute: ActivatedRoute,
              private _GS: GlobalService,
              private apiService: ApiService,
              private alertService: AlertService) {
    this.usuario = sessionStorage.getItem('Nombre');
    this.activatedRoute.params.subscribe((sucursal: Params) => {
      this.sucursal = sucursal.sucursal;
      this.obtenerQuery();
    });
  }

  ngOnInit() {
  }

  obtenerQuery() {
    switch (this.sucursal) {

      case 'Hermosillo':
        this.r1 = '1000000';
        this.r2 = '1999999';
        this.query = this._GS.PagosQuery(this.r1, this.r2);
        this.obtenerDatos(this.sucursal);
        break;
      case 'LaPaz':
        this.sucursal = 'La Paz';
        this.r1 = '2000000';
        this.r2 = '2999999';
        this.query = this._GS.PagosQuery(this.r1, this.r2);
        this.obtenerDatos(this.sucursal);
        break;
      case 'Tijuana':
        this.r1 = '3000000';
        this.r2 = '3999999';
        this.query = this._GS.PagosQuery(this.r1, this.r2);
        this.obtenerDatos(this.sucursal);
        break;
      case 'Guadalajara':
        this.r1 = '4000000';
        this.r2 = '4999999';
        this.query = this._GS.PagosQuery(this.r1,this.r2);
        this.obtenerDatos(this.sucursal);
        break;
      case 'Monterrey':
        this.r1 = '5000000';
        this.r2 = '5999999';
        this.query =  this._GS.PagosQuery(this.r1,this.r2);
        this.obtenerDatos(this.sucursal);
        break;
      case 'Noroeste':
        this.r1 = '0';
        this.r2 = '19999';
        this.query = this._GS.PagosQueryNoro(this.r1,this.r2);
        this.obtenerDatos(this.sucursal);
        break;
    }

  }

  obtenerFuncion(opcion: string) {

    switch (opcion) {

      case 'Pagos':
        this.funcionSeleccionada = 'Pagos';
        this.opcion = true;
        this.colorTabla = '#5352ed';
        break;
      case 'Notas de credito':
        this.funcionSeleccionada = 'Notas de credito';
        this.opcion = true;
        this.colorTabla = '#398bf7';
        break;
      case 'Notas de cargo':
        this.funcionSeleccionada = 'Notas de cargo';
        this.opcion = true;
        this.colorTabla = '#ffb22b';
        break;
      case 'Facturas':
        this.funcionSeleccionada = 'Facturas';
        this.opcion = true;
        this.colorTabla = '#06d79c';
        break;

    }

  }

  addPago(folio: number, monto: number) {

    let pago = {
      folio: folio,
      monto:monto
  };

    if (this.folios.length == 0) {
      this.folios.push(pago);
    } else {
      for (let i = 0; i < this.folios.length; i++) {
        if (this.folios[i].folio == folio) {
            this.folios.splice(i, 1);
            return;
        }
      }
      this.folios.push(pago);
    }
  }

  timbrarPagos() {
    this.timbrando = true;
    if(this.sucursal != 'Noroeste'){
      for (let i = 0; i < this.folios.length; i++) {
        setTimeout(()=>{
          this.apiService.timbrarAstral10(this.folios[i].folio).then((resolve: any) => {
            this.obtenerDatos(this.sucursal);
         let consultaDetalles = this._GS.InsertDetallePagosQuery(this.folios[i].folio, resolve.U_UUID[0],this.folios[i].monto,this.usuario,this.sucursal);
         this.apiService.insertarDetalles(consultaDetalles).then(() => {
           }).catch((err: any) => {
             this.alertService.errorMessage('Error al insertar', err);
           });
            this.openPDF(resolve.PDF);
            this.timbrando = false;
          }).catch((err: any) => {
            this.timbrando = false;
            let folio = err.folio;
            let error = err.mensaje[0];
            this.mostrarError(error,folio);
          });
        },3000);
      }
    }else{
      for (let i = 0; i < this.folios.length; i++) {
        setTimeout(()=>{
          this.apiService.timbrarNoroeste(this.folios[i].folio).then((resolve: any) => {
            this.obtenerDatos(this.sucursal);
            let consultaDetalles = this._GS.InsertDetallePagosQuery(this.folios[i].folio, resolve.U_UUID[0],this.folios[i].monto,this.usuario,this.sucursal);
            this.folios = [];
            this.apiService.insertarDetalles(consultaDetalles).then(() => {
            }).catch((err: any) => {
              this.alertService.errorMessage('Error al insertar', err);
            });
            this.openPDF(resolve.PDF);
            this.timbrando = false;
          }).catch((err: any) => {
            this.timbrando = false;
            let folio = err.folio;
            let error = err.mensaje[0];
            this.mostrarError(error,folio);
            //this.validarError(error,folio);
          });
        },5000);
      }
    }



  }

  mostrarError(mensaje:any,folio:any){
    this.alertService.errorMessage(mensaje,'Folio Pago: '+folio);
  }

  validarError(error:any,folio:any){
    switch (error) {
      case '301':
        this.alertService.errorMessage('XML mal formado', 'Folio Pago: ' + folio);
        break;
      case '5':
        this.alertService.errorMessage('Pack Off-line por mantenimiento', 'Folio Pago: ' + folio);
        break;
      case '302':
        this.alertService.errorMessage('Sello mal formado o inválido', 'Folio Pago: ' + folio);
        break;
      case '305':
        this.alertService.errorMessage('La fecha de emisión no está dentro de la vigencia del CSD del emisor', 'Folio Pago: ' + folio);
        break;
      case '401':
        this.alertService.errorMessage('Fecha y hora de generación fuera de rango', 'Folio Pago: ' + folio);
        break;
      case '402':
        this.alertService.errorMessage('El RFC del emisor no se encuentra en el régimen de contribuyentes', 'Folio Pago: ' + folio);
        break;
      default:
        this.alertService.errorMessage('Xml mal formado','Folio Pago: ' + folio);
        break;
    }
    this.folios = [];
  }

  obtenerDatos(sucursal:any) {
    if(sucursal != 'Noroeste'){
      this.apiService.consultaBdAstral10(this.query).then((response: any) => {
        this.datos = response;
        this.validarPermisos();
        //console.log(this.datos);
      }, (error: any) => {
        console.log(error);
      });
    }else{
      this.apiService.consultaBdNoroeste(this.query).then((response:any)=>{
        this.datos = response;
        this.validarPermisos();
      },(error:any)=>{
        console.error(error);
      });
    }

  }


  validarPermisos() {
    let consulta = this._GS.PermisosQuery(this.usuario);
    this.apiService.Consultas(consulta).then((response: any) => {

      this.Facturas = response[0].Facturas;
      this.Pagos = response[0].Pagos;
      this.NotasCredito = response[0].NotasCredito;
      this.NotasCargo = response[0].NotasCargo;

    }).catch((err: any) => {
      console.warn(err);
    });
  }

  openPDF(ruta:any){
      ruta = ruta.substring(27,100);
      ruta = 'http://192.168.0.173/'+ruta+".pdf";
      window.open(ruta);
  }

  borrarDatos(){
    this.datos = [];
    this.folios = [];
  }

  verFolios(posicion:any){
    if(this.folios.length > 0){
      if(this.folios[posicion].folios){
        return true;
      }
    }else{
      return false;
    }

  }


}
