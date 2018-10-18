import { Component, OnInit,Input } from '@angular/core';
import {HomeComponent} from './home/home.component';
declare  function init_plugins();
@Component({
  selector: 'app-componentes',
  templateUrl: './componentes.component.html',
  styles: []
})
export class ComponentesComponent implements OnInit {
  @Input() query:any;
  constructor() { }

  ngOnInit() {
    init_plugins();
  }

  obtenerConsulta(event:any){
    debugger;
    this.query = event;
    console.log(this.query);
    const HC = HomeComponent;


  }

}
