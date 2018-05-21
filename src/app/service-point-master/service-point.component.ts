import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ServicePointMasterService } from '../services/ProviderAdminServices/service-point-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { MdCheckbox, MdSelect } from '@angular/material';
@Component({
    selector: 'app-service-point',
    templateUrl: './service-point.component.html'
})
export class ServicePointComponent implements OnInit {

    searchDistrictID_edit: any;
    searchParkingPlaceID_edit: any;
    editMode: boolean = false;
    areaHQAddress: any;
    districtID: any;
    servicePointID: any;
    talukID: any;
    servicePointName: string;
    servicePointDesc: string;
    createButton: boolean = false;
    serviceline: any;
    services_array: any = [];
    userID: any;
    showServicePoints: any = true;
    availableServicePoints: any = [];
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    availableServicePointNames: any = [];
    countryID: any;
    searchStateID: any;
    searchDistrictID: any;
    searchParkingPlaceID: any;
    serviceID: any;
    createdBy: any;
    status: any;
    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public servicePointMasterService: ServicePointMasterService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.serviceID = this.commonDataService.serviceIDMMU;
        this.createdBy = this.commonDataService.uname;
        this.userID = this.commonDataService.uid;
    }

    showForm() {
        this.showServicePoints = false;
    }
    ngOnInit() {
        this.getProviderServices();
    }
    getProviderServices() {
        this.servicePointMasterService.getServices(this.userID)
            .subscribe(response => {
                this.services_array = response;
            }, err => {
            });
    }
    getStates(serviceID) {
        this.servicePointMasterService.getStates(this.userID, serviceID, false).
            subscribe(response => this.getStatesSuccessHandeler(response, false), err => {
            });
    }
    getStatesSuccessHandeler(response, isNational) {
        if (response) {
            console.log(response, 'Provider States');
            this.provider_states = response;
            this.createButton = false;
        }
    }
    parkingPlaceObj: any;
    getParkingPlaces(stateID, districtID) {
        this.parkingPlaceObj = {};
        this.parkingPlaceObj.stateID = stateID;
        this.parkingPlaceObj.districtID = districtID;
        this.parkingPlaceObj.serviceProviderID = this.service_provider_id;
        this.servicePointMasterService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));
    }

    availableParkingPlaces: any;
    getParkingPlaceSuccessHandler(response) {
        this.availableParkingPlaces = response;
        this.createButton = false;
        for (let availableParkingPlaces of this.availableParkingPlaces) {
            if (availableParkingPlaces.deleted) {
                const index: number = this.availableParkingPlaces.indexOf(availableParkingPlaces);
                if (index !== -1) {
                    this.availableParkingPlaces.splice(index, 1);
                }
            }
        }
    }

    getServicePoints(stateID, districtID, parkingPlaceID) {
        this.createButton = true;
        this.servicePointObj = {};
        this.servicePointObj.stateID = stateID;
        this.servicePointObj.districtID = districtID;
        this.servicePointObj.parkingPlaceID = parkingPlaceID;
        this.servicePointObj.serviceProviderID = this.service_provider_id;
        this.servicePointMasterService.getServicePoints(this.servicePointObj).subscribe(response => this.getServicePointSuccessHandler(response));

    }

    getServicePointSuccessHandler(response) {
        this.availableServicePoints = response;
        for (let availableServicePoint of this.availableServicePoints) {
            this.availableServicePointNames.push(availableServicePoint.servicePointName);
        }
    }
    districts: any = [];
    getDistricts(stateID) {
        this.servicePointMasterService.getDistricts(stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        console.log(response, "districts retrieved");
        this.districts = response;
        this.createButton = false;
    }
    taluks: any = [];
    GetTaluks(districtID: number) {
        this.servicePointMasterService.getTaluks(districtID)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
    }

    branches: any = [];
    GetBranches(talukID: number) {
        this.servicePointMasterService.getBranches(talukID)
            .subscribe(response => this.SetBranches(response));
    }
    SetBranches(response: any) {
        this.branches = response;
    }
    // ** adding values ** //
    servicePointObj: any;
    servicePointList: any = [];
    addServicePointToList(values) {
        debugger;

        this.servicePointObj = {};
        this.servicePointObj.servicePointName = values.servicePointName;
        this.servicePointObj.servicePointDesc = values.servicePointDesc;
        this.servicePointObj.countryID = this.countryID;

        if (this.searchStateID != undefined) {
            this.servicePointObj.stateID = this.searchStateID.stateID;
            this.servicePointObj.stateName = this.searchStateID.stateName;
        }

        if (this.searchDistrictID != undefined) {
            this.servicePointObj.districtID = this.searchDistrictID.districtID;
            this.servicePointObj.districtName = this.searchDistrictID.districtName;
        }
        if (values.talukID != undefined) {
            this.servicePointObj.districtBlockID = values.talukID.districtBlockID;
            this.servicePointObj.blockName = values.talukID.blockName;
        }
        this.servicePointObj.servicePointHQAddress = values.areaHQAddress;
        if (this.searchParkingPlaceID != undefined) {
            this.servicePointObj.parkingPlaceID = this.searchParkingPlaceID.parkingPlaceID;
            this.servicePointObj.parkingPlaceName = this.searchParkingPlaceID.parkingPlaceName
        }
        this.servicePointObj.providerServiceMapID = this.searchStateID.providerServiceMapID;

        this.servicePointObj.createdBy = this.createdBy;
        this.checkDuplicates(this.servicePointObj)


    }
    //* checking duplicates in buffer */
    checkDuplicates(servicePointObj) {
        debugger;
        let count = 0
        if (this.servicePointList.length === 0) {
            this.servicePointList.push(this.servicePointObj);
        }
        else if (this.servicePointList.length > 0) {
            for (let i = 0; i < this.servicePointList.length; i++) {
                if (this.servicePointList[i].servicePointName === servicePointObj.servicePointName) {
                    count = count + 1;
                }
            }
            if (count === 0) {
                this.servicePointList.push(servicePointObj);
                count = 0;
            }
            else {
                this.alertMessage.alert("Already exists");
            }
        }

    }
    //* deleting rows from buffer */
    deleteRow(i) {
        this.servicePointList.splice(i, 1);
    }

    //* save method */
    storeServicePoints() {
        debugger;
        let obj = { "servicePoints": this.servicePointList };
        console.log(obj);
        this.servicePointMasterService.saveServicePoint(obj).subscribe(response => this.servicePointSuccessHandler(response));
    }

    servicePointSuccessHandler(response) {
        this.servicePointList = [];
        this.alertMessage.alert("Saved successfully", 'success');
        this.showList();
    }

    //* Activate and Deactivate method */
    dataObj: any = {};
    updateServicePointStatus(servicePoint) {
        let flag = !servicePoint.deleted;
        let vanString;
        if (flag === true) {
            vanString = "Deactivate";
            this.status = "Deactivate";
        }
        if (flag === false) {
            vanString = "Activate";
            this.status = "Activate";
        }


        this.alertMessage.confirm('Confirm', "Are you sure you want to " + vanString + "?").subscribe(response => {
            if (response) {
                this.dataObj = {};
                this.dataObj.servicePointID = servicePoint.servicePointID;
                this.dataObj.deleted = !servicePoint.deleted;
                this.dataObj.modifiedBy = this.createdBy;
                this.servicePointMasterService.updateServicePointStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

                servicePoint.deleted = !servicePoint.deleted;
            }
        });

    }
    updateStatusHandler(response) {
        if (this.status === "Deactivate")
            this.alertMessage.alert("Deactivated successfully", 'success');
        else
            this.alertMessage.alert("Activated successfully", 'success')
        console.log("Service Point status changed");
    }

    showList() {
        if (this.editMode) {
            this.getServicePoints(this.searchStateID.stateID, this.searchDistrictID.districtID, this.searchParkingPlaceID.parkingPlaceID);
        }
        else {
            this.getServicePoints(this.searchStateID.stateID, this.searchDistrictID_edit, this.searchParkingPlaceID_edit);
        }

        this.showServicePoints = true;
        this.editMode = false;
        this.servicePointObj = [];
        this.servicePointList = [];
    }
    editservicePoint(spoint) {
        debugger;
        this.editMode = true;
        this.providerServiceMapID = this.searchStateID.providerServiceMapID;
        this.servicePointID = spoint.servicePointID;
        this.servicePointName = spoint.servicePointName;
        this.servicePointDesc = spoint.servicePointDesc;
        this.searchDistrictID_edit = spoint.districtID;
        this.talukID = spoint.districtBlockID;
        this.searchParkingPlaceID_edit = spoint.parkingPlaceID
        this.areaHQAddress = spoint.servicePointHQAddress

    }
    updateServicePoints(formValues) {
        debugger;
        let obj = {

            "servicePointID": this.servicePointID,
            "servicePointName": this.servicePointName,
            "servicePointDesc": this.servicePointDesc,
            "providerServiceMapID": this.searchStateID.providerServiceMapID,
            "districtID": this.searchDistrictID_edit,
            "modifiedBy": this.createdBy
        }

        this.servicePointMasterService.updateServicePoint(obj).subscribe(response => this.updateservicePointSuccessHandler(response));

    }
    updateservicePointSuccessHandler(response) {
        this.servicePointList = [];
        this.alertMessage.alert("Updated successfully", 'success');
        this.showList();
    }

    /* db check of service name */
    servicePointNameExist: any = false;
    checkExistance(servicePointName) {
        this.servicePointNameExist = this.availableServicePointNames.includes(servicePointName);
        console.log(this.servicePointNameExist);
    }
    back() {
        this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                this.showList();
            }
        })
    }
}