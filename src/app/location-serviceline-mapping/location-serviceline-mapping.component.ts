import { Component, OnInit } from '@angular/core';
import { LocationServicelineMapping } from "../services/ProviderAdminServices/location-serviceline-mapping.service";

@Component({
  selector: 'app-location-serviceline-mapping',
  templateUrl: './location-serviceline-mapping.component.html',
  styleUrls: ['./location-serviceline-mapping.component.css']
})
export class LocationServicelineMappingComponent implements OnInit {

  // ngModels
  state:any;
  district:any;
  office_address1:any;
  office_address2:any;
  OfficeID:any;
  serviceLine:any;

  serviceProviderID: any;

  // arrays
  states: any;
  districts: any;
  servicelines:any;

  // flags

  constructor(public provider_admin_location_serviceline_mapping: LocationServicelineMapping) {
    this.serviceProviderID = "1"; //pass this value dynamically
    this.states = [];
    this.districts = [];
    this.servicelines = [];
   }

  ngOnInit() {
    this.provider_admin_location_serviceline_mapping.getStates(this.serviceProviderID)
      .map((response:Response)=>this.states=this.successhandeler(response));
  }

  saveVal(val)
  {
    console.log(val);
  }

  getDistricts(serviceProviderID,stateID)
  {
    this.provider_admin_location_serviceline_mapping.getDistricts(serviceProviderID, stateID)
      .map((response: Response) => this.districts = this.successhandeler(response));
  }
  getServiceLines(serviceProviderID, stateID) {
    this.provider_admin_location_serviceline_mapping.getServiceLines(serviceProviderID, stateID)
      .map((response: Response) => this.servicelines = this.successhandeler(response));
  }

  successhandeler(response)
  {
    console.log(response, "-- loc-sermapping TS");
    return response;
  }
}
