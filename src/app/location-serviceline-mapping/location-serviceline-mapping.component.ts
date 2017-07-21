import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-serviceline-mapping',
  templateUrl: './location-serviceline-mapping.component.html',
  styleUrls: ['./location-serviceline-mapping.component.css']
})
export class LocationServicelineMappingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  saveVal(val)
  {
	  console.log(val);
  }
}
