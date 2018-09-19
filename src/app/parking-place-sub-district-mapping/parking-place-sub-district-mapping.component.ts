import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { ParkingPlaceMasterService } from '../services/ProviderAdminServices/parking-place-master-services.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-parking-place-sub-district-mapping',
  templateUrl: './parking-place-sub-district-mapping.component.html',
  styleUrls: ['./parking-place-sub-district-mapping.component.css']
})
export class ParkingPlaceSubDistrictMappingComponent implements OnInit {

  userID: any;
  createdBy: any;
  providerServiceMapID: any;
  service: any;
  state: any;
  zoneID: any;
  parking_Place: any;
  district: any;

  showTable: boolean = false;
  editable: boolean = false;
  disableSelection: boolean = false;
  showListOfMapping: boolean = true;

  /*Arrays*/
  servicelines: any = [];
  states: any = [];
  zones: any = [];
  parkingPlaces: any = [];
  mappedParkingPlaceDistricts: any = [];
  districts: any = [];
  taluks: any = [];
  mappingList: any = [];

  @ViewChild('mappingForm') mappingForm: NgForm;
  constructor(public commonDataService: dataService,
    public parkingPlaceMasterService: ParkingPlaceMasterService,
    public dialog: MdDialog,
    private alertService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    this.createdBy = this.commonDataService.uname;
    this.getServicelines();
  }
  getServicelines() {
    this.parkingPlaceMasterService.getServiceLinesNew(this.userID).subscribe((response) => {
      this.getServicesSuccessHandeler(response),
        (err) => {
          console.log("ERROR in fetching serviceline", err);
        }
    });
  }
  getServicesSuccessHandeler(response) {
    this.servicelines = response;
  }
  getStates(value) {
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.parkingPlaceMasterService.getStatesNew(obj).
      subscribe((response) => {
        this.getStatesSuccessHandeler(response),
          (err) => {
            console.log("error in fetching states", err);
          }
        //this.alertMessage.alert(err, 'error');
      });

  }

  getStatesSuccessHandeler(response) {
    this.states = response;
  }
  setProviderServiceMapID(providerServiceMapID) {
    this.zones = [];
    console.log("providerServiceMapID", providerServiceMapID);
    this.providerServiceMapID = providerServiceMapID;
    this.getAvailableZones(this.providerServiceMapID);

  }
  getAvailableZones(providerServiceMapID) {
    this.parkingPlaceMasterService.getZones({ "providerServiceMapID": providerServiceMapID }).subscribe(response => this.getZonesSuccessHandler(response));
  }
  getZonesSuccessHandler(response) {
    if (response != undefined) {
      for (let zone of response) {
        if (!zone.deleted) {
          this.zones.push(zone);
        }
      }
    }
  }
  getAllParkingPlaces(zoneID, providerServiceMapID) {
    let parkingPlaceObj = {
      "zoneID": zoneID,
      "providerServiceMapID": providerServiceMapID
    };
    this.parkingPlaceMasterService.getParkingPlaces(parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));

  }
  getParkingPlaceSuccessHandler(response) {
    this.parkingPlaces = response;
  }
  getParkingPlaceSubDistrictMappings(providerServiceMapID, zoneID, parkingPlaceID) {
    let mappedReqObj = {
      "providerServiceMapID": providerServiceMapID,
      "zoneID": zoneID,
      "parkingPlaceID": parkingPlaceID
    }
    this.parkingPlaceMasterService.getAllParkingPlaceSubDistrictMapping(mappedReqObj)
      .subscribe(response => this.getMappingSuccessHandler(response));

  }
  getMappingSuccessHandler(response) {
    this.mappedParkingPlaceDistricts = response;
    this.showTable = true;
  }
  showForm() {
    this.disableSelection = true;
    this.showTable = false;
    this.showListOfMapping = false;
    this.getDistricts(this.zoneID.zoneID);

  }
  getDistricts(zoneID) {
    this.parkingPlaceMasterService.getDistricts(zoneID)
      .subscribe(districtResponse => this.getDistrictsSuccessHandeler(districtResponse));
  }
  getDistrictsSuccessHandeler(districtResponse) {
    this.districts = districtResponse;
  }
  getTaluks(districtID) {
    this.parkingPlaceMasterService.getTaluks(districtID)
      .subscribe(talukResponse => this.getTaluksSuccessHandler(talukResponse));
  }
  getTaluksSuccessHandler(talukResponse) {
    this.taluks = talukResponse;
  }
  addMappingObject(formValue) {
    console.log("formValue", formValue);
    for (let taluks of formValue.taluk) {
      let talukID = taluks.blockID;
      let mappingObject = {
        "providerServiceMapID": this.providerServiceMapID,
        "parkingPlaceID": this.parking_Place.parkingPlaceID,
        "parkingPlaceName": this.parking_Place.parkingPlaceName,
        "districtID": formValue.district.districtID,
        "districtName": formValue.district.districtName,
        "districtBlockID": talukID,
        "districtBlockName": taluks.blockName,
        "createdBy": this.createdBy
      }
      this.mappingList.push(mappingObject);
      this.mappingForm.resetForm();
      this.taluks = [];
    }

  }
  remove_obj(index) {
    this.mappingList.splice(index, 1);
  }
  saveSubdistrictMapping() {
    this.parkingPlaceMasterService.saveParkingPlaceSubDistrictMapping(this.mappingList)
    .subscribe(response => this.saveSuccessHandler(response))
    
  }
  saveSuccessHandler(response) {
    this.alertService.alert("Mapping saved successfully", 'success');
    this.mappingList = [];
    this.showList();
  }
  back() {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.showList();
        this.mappingList = [];
      }
    })
  }
  showList() {
    this.getParkingPlaceSubDistrictMappings(this.state.providerServiceMapID, this.zoneID.zoneID, this.parking_Place.parkingPlaceID);
    this.editable = false;
    this.disableSelection = false;
    this.showListOfMapping = true;
    this.showTable = false;
    this.mappingForm.resetForm();
  }
 
}


