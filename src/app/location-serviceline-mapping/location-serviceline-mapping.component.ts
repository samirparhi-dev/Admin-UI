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
  providerServiceMapID: any;

  // arrays
  states: any;
  districts: any;
  servicelines:any;

  workLocations: any;

  // flags
  showTable: boolean;

  constructor(public provider_admin_location_serviceline_mapping: LocationServicelineMapping) {
    this.serviceProviderID = "1"; //pass this value dynamically
    this.states = [];
    this.districts = [];
    this.servicelines = [];
    this.workLocations = [];

    this.showTable = true;
   }

  ngOnInit() {
    this.provider_admin_location_serviceline_mapping.getStates(this.serviceProviderID)
      .subscribe((response:Response)=>this.states=this.successhandeler(response));

    this.getAllWorkLocations();
  }

  resetFields()
  {
    // ngmodels
    this.state="";
    this.district="";
    this.office_address1="";
    this.office_address2="";
    this.OfficeID="";
    this.serviceLine="";

    this.serviceProviderID="";
    this.providerServiceMapID="";

    // arrays
    this.states=[];
    this.districts=[];
    this.servicelines=[];
  }

  changeTableFlag(flag_val)
  {
    if (flag_val===true)
    {
      let confirmation = confirm("Do you really want to cancel and go back to main screen?");
      if(confirmation)
      {
        this.showTable = flag_val;
        this.resetFields();
      }
    }
    else
    {
      this.showTable = flag_val;
    }
    
  }

  getDistricts(serviceProviderID,stateID)
  {
    this.provider_admin_location_serviceline_mapping.getDistricts(serviceProviderID, stateID)
      .subscribe((response: Response) => this.districts = this.successhandeler(response));
  }
  getServiceLines(serviceProviderID, stateID) {
    this.provider_admin_location_serviceline_mapping.getServiceLines(serviceProviderID, stateID)
      .subscribe((response: Response) => this.servicesSuccesshandeler(response));
  }

  successhandeler(response)
  {
    console.log(response, "-- loc-sermapping TS");
    return response;
  }
  servicesSuccesshandeler(response)
  {
    this.servicelines = response;
    this.providerServiceMapID = response[0].providerServiceMapID;
  }

  saveOfficeAddress(requestObject) {
    console.log(requestObject);
    let OBJ = {
      "serviceProviderID": this.serviceProviderID,
      "stateID": this.state,
      "serviceID": "6",
      "providerServiceMapID": this.providerServiceMapID,
      "districtID": this.district,
      "address": requestObject.office_address1 + "," + requestObject.office_address2,
      "createdBy": "Diamond Khanna",
      "createdDate": "2017-07-25T00:00:00.000Z"
    }

    this.provider_admin_location_serviceline_mapping.addWorkLocation(requestObject)
      .subscribe((response: Response) => this.saveOfficeSuccessHandeler(response));
  }

  editOfficeAddress(val)
  {

  }

  deleteOfficeAddress(id)
  {

  }

  saveOfficeSuccessHandeler(response)
  {
    console.log('saved', response);
  }

  getAllWorkLocations()
  {
    this.provider_admin_location_serviceline_mapping.getWorkLocations()
      .subscribe((response: Response) => this.workLocations= this.successhandeler(response));
  }
}
