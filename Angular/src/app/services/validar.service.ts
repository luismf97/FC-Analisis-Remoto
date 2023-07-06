import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidarService {

  private _isLoggedIn = false;
  tipoUsuario;
  usuario;

  constructor() { }

  loginOk(tipoUsuario, usuario){
    this._isLoggedIn = true
    this.tipoUsuario = tipoUsuario
    this.usuario = usuario
  }

  isAuthenticated(){
    return this._isLoggedIn;
  }

  tipoRol(){
    return this.tipoUsuario
  }

  usuarioId(){
    return this.usuario
  }

}