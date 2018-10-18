import { Injectable} from '@angular/core';
import swal from 'sweetalert2';

@Injectable()
export class AlertService {

  constructor() {
  }

  successMesage(tittle:string, message:string){
    swal(
      tittle,
      message,
      'success'
    )
  }

  successMesage2(tittle:string, message:string){

    return new Promise((resolve)=>{
      swal(
        tittle,
        message,
        'success'
      ).then(()=>{
        resolve();
      })
    })
  }

  errorMessage(tittle:string,message:string){
      swal(
        tittle,
        message,
        'error'
      )
  }
  errorMessage2(tittle:string,message:string){
    swal({
      title: tittle,
      text: message,
      timer: 800,
      allowEnterKey:false
    })
  }

  deleteItem(){
    return new Promise((resolve)=>{
      swal({
        title: '¿Desea cancelar este documento?',
        text: "",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.value) {
          return resolve(true);
        }
      })
    })

  }



}
