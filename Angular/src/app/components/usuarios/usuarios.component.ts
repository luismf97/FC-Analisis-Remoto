import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import 'bootstrap-datepicker';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  baseUrl : string = environment.baseUrl
  usuarios : any[]

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getUsuarios();
  }

  getUsuarios() {
    this.http.get(this.baseUrl+'getUsuarios')
      .subscribe( (data: any) => {
      this.usuarios = data.rows;
      });
  }

}
