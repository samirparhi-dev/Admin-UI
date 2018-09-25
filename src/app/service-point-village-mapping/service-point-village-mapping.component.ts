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
    district: any;
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
    parkingPlaces: any = [];


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

    showForm(zoneID) {
        this.showServicePointVillageMaps = false;
        this.formMode = true;
        this.getDistricts(zoneID);
        //  this.districts = [];
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
            this.availableServicePointVillageMaps = [];
            this.filteredavailableServicePointVillageMaps = [];
            this.createButton = false;
        }
    }
    setProviderServiceMapID(providerServiceMapID) {
        this.zones = [];
        // this.districts = [];
        this.parkingPlaces = [];
        // this.taluks = [];
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
    getAllParkingPlaces(zoneID, providerServiceMapID) {
        let parkingPlaceObj = {
            "zoneID": zoneID,
            "providerServiceMapID": providerServiceMapID
        };
        this.servicePointMasterService.getParkingPlaces(parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));

    }
    getParkingPlaceSuccessHandler(response) {
        this.parkingPlaces = response;
    }
    getServicePoints(stateID, parkingPlaceID) {
        this.servicePointVillageMapObj = {};
        this.servicePointVillageMapObj.stateID = stateID;
        // this.servicePointVillageMapObj.districtID = districtID;
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

    getServicePointVillageMaps(stateID, parkingPlaceID, servicePointID) {
        this.servicePointVillageMapObj = {};
        this.servicePointVillageMapObj.stateID = stateID;
        // this.servicePointVillageMapObj.districtID = districtID;
        this.servicePointVillageMapObj.parkingPlaceID = parkingPlaceID;
        // this.servicePointVillageMapObj.districtBlockID = districtBlockID;
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

    districts: any = [];
    getDistricts(zoneID) {
        this.taluks = [];
        this.servicePointMasterService.getDistricts(zoneID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        this.districts = response;
        this.availableServicePointVillageMaps = [];
        this.filteredavailableServicePointVillageMaps = [];
        this.createButton = false;
    }

    taluks: any = [];
    GetTaluks(parkingPlaceID, districtID) {
        let talukObj = {
            "parkingPlaceID": parkingPlaceID,
            "districtID": districtID
        }
        this.servicePointMasterService.getTaluks(talukObj)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
    }

    branches: any = [];
    GetBranches(providerServiceMapID, talukID) {
        this.servicePointVillageMapService.getBranches(talukID)
            .subscribe(response => this.SetBranches(response, providerServiceMapID, talukID));
    }
    SetBranches(response, providerServiceMapID, talukID) {
        this.branches = response;
        if (this.branches) {
            this.checkExistance(providerServiceMapID, talukID);
        }
        //on edit - populate available villages
        if (this.editVillageMapping != undefined) {
            if (this.branches) {
                let village = this.branches.filter((villageResponse) => {
                    if (this.editVillageMapping.districtBranchID == villageResponse.blockID) {
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



                this.servicePointVillageMapObj.districtID = this.district.districtID;
                this.servicePointVillageMapObj.districtName = this.district.districtName;


                this.servicePointVillageMapObj.parkingPlaceID = this.parking_Place.parkingPlaceID;
                this.servicePointVillageMapObj.parkingPlaceName = this.parking_Place.parkingPlaceName;

                this.servicePointVillageMapObj.servicePointID = this.searchServicePointID.servicePointID;
                this.servicePointVillageMapObj.servicePointName = this.searchServicePointID.servicePointName;

                this.servicePointVillageMapObj.districtBlockID = this.talukID.districtBlockID;
                this.servicePointVillageMapObj.districtBlockName = this.talukID.districtBlockName;

                this.servicePointVillageMapObj.districtBranchID = villageId;
                this.servicePointVillageMapObj.villageName = villageName;

                this.servicePointVillageMapObj.providerServiceMapID = this.searchStateID.providerServiceMapID;

                this.servicePointVillageMapObj.createdBy = this.createdBy;
                this.servicePointVillageMapList.push(this.servicePointVillageMapObj);
                this.servicePointVillage.resetForm();

            }
        }
        this.GetBranches(this.searchStateID.providerServiceMapID, this.talukID.districtBlockID)

    }
    existingVillages: any = [];
    availableVillages: any = [];

    checkExistance(providerServiceMapID, talukID) {
        let unmappedObj = {
            "providerServiceMapID": providerServiceMapID,
            "districtBlockID": talukID
        }
        this.servicePointVillageMapService.filterMappedVillages(unmappedObj).subscribe((response) => {
            this.availableVillages = response;
            console.log("availableVillages", this.availableVillages);
            if (!this.editable) {
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
        });

    }

    remove_obj(index) {
        this.servicePointVillageMapList.splice(index, 1);
        this.showForm(this.zoneID.zoneID);

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
        this.getDistricts(this.zoneID.zoneID);
        this.searchServicePointID_edit = mapping.servicePointID;
        this.district = mapping.m_providerServiceMapping.m_district.districtName;
        this.talukID = mapping.blockID;
        this.providerServiceMapID = mapping.providerServiceMapID;
        this.servicePointVillageMapID = mapping.servicePointVillageMapID;
        this.editVillageMapping = mapping;
        this.GetBranches(mapping.providerServiceMapID, mapping.blockID);
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

    parking_Place: any;
    searchServicePointID: any;
    showList() {
        this.showServicePointVillageMaps = true;
        this.editMode = false;
        this.formMode = false;
        if (this.editMode) {
            this.getServicePointVillageMaps(this.searchStateID.stateID, this.parking_Place.parkingPlaceID, this.searchServicePointID_edit);
        }
        else {
            this.getServicePointVillageMaps(this.searchStateID.stateID, this.parking_Place.parkingPlaceID, this.searchServicePointID.servicePointID);
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
                this.servicePointVillageMapList = [];
                this.villageIdList = undefined;
                this.availableVillages = [];
                this.editVillageMapping = undefined;
            }
        })
    }
}