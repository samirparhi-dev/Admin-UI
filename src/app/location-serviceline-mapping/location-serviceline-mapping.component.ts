import { Component, OnInit } from '@angular/core';
import { LocationServicelineMapping } from "../services/ProviderAdminServices/location-serviceline-mapping.service";
import { dataService } from '../services/dataService/data.service';


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

  constructor(public provider_admin_location_serviceline_mapping: LocationServicelineMapping,
    public commonDataService: dataService) 
  {
    this.serviceProviderID = commonDataService.service_providerID; //pass this value dynamically
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
      "serviceProviderID": this.serviceProviderID.toString(),
      "stateID": this.state,
      "serviceID": "6",
      "providerServiceMapID": this.providerServiceMapID,
      "districtID": this.district,
      "locationName": this.OfficeID,
      "address": requestObject.office_address1 + "," + requestObject.office_address2,
      "createdBy": "Diamond Khanna",
      "createdDate": "2017-07-25T00:00:00.000Z"
    }

    console.log(OBJ,"requestOBJ");

    this.provider_admin_location_serviceline_mapping.addWorkLocation(requestObject)
    .subscribe((response: Response) => this.saveOfficeSuccessHandeler(response));
  }

  editOfficeAddress(toBeEditedOBJ)
  {

    let editedObj=
    {

      "pSAddMapID": toBeEditedOBJ.pSAddMapID,
      "providerServiceMapID": toBeEditedOBJ.ProviderServiceMapID,
      "locationName" : "edited testing",
      "address": "edited testing address",
      "districtID": toBeEditedOBJ.districtID,
      "createdBy": toBeEditedOBJ.CreatedBy,
      "createdDate": "2017-02-22T00:00:00.000Z"

    }

    console.log(editedObj);



    this.provider_admin_location_serviceline_mapping.editWorkLocation(editedObj)
      .subscribe((response: Response) => this.editOfficeSuccessHandeler(response));
  }

  deleteOfficeAddress(id)
  {
    let confirmation = confirm("do you really want to delete the location with psaddmapid:" + id + "??");
    if(confirmation)
    {
      console.log(id);
      this.provider_admin_location_serviceline_mapping.deleteWorkLocation(id)
      .subscribe((response: Response) => this.deleteOfficeSuccessHandeler(response));
    }
    
  }



  saveOfficeSuccessHandeler(response)
  {
    console.log('saved', response);
  }

  deleteOfficeSuccessHandeler(response) {
    console.log('deleted', response);
    this.getAllWorkLocations();
  }

  editOfficeSuccessHandeler(response) {
    console.log('edited', response);
    this.getAllWorkLocations();
  }

  getAllWorkLocations()
  {
    this.provider_admin_location_serviceline_mapping.getWorkLocations()
    .subscribe((response: Response) => this.workLocations= this.successhandeler(response));
  }
}
