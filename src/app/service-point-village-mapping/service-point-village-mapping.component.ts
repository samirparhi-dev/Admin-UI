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

    filteredavailableServicePointVillageMaps: any = [];
    formMode: boolean = false;
    villageIdList_edit: any;
    servicePointVillageMapID: any;
    searchServicePointID_edit: any;
    searchParkingPlaceID_edit: any;
    searchDistrictID_edit: any;
    editMode: boolean = false;
    serviceline: any;
    createButton: boolean = false;
    services_array: any;
    userID: any;
    talukID: any;
    showServicePointVillageMaps: any = false;
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    countryID: any;
    searchStateID: any;
    searchDistrictID: any;
    serviceID: any;
    createdBy: any;
    zoneID: any;
    servicePointVillageMapObj: any;

    /*Arrays*/
    zones: any = [];
    bufferVillagesArray: any = [];
    servicePointVillageMapList: any = [];
    mappedVillageIDs: any = [];
    villageIdList: any = [];
    availableServicePointVillageMapNames: any = [];
    availableServicePointVillageMaps: any = [];


    @ViewChild('servicePointVillageMapForm') servicePointVillageMapForm: NgForm;
    @ViewChild('servicePointVillage') servicePointVillage: NgForm;
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

    showForm(stateID, zoneID, districtID, parkingPlaceID, districtBlockID) {
        this.showServicePointVillageMaps = false;
        this.formMode = true;
        this.GetBranches(stateID, zoneID, districtID, parkingPlaceID, districtBlockID);
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
            this.availableServicePointVillageMaps = [];
            this.filteredavailableServicePointVillageMaps = [];
            this.createButton = false;
        }
    }
    setProviderServiceMapID(providerServiceMapID) {
        this.zones = [];
        this.districts = [];
        this.availableParkingPlaces = [];
        this.taluks = [];
        this.availableServicePoints = [];
        this.filteredavailableServicePointVillageMaps = [];
        console.log("providerServiceMapID", providerServiceMapID);
        this.providerServiceMapID = providerServiceMapID;
        this.getAvailableZones(this.providerServiceMapID);

    }
    getAvailableZones(providerServiceMapID) {
        this.servicePointMasterService.getZones({ "providerServiceMapID": providerServiceMapID }).subscribe(response => this.getZonesSuccessHandler(response));
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
    districts: any = [];
    getDistricts(zoneID) {
        this.availableParkingPlaces = [];
        this.availableServicePoints = [];
        this.taluks = [];
        this.servicePointVillageMapService.getDistricts(zoneID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        this.districts = response;
        this.availableServicePointVillageMaps = [];
        this.filteredavailableServicePointVillageMaps = [];
        this.createButton = false;
    }
    parkingPlaceObj: any;
    getParkingPlaces(stateID, districtID) {
        this.availableServicePoints = [];
        this.parkingPlaceObj = {};
        this.parkingPlaceObj.stateID = stateID;
        this.parkingPlaceObj.districtID = districtID;
        this.parkingPlaceObj.serviceProviderID = this.service_provider_id;
        this.servicePointVillageMapService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));
    }

    availableParkingPlaces: any;
    getParkingPlaceSuccessHandler(response) {
        this.availableParkingPlaces = response;
        this.availableServicePointVillageMaps = [];
        this.taluks = [];
        this.filteredavailableServicePointVillageMaps = [];
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

    taluks: any = [];
    GetTaluks(parkingPlaceID: number) {
        this.servicePointVillageMapService.getTaluks(parkingPlaceID)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
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
        this.availableServicePointVillageMaps = [];
        this.filteredavailableServicePointVillageMaps = [];
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
        this.filteredavailableServicePointVillageMaps = response;
        this.createButton = true;
        this.showServicePointVillageMaps = true;
        for (let availableServicePointVillageMap of this.availableServicePointVillageMaps) {
            this.availableServicePointVillageMapNames.push(availableServicePointVillageMap.m_servicepoint.servicePointName);
        }
    }
    remove_obj(index) {
        this.servicePointVillageMapList.splice(index, 1);
        this.showForm(this.searchStateID.stateID, this.zoneID.zoneID, this.searchDistrictID.districtID, this.searchParkingPlaceID.parkingPlaceID, this.talukID.districtBlockID);

    }
    branches: any = [];
    GetBranches(stateID, zoneID, districtID, parkingPlaceID, talukID) {
        this.servicePointVillageMapService.getBranches(talukID)
            .subscribe(response => this.SetBranches(response, stateID, zoneID, districtID, parkingPlaceID, talukID));
    }
    SetBranches(response, stateID, zoneID, districtID, parkingPlaceID, talukID) {
        this.branches = response;
        if (this.branches) {
            this.checkExistance(stateID, zoneID, districtID, parkingPlaceID, talukID);
        }
        //on edit - populate available villages
        if (this.editVillageMapping != undefined) {
            if (this.branches) {
                let village = this.branches.filter((villageResponse) => {
                    if (this.editVillageMapping.districtBranchID == villageResponse.districtBranchID) {
                        return villageResponse;
                    }
                })[0];
                if (village) {
                    this.villageIdList_edit = village;
                    this.availableVillages.push(village);
                }

            }
        }
    }


    addServicePointVillageMapToList(values) {

        let villageIds = [];
        for (let villages of values.villageIdList) {
            let villageId = villages.districtBranchID;
            let villageName = villages.villageName;

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
                this.servicePointVillageMapList.push(this.servicePointVillageMapObj);
                this.servicePointVillage.resetForm();

            }
        }
        this.showForm(this.searchStateID.stateID, this.zoneID.zoneID, this.searchDistrictID.districtID, this.searchParkingPlaceID.parkingPlaceID, this.talukID.districtBlockID);

    }
    existingVillages: any = [];
    availableVillages: any = [];
    checkExistance(stateID, zoneID, districtID, parkingPlaceID, talukID) {
        this.availableServicePointVillageMaps.forEach((availableServicePointVillageMappings) => {
            if (availableServicePointVillageMappings.providerServiceMapID != undefined && availableServicePointVillageMappings.providerServiceMapID == stateID.providerServiceMapID) {
                if (!availableServicePointVillageMappings.deleted) {
                    this.existingVillages.push(availableServicePointVillageMappings.districtBranchID);
                }
            }
        });
        this.availableVillages = this.branches.slice();

        let temp = [];
        this.availableVillages.forEach((villages) => {
            let index = this.existingVillages.indexOf(villages.districtBranchID);
            if (index < 0) {
                temp.push(villages);
            }
        });
        this.availableVillages = temp.slice(); // available villages has villages except existing villages

        if (this.servicePointVillageMapList.length > 0) {
            this.servicePointVillageMapList.forEach((servicePointVillageMap) => {
                this.bufferVillagesArray.push(servicePointVillageMap.districtBranchID)
            });
        }
        let bufferTemp = [];
        this.availableVillages.forEach((villages) => {
            let index = this.bufferVillagesArray.indexOf(villages.districtBranchID);
            if (index < 0) {
                bufferTemp.push(villages);
            }
        });

        //available villages has villages except existing villages and the villages which are added in a buffer array
        this.availableVillages = bufferTemp.slice();
        this.bufferVillagesArray = [];
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
        this.existingVillages = []; // Reset the existing villages array
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

    editVillageMapping: any;
    editServiceVillageMapping(mapping) {
        this.editMode = true;
        this.showServicePointVillageMaps = false;
        this.formMode = false;
        this.searchDistrictID_edit = mapping.m_providerServiceMapping.districtID;
        this.searchParkingPlaceID_edit = mapping.m_servicepoint.parkingPlaceID;
        this.searchServicePointID_edit = mapping.servicePointID;
        this.providerServiceMapID = mapping.providerServiceMapID;
        this.servicePointVillageMapID = mapping.servicePointVillageMapID;
        this.editVillageMapping = mapping;
        this.GetBranches(this.searchStateID, this.zoneID.zoneID, this.searchDistrictID.districtID, this.searchParkingPlaceID.parkingPlaceID, this.talukID.districtBlockID);
        // this.villageIdList_edit = mapping.districtBranchID;

    }
    updateStoreServicePointVillageMaps() {
        let obj = {
            "servicePointVillageMapID": this.servicePointVillageMapID,
            "servicePointID": this.searchServicePointID_edit,
            "districtBranchID": this.villageIdList_edit.districtBranchID,
            "providerServiceMapID": this.providerServiceMapID,
            "modifiedBy": this.createdBy
        }
        // if (!this.checkDb(obj))
        this.servicePointVillageMapService.updateServicePointVillageMaps(obj).subscribe(response => this.updateServicePointSuccessHandler(response));
        // else
        //     this.alertMessage.alert("Already Mapped");

    }
    updateServicePointSuccessHandler(response) {
        this.servicePointVillageMapList = [];
        this.alertMessage.alert("Mapping updated successfully", 'success');
        this.showList();
    }

    searchParkingPlaceID: any;
    searchServicePointID: any;
    showList() {
        this.showServicePointVillageMaps = true;
        this.editMode = false;
        this.formMode = false;
        if (this.editMode) {
            this.getServicePointVillageMaps(this.searchStateID.stateID, this.searchDistrictID_edit, this.searchParkingPlaceID_edit, this.searchServicePointID_edit);
        }
        else {
            this.getServicePointVillageMaps(this.searchStateID.stateID, this.searchDistrictID.districtID, this.searchParkingPlaceID.parkingPlaceID, this.searchServicePointID.servicePointID);
        }
    }
    filterComponentList(searchTerm?: string) {
        if (!searchTerm) {
            this.filteredavailableServicePointVillageMaps = this.availableServicePointVillageMaps;
        } else {
            this.filteredavailableServicePointVillageMaps = [];
            this.availableServicePointVillageMaps.forEach((item) => {
                for (let key in item) {
                    let value: string = '' + item[key];
                    if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                        this.filteredavailableServicePointVillageMaps.push(item); break;
                    }
                }
            });
        }


    }
    back() {
        this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                this.showList();
                this.villageIdList = undefined;
                this.availableVillages = [];
                this.editVillageMapping = undefined;
            }
        })
    }
}