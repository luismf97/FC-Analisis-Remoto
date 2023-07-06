import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarGuard } from './guards/validar.guard';

const routes: Routes = [
  {path: 'login', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)},
  {path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),canActivate:[ValidarGuard], canLoad:[ValidarGuard]},
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }