import {Component, OnInit} from '@angular/core';
import {UserData} from '../interfaces/user';
import {AlertService} from '../services/sweetalert';
import {ApiService} from '../services/api.service';
import {Router} from '@angular/router';
declare function init_plugins();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserData = {
    usuario: '',
    clave: ''
  };

  cargando=false;


  constructor(
              private alertService: AlertService,
              private router: Router,
              private apiService:ApiService
            ) {}

  ngOnInit() {
    init_plugins();
  }

  ingresar(usr: UserData) {
    usr.usuario = usr.usuario.toLowerCase();
    usr.clave = usr.clave.toLowerCase();
    this.cargando = true;
    this.apiService.iniciar_session(usr).then((response:any)=>{
      this.cargando = false;
      this.router.navigate(['home']);
    },(error:any)=>{
      this.cargando = false;
      switch (error){
        case 'Usuario no existente':
              this.alertService.errorMessage('Error',error);
              usr.usuario = '';
              break;

        case 'Contraseña incorrecta':
              this.alertService.errorMessage('Error',error);
              usr.clave = '';
              break;

        default :
              this.alertService.errorMessage('Error',error);
              break;
      }
    });
  }

  validar_campos(usr: UserData) {

    if (usr.usuario == '') {
      this.alertService.errorMessage('Campo vacio', 'Llena el campo usuario')
    } else if (usr.clave == '') {
      this.alertService.errorMessage('Campo vacio', 'Llena el campo contraseña');
    } else {
      this.ingresar(usr);
    }

  }

}
