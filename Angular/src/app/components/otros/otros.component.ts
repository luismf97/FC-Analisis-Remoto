import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../services/websocket.service';
import { Chart } from 'angular-highcharts';
import * as Highcharts from "highcharts";
import ExportingModule from 'highcharts/modules/exporting';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidarService } from 'src/app/services/validar.service';
import Swal from 'sweetalert2'
ExportingModule(Highcharts);
@Component({
  selector: 'app-otros',
  templateUrl: './otros.component.html',
  styleUrls: ['./otros.component.css']
})
export class OtrosComponent implements OnInit {

  baseUrl : string = environment.baseUrl
  dataSocket: any[] = []
  conectado : string
  mockCsvData!: string;
  mockHeaders = `Value`
  fileTitle = 'registro-ecg';
  pacientes : any

  usuario : any
  tipoRol : any

  configurado : boolean = true

  miFormulario: FormGroup = this.fb.group({
    datosPorPaquete: [1],
    numeroPaquetes: [1],
    frecuencia: [1]
  });

  miFormulario2: FormGroup = this.fb.group({
    pacienteId: ["", Validators.required],
    tipo: ["", Validators.required]
  });

  public lineChartData: Array<any> = [
    { data: [ 1, 2, 3, 4 ]}
  ];

  public lineChartLabels: Array<any> = [1,2,3,4];

  chart = new Chart({
    chart: {
      type: 'line',
      
    },
    title: {
      text: 'Grafica en Tiempo Real'
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'ECG - WebSockets',
        type: "line",
        data: [],
        color: "red",
      }
    ]
  });


  constructor(
    private http: HttpClient,
    public wsService: WebsocketService,
    private fb: FormBuilder,
    private ValidarService: ValidarService
  ) { }

  ngOnInit() {
    this.getConectado();
    this.escucharSocket();
    this.escucharClientes(); 
    this.getTipoRol();
    this.getPacientes();
  }

  getConectado() {
    this.http.get('https://ecg-server.herokuapp.com/usuarios/detalle')
      .subscribe( (data: any) => {
      if(data.clientes == undefined){
        this.conectado = "desconectado"
      } else{
        this.conectado = "conectado"
      }}
       );
  }
 

  detener() {
    this.http.get(this.baseUrl+'detener')
      .subscribe( (data: any) => console.log("detener") 
      );
  }

  iniciar() {
    this.http.get(this.baseUrl+'otros')
      .subscribe( (data: any) => console.log("iniciar") );
  }

  escucharSocket() {
    this.wsService.listen('data').subscribe( (data: any) => {
      console.log(data)
      for (const propiedad in data) {
        if (data.hasOwnProperty(propiedad)) {
          const valor = data[propiedad];
          let arr = valor.split(',').map((element: any) => {
            return Number(element);
          });
          arr.pop();
          this.chart.addPoint(arr[0]); 
          this.dataSocket = [...this.dataSocket, ...arr]
        }
      }            
      });
  }

  escucharClientes() {
    this.wsService.listen('usuarios-activos').subscribe( (data: any) => {
        if (data.length == 0 ){
          this.conectado = "desconectado"
        } else {
          this.conectado = "conectado"
        }
      });
  }

  convertToCSV(objArray:any) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

  formatToCsvData() {
    let itemsFormatted:any = [];
    itemsFormatted.push({
      value: 'LECTURA'
  });
    this.dataSocket.forEach((item) => {
      itemsFormatted.push({
          value: item
      });
    });
    const jsonObject = JSON.stringify(itemsFormatted);
    const csv = this.convertToCSV(jsonObject);
    this.mockCsvData = csv;
  }

  download() {
    this.formatToCsvData()
    const exportedFilenmae = this.fileTitle + '.csv';

    const blob = new Blob([this.mockCsvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', exportedFilenmae);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
  }

  getTipoRol(){
    this.tipoRol = this.ValidarService.tipoRol()
    this.usuario = this.ValidarService.usuarioId();
  }

  guardarData(){
    const {pacienteId} = this.miFormulario2.value;
    this.http.post<any>(this.baseUrl+'guardarRegistro', {medico: this.usuario, paciente: pacienteId, datos: this.dataSocket, tipo: "Otros" }).subscribe(data => { 
      if(data.ok == true){
          Swal.fire(
            'Guardado',
            'El registro ha sido guardado correctamente',
            'success'
          )
        } else{
          Swal.fire('Oops...', 'Algo salio mal', 'error');
          console.log(data)
      }
  }, err => {
    Swal.fire('Oops...', 'Algo salio mal', 'error')
  });
  }

  configurar(){
    const {datosPorPaquete} = this.miFormulario.value;    
    const {numeroPaquetes} = this.miFormulario.value; 
    const {frecuencia} = this.miFormulario.value; 
    this.http.post<any>(this.baseUrl+'otroRegistroConf', {datosPorPaquete, numeroPaquetes, frecuencia}).subscribe(data => {
      if(data.ok == true){
        Swal.fire(
          'Configurado',
          'Los parametros fueron configurados',
          'success'
        )
      } else{
        Swal.fire('Oops...', 'Algo salio mal', 'error')
    }
}, err => {
  Swal.fire('Oops...', 'Algo salio mal', 'error')
});
    this.configurado = false
  }

  getPacientes() {
    this.http.get(this.baseUrl+'pacientes')
      .subscribe( (data: any) => {
      this.pacientes = data.rows
      });
  }

}
