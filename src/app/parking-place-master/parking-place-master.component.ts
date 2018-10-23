import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ParkingPlaceMasterService } from '../services/ProviderAdminServices/parking-place-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-parking-place',
    templateUrl: './parking-place-master.component.html'
})
export class ParkingPlaceComponent implements OnInit {

    filteredavailableParkingPlaces: any = [];
    status: string;
    userID: any;
    service: any;
    state: any;
    zoneID: any;
    districtID: any;
    parkingPlaceID: any;
    parkingPlaceName: any;
    parkingPlaceDesc: any;
    stateID: any;
    talukID: any;
    areaHQAddress: any;
    showTableFlag: boolean = false;
    disableSelection: boolean = false;
    showParkingPlaces: any = true;
    parkingPlaceNameExist: any = false;
    showListOfParking: any = true;

    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    createButton: boolean = false;
    enableHubFlag: boolean = false;

    countryID: any;
    serviceID: any;
    createdBy: any;
    bufferCount: any = 0;

    /* Arrays*/
    services: any = [];
    states: any = [];
    zones: any = [];
    availableParkingPlaces: any = [];
    availableParkingPlaceNames: any = [];

    @ViewChild('searchForm') searchForm: NgForm
    @ViewChild('parkingPlaceForm') parkingPlaceForm: NgForm
    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public parkingPlaceMasterService: ParkingPlaceMasterService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.serviceID = this.commonDataService.serviceIDMMU;
        this.createdBy = this.commonDataService.uname;
    }

    showForm() {
        this.showParkingPlaces = false;
        this.showTableFlag = false;
        this.disableSelection = true;
        this.showListOfParking = false;

    }
    ngOnInit() {
        this.userID = this.commonDataService.uid;
        this.getServiceLines();
    }
    getServiceLines() {
        this.parkingPlaceMasterService.getServiceLinesNew(this.userID).subscribe((response) => {
            this.getServicesSuccessHandeler(response),
                (err) => {
                    console.log("ERROR in fetching serviceline", err);
                    // this.alertMessage.alert(err, 'error');
                }
        });
    }
    getServicesSuccessHandeler(response) {
        this.services = response;
    }
    parkAndHub:String;
    getStates(value) {
        this.zones = [];
        this.filteredavailableParkingPlaces = [];
        if (value.serviceID == 4) {
            this.parkAndHub = "Hub";
        } else {
            this.parkAndHub = "Parking Place";
        }
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
        this.createButton = false;
    }
    setProviderServiceMapID(providerServiceMapID) {
        this.zones = [];
        this.filteredavailableParkingPlaces = [];
        console.log("providerServiceMapID", providerServiceMapID);
        this.providerServiceMapID = providerServiceMapID;
        this.getAvailableZones(this.providerServiceMapID);

    }
    getAvailableZones(providerServiceMapID) {
        this.parkingPlaceMasterService.getZones({ "providerServiceMapID": providerServiceMapID }).subscribe(response => this.getZonesSuccessHandler(response));
    }
    getZonesSuccessHandler(response) {
        this.createButton = false;
        if (response != undefined) {
            for (let zone of response) {
                if (!zone.deleted) {
                    this.zones.push(zone);
                }
            }
        }
    }

    getParkingPlaces(zoneID, providerServiceMapID) {
        this.parkingPlaceObj = {
            "zoneID": zoneID,
            "providerServiceMapID": providerServiceMapID
        };
        this.parkingPlaceMasterService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));

    }

    getParkingPlaceSuccessHandler(response) {
        this.showTableFlag = true;
        this.editable = false;
        this.createButton = true;
        this.availableParkingPlaces = response;
        this.filteredavailableParkingPlaces = response;
        for (let availableParkingPlace of this.availableParkingPlaces) {
            this.availableParkingPlaceNames.push(availableParkingPlace.parkingPlaceName);
        }
    }


    parkingPlaceObj: any;
    parkingPlaceList: any = [];
    addParkingPlaceToList(values) {
        this.parkingPlaceObj = {};
        this.parkingPlaceObj.parkingPlaceName = values.parkingPlaceName;
        this.parkingPlaceObj.parkingPlaceDesc = values.parkingPlaceDesc;
        this.parkingPlaceObj.countryID = this.countryID;

        this.parkingPlaceObj.stateID = this.state.stateID;
        this.parkingPlaceObj.stateName = this.state.stateName;

        this.parkingPlaceObj.zoneID = this.zoneID.zoneID;
        this.parkingPlaceObj.zoneName = this.zoneID.zoneName;

        this.parkingPlaceObj.areaHQAddress = values.areaHQAddress;
        this.parkingPlaceObj.providerServiceMapID = this.providerServiceMapID;
        this.parkingPlaceObj.createdBy = this.createdBy;
        this.checkDuplicates(this.parkingPlaceObj);
    }
    checkDuplicates(parkingPlaceObj) {
        if (this.parkingPlaceList.length == 0) {
            this.parkingPlaceList.push(this.parkingPlaceObj);
            this.parkingPlaceForm.resetForm();
        }
        else if (this.parkingPlaceList.length > 0) {
            for (let a = 0; a < this.parkingPlaceList.length; a++) {
                if (this.parkingPlaceList[a].parkingPlaceName === this.parkingPlaceObj.parkingPlaceName
                    && this.parkingPlaceList[a].stateID === this.parkingPlaceObj.stateID
                    && this.parkingPlaceList[a].zoneID === this.parkingPlaceObj.zoneID
                    && this.parkingPlaceList[a].areaHQAddress === this.parkingPlaceObj.areaHQAddress) {
                    this.bufferCount = this.bufferCount + 1;
                    console.log('Duplicate Combo Exists', this.bufferCount);
                }
            }
            if (this.bufferCount > 0) {
                this.alertMessage.alert("Already exists");
                this.bufferCount = 0;
                this.parkingPlaceForm.resetForm();
            }
            else {
                this.parkingPlaceList.push(this.parkingPlaceObj);
                this.parkingPlaceForm.resetForm();
            }
        }

    }

    remove_obj(i) {
        this.parkingPlaceList.splice(i, 1);
    }


    storeParkingPlaces() {
        let obj = { "parkingPlaces": this.parkingPlaceList };
        this.parkingPlaceMasterService.saveParkingPlace(obj).subscribe(response => this.parkingPlaceSuccessHandler(response));
    }

    parkingPlaceSuccessHandler(response) {
        this.parkingPlaceList = [];
        this.alertMessage.alert("Saved successfully", 'success');
        this.showList();

    }

    dataObj: any = {};
    updateParkingPlaceStatus(parkingPlace) {

        let flag = !parkingPlace.deleted;
        let status;
        if (flag === true) {
            status = "Deactivate";
            this.status = "Deactivate";
        }
        if (flag === false) {
            status = "Activate";
            this.status = "Activate";
        }

        this.alertMessage.confirm('Confirm', "Are you sure you want to " + status + "?").subscribe(response => {
            if (response) {
                this.dataObj = {};
                this.dataObj.parkingPlaceID = parkingPlace.parkingPlaceID;
                this.dataObj.deleted = !parkingPlace.deleted;
                this.dataObj.modifiedBy = this.createdBy;
                this.parkingPlaceMasterService.updateParkingPlaceStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

                parkingPlace.deleted = !parkingPlace.deleted;
            }

        });
    }
    updateStatusHandler(response) {
        console.log("Parking place status changed");
        this.alertMessage.alert(this.status + "d successfully", 'success');
    }

    showList() {
        this.getParkingPlaces(this.zoneID.zoneID, this.state.providerServiceMapID);
        this.showParkingPlaces = true;
        this.editable = false;
        this.disableSelection = false;
        this.showListOfParking = true;
    }


    checkExistance(parkingPlaceName) {
        this.parkingPlaceNameExist = this.availableParkingPlaceNames.includes(parkingPlaceName);
    }


    initializeObj() {
        this.parkingPlaceID = "";
        this.parkingPlaceName = "";
        this.parkingPlaceDesc = "";
        this.areaHQAddress = "";
    }
    editParkingPlaceData(parkingPlace) {
        this.editable = true;
        this.disableSelection = true;
        this.showListOfParking = false;
        this.parkingPlaceID = parkingPlace.parkingPlaceID;
        this.parkingPlaceName = parkingPlace.parkingPlaceName;
        this.parkingPlaceDesc = parkingPlace.parkingPlaceDesc;
        this.areaHQAddress = parkingPlace.areaHQAddress;
    }

    updateParkingPlaceData() {

        this.dataObj = {};
        this.dataObj.parkingPlaceID = this.parkingPlaceID;
        this.dataObj.service = this.service.serviceID;
        this.dataObj.stateID = this.state.stateID;
        this.dataObj.zoneID = this.zoneID.zoneID;
        this.dataObj.parkingPlaceName = this.parkingPlaceName;
        this.dataObj.parkingPlaceDesc = this.parkingPlaceDesc;
        this.dataObj.areaHQAddress = this.areaHQAddress;
        this.parkingPlaceMasterService.updateParkingPlaceDetails(this.dataObj).subscribe(response => this.updateHandler(response));
    }

    updateHandler(response) {
        this.editable = true;
        this.alertMessage.alert("Updated successfully", 'success');
        this.showList();
        this.initializeObj();
        this.availableParkingPlaceNames = [];

    }
    filterComponentList(searchTerm?: string) {
        if (!searchTerm) {
            this.filteredavailableParkingPlaces = this.availableParkingPlaces;
        } else {
            this.filteredavailableParkingPlaces = [];
            this.availableParkingPlaces.forEach((item) => {
                for (let key in item) {
                    if (key == 'parkingPlaceName') {
                        let value: string = '' + item[key];
                        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                            this.filteredavailableParkingPlaces.push(item); break;
                        }
                    }
                }
            });
        }

    }
    back() {
        this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                this.parkingPlaceForm.resetForm();
                this.showList();
                this.parkingPlaceList = [];
            }
        })
    }
}