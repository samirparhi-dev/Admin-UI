import { Component, OnInit,Inject } from '@angular/core';
import { LocationServicelineMapping } from "../services/ProviderAdminServices/location-serviceline-mapping.service";
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
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

  providerServiceMapIDs: any=[];

  serviceProviderID: any;
  providerServiceMapID: any;

  PSMID_searchService:any;
  service_ID:any;

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
    public dialog: MdDialog, private alertService: ConfirmationDialogsService) 
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
    .subscribe(response=>this.states=this.successhandeler(response));

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
      this.state=this.search_state;
      this.getDistricts(this.serviceProviderID,this.state);

      this.providerServiceMapIDs=[];
      if(this.PSMID_searchService!=null && this.PSMID_searchService!=undefined && this.PSMID_searchService!="")
      {
        this.providerServiceMapIDs.push(this.PSMID_searchService);
      }
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

  setPSMID(psmID)
  {
    this.PSMID_searchService=psmID;
  }

  setSL(serviceID)
  {
    this.service_ID=serviceID;
  }

  getDistricts(serviceProviderID, stateID) {
    this.provider_admin_location_serviceline_mapping.getDistricts(serviceProviderID, stateID)
      .subscribe(response =>  this.getDistrictsSuccessHandeler(response));
  }

  getServiceLines(serviceProviderID, stateID) {
    this.provider_admin_location_serviceline_mapping.getServiceLines(serviceProviderID, stateID)
      .subscribe(response => this.servicesSuccesshandeler(response));
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
        response => this.findLocationsSuccesshandeler(response)
        );
    }
    else {
      reqOBJ["stateID"] = this.search_state? this.search_state:'';
      console.log(reqOBJ);

      this.provider_admin_location_serviceline_mapping.getWorkLocationsOnState(reqOBJ).subscribe(
        response => this.findLocationsSuccesshandeler(response)
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
    .subscribe(response => this.saveOfficeSuccessHandeler(response));
  }

  editOfficeAddress(toBeEditedOBJ) {
    let OBJ={
      "toBeEditedOBJ":toBeEditedOBJ,
      "offices":this.officeArray
    }
    let dialog_Ref = this.dialog.open(EditLocationModal, {
      height: '500px',
      width: '500px',
      data: OBJ
    });

    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.findLocations();
      }

    });

  }
  confirmMessage : any;
  activeDeactivate(id,flag) {
    let obj = {
      "pSAddMapID": id,
      "deleted": flag
    }
    console.log(obj);

      if (flag) {
        this.confirmMessage = 'Deactivate';
      } else {
        this.confirmMessage = 'Activate';
      }
    // let confirmation = confirm("do you really want to delete the location with psaddmapid:" + id + "??");
    this.alertService.confirm("Are you sure want to "+this.confirmMessage+"?").subscribe((res)=>{
      if (res) {
        console.log(id);

        this.provider_admin_location_serviceline_mapping.deleteWorkLocation(obj)
          .subscribe(response => this.deleteOfficeSuccessHandeler(response));

      }
    },
    (err)=>{
      console.log(err);
    })
  }

 // handeler functions

  successhandeler(response)
  {
    console.log(response, "successful response");
    return response;
  }

  findLocationsSuccesshandeler(response) {
    console.log(response, "get locations success");
    ;
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
      this.providerServiceMapIDs=[];
      this.providerServiceMapID = response[0].providerServiceMapID;
    }
    
  }

  saveOfficeSuccessHandeler(response) {
    // alert("location successfully created");
    this.alertService.alert("Location created successfully");
    console.log('saved', response);
    // this.showTable = false;
    this.showForm = false;
  //  this.resetFields();
  this.search_state=this.state;
  // this.search_serviceline=this.service_ID; we can use this also if we want to find for specific
  this.search_serviceline="";
    jQuery('#locationForm').trigger("reset");

    this.findLocations();
  }

  deleteOfficeSuccessHandeler(response) {
    this.alertService.alert(this.confirmMessage+"d successfully");
    console.log('deleted', response);
    this.findLocations();
  }
  clear() {
    jQuery("#searchForm").trigger("reset");
    // this.search_serviceline = "";
    // this.search_state = "";
    this.showTable = false;
    this.workLocations = [];
    this.servicelines = [];
    this.PSMID_searchService="";

  }

  servicelineSelected(array) {
    let req_array=[];
    if(array.constructor != Array)
    {
      req_array.push(array);
    }
    else
    {
      req_array=array;
    }
    this.OfficeID = "";
    this.officeNameExist =false;
    this.provider_admin_location_serviceline_mapping.getWorklocationOnProviderArray(req_array)
      .subscribe(response => this.currentServicesSuccess(response));
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

  originalOfficeID:any;
  officeNameExist:boolean=true;
  msg:any="";

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
  public provider_admin_location_serviceline_mapping: LocationServicelineMapping,
  public dialog_Ref: MdDialogRef<EditLocationModal>,
  private alertService: ConfirmationDialogsService) { }
  
  ngOnInit() {

    console.log(this.data, "modal content");

    this.serviceProviderName = this.data.toBeEditedOBJ.serviceProviderName;
    this.stateName = this.data.toBeEditedOBJ.stateName;
    this.districtName=this.data.toBeEditedOBJ.districtName;
    this.address = this.data.toBeEditedOBJ.address;
    this.officeID = this.data.toBeEditedOBJ.locationName;

    this.originalOfficeID=this.data.toBeEditedOBJ.locationName;
  }

  checkOfficeName(value) {

    for(var i=0; i<this.data.offices.length; i++) {
       let a = this.data.offices[i].locationName;
       if(a.toLowerCase() == value.toLowerCase() && this.originalOfficeID.toLowerCase()!=a.toLowerCase() ) {
         this.officeNameExist = true;
         this.msg = "OfficeName exist for "+this.data.offices[i].serviceName;
         break;
       }
       else {
         this.officeNameExist = false;
       }
    }
  }


  update()
  {
    let editedObj =
      {

        "pSAddMapID": this.data.toBeEditedOBJ.pSAddMapID,
        "providerServiceMapID": this.data.providerServiceMapID,
        "locationName": this.officeID,
        "address": this.address,
        "districtID": this.data.toBeEditedOBJ.districtID,
        "createdBy": this.data.toBeEditedOBJ.CreatedBy,
        "createdDate": "2017-02-28T00:00:00.000Z"

      }

    console.log(editedObj, "edit rwq obj in modal");

    this.provider_admin_location_serviceline_mapping.editWorkLocation(editedObj)
      .subscribe(response => this.editOfficeSuccessHandeler(response));

  }

  editOfficeSuccessHandeler(response) {
    this.alertService.alert("Location edited successfully");
    console.log('edited', response);
    this.dialog_Ref.close("success");
  }



}

