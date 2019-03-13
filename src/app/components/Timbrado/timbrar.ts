import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {GlobalService} from '../../services/globals.service';
import {ApiService} from '../../services/api.service';
import {AlertService} from '../../services/sweetalert';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {selectValueAccessor} from '@angular/forms/src/directives/shared';

@Component({
  selector: 'app-timbrar-pagos',
  templateUrl: './timbrar.html',
  styleUrls: ['./timbrar.css']
})
export class timbrarComponent implements OnInit {

  opcion: boolean = false;
  funcionSeleccionada: string = '';
  sucursal: any;
  query: string;
  r1: string;
  r2: string;
  folios: any[] = [];
  datos: any[] = [];
  datosAux: any[] = [];
  usuario: string;
  colorTabla: string;
  timbrando:boolean=false;
  selectAll:boolean = false;
  datosCargados:boolean = false;
  jQtabla:boolean = false;

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
      this.validarPermisos();
      this.validarInfoConsultada();

    });
  }

  ngOnInit() {
   //
    // this.jqueryInit();
  }

  strUpper(){
    return this.sucursal.toUpperCase();
  }

  validarInfoConsultada(){
    if(this.datos.length > 0 || this.opcion ){
        this.datos = [];
        this.opcion = false;
        this.datosCargados = false;
    }
  }

  obtenerQuery() {
    switch (this.sucursal) {

      case 'Hermosillo':
        this.r1 = '1000000';
        this.r2 = '1999999';
        //this.query = this._GS.PagosQuery(this.r1, this.r2);
        this.obtenerFuncionQuerySuc();
        this.obtenerDatos(this.sucursal);

        break;
      case 'LaPaz':
        this.sucursal = 'LaPaz';
        this.r1 = '2000000';
        this.r2 = '2999999';
        //this.query = this._GS.PagosQuery(this.r1, this.r2);
        this.obtenerFuncionQuerySuc();
        this.obtenerDatos(this.sucursal);

        break;
      case 'Tijuana':
        this.r1 = '3000000';
        this.r2 = '3999999';
        //this.query = this._GS.PagosQuery(this.r1, this.r2);
        this.obtenerFuncionQuerySuc();
        this.obtenerDatos(this.sucursal);

        break;
      case 'Guadalajara':
        this.r1 = '4000000';
        this.r2 = '4999999';
        //this.query = this._GS.PagosQuery(this.r1,this.r2);
        this.obtenerFuncionQuerySuc();
        this.obtenerDatos(this.sucursal);

        break;
      case 'Monterrey':
        this.r1 = '5000000';
        this.r2 = '5999999';
        //this.query =  this._GS.PagosQuery(this.r1,this.r2);
        this.obtenerFuncionQuerySuc();
        this.obtenerDatos(this.sucursal);

        break;
      case 'Noroeste':
        this.r1 = '0';
        this.r2 = '19999';
        //this.query = this._GS.PagosQueryNoro(this.r1,this.r2);
        this.obtenerFuncionQuerySuc();
        this.obtenerDatos(this.sucursal);

        break;
    }

  }

  obtenerFuncionQuerySuc(){
    if(this.funcionSeleccionada == 'Pagos'){
        if(this.sucursal != 'Noroeste'){
            this.query = this._GS.PagosQuery(this.r1,this.r2);
        }else{
          this.query = this._GS.PagosQueryNoro(this.r1,this.r2);
        }
    }else if(this.funcionSeleccionada == 'Facturas'){
        if(this.sucursal != 'Noroeste'){
            this.query = this._GS.FacturasQuery(this.r1,this.r2);
        }else{
            this.query = this._GS.FacturasQueryNoro(this.r1,this.r2);
        }
    }else if(this.funcionSeleccionada == 'Notas de credito'){
      if(this.sucursal != 'Noroeste'){
        this.query = this._GS.ObtenerNotasCreditoQuery(this.r1,this.r2);
      }else{
        this.query = this._GS.ObtenerNotasCreditoQueryNoro(this.r1,this.r2);
      }
    }else if(this.funcionSeleccionada == 'Notas de cargo'){
      if(this.sucursal != 'Noroeste'){
        this.query = this._GS.ObtenerNotasCargoQuery(this.r1,this.r2);
      }else{
        this.query = this._GS.ObtenerNotasCargoQueryNoro(this.r1,this.r2);
      }
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
    this.obtenerQuery();
  }

  addDcto(folio: number, monto: number) {

    let dcto = {
      folio: folio,
      monto:monto
  };
    if (this.folios.length == 0) {
      this.folios.push(dcto);
    } else {
      for (let i = 0; i < this.folios.length; i++) {
        if (this.folios[i].folio == folio) {
            this.folios.splice(i, 1);
            return;
        }
      }
      this.folios.push(dcto);
    }
  }

  switchearBotonTimbrado(){
    if(this.funcionSeleccionada == 'Pagos'){
      this.timbrarPagos();
    }else if (this.funcionSeleccionada == 'Facturas'){
      this.timbrarFacturas();
    }else if (this.funcionSeleccionada == 'Notas de cargo'){
      this.timbrarNotasCargo();
    }else if(this.funcionSeleccionada == 'Notas de credito'){
      this.timbrarNotasCredito();
    }
  }

  timbrarPagos() {
    let contador = 0;
    this.timbrando = true;
    if(this.sucursal != 'Noroeste'){
      for (let i = 0; i < this.folios.length; i++) {
        setTimeout(()=>{
          this.apiService.timbrarAstral10(this.folios[i].folio).then((resolve: any) => {
            let consultaDetalles = this._GS.InsertDetallePagosQuery(this.folios[i].folio, resolve.U_UUID[0],this.folios[i].monto,this.usuario,this.sucursal);
            this.insertaDetalle(consultaDetalles);
            this.openPDF(resolve.PDF);
            this.timbrando = false;
            contador ++;
            if(contador == this.folios.length){
              this.cambiarDatos();
            }
          }).catch((err: any) => {
            this.timbrando = false;
            let folio = err.folio;
            let error = err.mensaje[0];
            this.mostrarError(error,folio,'Pago');
          });
        },3000);
      }
    }else{
      let contador = 0;
      for (let i = 0; i < this.folios.length; i++) {
        setTimeout(()=>{
          this.apiService.timbrarNoroeste(this.folios[i].folio).then((resolve: any) => {
            let consultaDetalles = this._GS.InsertDetallePagosQuery(this.folios[i].folio, resolve.U_UUID[0],this.folios[i].monto,this.usuario,this.sucursal);
            this.insertaDetalle(consultaDetalles);
            this.openPDF(resolve.PDF);
            contador ++;
            if(contador == this.folios.length){
              this.cambiarDatos();
            }
            this.timbrando = false;
          }).catch((err: any) => {
            this.timbrando = false;
            let folio = err.folio;
            let error = err.mensaje[0];
            this.mostrarError(error,folio,'Pago');
            //this.validarError(error,folio);
          });
        },5000);
      }
    }
  }

  timbrarNotasCredito(){
    this.timbrando = true;
    let contador = 0;
    for(let i=0; i<this.folios.length;i++){
      setTimeout(()=>{
        if(this.sucursal != 'Noroeste'){
          debugger;
          this.apiService.timbrarPacifico(this.folios[i].folio,'timbradoNotaCredito','N.CREDITO').then((response:any)=>{
            let detalleNCreditoQuery = this._GS.InsertDetalleNCredito(this.folios[i].folio,response.UUID[0],this.folios[i].monto,this.usuario);
            this.insertaDetalle(detalleNCreditoQuery);
            this.openPDF(response.PDF);
            contador ++;
            if(contador == this.folios.length){
              this.cambiarDatos();
            }
          },(error:any)=>{
              this.mostrarError(error.mensaje,error.folio,'Nota de credito');
          })
        }
      },3000);
    }
  }

  timbrarNotasCargo(){
    this.timbrando = true;
    let contador = 0;
    for(let i=0; i<this.folios.length;i++){
      setTimeout(()=>{
        if(this.sucursal != 'Noroeste'){
          this.apiService.timbrarPacifico(this.folios[i].folio,'timbradoNotaCargo','N.CARGO').then((response:any)=>{
            let queryDetalleNCargo = this._GS.InsertDetalleNCargo(this.folios[i].folio,response.UUID[0],this.folios[i].monto,this.usuario);
            this.insertaDetalle(queryDetalleNCargo);
            this.openPDF(response.PDF);
            contador ++;
            if(contador == this.folios.length){
              this.cambiarDatos();
            }
          },(error:any)=>{
            this.mostrarError(error.mensaje,error.folio,'Nota de credito');
          })
        }
      },3000);
    }
  }

  seleccionarTodos(){
    this.selectAll = !this.selectAll;
    if(this.selectAll){
      for(let i=0; i<this.datos.length;i++){
        let dctoAux = {
          folio: this.datos[i].Folio,
          monto:this.datos[i].Total
        };
        this.folios.push(dctoAux);
      }
    }else{
      this.folios = [];
    }
  }

  timbrarFacturas(){
    let contador = 0;
    setTimeout(()=>{
      this.timbrando = true;
      if(this.sucursal != 'Noroeste'){
        for(let i=0; i<this.folios.length;i++){
          this.apiService.timbrarPacifico(this.folios[i].folio,'timbradoFacturas','FACTURA').then((resolve:any)=>{
            let queryDetalleFactura = this._GS.InsertDetalleFacturasQuery(resolve.Folio,resolve.UUID[0],this.folios[i].monto,this.usuario);
            this.insertaDetalle(queryDetalleFactura);
            this.openPDF(resolve.PDF);
            contador ++;
            if(contador == this.folios.length){
              this.cambiarDatos();
            }
          }).catch((rejected:any)=>{
            this.timbrando = false;
            this.mostrarError(rejected.mensaje,rejected.Folio,'Factura');
          });
        }

      }
    },4000);
  }

  insertaDetalle(query:any){
    this.apiService.insertarDetalles(query).then(()=>{

    },(error:any)=>{
      this.alertService.errorMessage('Error al insertar', error);
    }).catch((er:any)=>{
      console.error(er);
    })
  }

  mostrarError(mensaje:any,folio:any,tipoDcto:string){
    this.alertService.errorMessage(mensaje,'Folio '+tipoDcto+': '+folio);
  }


  cambiarDatos(){
    this.timbrando = false;
    this.obtenerDatos(this.sucursal);
    this.folios = [];
  }

  obtenerDatos(sucursal:any) {
    if(sucursal != 'Noroeste'){
      this.apiService.consultaBdAstral10(this.query).then((response: any) => {
        this.datos = response;
        this.datosAux = this.datos;
      }, (error: any) => {
        console.log(error);
        this.datos = [];
      });
    }else{
      this.apiService.consultaBdNoroeste(this.query).then((response:any)=>{
        this.datos = response;
        this.datosAux = this.datos;
        this.datosCargados = true;
      },(error:any)=>{
        this.datosCargados = true;
        this.datos = [];
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
      ruta = ruta.substring(27,150);
      ruta = 'http://192.168.0.173/'+ruta+".pdf";
      window.open(ruta);
  }

  borrarDatos(){
    this.datos = [];
    this.folios = [];
  }

  searchDocument(ev: any){
    this.datos = this.datosAux;
    let val = ev.target.value;
    if(val.key != ' ' || val.key != ''){
      //this.datos = this.datos.filter(item => item.Folio == val);
      this.datos = this.datos.filter(item => item.Folio.toString().includes(val));
    }

  }


}
