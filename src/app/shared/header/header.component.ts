import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../../services/globals.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  nombre:string;
  constructor() {
    this.nombre = sessionStorage.getItem('Nombre');
  }

  ngOnInit() {
  }

}
