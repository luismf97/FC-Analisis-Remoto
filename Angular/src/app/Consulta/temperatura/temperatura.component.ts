import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-temperatura',
  templateUrl: './temperatura.component.html',
  styleUrls: ['./temperatura.component.css']
})
export class TemperaturaComponent implements OnInit {

  baseUrl : string = environment.baseUrl
  registros : any

  dataSocket: any[] = []

  jsonData : any

  mockCsvData!: string;
  mockHeaders = `Value`
  fileTitle = 'export-result';

  constructor(private http: HttpClient,
              private fb: FormBuilder,) { }

  ngOnInit() {
    this.getRegistros();
  }

  getRegistros() {
    this.http.get(this.baseUrl+'registrosTemp')
      .subscribe( (data: any) => {
      this.registros = data.rows
      });
  }

  borrarRegistro(id){
    this.http.post<any>(this.baseUrl+'borrarRegistroTemp', { id: id}).subscribe(data => {
        if(data.ok == true){
          this.registros = []
          this.getRegistros();
          Swal.fire(
            'Borrado',
            'El registro ha sido borrado',
            'success'
          )
        } else{
          Swal.fire('Oops...', 'Algo salio mal', 'error')
      }
  }, err => {
    Swal.fire('Oops...', 'Algo salio mal', 'error')
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

borrar(id){
  Swal.fire({
    title: '¿Estas seguro?',
    text: 'Estas a punto de borrar un registro',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, borrar',
    cancelButtonText: 'No, cancelar'
  }).then((result) => {
    if (result.value) {
      this.borrarRegistro(id);
    // For more information about handling dismissals please visit
    // https://sweetalert2.github.io/#handling-dismissals
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelado',
        'El registro no se borro',
        'error'
      )
    }
  })
}

formatToCsvData(datos) {  
  const jsonObject = datos
  this.jsonData = jsonObject
  const csv = this.convertToCSV(jsonObject);
  this.mockCsvData = csv;
}

download(datos) {
  this.formatToCsvData(datos)
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

}
