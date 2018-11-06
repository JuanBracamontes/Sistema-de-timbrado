import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserData} from '../interfaces/user';
import {API_URL} from './url.api';
import {GlobalService} from './globals.service';
import {Observable} from 'rxjs';
import {reject} from 'q';

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


  cancelarDocumentoCFDI(uuid:string,consulta:string){
    let dato = {
      uuid:uuid,
      consulta:consulta
    };
    let url = API_URL + '/Cancelar';
    return new Promise((resolve,reject)=>{
      this.http.post(url,dato).subscribe((response:any)=>{
        if(response.error[0] == 'false'){
          let respuesta = {
            error: true,
            mensaje : response.mensaje[0]
          };
          reject(respuesta);
        }else{
          if(response.mensaje[0] == 'UUID Previamente cancelado'){
            let respuesta = {
              error: true,
              mensaje : response.mensaje[0]
            };
            reject(respuesta);
          }else{
            let respuesta = {
              error: false,
              mensaje : response.mensaje[0]
            };
            resolve(respuesta);
          }
        }
      })
    })
  }






}
