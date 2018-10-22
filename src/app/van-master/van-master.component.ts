import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { VanMasterService } from '../services/ProviderAdminServices/van-master-service.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { ServicePointMasterService } from '../services/ProviderAdminServices/service-point-master-services.service';

@Component({
    selector: 'app-van-master',
    templateUrl: './van-master.component.html'
})
export class VanComponent implements OnInit {

    filteredavailableVans: any = [];
    showVansTable: boolean = false;
    userID: any;
    serviceline: any;
    showVans: any = true;
    availableVans: any = [];
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    availableVanNames: any = [];
    availableVehicleNos: any = [];
    services_array: any = [];
    zones: any = [];
    countryID: any;
    searchStateID: any;
    district: any;
    parking_place: any;
    serviceID: any;
    createdBy: any;
    status: any;
    zoneID: any;
    createButton: boolean = false;
    parkingPlaces: any = [];

    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public vanMasterService: VanMasterService,
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
        this.showVans = false;
        this.showVansTable = false;
        //this.districts = [];
    }
    ngOnInit() {
        this.getProviderServices();
        this.getVanTypes();
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
    setProviderServiceMapID(providerServiceMapID) {
        this.zones = [];
        this.parkingPlaces = [];
        this.filteredavailableVans = [];
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
        this.createButton = false;
        for (let parkingPlaces of this.parkingPlaces) {
            if (parkingPlaces.deleted) {
                const index: number = this.parkingPlaces.indexOf(parkingPlaces);
                if (index !== -1) {
                    this.parkingPlaces.splice(index, 1);
                }
            }
        }
    }

    // districts: any = [];
    // getDistricts(zoneID) {
    //     this.vanMasterService.getDistricts(zoneID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    // }
    // getDistrictsSuccessHandeler(response) {
    //     console.log(response, "districts retrieved");
    //     this.districts = response;
    //     this.availableVans = [];
    //     this.filteredavailableVans = [];
    //     this.createButton = false;
    // }
    obj: any;
    getVanTypes() {
        this.vanMasterService.getVanTypes().subscribe(response => this.getVanTypesSuccessHandler(response));
    }

    availableVanTypes: any;
    getVanTypesSuccessHandler(response) {
        this.availableVanTypes = response;
    }



    getVans(providerServiceMapID, parkingPlaceID) {
        this.vanObj = {};
        //  this.vanObj.stateID = stateID;
        this.vanObj.parkingPlaceID = parkingPlaceID;
        this.vanObj.providerServiceMapID = providerServiceMapID;
        this.vanMasterService.getVans(this.vanObj).subscribe(response => this.getVanSuccessHandler(response));

    }

    getVanSuccessHandler(response) {
        this.availableVans = response;
        this.filteredavailableVans = response;
        this.createButton = true;
        this.showVansTable = true;
        for (let availableVan of this.availableVans) {
            this.availableVanNames.push(availableVan.vanName);
            this.availableVehicleNos.push(availableVan.vehicalNo);
        }
    }

    // taluks: any = [];
    // GetTaluks(parkingPlaceID, districtID) {
    //     let talukObj = {
    //         "parkingPlaceID": parkingPlaceID,
    //         "districtID": districtID
    //     }
    //     this.vanMasterService.getTaluks(talukObj)
    //         .subscribe(response => this.SetTaluks(response));
    // }
    // SetTaluks(response: any) {
    //     this.taluks = response;
    //     if (this.editVanValue != undefined) {
    //         if (this.taluks) {
    //             let taluk = this.taluks.filter((talukRes) => {
    //                 if (this.editVanValue.districtBlockID == talukRes.districtBlockID) {
    //                     return talukRes;
    //                 }
    //             })[0];
    //             if (taluk) {
    //                 this.talukID = taluk;
    //             }
    //         }

    //     }
    // }
    deleteRow(i) {
        this.vanList.splice(i, 1);
    }
    vanObj: any;
    vanList: any = [];
    addVanToList(formValues) {
        this.vanObj = {};
        this.vanObj.vanName = formValues.vanName;
        this.vanObj.vehicalNo = formValues.vehicalNo;
        this.vanObj.countryID = this.countryID;
        this.vanObj.stateID = this.searchStateID.stateID;
        this.vanObj.stateName = this.searchStateID.stateName;
        // this.vanObj.districtID = this.district.districtID;
        // this.vanObj.districtName = this.district.districtName;
        this.vanObj.parkingPlaceID = this.parking_place.parkingPlaceID;
        this.vanObj.parkingPlaceName = this.parking_place.parkingPlaceName;
        this.vanObj.providerServiceMapID = this.searchStateID.providerServiceMapID;
        this.vanObj.vanTypeID = formValues.vanTypeID.split("-")[0];
        this.vanObj.vanType = formValues.vanTypeID.split("-")[1];
        this.vanObj.createdBy = this.createdBy;
        this.checkDuplicates(this.vanObj);
        //this.vanList.push(this.vanObj);

        if (this.vanList.length <= 0) {
            this.alertMessage.alert("No Service available with the state selected");
        }
    }
    checkDuplicates(vanObj) {
        let count = 0
        if (this.vanList.length === 0) {
            this.vanList.push(vanObj);
        }
        else if (this.vanList.length > 0) {
            for (let i = 0; i < this.vanList.length; i++) {
                if (this.vanList[i].vanName === vanObj.vanName
                    && this.vanList[i].providerServiceMapID === vanObj.providerServiceMapID
                    // && this.vanList[i].districtName === vanObj.districtName
                    && this.vanList[i].parkingPlaceName === vanObj.parkingPlaceName
                    && this.vanList[i].vanType === vanObj.vanType
                    && this.vanList[i].vehicalNo === vanObj.vehicalNo) {
                    count = 1;
                }
            }
            if (count === 0) {
                this.vanList.push(vanObj);
            }
            else {
                this.alertMessage.alert("Already exists");
                count = 0;
            }
        }

    }

    storeVans() {
        let obj = { "vanMaster": this.vanList };
        console.log(obj);
        this.vanMasterService.saveVan(obj).subscribe(response => this.vanSuccessHandler(response));
    }

    vanSuccessHandler(response) {
        this.vanList = [];
        this.alertMessage.alert("Saved successfully", 'success');
        this.showList();
    }

    dataObj: any = {};
    updateVanStatus(van) {
        let flag = !van.deleted;
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
                this.dataObj.vanID = van.vanID;
                this.dataObj.deleted = !van.deleted;
                this.dataObj.modifiedBy = this.createdBy;
                this.vanMasterService.updateVanStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

                van.deleted = !van.deleted;
            }
        });

    }
    updateStatusHandler(response) {
        if (this.status === "Deactivate")
            this.alertMessage.alert("Deactivated successfully", 'success');
        else
            this.alertMessage.alert("Activated successfully", 'success')
        console.log("Van status changed");
    }

    showList() {
        this.getVans(this.searchStateID.providerServiceMapID, this.parking_place.parkingPlaceID); this.showVans = true;
        this.showVansTable = true;
        this.editable = false;
        this.vanList = [];
    }

    vanNameExist: any = false;
    checkExistance(vanName) {
        this.vanNameExist = this.availableVanNames.includes(vanName);
        console.log(this.vanNameExist);
    }

    vehicleExist: any = false;
    checkVehicleExistance(vehicleNo) {
        this.vehicleExist = this.availableVehicleNos.includes(vehicleNo);
        console.log(this.vehicleExist);
    }

    vanID: any;
    vanName: any;
    vehicalNo: any;
    vanTypeID: any;
    stateID: any;
    districtID: any;
    parkingPlaceID: any;
    editVanValue: any;

    editVanData(van) {
        this.showVansTable = false;
        this.editVanValue = van;
        this.vanID = van.vanID;
        this.vanName = van.vanName
        this.vehicalNo = van.vehicalNo;
        this.vanTypeID = van.vanTypeID + "-" + van.vanType;
        this.stateID = van.stateID;
        // this.district = van.districtID;
        this.providerServiceMapID = van.providerServiceMapID;
        this.parking_place.parkingPlaceID = van.parkingPlaceID;
        this.parking_place.parkingPlaceName = van.parkingPlaceName;
        this.editable = true;
        // this.GetTaluks(this.parking_place, this.district);
    }

    updateVanData(van) {
        this.dataObj = {};
        this.dataObj.vanID = this.vanID;
        this.dataObj.vanName = van.vanName;
        this.dataObj.vehicalNo = van.vehicalNo;
        this.dataObj.vanTypeID = van.vanTypeID.split("-")[0];
        this.dataObj.countryID = this.countryID;
        this.dataObj.parkingPlaceID = this.parking_place.parkingPlaceID;
        this.dataObj.stateID = this.stateID;
        this.dataObj.providerServiceMapID = this.providerServiceMapID;
        this.dataObj.modifiedBy = this.createdBy;
        this.vanMasterService.updateVanData(this.dataObj).subscribe(response => this.updateHandler(response));

    }

    updateHandler(response) {
        this.editable = false;
        this.alertMessage.alert("Updated successfully", 'success');
        this.availableVanNames = [];
        this.getVans(this.searchStateID.providerServiceMapID, this.parking_place.parkingPlaceID);
    }
    filterComponentList(searchTerm?: string) {
        if (!searchTerm) {
            this.filteredavailableVans = this.availableVans;
        } else {
            this.filteredavailableVans = [];
            this.availableVans.forEach((item) => {
                for (let key in item)
                    if (key == 'vanName' || key == 'vehicalNo' || key == 'vanType') {
                        let value: string = '' + item[key];
                        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                            this.filteredavailableVans.push(item); break;
                        }
                    }
            });
        }

    }
    back() {
        this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                this.showList();
            }
        })
    }





}