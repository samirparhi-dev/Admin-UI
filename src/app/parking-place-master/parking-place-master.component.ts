import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ParkingPlaceMasterService } from '../services/ProviderAdminServices/parking-place-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

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
    searchStateID:any;
    searchDistrictID:any;
    serviceID:any;

    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public parkingPlaceMasterService: ParkingPlaceMasterService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.serviceID =  this.commonDataService.serviceIDMMU;
    }

    showForm() {
        this.showParkingPlaces = false;
        this.districts =[];
    }
    ngOnInit() {
        this.getParkingPlaces(null,null);
        //this.getStates();
        this.getStatesByServiceID();
    }
    getParkingPlaces(stateID,districtID){
        this.parkingPlaceObj = {};
        this.parkingPlaceObj.stateID = stateID;
        this.parkingPlaceObj.districtID = districtID;
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
    addParkingPlaceToList(values){
        for (let provider_service of this.provider_services) {
            if ("MMU" == provider_service.serviceName) {
                this.parkingPlaceObj = {};
                this.parkingPlaceObj.parkingPlaceName = values.parkingPlaceName;
                this.parkingPlaceObj.parkingPlaceDesc = values.parkingPlaceDesc;
                this.parkingPlaceObj.countryID = this.countryID;
                this.parkingPlaceObj.stateID = values.stateID;
                if(values.districtID!=undefined){
                    this.parkingPlaceObj.districtID = values.districtID.split("-")[0];
                    this.parkingPlaceObj.districtName = values.districtID.split("-")[1];
                }
                if(values.talukID!=undefined){
                    this.parkingPlaceObj.districtBlockID = values.talukID.split("-")[0];
                    this.parkingPlaceObj.blockName = values.talukID.split("-")[1];
                }
                this.parkingPlaceObj.areaHQAddress = values.areaHQAddress;

                this.parkingPlaceObj.providerServiceMapID = provider_service.providerServiceMapID;
                this.parkingPlaceObj.stateName = provider_service.stateName;
                    
                this.parkingPlaceObj.createdBy = "Admin";

                this.parkingPlaceList.push(this.parkingPlaceObj);
            }
        }
        if(this.parkingPlaceList.length<=0){
            this.alertMessage.alert("No Service available with the state selected");
        }
    }

    storeParkingPlaces(){
        let obj = { "parkingPlaces": this.parkingPlaceList };
        this.parkingPlaceMasterService.saveParkingPlace(obj).subscribe(response => this.parkingPlaceSuccessHandler(response));
    }

    parkingPlaceSuccessHandler(response){
        this.parkingPlaceList = [];
        this.alertMessage.alert("Parking Places stored successfully");
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

    getStatesByServiceID(){
        this.parkingPlaceMasterService.getStatesByServiceID(this.serviceID,this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    }
    

    districts: any = [];
    getDistricts(stateID) {
        this.parkingPlaceMasterService.getDistricts(stateID).subscribe((response: Response) => this.getDistrictsSuccessHandeler(response));
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
        if(this.providerServiceMapID=="" || this.providerServiceMapID ==undefined){
            this.alertMessage.alert("No Service available with the state selected");
        }
    }

     dataObj: any = {};
    updateParkingPlaceStatus(parkingPlace) {

        this.dataObj = {};
        this.dataObj.parkingPlaceID = parkingPlace.parkingPlaceID;
        this.dataObj.deleted = !parkingPlace.deleted;
        this.dataObj.modifiedBy = "Admin";
        this.parkingPlaceMasterService.updateParkingPlaceStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

        parkingPlace.deleted = !parkingPlace.deleted;

    }
    updateStatusHandler(response) {
        console.log("parkingPlace Status Changed");
    }

    showList(){
        this.searchStateID ="";
        this.searchDistrictID ="";
        this.getParkingPlaces(null,null);
        this.showParkingPlaces=true;
    }

    parkingPlaceNameExist: any = false;
    checkExistance(parkingPlaceName) {
        this.parkingPlaceNameExist = this.availableParkingPlaceNames.includes(parkingPlaceName);
        console.log(this.parkingPlaceNameExist);
    }
    
    
}