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

    userID(arg0: any): any {
        throw new Error("Method not implemented.");
    }
    serviceline:any;
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
    countryID: any;
    searchStateID: any;
    searchDistrictID: any;
    searchParkingPlaceID: any;
    searchDistrictID_Update: any;
    searchParkingPlaceID_Update: any;
    serviceID: any;
    createdBy: any;
    status: any;
    createButton: boolean = false;

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
        //this.districts = [];
    }
    ngOnInit() {
        //  this.getVans(null, null, null);
        //this.getStates();
        //   this.getStatesByServiceID();
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

    obj: any;
    getVanTypes() {
        this.vanMasterService.getVanTypes().subscribe(response => this.getVanTypesSuccessHandler(response));
    }

    availableVanTypes: any;
    getVanTypesSuccessHandler(response) {
        this.availableVanTypes = response;
    }

    parkingPlaceObj: any;
    getParkingPlaces(stateID, districtID) {
        this.parkingPlaceObj = {};
        this.parkingPlaceObj.stateID = stateID;
        this.parkingPlaceObj.districtID = districtID;
        this.parkingPlaceObj.serviceProviderID = this.service_provider_id;
        this.vanMasterService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));
    }

    availableParkingPlaces: any;
    getParkingPlaceSuccessHandler(response) {
        this.availableParkingPlaces = response;
        this.createButton = false;
        this.searchDistrictID_Update = this.searchDistrictID;
        for (let availableParkingPlaces of this.availableParkingPlaces) {
            if (availableParkingPlaces.deleted) {
                const index: number = this.availableParkingPlaces.indexOf(availableParkingPlaces);
                if (index !== -1) {
                    this.availableParkingPlaces.splice(index, 1);
                }
            }
        }
    }

    getVans(stateID, districtID, parkingPlaceID) {
        debugger;
        this.vanObj = {};
        this.vanObj.stateID = stateID;
        this.vanObj.districtID = districtID;
        this.vanObj.parkingPlaceID = parkingPlaceID;
        this.vanObj.serviceProviderID = this.service_provider_id;
        this.searchParkingPlaceID_Update = this.searchParkingPlaceID;
        this.vanMasterService.getVans(this.vanObj).subscribe(response => this.getVanSuccessHandler(response));

    }

    getVanSuccessHandler(response) {
        this.availableVans = response;
        this.createButton = true;
        for (let availableVan of this.availableVans) {
            this.availableVanNames.push(availableVan.vanName);
            this.availableVehicleNos.push(availableVan.vehicalNo);
        }
    }
    deleteRow(i) {
        this.vanList.splice(i, 1);
    }
    vanObj: any;
    vanList: any = [];
    addVanToList(values) {
        debugger;
        this.vanObj = {};
        this.vanObj.vanName = values.vanName;
        this.vanObj.vehicalNo = values.vehicalNo;
        this.vanObj.countryID = this.countryID;
        this.vanObj.stateID = this.searchStateID.stateID;
        this.vanObj.stateName = this.searchStateID.stateName;
        this.vanObj.districtID = this.searchDistrictID.districtID;
        this.vanObj.districtName = this.searchDistrictID.districtName;
        this.vanObj.parkingPlaceID = this.searchParkingPlaceID.parkingPlaceID;
        this.vanObj.parkingPlaceName = this.searchParkingPlaceID.parkingPlaceName;
        this.vanObj.providerServiceMapID = this.searchStateID.providerServiceMapID;
        this.vanObj.vanTypeID = values.vanTypeID.split("-")[0];
        this.vanObj.vanType = values.vanTypeID.split("-")[1];
        this.vanObj.createdBy = this.createdBy;
        this.checkDuplicates(this.vanObj);
        //this.vanList.push(this.vanObj);

        if (this.vanList.length <= 0) {
            this.alertMessage.alert("No Service available with the state selected");
        }
    }
    checkDuplicates(vanObj) {
        debugger;
        let count = 0
        if (this.vanList.length === 0) {
            this.vanList.push(vanObj);
        }
        else if (this.vanList.length > 0) {
            for (let i = 0; i < this.vanList.length; i++) {
                if (this.vanList[i].vanName === vanObj.vanName
                    && this.vanList[i].providerServiceMapID === vanObj.providerServiceMapID
                    && this.vanList[i].districtName === vanObj.districtName
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

    // stateSelection(stateID) {
    //     this.getServices(stateID);
    // }

    // getServices(stateID) {
    //     this.vanMasterService.getServices(this.service_provider_id, stateID).subscribe(response => this.getServicesSuccessHandeler(response));
    // }

    // getStates() {
    //     this.vanMasterService.getStates(this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    // }

    // getStatesSuccessHandeler(response) {
    //     this.provider_states = response;
    // }

    // getStatesByServiceID() {
    //     this.vanMasterService.getStatesByServiceID(this.serviceID, this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    // }


    districts: any = [];
    getDistricts(stateID) {
        this.vanMasterService.getDistricts(stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        console.log(response, "districts retrieved");
        this.districts = response;
        this.createButton = false;
    }
    taluks: any = [];
    GetTaluks(districtID: number) {
        this.vanMasterService.getTaluks(districtID)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
    }

    branches: any = [];
    GetBranches(talukID: number) {
        this.vanMasterService.getBranches(talukID)
            .subscribe(response => this.SetBranches(response));
    }
    SetBranches(response: any) {
        this.branches = response;
    }


    // getServicesSuccessHandeler(response) {
    //     this.provider_services = response;
    //     for (let provider_service of this.provider_services) {
    //         if ("MMU" == provider_service.serviceName) {
    //             this.providerServiceMapID = provider_service.providerServiceMapID;
    //         }
    //     }
    //     if (this.providerServiceMapID == "" || this.providerServiceMapID == undefined) {
    //         this.alertMessage.alert("No Service available with the state selected");
    //     }
    // }

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
        this.getVans(this.searchStateID.stateID, this.searchDistrictID.districtID, this.searchParkingPlaceID.parkingPlaceID);
        this.showVans = true;
        this.editable = false;
        this.vanObj = [];
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

    initializeObj() {
        this.vanID = "";
        this.vanName = "";
        this.vehicalNo = "";
        this.vanTypeID = "";
        this.stateID = "";
        this.districtID = "";
        this.parkingPlaceID = "";
    }
    editVanData(van) {
        debugger;
        this.vanID = van.vanID;
        this.vanName = van.vanName
        this.vehicalNo = van.vehicalNo;
        this.vanTypeID = van.vanTypeID + "-" + van.vanType;
        this.stateID = van.stateID;
        this.searchDistrictID = van.districtID;
        this.providerServiceMapID = van.providerServiceMapID;
        this.searchParkingPlaceID = van.parkingPlaceID;
        // this.getStatesByServiceID();
        // this.getDistricts(van.stateID);
        //  this.getParkingPlaces(van.stateID, van.districtID);

        this.editable = true;
    }

    updateVanData(van) {
        debugger;
        this.dataObj = {};
        this.dataObj.vanID = this.vanID;
        this.dataObj.vanName = van.vanName;
        this.dataObj.vehicalNo = van.vehicalNo;
        this.dataObj.vanTypeID = van.vanTypeID.split("-")[0];
        this.dataObj.countryID = this.countryID;
        this.dataObj.parkingPlaceID = this.searchParkingPlaceID;
        this.dataObj.stateID = this.stateID;
        this.dataObj.providerServiceMapID = this.providerServiceMapID;
        this.dataObj.districtID = this.searchDistrictID;
        this.dataObj.modifiedBy = this.createdBy;
        this.searchDistrictID = this.searchDistrictID_Update;
        this.searchParkingPlaceID = this.searchParkingPlaceID_Update;
        this.vanMasterService.updateVanData(this.dataObj).subscribe(response => this.updateHandler(response));

    }

    updateHandler(response) {
        this.editable = false;
        this.alertMessage.alert("Updated successfully", 'success');
        this.getVans(this.searchStateID.stateID, this.searchDistrictID.districtID, this.searchParkingPlaceID.parkingPlaceID);
        //this.initializeObj();
    }
    back() {
        this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                this.showList();
            }
        })
    }

}