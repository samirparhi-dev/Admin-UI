import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drug-master',
  templateUrl: './drug-master.component.html',
  styleUrls: ['./drug-master.component.css']
})
export class DrugMasterComponent implements OnInit {

  constructor() { 
   }

  ngOnInit() {
  }

  Activity_Number: any;

  show(value) {
	  this.Activity_Number = value;
  }

  
}
