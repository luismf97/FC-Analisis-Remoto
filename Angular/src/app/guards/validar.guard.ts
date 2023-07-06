import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ValidarService } from '../services/validar.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarGuard implements CanActivate, CanLoad {
  constructor(private ValidarService: ValidarService,
              private router : Router){

  }

  canActivate(): Observable<boolean>|boolean {
    let boolean = this.ValidarService.isAuthenticated()
    if(boolean){
      return this.ValidarService.isAuthenticated();
    } else{
      this.router.navigateByUrl('/login')
      return this.ValidarService.isAuthenticated();
    }
  }

  canLoad(): Observable<boolean>|boolean{
        let boolean = this.ValidarService.isAuthenticated()
    if(boolean){
      return this.ValidarService.isAuthenticated();
    } else{
      this.router.navigateByUrl('/login')
      return this.ValidarService.isAuthenticated();
    }
  }
}