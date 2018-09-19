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
  parkingPlaceObj: any;

  showTable: boolean = false;
  editable: boolean = false;
  disableSelection:  boolean = false;
  showListOfMapping: boolean = true;

  /*Arrays*/
  servicelines: any = [];
  states: any = [];
  zones: any = [];
  parkingPlaces: any = [];

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
    this.parkingPlaceMasterService.getZones({"providerServiceMapID":providerServiceMapID}).subscribe(response => this.getZonesSuccessHandler(response));
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
    this.parkingPlaceObj = {
      "zoneID": zoneID,
      "providerServiceMapID": providerServiceMapID
    };
    this.parkingPlaceMasterService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));

  }
  getParkingPlaceSuccessHandler(response) {
    this.parkingPlaces = response;
  }
  getParkingPlaceSubDistrictMappings() {
    this.parkingPlaceMasterService.getAllParkingPlaceSubDistrictMapping().subscribe(response => this.getParkingPlaceSuccessHandler(response));

  }
  showForm() {
    this.disableSelection = true;
    this.showTable = false;

  }
}


