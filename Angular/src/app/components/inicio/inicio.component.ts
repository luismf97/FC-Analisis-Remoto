import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  baseUrl : string = environment.baseUrl
  operadores : any
  pacientes : any
  electros : any
  bpms : any
  temps : any
  otros : any


  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getDatos();
  }

  drawChart() {
    const chartOptions: any = {
      chart: {
        type: 'pie',
        renderTo: 'pie-chart'
      },
      title: {
        text: 'Distribución de Registros'
      },
      series: [{
        data: [
          {
            name: 'Electrocardiogramas',
            y: this.electros
          },
          {
            name: 'Temperatura',
            y: this.temps
          },
          {
            name: 'Otros',
            y: this.otros
          }
        ]
      }]
    };
  
    Highcharts.chart('pie-chart', chartOptions);
  }

  drawChart2() {
    const chartOptions: any = {
      chart: {
        type: 'pie',
        renderTo: 'pie2-chart'
      },
      title: {
        text: 'Distribución de Usuarios'
      },
      series: [{
        data: [
          {
            name: 'Operadores',
            y: this.operadores
          },
          {
            name: 'Pacientes',
            y: this.pacientes
          }
        ]
      }]
    };
  
    Highcharts.chart('pie2-chart', chartOptions);
  }

  getDatos() {
    this.http.get(this.baseUrl+'dashboard')
      .subscribe( (data: any) => {
        this.operadores = parseInt(data.rows[0].TotalUsuarios)
        this.pacientes = parseInt(data.rows[0].TotalPacientes)
        this.electros = parseInt(data.rows[0].TotalECG)
        this.bpms = parseInt(data.rows[0].TotalBPM)
        this.temps = parseInt(data.rows[0].TotalTemperatura)
        this.otros = parseInt(data.rows[0].TotalRegistros)
        this.drawChart();
        this.drawChart2();
      });
  }



}
