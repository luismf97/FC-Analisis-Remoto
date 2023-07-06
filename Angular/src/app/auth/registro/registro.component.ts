import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { sha256 } from 'js-sha256';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  
  baseUrl : string = environment.baseUrl
  roles: any [] = []

  miFormulario: FormGroup = this.fb.group({
    nombre : ['', [Validators.required]],
    correo : ['', [Validators.required, Validators.email]],
    rol : ['', [Validators.required]],
    telefono : ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder,
              private http: HttpClient,) { }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this.http.get(this.baseUrl+'roles')
      .subscribe( (data: any) => {
      this.roles = data.rows
      });
  }

  submit(){
    const {nombre, correo, rol, telefono, password} = this.miFormulario.value
    this.http.post<any>(this.baseUrl+'registro', { nombre, correo,rol,telefono, password: sha256(password)}).subscribe(data => {
      if(data.ok == true){
        Swal.fire(
          'Registrado',
          data.mensaje,
          'success'
        )
      } else{
        Swal.fire('Oops...', 'Algo salio mal, contacte', 'error')
    }
}, err => {
  Swal.fire('Oops...', 'Algo salio mal', 'error')
});

  }

}
