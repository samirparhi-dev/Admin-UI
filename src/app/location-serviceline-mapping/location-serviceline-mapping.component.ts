import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-serviceline-mapping',
  templateUrl: './location-serviceline-mapping.component.html',
  styleUrls: ['./location-serviceline-mapping.component.css']
})
export class LocationServicelineMappingComponent implements OnInit {


  state:any;
  district:any;
  office_address1:any;
  office_address2:any;
  OfficeID:any;
  serviceLine:any;

  constructor() { }

  ngOnInit() {
  }

  saveVal(val)
  {
	  console.log(val);
  }
}
