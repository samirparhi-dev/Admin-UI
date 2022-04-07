import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocationServicelineMapping } from '../services/ProviderAdminServices/location-serviceline-mapping.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
declare var jQuery: any;



@Component({
  selector: 'app-location-serviceline-mapping',
  templateUrl: './location-serviceline-mapping.component.html',
  styleUrls: ['./location-serviceline-mapping.component.css']
})
export class LocationServicelineMappingComponent implements OnInit {

  filteredworkLocations: any = [];
  userID: any;

  // ngModels
  state: any;
  district: any;
  office_address1: any;
  office_address2: any;
  OfficeID: any;

  providerServiceMapIDs: any = [];

  serviceProviderID: any;
  providerServiceMapID: any;

  PSMID_searchService: any;
  service_ID: any;

  search_state: any;
  search_serviceline: any;
  service_id: any;

  // arrays
  states: any;
  districts: any;
  servicelines: any;

  workLocations: any;

  providerServiceMapID_request_array: any;
  dummyIndexArray: any;
  officeArray: any = [];
  // flags
  showTable: boolean = false;
  showForm: boolean;
  nationalFlag: any;
  disableSelection: boolean = false;

  @ViewChild('f') form: NgForm;
  constructor(public provider_admin_location_serviceline_mapping: LocationServicelineMapping,
    public commonDataService: dataService,
    public dialog: MdDialog, private alertService: ConfirmationDialogsService) {
    this.userID = this.commonDataService.uid;
    this.serviceProviderID = this.commonDataService.service_providerID; //pass this value dynamically
    this.states = [];
    this.districts = [];
    this.servicelines = [];
    this.workLocations = [];
    this.filteredworkLocations = [];

    console.log('USER ID IS', this.userID);
    this.showForm = false;


  }

  ngOnInit() {
    // this.provider_admin_location_serviceline_mapping.getStates(this.serviceProviderID)
    //   .subscribe(response => this.states = this.successhandeler(response));

    this.provider_admin_location_serviceline_mapping.getServiceLinesNew(this.userID)
      .subscribe(response => this.servicesSuccesshandeler(response), err => {
        console.log('ERROR WHILE FETCHING SERVICES', err);
        // this.alertService.alert(err, 'error');
      });

    // this.getAllWorkLocations();
  }

  last_searchServiceobj: any;
  saveSearchServicelineObj(obj) {
    this.last_searchServiceobj = obj;
  }

  changeTableFlag(flag_val) {
    if (flag_val === true) {
      // let confirmation = confirm("Do you really want to cancel and go back to main screen?");
      // if (confirmation) {
      // this.showTable = flag_val;
      this.showForm = !flag_val;
      this.showTable = flag_val;
      this.disableSelection = false;
      // this.resetFields();
      this.findLocations(this.search_state.stateID, this.search_serviceline.serviceID);
      //  }
    }
    else {
      // this.showTable = !flag_val;
      this.disableSelection = true;
      this.showTable = flag_val;
      this.showForm = !flag_val;
      this.service_id = this.search_serviceline.serviceID;
      this.state = this.search_state;
      if (!this.nationalFlag) {
        this.getDistricts(this.serviceProviderID, this.search_state.stateID);
      }
      this.providerServiceMapIDs = [];
      if (this.PSMID_searchService != null && this.PSMID_searchService != undefined && this.PSMID_searchService != "") {
        this.providerServiceMapIDs.push(this.PSMID_searchService);
      }
    }
  }
  back(flag_val) {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.form.resetForm();
        this.changeTableFlag(flag_val);
      }
    })
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

  getStates(value) {
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.provider_admin_location_serviceline_mapping.getStatesNew(obj).
      subscribe(response => this.getStatesSuccessHandeler(response, value), (err) => {
        console.log("error in fetching states");
        // this.alertService.alert(err, 'error');
      });

  }
  getStatesSuccessHandeler(response, value) {
    this.search_state = "";
    this.states = response;
    this.workLocations = [];
    this.filteredworkLocations = [];
    if (value.isNational) {
      this.nationalFlag = value.isNational;
      this.setPSMID(response[0].providerServiceMapID);
      this.findLocations(undefined, this.search_serviceline.serviceID);

    }
    else {
      this.nationalFlag = value.isNational;
      //  this.showTable = false;
    }
  }
  setPSMID(psmID) {
    this.PSMID_searchService = psmID;
    console.log('PSM ID SET HO GAYI HAI BHAAAI', this.PSMID_searchService);
  }

  // setIsNational(value) {
  //   this.isNational = value;
  //   if (value) {
  //     this.state = '';
  //     this.district = '';
  //   }
  // }

  setSL(serviceID) {
    this.service_ID = serviceID;
  }

  getDistricts(serviceProviderID, stateID) {
    this.provider_admin_location_serviceline_mapping.getDistricts(serviceProviderID, stateID)
      .subscribe(response => this.getDistrictsSuccessHandeler(response),
        (err) => {
          console.log("error", err);
          //this.alertService.alert(err, 'error')
        });
  }

  getServiceLines(serviceProviderID, stateID) {
    this.provider_admin_location_serviceline_mapping.getServiceLines(serviceProviderID, stateID)
      .subscribe(response => this.servicesSuccesshandeler(response),
        (err) => {
          console.log("error", err);
          //this.alertService.alert(err, 'error')
        });
  }
  getServiceLinesfromSearch(serviceProviderID, stateID) {

    this.search_serviceline = "";
    this.getServiceLines(serviceProviderID, stateID);
    this.findLocations(this.search_state.stateID, this.search_serviceline.serviceID);
  }

  //  CRUD functionalities

  findLocations(stateID, serviceID) {


    let reqOBJ = {
      'serviceProviderID': this.serviceProviderID,
      'stateID': stateID,
      'serviceID': serviceID,
      'isNational': this.nationalFlag
    }

    this.provider_admin_location_serviceline_mapping.getWorkLocations(reqOBJ).subscribe(
      response => {
        this.showTable = true;
        this.findLocationsSuccesshandeler(response)
      },
      (err) => {
        console.log("error", err);
        //this.alertService.alert(err, 'error')
      });
  }

  saveOfficeAddress(requestObject) {
    // console.log(requestObject);
    let OBJ = {
      "serviceProviderID": this.serviceProviderID,
      "stateID": this.state,
      "serviceID": this.providerServiceMapIDs,
      // "providerServiceMapID": this.providerServiceMapID,
      "districtID": this.district,
      "locationName": this.OfficeID ? this.OfficeID.trim() : null, 
      "address": this.office_address1.trim() + "," + this.office_address2.trim(),
      "createdBy": this.commonDataService.uname
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
      "locationName": this.OfficeID.trim(),
      "address": this.office_address1.trim() + "," + this.office_address2.trim(),
      "createdBy": this.commonDataService.uname
    }
    let count = 0;
    if (newreqobj.stateID === "") {
      for (let a = 0; a < this.workLocations.length; a++) {
        if (this.workLocations[a].locationName === newreqobj.locationName
          && this.workLocations[a].address === newreqobj.address
          && this.workLocations[a].providerServiceMapID === newreqobj.providerServiceMapID[0]) {
          count = count + 1;
        }
      }
    }
    else {
      for (let a = 0; a < this.workLocations.length; a++) {
        if (this.workLocations[a].locationName === newreqobj.locationName
          && this.workLocations[a].districtID === parseInt(newreqobj.districtID)
          && this.workLocations[a].address === newreqobj.address
          && this.workLocations[a].providerServiceMapID === newreqobj.providerServiceMapID[0]) {
          count = count + 1;
        }
      }
    }

    console.log(OBJ, "requestOBJ");
    console.log(newreqobj, "new requestOBJ");
    if (count == 0) {
      this.provider_admin_location_serviceline_mapping.addWorkLocation(newreqobj)
        .subscribe(response => this.saveOfficeSuccessHandeler(response),
          (err) => {
            console.log("error", err);
            //this.alertService.alert(err, 'error')
          });
    }
    else {
      this.alertService.alert("Already exists");
    }
  }

  editOfficeAddress(toBeEditedOBJ) {
    let OBJ = {
      "toBeEditedOBJ": toBeEditedOBJ,
      "offices": this.workLocations
    }
    let dialog_Ref = this.dialog.open(EditLocationModal, {
      width: '500px',
      data: OBJ
    });

    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.findLocations(this.search_state.stateID, this.search_serviceline.serviceID);
      }

    });

  }
  confirmMessage : any;
  activeDeactivate(id, flag) {
    let obj = {
      "pSAddMapID": id,
      "deleted": flag
    }
    console.log(obj);

    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    // let confirmation = confirm("do you really want to delete the location with psaddmapid:" + id + "??");
    this.alertService.confirm('Confirm', "Are you sure want to " + this.confirmMessage + "?").subscribe((res) => {
      if (res) {
        console.log(id);

        this.provider_admin_location_serviceline_mapping.deleteWorkLocation(obj)
          .subscribe(response => this.deleteOfficeSuccessHandeler(response),
            (err) => {
              console.log("error", err);
              //this.alertService.alert(err, 'error')
            });

      }
    },
      (err) => {
        console.log(err);
      })
  }

  // handeler functions

  successhandeler(response) {
    console.log(response, "successful response");
    return response;
  }

  findLocationsSuccesshandeler(response) {
    console.log(response, "get locations success");
    ;
    this.workLocations = response;
    this.filteredworkLocations = response;
    // this.showTable = true;
  }

  getDistrictsSuccessHandeler(response) {
    console.log(response, "districts");
    this.districts = response;
  }

  servicesSuccesshandeler(response) {
    console.log(response, "services");
    this.servicelines = response;
    // if (response.length > 0) {
    //   this.providerServiceMapID = response[0].providerServiceMapID;
    // }

  }

  saveOfficeSuccessHandeler(response) {
    // alert("location successfully created");
    this.alertService.alert("Saved successfully", 'success');
    console.log('saved', response);
    // this.showTable = false;
    this.showForm = false;
    this.disableSelection = false;
    //  this.resetFields();

    // this.search_serviceline=this.service_ID; we can use this also if we want to find for specific

    jQuery('#locationForm').trigger("reset");

    this.findLocations(this.search_state.stateID, this.search_serviceline.serviceID);
  }

  deleteOfficeSuccessHandeler(response) {
    this.alertService.alert(this.confirmMessage + "d successfully", 'success');
    console.log('deleted', response);
    this.findLocations(this.search_state.stateID, this.search_serviceline.serviceID);
  }
  clear() {
    jQuery("#searchForm").trigger("reset");
    // this.search_serviceline = "";
    // this.search_state = "";
    this.showTable = false;
    this.workLocations = [];
    this.filteredworkLocations = [];
    this.servicelines = [];
    this.PSMID_searchService = "";

  }

  servicelineSelected(array) {
    let req_array = [];
    if (array.constructor != Array) {
      req_array.push(array);
    }
    else {
      req_array = array;
    }
    this.OfficeID = "";
    this.officeNameExist = false;
    this.provider_admin_location_serviceline_mapping.getWorklocationOnProviderArray(req_array)
      .subscribe(response => this.currentServicesSuccess(response),
        (err) => {
          console.log("error", err);
          //this.alertService.alert(err, 'error')
        });
  }

  setPSMID_onStateSeletion(psmID) {
    this.providerServiceMapIDs = [psmID];
    let reqArray = [psmID];
    this.OfficeID = "";
    this.officeNameExist = false;
    this.provider_admin_location_serviceline_mapping.getWorklocationOnProviderArray(reqArray)
      .subscribe(response => this.currentServicesSuccess(response),
        (err) => {
          console.log("error", err);
          //this.alertService.alert(err, 'error')
        });
  }

  currentServicesSuccess(res) {
    this.officeArray = res;
    console.log("officearray", this.officeArray)
  }
  officeNameExist: boolean = false;
  msg: any;

  checkOfficeName(value) {
    for (var i = 0; i < this.officeArray.length; i++) {
      let a = this.workLocations[i].locationName;
      console.log(value.trim(), "EDsdd");
      if (a.trim().toLowerCase() == value.trim().toLowerCase()) {
        this.officeNameExist = true;
        this.msg = "Office name exists"
        break;
      }
      else {
        this.officeNameExist = false;
        this.msg = '';
      }
    }

    if (value.trim().length == 0) {
      this.officeNameExist = true;
    }
  }
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredworkLocations = this.workLocations;
    } else {
      this.filteredworkLocations = [];
      this.workLocations.forEach((item) => {
        for (let key in item) {
          if (key == 'locationName' || key == 'districtName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredworkLocations.push(item); break;
            }
          }
        }
      });
    }

  }


}


@Component({
  selector: 'editLocationModalWindow',
  templateUrl: './editLocationModal.html',
})
export class EditLocationModal {

  // modal windows ngmodels 
  serviceProviderName: any;
  stateName: any;
  districtName: any;
  address: any;
  officeID: any;

  originalOfficeID: any;
  officeNameExist: boolean = false;
  msg: any = "";

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
    public provider_admin_location_serviceline_mapping: LocationServicelineMapping,
    public dialog_Ref: MdDialogRef<EditLocationModal>,
    private alertService: ConfirmationDialogsService) { }

  ngOnInit() {

    console.log(this.data, "modal content");

    this.serviceProviderName = this.data.toBeEditedOBJ.serviceProviderName;
    this.stateName = this.data.toBeEditedOBJ.stateName === undefined ? "All states" : this.data.toBeEditedOBJ.stateName;
    this.districtName = this.data.toBeEditedOBJ.districtName;
    this.address = this.data.toBeEditedOBJ.address;
    this.officeID = this.data.toBeEditedOBJ.locationName;

    this.originalOfficeID = this.data.toBeEditedOBJ.locationName;
  }

  checkOfficeName(value) {
    for (var i = 0; i < this.data.offices.length; i++) {
      let a = this.data.offices[i].locationName;

      if (a.trim().toLowerCase() == value.trim().toLowerCase() && this.originalOfficeID.trim().toLowerCase() != a.trim().toLowerCase()) {
        this.officeNameExist = true;
        this.msg = "OfficeName exist for " + this.data.offices[i].serviceName;
        break;
      }
      else {
        this.officeNameExist = false;
      }
    }


    if (value.trim().length == 0) {
      this.officeNameExist = true;
    }
  }


  update() {
    let editedObj =
      {

        "pSAddMapID": this.data.toBeEditedOBJ.pSAddMapID,
        "providerServiceMapID": this.data.toBeEditedOBJ.providerServiceMapID,
        "locationName": this.officeID.trim(),
        "address": this.address.trim(),
        "districtID": this.data.toBeEditedOBJ.districtID,
        "createdBy": this.data.toBeEditedOBJ.CreatedBy
      }

    console.log(editedObj, "edit rwq obj in modal");

    this.provider_admin_location_serviceline_mapping.editWorkLocation(editedObj)
      .subscribe(response => this.editOfficeSuccessHandeler(response),
        (err) => {
          console.log("error", err);
          //this.alertService.alert(err, 'error')
        });

  }

  editOfficeSuccessHandeler(response) {
    this.alertService.alert("Updated successfully", 'success');
    console.log('edited', response);
    this.dialog_Ref.close("success");
  }



}

