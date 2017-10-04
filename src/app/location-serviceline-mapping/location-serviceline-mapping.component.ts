import { Component, OnInit,Inject } from '@angular/core';
import { LocationServicelineMapping } from "../services/ProviderAdminServices/location-serviceline-mapping.service";
import { dataService } from '../services/dataService/data.service';

import { MdDialog, MdDialogRef} from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
declare var jQuery: any;



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

  providerServiceMapIDs: any;

  serviceProviderID: any;
  providerServiceMapID: any;

  search_state:any;
  search_serviceline:any;

  // arrays
  states: any;
  districts: any;
  servicelines:any;

  workLocations: any;

  providerServiceMapID_request_array: any;
  dummyIndexArray: any;
  officeArray: any = [];
  // flags
  showTable: boolean = false;
  showForm: boolean;

  constructor(public provider_admin_location_serviceline_mapping: LocationServicelineMapping,
    public commonDataService: dataService,
    public dialog: MdDialog) 
  {
    this.serviceProviderID = this.commonDataService.service_providerID; //pass this value dynamically
    this.states = [];
    this.districts = [];
    this.servicelines = [];
    this.workLocations = [];

    
    this.showForm = false;
   // this.findLocations();
  }

  ngOnInit() {
    this.provider_admin_location_serviceline_mapping.getStates(this.serviceProviderID)
    .subscribe((response:Response)=>this.states=this.successhandeler(response));

    // this.getAllWorkLocations();
  }

  changeTableFlag(flag_val) {
    if (flag_val === true) {
      // let confirmation = confirm("Do you really want to cancel and go back to main screen?");
      // if (confirmation) {
        // this.showTable = flag_val;
        this.showForm = !flag_val;
       // this.resetFields();
        this.findLocations();
    //  }
    }
    else {
      // this.showTable = !flag_val;
      this.showForm = !flag_val;
    }

  }

  // resetFields() {
  //   // ngmodels
  //   this.state = "";
  //   this.district = "";
  //   this.office_address1 = "";
  //   this.office_address2 = "";
  //   this.OfficeID = "";
  //   this.providerServiceMapIDs = "";


  //   this.search_state="";
  //   this.search_serviceline="";
  // }

  getDistricts(serviceProviderID, stateID) {
    this.provider_admin_location_serviceline_mapping.getDistricts(serviceProviderID, stateID)
      .subscribe((response: Response) =>  this.getDistrictsSuccessHandeler(response));
  }

  getServiceLines(serviceProviderID, stateID) {
    this.provider_admin_location_serviceline_mapping.getServiceLines(serviceProviderID, stateID)
      .subscribe((response: Response) => this.servicesSuccesshandeler(response));
  }
  getServiceLinesfromSearch(serviceProviderID, stateID){
    
    this.search_serviceline = "";
    this.getServiceLines(serviceProviderID, stateID);
    this.findLocations();
  }

//  CRUD functionalities

  findLocations()
  {

    let reqOBJ = { "serviceProviderID":this.serviceProviderID };
    if(this.search_serviceline != "")
    {
      reqOBJ["stateID"] = this.search_state? this.search_state:'';
      reqOBJ["serviceID"] = this.search_serviceline? this.search_serviceline:'';
      console.log(reqOBJ);

      this.provider_admin_location_serviceline_mapping.getWorkLocations(reqOBJ).subscribe(
        (response: Response) => this.findLocationsSuccesshandeler(response)
        );
    }
    else {
      reqOBJ["stateID"] = this.search_state? this.search_state:'';
      console.log(reqOBJ);

      this.provider_admin_location_serviceline_mapping.getWorkLocationsOnState(reqOBJ).subscribe(
        (response: Response) => this.findLocationsSuccesshandeler(response)
        );

    }
    this.showTable = true;
  }

  saveOfficeAddress(requestObject) {
    // console.log(requestObject);
    let OBJ = {
      "serviceProviderID": this.serviceProviderID,
      "stateID": this.state,
      "serviceID": this.providerServiceMapIDs,
      // "providerServiceMapID": this.providerServiceMapID,
      "districtID": this.district,
      "locationName": this.OfficeID,
      "address": this.office_address1 + "," + this.office_address2,
      "createdBy": "Diamond Khanna",
      "createdDate": "2017-07-31T00:00:00.000Z"
    }

    // for (let i = 0; i < this.serviceLine.length;i++)
    // {
    //   this.providerServiceMapID_request_array.push(this.serviceLine.)
    // }

    let newreqobj = {
      "serviceProviderID": this.serviceProviderID,
      "stateID": this.state,
      // "serviceID": "6",
      "providerServiceMapID": this.providerServiceMapIDs,
      "districtID": this.district,
      "locationName": this.OfficeID,
      "address": this.office_address1 + "," + this.office_address2,
      "createdBy": "Diamond Khanna",
      "createdDate": "2017-07-31T00:00:00.000Z"
    }


    console.log(OBJ, "requestOBJ");
    console.log(newreqobj, "new requestOBJ");

    this.provider_admin_location_serviceline_mapping.addWorkLocation(newreqobj)
    .subscribe((response: Response) => this.saveOfficeSuccessHandeler(response));
  }

  editOfficeAddress(toBeEditedOBJ) {
    let dialog_Ref = this.dialog.open(EditLocationModal, {
      height: '500px',
      width: '500px',
      data: toBeEditedOBJ
    });

    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.findLocations();
      }

    });

  }

  deleteOfficeAddress(id) {
    let confirmation = confirm("do you really want to delete the location with psaddmapid:" + id + "??");
    if (confirmation) {
      console.log(id);
      this.provider_admin_location_serviceline_mapping.deleteWorkLocation(id)
        .subscribe((response: Response) => this.deleteOfficeSuccessHandeler(response));
    }
  }

 // handeler functions

  successhandeler(response)
  {
    console.log(response, "successful response");
    return response;
  }

  findLocationsSuccesshandeler(response) {
    console.log(response, "get locations success");
    this.workLocations = response;
    // this.showTable = true;
  }

  getDistrictsSuccessHandeler(response)
  {
    console.log(response, "districts");
    this.districts =response;
  }

  servicesSuccesshandeler(response) {
    console.log(response, "services");
    this.servicelines = response;
    if(response.length>0)
    {
      this.providerServiceMapID = response[0].providerServiceMapID;
    }
    
  }

  saveOfficeSuccessHandeler(response) {
    alert("location successfully created");
    console.log('saved', response);
    // this.showTable = false;
    this.showForm = false;
  //  this.resetFields();
    jQuery('#locationForm').trigger("reset");
    this.findLocations();
  }

  deleteOfficeSuccessHandeler(response) {
    console.log('deleted', response);
    this.findLocations();
  }
  clear() {
    this.search_serviceline = "";
    this.search_state = "";
    this.showTable = false;
    this.workLocations = [];

  }
  servicelineSelected(obj) {
    this.OfficeID = "";
    this.officeNameExist =false;
    this.provider_admin_location_serviceline_mapping.getWorklocationOnProviderArray(obj)
      .subscribe((response: Response) => this.currentServicesSuccess(response));
  }
  currentServicesSuccess(res) {
     this.officeArray = res;
  }
   officeNameExist: boolean = false;
   msg: any;
  checkOfficeName(value) {

    for(var i=0; i<this.officeArray.length; i++) {
       let a = this.officeArray[i].locationName;
       if(a.toLowerCase() == value.toLowerCase()) {
         this.officeNameExist = true;
         this.msg = "OfficeName exist for "+this.officeArray[i].serviceName+", deselect "+this.officeArray[i].serviceName;
         break;
       }
       else {
         this.officeNameExist = false;
       }
    }
  }
  
}


@Component({
  selector: 'editLocationModalWindow',
  templateUrl: './editLocationModal.html',
})
export class EditLocationModal {

  // modal windows ngmodels 
  serviceProviderName:any;
  stateName:any;
  districtName:any;
  address:any;
  officeID:any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
  public provider_admin_location_serviceline_mapping: LocationServicelineMapping,
  public dialog_Ref: MdDialogRef<EditLocationModal>) { }
  
  ngOnInit() {

    console.log(this.data, "modal content");

    this.serviceProviderName = this.data.serviceProviderName;
    this.stateName = this.data.stateName;
    this.districtName=this.data.districtName;
    this.address = this.data.address;
    this.officeID = this.data.locationName;
  }


  update()
  {
    let editedObj =
      {

        "pSAddMapID": this.data.pSAddMapID,
        "providerServiceMapID": this.data.providerServiceMapID,
        "locationName": this.officeID,
        "address": this.address,
        "districtID": this.data.districtID,
        "createdBy": this.data.CreatedBy,
        "createdDate": "2017-02-28T00:00:00.000Z"

      }

    console.log(editedObj, "edit rwq obj in modal");

    this.provider_admin_location_serviceline_mapping.editWorkLocation(editedObj)
      .subscribe((response: Response) => this.editOfficeSuccessHandeler(response));

  }

  editOfficeSuccessHandeler(response) {
    console.log('edited', response);
    this.dialog_Ref.close("success");
  }



}

