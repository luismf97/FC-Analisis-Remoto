import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from '../components/inicio/inicio.component';
import { PacientesComponent } from '../components/pacientes/pacientes.component';
import { GraficaComponent } from '../components/grafica/grafica.component';
import { RegistrosComponent } from '../components/registros/registros.component';
import { TempComponent } from '../components/temperatura/temp.component';
import { UsuariosComponent } from '../components/usuarios/usuarios.component';
import { OtrosComponent } from '../components/otros/otros.component';

const routes: Routes = [
  {path: "", component: InicioComponent},
  { path: 'pacientes', component: PacientesComponent },
  { path: 'ecg', component: GraficaComponent },
  { path: 'registros', component: RegistrosComponent },
  { path: 'temp', component: TempComponent },
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'otros', component: OtrosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }