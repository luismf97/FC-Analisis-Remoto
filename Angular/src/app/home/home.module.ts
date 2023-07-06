import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { InicioComponent } from '../components/inicio/inicio.component';
import { PacientesComponent } from '../components/pacientes/pacientes.component';
import { GraficaComponent } from '../components/grafica/grafica.component';
import { RegistrosComponent } from '../components/registros/registros.component';
import { TempComponent } from '../components/temperatura/temp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { EcgsComponent } from '../Consulta/ecgs/ecgs.component';
import { BpmsComponent } from '../Consulta/bpms/bpms.component';
import { TemperaturaComponent } from '../Consulta/temperatura/temperatura.component';
import { UsuariosComponent } from '../components/usuarios/usuarios.component';
import { OtrosComponent } from '../components/otros/otros.component';

@NgModule({
  declarations: [
    InicioComponent,
    PacientesComponent,
    GraficaComponent,
    RegistrosComponent,
    TempComponent,
    EcgsComponent,
    BpmsComponent,
    TemperaturaComponent,
    OtrosComponent,
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    ChartModule
  ]
})
export class HomeModule { }
