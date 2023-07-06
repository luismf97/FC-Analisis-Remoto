import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../services/websocket.service';
import { Chart } from 'angular-highcharts';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidarService } from 'src/app/services/validar.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.css']
})
export class TempComponent implements OnInit {

  baseUrl : string = environment.baseUrl
  dataSocket: any[] = []
  conectado : string
  mockCsvData!: string;
  mockHeaders = `Value`
  fileTitle = 'registro-temp';
  pacientes : any
  hora = []
  usuario : any
  tipoRol : any

  jsonData : any

  miFormulario: FormGroup = this.fb.group({
    pacienteId: ["", Validators.required]
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
      text: 'Temperatura en Tiempo Real'
    },
    xAxis: {
      type: 'datetime',
      categories: this.hora
  },
    yAxis: {
      title: {
        text: 'Temperatura °C'
      }
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Temp - WebSockets',
        type: "line",
        data: [],
        color: "blue",
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
    this.getPacientes();
    this.getTipoRol();
  }

  getTipoRol(){
    this.tipoRol = this.ValidarService.tipoRol()
    this.usuario = this.ValidarService.usuarioId();
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

  getPacientes() {
    this.http.get(this.baseUrl+'pacientes')
      .subscribe( (data: any) => {
      this.pacientes = data.rows
      });
  }

  

  detener() {
    this.http.get(this.baseUrl+'detener')
      .subscribe( (data: any) => console.log("detener") );
  }

  iniciar() {
    this.http.get(this.baseUrl+'iniciarTemp')
      .subscribe( (data: any) => console.log("iniciar") );
  }

  escucharSocket() {
    this.wsService.listen('data_temp').subscribe( (data: any) => {
        let datos = data.now
        if (datos == null){
          //console.log("DatosNull")
        } else{
          this.chart.addPoint(datos); 
          this.dataSocket = [...this.dataSocket, ...datos]
          let date = new Date()
          this.hora.push(date)
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
      value: 'LECTURA',
      date: 'Hora'
  });
    this.dataSocket.forEach((item, index) => {
      itemsFormatted.push({
          value: item,
          date: this.hora[index]
      });
    });    
    const jsonObject = JSON.stringify(itemsFormatted);
    this.jsonData = jsonObject
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

  guardarData(){
    const {pacienteId} = this.miFormulario.value;
    this.formatToCsvData()
    this.http.post<any>(this.baseUrl+'guardarTemp', { medico: this.usuario ,paciente: pacienteId, datos: this.jsonData }).subscribe(data => {
        if(data.ok == true){
          Swal.fire(
            'Guardado',
            'El registro ha sido guardado correctamente',
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
