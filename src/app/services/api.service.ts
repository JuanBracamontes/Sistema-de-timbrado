import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserData} from '../interfaces/user';
import {API_URL} from './url.api';
import {GlobalService} from './globals.service';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient,
              private _GS: GlobalService) {
  }

  iniciar_session(usr: UserData) {
    let url = API_URL + '/login';
    return new Promise((resolve, reject) => {
      this.http.post(url, usr).subscribe((response: any) => {
        if (response.error) {
          reject(response.mensaje);
        } else {
          sessionStorage.setItem('Nombre', response[0].Nombre);
          resolve('Se ha logeado correctamente');
        }
      },(er:any)=>{
          if(er.error){
            reject('Ocurrio un error inesperado');
          }
      })
    })
  }

  consultaBdAstral10(consulta: any) {
    let data = {
      consulta: consulta
    };
    let url = API_URL + '/ConsultaAstral10';
    return new Promise((resolve, reject) => {
      this.http.post(url, data).subscribe((response: any) => {
        if (response.error) {
          reject(response.mensaje);
        } else {
          resolve(response.datos);
        }
      })
    });
  }

  consultaBdNoroeste(consulta: any) {
    let data = {
      consulta: consulta
    };
    let url = API_URL + '/ConsultaNoroeste';
    return new Promise((resolve, reject) => {
      this.http.post(url, data).subscribe((response: any) => {
        if (response.error) {
          reject(response.mensaje);
        } else {
          resolve(response.datos);
        }
      })
    });
  }

  Consultas(consulta: any) {
    let data = {
      consulta: consulta
    };
    let url = API_URL + '/ConsultasDefault';
    return new Promise((resolve, reject) => {
      this.http.post(url, data).subscribe((response: any) => {
        if (response.error) {
          reject(response.mensaje);
        } else {
          resolve(response.datos);
        }
      })
    });

  }

  timbrarPacifico(folio:any,archivo:string,tipoDocumento:string){
    debugger;
    let dato = {
      folio : folio,
      TipoDcto: tipoDocumento
    };
    let url = API_URL + '/' + archivo;
    return new Promise((resolve,reject)=>{
      this.http.post(url,dato).subscribe((response:any)=>{
        if(response.error){
          let error = {
            mensaje:response.mensaje,
            folio:response.folio
          };
          reject(error);
        }else{
          resolve(response);
        }
      },(err:any)=>{
        if(err.error){
          let error = {
            mensaje:err.message,
            folio:folio
          };
          reject(error);
        }
      })
    })

  }


  timbrarAstral10(folio: any) {
    let dato = {
      folio: folio
    };
    let url = API_URL + '/timbradoPagos';
    return new Promise((resolve, reject) => {
      this.http.post(url, dato).subscribe((response: any) => {
        if (response.error) {
          let error = {
            codigo: response.codigo,
            mensaje:response.mensaje,
            folio: response.folio
          };
          reject(error);
        } else {
          resolve(response);
        }
      },(err:any)=>{
        if(err.error){
            let error = {
              mensaje:'XML Mal Formado',
              folio:folio
            };
            reject(error);
        }
      })
    });
  }

  timbrarGrupalAstral10(folios:any){
    let dato = {
      folios:folios
    };
    let url = API_URL + '/timbradoGrupalPagos';
    return new Promise((resolve,reject)=>{
      this.http.post(url,dato).subscribe((response:any)=>{
        resolve(response);
      },(error:any)=>{
        reject (error);
      })
    })
  }

  timbrarNoroeste(folio: any) {
    let dato = {
      folio: folio
    };
    let url = API_URL + '/timbradoPagosNoro';
    return new Promise((resolve, reject) => {
      this.http.post(url, dato).subscribe((response: any) => {
        if (response.error) {
          let error = {
            codigo: response.codigo,
            mensaje: response.mensaje,
            folio: response.folio
          };
          reject(error);
        } else {
          resolve(response);
        }
      },(err:any)=>{
        if(err.error){
          let error = {
            mensaje:'XML Mal Formado',
            folio:folio
          };
          reject(error);
        }
      })
    });
  }

  insertarDetalles(consulta: string) {
    let dato = {
      consulta: consulta
    };
    let url = API_URL + '/UpdateDetalles';
    return new Promise((resolve, reject) => {
      this.http.post(url, dato).subscribe((response: any) => {
        if (response.error) {
          reject(response.mensaje);
        } else {
          resolve();
        }
      })
    });
  }


  cancelarDocumentoCFDI(uuid:string,consulta:string,queryActualizaPrinted:any){
    let dato = {
      uuid:uuid,
      consulta:consulta,
      consultaPrinted:queryActualizaPrinted
    };

    let url = API_URL + '/Cancelar';
    return new Promise((resolve,reject)=>{
      this.http.post(url,dato).subscribe((response:any)=>{
        if(response.error == false){
          let respuesta = {
            error: false,
            mensaje : response.mensaje[0]
          };
          resolve(respuesta);
        }else{
          if(response.mensaje[0] == 'Previamente cancelado'){
            let respuesta = {
              error: true,
              mensaje : response.mensaje[0]
            };
            reject(respuesta);
          }else if(response.mensaje[0] == 'En proceso'){
            let respuesta = {
              error: false,
              mensaje : response.mensaje[0]
            };
            resolve(respuesta);
          }else {
            let respuesta = {
              error: true,
              mensaje : response.mensaje[0]
            };
            reject(respuesta);
          }
        }
      })
    })
  }

  actualizaDbDefault(query:string){
    let dato = {
      consulta:query
    };
    let url = API_URL + '/UpdateDetalles';
    return new Promise((resolve,reject)=>{
        this.http.post(url,dato).subscribe((response:any)=>{
          resolve(response.mensaje);
        },(error:any)=>{
          reject(error.mensaje);
      })
    })
  }


  timbrarNotaCredito(query: any){
    let obj = {
      consulta:query
    };
    let url = API_URL + '/timbradoNotaCredito';
    return new Promise((resolve,reject)=>{
      this.http.post(url,obj).subscribe((response:any)=>{
        //ENTRA CUANDO NO OCURRIO NINGUN PROBLEMA
        if(response.error){
          reject(response.mensaje);
        }else{
          resolve(response);
        }
      },(err:any)=>{
        //ENTRA CUANDO OCURRIO UN ERROR INESPERADO
        reject(err);
      })
    })

  }





}
