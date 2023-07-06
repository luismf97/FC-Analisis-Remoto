import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {

  verEcgsFlag : boolean = false;
  verBpmsFlag : boolean = false;
  verTempFlag : boolean = false;
  verOtrosFlag : boolean = false;


  constructor() { }

  ngOnInit() {
  }

  verEcgs(){
    this.verEcgsFlag = true;
    this.verBpmsFlag = false;
    this.verTempFlag = false;
    this.verOtrosFlag = false;
  }

  verBpms(){
    this.verEcgsFlag = false;
    this.verBpmsFlag = true;
    this.verTempFlag = false;
    this.verOtrosFlag = false;
  }

  verTemp(){
    this.verEcgsFlag = false;
    this.verBpmsFlag = false;
    this.verTempFlag = true;
    this.verOtrosFlag = false;
  }

  verOtros(){
    this.verEcgsFlag = false;
    this.verBpmsFlag = false;
    this.verTempFlag = false;
    this.verOtrosFlag = true;
  }


}
