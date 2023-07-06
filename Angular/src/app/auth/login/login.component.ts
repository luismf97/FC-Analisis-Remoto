import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ValidarService } from '../../services/validar.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  baseUrl : string = environment.baseUrl

  miFormulario: FormGroup = this.fb.group({
    correo : ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private ValidarService: ValidarService,
              private router: Router,) { }

  ngOnInit() {
  }

  login(){
    const {correo, password} = this.miFormulario.value
    this.http.post<any>(this.baseUrl+'login', { correo,password: sha256(password)}).subscribe(data => {
      if(data.ok == true){
        this.ValidarService.loginOk(data.rows[0].Rol, data.rows[0].Id);
        this.router.navigate(['/']);
      } else{
        Swal.fire('Oops...', 'Algo salio mal, contacte', 'error')
    }
}, err => {
  Swal.fire('Oops...', 'Algo salio mal', 'error')
});    

}

}
