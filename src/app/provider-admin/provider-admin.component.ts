import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provider-admin',
  templateUrl: './provider-admin.component.html',
  styleUrls: ['./provider-admin.component.css']
})
export class ProviderAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  Activity_Number: any;

  show(value) {
	  this.Activity_Number = value;
  }

}
