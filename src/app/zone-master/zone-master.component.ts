import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-zone-master',
  templateUrl: './zone-master.component.html'
})
export class ZoneMasterComponent implements OnInit {
    constructor() { 
   }

  ngOnInit() {
  }

  Activity_Number: any;

  show(value) {
	  this.Activity_Number = value;
  }
}
