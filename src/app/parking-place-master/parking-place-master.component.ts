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

    showParkingPlaces: any = true;
    availableParkingPlaces: any = [];
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    availableParkingPlaceNames: any = [];
    countryID: any;
    searchStateID: any;
    searchDistrictID: any;
    serviceID: any;
    createdBy: any;

    @ViewChild('searForm') searForm: NgForm
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
        this.districts = [];
    }
    ngOnInit() {
        this.getParkingPlaces(null, null);
        //this.getStates();
        this.getStatesByServiceID();
    }
    getParkingPlaces(stateID, districtID) {
        this.parkingPlaceObj = {};
        this.parkingPlaceObj.stateID = stateID;
        this.parkingPlaceObj.districtID = districtID;
        this.parkingPlaceObj.serviceProviderID = this.service_provider_id;
        this.parkingPlaceMasterService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));

    }

    getParkingPlaceSuccessHandler(response) {
        this.availableParkingPlaces = response;
        for (let availableParkingPlace of this.availableParkingPlaces) {
            this.availableParkingPlaceNames.push(availableParkingPlace.parkingPlaceName);
        }
    }

    parkingPlaceObj: any;
    parkingPlaceList: any = [];
    addParkingPlaceToList(values) {
        for (let provider_service of this.provider_services) {
            if ("MMU" == provider_service.serviceName) {
                this.parkingPlaceObj = {};
                this.parkingPlaceObj.parkingPlaceName = values.parkingPlaceName;
                this.parkingPlaceObj.parkingPlaceDesc = values.parkingPlaceDesc;
                this.parkingPlaceObj.countryID = this.countryID;

                if (values.districtID != undefined) {
                    this.parkingPlaceObj.districtID = values.districtID.split("-")[0];
                    this.parkingPlaceObj.districtName = values.districtID.split("-")[1];
                }
                if (values.talukID != undefined) {
                    this.parkingPlaceObj.districtBlockID = values.talukID.split("-")[0];
                    this.parkingPlaceObj.blockName = values.talukID.split("-")[1];
                }
                this.parkingPlaceObj.areaHQAddress = values.areaHQAddress;

                this.parkingPlaceObj.providerServiceMapID = provider_service.providerServiceMapID;
                if (values.stateID != undefined) {
                    this.parkingPlaceObj.stateID = values.stateID.split("-")[0];
                    this.parkingPlaceObj.stateName = values.stateID.split("-")[1];
                }

                this.parkingPlaceObj.createdBy = this.createdBy;
                debugger;

            }
        }
        if (this.parkingPlaceList.length == 0) {
            this.parkingPlaceList.push(this.parkingPlaceObj);
        }
        else {
            let count = 0
            for (let a = 0; a < this.parkingPlaceList.length; a++) {
                if (this.parkingPlaceList[a].parkingPlaceName == this.parkingPlaceObj.parkingPlaceName) {
                    count = count + 1;
                }
            }
            if (count == 0) {
                this.parkingPlaceList.push(this.parkingPlaceObj);
            }

            else {
                this.alertMessage.alert("Already exists");
            }

        }
        if (this.parkingPlaceList.length <= 0) {
            this.alertMessage.alert("No Service available with the state selected");
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
    }

    stateSelection(stateID) {
        this.getServices(stateID);
    }

    getServices(stateID) {
        this.parkingPlaceMasterService.getServices(this.service_provider_id, stateID).subscribe(response => this.getServicesSuccessHandeler(response));
    }

    getStates() {
        this.parkingPlaceMasterService.getStates(this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    }

    getStatesSuccessHandeler(response) {
        this.provider_states = response;
    }

    getStatesByServiceID() {
        this.parkingPlaceMasterService.getStatesByServiceID(this.serviceID, this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    }


    districts: any = [];
    getDistricts(stateID) {
        this.parkingPlaceMasterService.getDistricts(stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        console.log(response, "districts retrieved");
        this.districts = response;
    }
    taluks: any = [];
    GetTaluks(districtID: number) {
        this.parkingPlaceMasterService.getTaluks(districtID)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
    }

    branches: any = [];
    GetBranches(talukID: number) {
        this.parkingPlaceMasterService.getBranches(talukID)
            .subscribe(response => this.SetBranches(response));
    }
    SetBranches(response: any) {
        this.branches = response;
    }


    getServicesSuccessHandeler(response) {
        this.provider_services = response;
        for (let provider_service of this.provider_services) {
            if ("MMU" == provider_service.serviceName) {
                this.providerServiceMapID = provider_service.providerServiceMapID;
            }
        }
        if (this.providerServiceMapID == "" || this.providerServiceMapID == undefined) {
            this.alertMessage.alert("No Service available with the state selected");
        }
    }

    dataObj: any = {};
    updateParkingPlaceStatus(parkingPlace) {

        let flag = !parkingPlace.deleted;
        let status;
        if (flag === true) {
            status = "Deactivate";
        }
        if (flag === false) {
            status = "Activate";
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
            this.alertMessage.alert(status + "d successfully", 'success');
        });
    }
    updateStatusHandler(response) {
        console.log("Parking place status changed");
    }

    showList() {
        this.searchStateID = "";
        this.searchDistrictID = "";
        this.getParkingPlaces(null, null);
        this.showParkingPlaces = true;
        this.editable = false;
    }

    parkingPlaceNameExist: any = false;
    checkExistance(parkingPlaceName) {
        this.parkingPlaceNameExist = this.availableParkingPlaceNames.includes(parkingPlaceName);
        console.log(this.parkingPlaceNameExist);
    }

    parkingPlaceID: any;
    parkingPlaceName: any;
    parkingPlaceDesc: any;
    stateID: any;
    districtID: any;
    talukID: any;
    areaHQAddress: any;
    initializeObj() {
        this.parkingPlaceID = "";
        this.parkingPlaceName = "";
        this.parkingPlaceDesc = "";
        this.stateID = "";
        this.districtID = "";
        this.talukID = "";
        this.areaHQAddress = "";
    }
    editParkingPlaceData(parkingPlace) {
        this.parkingPlaceID = parkingPlace.parkingPlaceID;
        this.parkingPlaceName = parkingPlace.parkingPlaceName
        this.parkingPlaceDesc = parkingPlace.parkingPlaceDesc;
        this.areaHQAddress = parkingPlace.areaHQAddress;
        this.stateID = parkingPlace.stateID + "-" + parkingPlace.stateName;
        this.districtID = parkingPlace.districtID + "-" + parkingPlace.districtName;
        if (parkingPlace.districtBlockID != undefined) {
            this.talukID = parkingPlace.districtBlockID + "-" + parkingPlace.blockName;
        }

        this.serviceID = parkingPlace.m_providerServiceMapping.m_serviceMaster.serviceID + "-" + parkingPlace.providerServiceMapID;
        this.getDistricts(parkingPlace.stateID);
        this.GetTaluks(parkingPlace.districtID);
        this.GetBranches(parkingPlace.districtBlockID);
        this.getStates();
        this.getServices(parkingPlace.stateID);

        this.editable = true;
    }

    updateParkingPlaceData(parkingPlace) {
        this.dataObj = {};
        this.dataObj.parkingPlaceID = this.parkingPlaceID;
        this.dataObj.parkingPlaceName = parkingPlace.parkingPlaceName;
        this.dataObj.parkingPlaceDesc = parkingPlace.parkingPlaceDesc;
        this.dataObj.areaHQAddress = parkingPlace.areaHQAddress;
        //this.dataObj.providerServiceMapID = zone.serviceID.split("-")[0];
        if (parkingPlace.stateID != undefined) {
            this.dataObj.stateID = parkingPlace.stateID.split("-")[0];
        }
        if (parkingPlace.districtID != undefined) {
            this.dataObj.districtID = parkingPlace.districtID.split("-")[0];
        }
        if (parkingPlace.talukID != undefined) {
            this.dataObj.districtBlockID = parkingPlace.talukID.split("-")[0];
        }

        this.dataObj.modifiedBy = this.createdBy;
        this.parkingPlaceMasterService.updateParkingPlaceDetails(this.dataObj).subscribe(response => this.updateHandler(response));

    }

    updateHandler(response) {
        this.editable = true;
        this.alertMessage.alert("Updated successfully", 'success');
        this.getParkingPlaces(null, null);
        //this.initializeObj();
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