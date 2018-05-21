import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ServicePointVillageMapService } from '../services/ProviderAdminServices/service-point-village-map.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { ServicePointMasterService } from '../services/ProviderAdminServices/service-point-master-services.service';

@Component({
    selector: 'app-service-point-village-mapping',
    templateUrl: './service-point-village-mapping.component.html'
})
export class ServicePointVillageMapComponent implements OnInit {

    serviceline: any;
    createButton: boolean = false;
    services_array: any;
    userID: any;
    showServicePointVillageMaps: any = true;
    availableServicePointVillageMaps: any = [];
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    availableServicePointVillageMapNames: any = [];
    countryID: any;
    searchStateID: any;
    searchDistrictID: any;
    serviceID: any;
    createdBy: any;

    @ViewChild('servicePointVillageMapForm') servicePointVillageMapForm: NgForm;
    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public servicePointVillageMapService: ServicePointVillageMapService,
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
        this.showServicePointVillageMaps = false;
        //  this.districts = [];
    }
    ngOnInit() {
        // this.getServicePointVillageMaps(null, null, null, null);
        //this.getStates();
        // this.getStatesByServiceID();
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
        this.servicePointVillageMapService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));
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
        this.servicePointVillageMapObj = {};
        this.servicePointVillageMapObj.stateID = stateID;
        this.servicePointVillageMapObj.districtID = districtID;
        this.servicePointVillageMapObj.parkingPlaceID = parkingPlaceID;
        this.servicePointVillageMapObj.serviceProviderID = this.service_provider_id;
        this.servicePointVillageMapService.getServicePoints(this.servicePointVillageMapObj).subscribe(response => this.getServicePointSuccessHandler(response));

    }


    availableServicePoints: any;
    getServicePointSuccessHandler(response) {
        this.availableServicePoints = response;
        this.createButton = false;
        for (let availableServicePoint of this.availableServicePoints) {
            if (availableServicePoint.deleted) {
                const index: number = this.availableServicePoints.indexOf(availableServicePoint);
                if (index !== -1) {
                    this.availableServicePoints.splice(index, 1);
                }
            }
        }
    }

    getServicePointVillageMaps(stateID, districtID, parkingPlaceID, servicePointID) {
        this.servicePointVillageMapObj = {};
        this.servicePointVillageMapObj.stateID = stateID;
        this.servicePointVillageMapObj.districtID = districtID;
        this.servicePointVillageMapObj.parkingPlaceID = parkingPlaceID;
        this.servicePointVillageMapObj.servicePointID = servicePointID;
        this.servicePointVillageMapObj.serviceProviderID = this.service_provider_id;
        this.servicePointVillageMapService.getServicePointVillageMaps(this.servicePointVillageMapObj).subscribe(response => this.getServicePointVillageMapSuccessHandler(response));

    }

    getServicePointVillageMapSuccessHandler(response) {
        this.availableServicePointVillageMaps = response;
        this.createButton = true;
        for (let availableServicePointVillageMap of this.availableServicePointVillageMaps) {
            this.availableServicePointVillageMapNames.push(availableServicePointVillageMap.m_servicepoint.servicePointName);
        }
    }
    remove_obj(index) {
        this.servicePointVillageMapList.splice(index, 1);
    }

    servicePointVillageMapObj: any;
    servicePointVillageMapList: any = [];
    mappedVillageIDs: any = [];
    addServicePointVillageMapToList(values) {

        let villageIds = [];
        for (let villages of values.villageIdList) {
            let villageId = villages.split("-")[0];
            let villageName = villages.split("-")[1];

            if (this.mappedVillageIDs.indexOf(parseInt(villageId)) == -1) {

                this.servicePointVillageMapObj = {};


                this.servicePointVillageMapObj.stateID = this.searchStateID.stateID;
                this.servicePointVillageMapObj.stateName = this.searchStateID.stateName;



                this.servicePointVillageMapObj.districtID = this.searchDistrictID.districtID;
                this.servicePointVillageMapObj.districtName = this.searchDistrictID.districtName;


                this.servicePointVillageMapObj.parkingPlaceID = this.searchParkingPlaceID.parkingPlaceID;
                this.servicePointVillageMapObj.parkingPlaceName = this.searchParkingPlaceID.parkingPlaceName;

                this.servicePointVillageMapObj.servicePointID = this.searchServicePointID.servicePointID;
                this.servicePointVillageMapObj.servicePointName = this.searchServicePointID.servicePointName;

                this.servicePointVillageMapObj.districtBranchID = villageId;
                this.servicePointVillageMapObj.villageName = villageName;

                this.servicePointVillageMapObj.providerServiceMapID = this.searchStateID.providerServiceMapID;

                this.servicePointVillageMapObj.createdBy = this.createdBy;
                this.checkDuplicates(this.servicePointVillageMapObj);


            }
        }

    }

    checkDuplicates(servicePointVillageMapObj) {
        let count = 0;
        if (this.servicePointVillageMapList.length == 0 && this.checkDb(this.servicePointVillageMapObj))
            this.servicePointVillageMapList.push(this.servicePointVillageMapObj);
        else {
            for (let i = 0; i < this.servicePointVillageMapList.length; i++) {
                if (
                    this.servicePointVillageMapList[i].providerServiceMapID === servicePointVillageMapObj.providerServiceMapID
                    && this.servicePointVillageMapList[i].districtID === servicePointVillageMapObj.districtID
                    && this.servicePointVillageMapList[i].parkingPlaceID === servicePointVillageMapObj.parkingPlaceID
                    && this.servicePointVillageMapList[i].servicePointID === servicePointVillageMapObj.servicePointID
                    && this.servicePointVillageMapList[i].districtBranchID === servicePointVillageMapObj.districtBranchID

                ) {
                    count = 1;

                }
            }
            if (count === 0) {
                if (this.checkDb(this.servicePointVillageMapObj))
                    this.servicePointVillageMapList.push(this.servicePointVillageMapObj);
                else {
                    this.alertMessage.alert("Already Mapped");
                }
            }
            else {
                this.alertMessage.alert("Already Exists");
                count = 0;
            }
        }
    }
    checkDb(servicePointVillageMapObj) {
        let count = 0;

        for (let i = 0; i < this.availableServicePointVillageMaps.length; i++) {
            if (
                this.availableServicePointVillageMaps[i].providerServiceMapID === servicePointVillageMapObj.providerServiceMapID
                && this.availableServicePointVillageMaps[i].m_providerServiceMapping.districtID === servicePointVillageMapObj.districtID
                && this.availableServicePointVillageMaps[i].m_servicepoint.parkingPlaceID === servicePointVillageMapObj.parkingPlaceID
                && this.availableServicePointVillageMaps[i].servicePointID === servicePointVillageMapObj.servicePointID
                && this.availableServicePointVillageMaps[i].districtBranchID === parseInt(servicePointVillageMapObj.districtBranchID)

            ) {
                count = 1;

            }
        }
        if (count == 1) {
            count = 0;
            return false;

        }
        else
            return true;
    }

    storeServicePointVillageMaps() {
        let obj = { "servicePointVillageMaps": this.servicePointVillageMapList };
        console.log(obj);
        this.servicePointVillageMapService.saveServicePointVillageMaps(obj).subscribe(response => this.servicePointSuccessHandler(response));
    }

    servicePointSuccessHandler(response) {
        this.servicePointVillageMapList = [];
        this.alertMessage.alert("Mapping saved successfully", 'success');
        this.showList();
    }




    districts: any = [];
    getDistricts(stateID) {
        this.servicePointVillageMapService.getDistricts(stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        this.districts = response;
        this.createButton = false;
    }
    taluks: any = [];
    GetTaluks(districtID: number) {
        this.servicePointVillageMapService.getTaluks(districtID)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
    }

    branches: any = [];
    GetBranches(talukID: number) {
        this.servicePointVillageMapService.getBranches(talukID)
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
    updateServicePointVillageMapStatus(servicePointvillageMap) {
        let flag = !servicePointvillageMap.deleted;
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
                this.dataObj.servicePointVillageMapID = servicePointvillageMap.servicePointVillageMapID;
                this.dataObj.deleted = !servicePointvillageMap.deleted;
                this.dataObj.modifiedBy = this.createdBy;
                this.servicePointVillageMapService.updateServicePointVillageMapStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

                servicePointvillageMap.deleted = !servicePointvillageMap.deleted;
            }
            this.alertMessage.alert(status + "d successfully", 'success');
        });
    }
    updateStatusHandler(response) {
        console.log("Service Point status changed");
    }

    searchParkingPlaceID: any;
    searchServicePointID: any;
    showList() {
        // this.searchStateID = null;
        // this.searchDistrictID = null;
        // this.searchParkingPlaceID = null;
        // this.searchServicePointID = null;
        this.getServicePointVillageMaps(this.searchStateID.stateID, this.searchDistrictID.districtID, this.searchParkingPlaceID.parkingPlaceID, this.searchServicePointID.servicePointID);
        this.showServicePointVillageMaps = true;
        //this.createButton = false;
    }
    back() {
        this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                // this.servicePointVillageMapForm.resetForm();
                this.showList();
                this.villageIdList = undefined;

            }
        })
    }
    mappedVillages: any = [];
    villageIdList: any = [];
    existingVillages: any = [];


}