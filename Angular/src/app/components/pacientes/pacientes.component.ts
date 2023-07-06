import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidarService } from 'src/app/services/validar.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import * as $ from 'jquery';
import 'bootstrap-datepicker';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {


  baseUrl : string = environment.baseUrl
  pacientes : any[]
  generos: any[]
  tipoRol : any

  miFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    genero: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
  });

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private ValidarService: ValidarService) { 
              }

  ngOnInit() {
    this.getTipoRol();
    this.getPacientes();

    $('#fecha').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
      todayHighlight: true,
      language: 'es'
    }).on('changeDate', (e) => {
      const fechaSeleccionada = e.format('yyyy/mm/dd');
      this.miFormulario.patchValue({fecha: fechaSeleccionada});
    });

  }

  getPacientes() {
    this.http.get(this.baseUrl+'pacientes')
      .subscribe( (data: any) => {
      this.pacientes = data.rows
      });
  }

  getGeneros() {
    this.http.get(this.baseUrl+'getGeneros')
      .subscribe( (data: any) => {
      this.generos = data.rows
      });
  }

  getTipoRol(){
    this.tipoRol = this.ValidarService.tipoRol()
    if (this.tipoRol == 1){
      this.getGeneros()
    }
  }

  registrar(){
    const {nombre, correo,genero, fecha, telefono} = this.miFormulario.value;

    this.http.post<any>(this.baseUrl+'registrarPaciente', { nombre, correo, genero, fecha, telefono }).subscribe(data => {
      if(data.ok == true){
        this.getPacientes();
        Swal.fire(
          'Registrado',
          data.mensaje,
          'success'
        )
      } else{
        Swal.fire('Oops...', 'Algo salio mal', 'error')
    }
}, err => {
  Swal.fire('Oops...', 'Algo salio mal', 'error')
});
  }


}

