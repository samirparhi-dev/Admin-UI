import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { VillageMasterService } from './../services/adminServices/AdminVillage/village-master-service.service';

@Component({
    selector: 'app-village-master',
    templateUrl: './village-master.component.html'
})
export class VillageMasterComponent implements OnInit {

    showVillages: any = true;
    availableVillages: any = [];
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    availableVillageNames: any = [];
    countryID: any;
    createdBy:any;
    constructor(
        public commonDataService: dataService,
        private alertMessage: ConfirmationDialogsService,
        private villageMasterService: VillageMasterService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.createdBy = this.commonDataService.uname;
    }

    showForm() {
        this.showVillages = false;
    }
    ngOnInit() {
        this.getStates();
        //this.getServiceLines();
    }

    stateSelection(stateID) {
       
    }

    getStates() {
        this.villageMasterService.getStates(this.countryID).subscribe(response => this.getStatesSuccessHandeler(response));
    }

    getStatesSuccessHandeler(response) {
        this.provider_states = response;
    }

    districts: any = [];
    getDistricts(stateID) {
        this.villageMasterService.getDistricts(stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        this.districts = response;
        console.log(this.districts)
    }
    taluks: any = [];
    GetTaluks(districtID: number) {
        this.villageMasterService.getTaluks(districtID)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
    }

    GetBranches(talukID: number) {
        let data = {"blockID":talukID};
        this.villageMasterService.getBranches(data)
            .subscribe(response => this.SetBranches(response));
    }
    SetBranches(response: any) {
        this.availableVillages = response;
        for(let villages of this.availableVillages){
            this.availableVillageNames.push(villages.blockID +"-"+villages.villageName.toUpperCase());
        }
    }

    villageNameExist: any = false;
    checkExistance(blockID,villageName) {
        this.villageNameExist = this.availableVillageNames.includes(blockID+"-"+villageName.toUpperCase());
        console.log(this.villageNameExist);
    }

    villageObj: any;
    villageList: any = [];
    addVillageToList(values) {
       // for(let services of values.serviceID){
            this.villageObj = {};

            if(values.blockID!=undefined){
                this.villageObj.blockID = values.blockID.split("-")[0];
                this.villageObj.blockName = values.blockID.split("-")[1];
            }
            this.villageObj.panchayatName = values.panchayatName;
            this.villageObj.villageName = values.villageName;
            this.villageObj.habitat = values.habitat;
            this.villageObj.pinCode = values.pinCode;
            this.villageObj.govVillageID = values.govVillageID;
            this.villageObj.govSubDistrictID = values.govSubDistrictID;

            this.villageObj.createdBy = this.createdBy;

            this.villageList.push(this.villageObj);
        //}
    }

    storeVillages() {
        console.log(this.villageList);
        let obj = { "districtBranchMapping": this.villageList };
        this.villageMasterService.storeVillages(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
    }

    successHandler(response) {
        this.villageList = [];
        this.alertMessage.alert("Village stored successfully");
    }

    dataObj: any = {};
    updateVillageStatus(village) {
      let flag = !village.deleted;
      let status;
        if(flag===true){
            status = "Deactivate";
        }
        if(flag===false) {
            status = "Activate";
        }

        this.alertMessage.confirm("Are you sure you want to "+status+"?").subscribe(response=>{
                if(response)
                {
                    this.dataObj = {};
                    this.dataObj.districtBranchID = village.districtBranchID;
                    this.dataObj.deleted = !village.deleted;
                    this.dataObj.modifiedBy = this.createdBy;
                    this.villageMasterService.updateVillageStatus(JSON.stringify(this.dataObj)).subscribe(response => this.updateStatusHandler(response));
                    village.deleted = !village.deleted;
                }
            });
        

        

    }
    updateStatusHandler(response) {
        console.log("Village status changed");
    }
    searchStateID:any;
    stateID:any;
    searchDistrictID:any;
    districtID:any;
    searchTalukID:any;
    districtBranchID: any;
    villageName: any;
    blockID: any;
    panchayatName: any;
    habitat: any;
    pinCode: any;
    govVillageID: any;
    govSubDistrictID: any;

    initializeObj() {
        this.districtBranchID = "";
        this.villageName = "";
        this.blockID = "";
        this.panchayatName = "";
        this.habitat = "";
        this.pinCode = "";
        this.govVillageID = "";
        this.govSubDistrictID = "";

    }
    editVillageData(village) {

        if(this.searchStateID!=""){
            this.stateID = this.searchStateID;
        }
        if(this.searchDistrictID!=""){
            this.districtID = this.searchDistrictID;
        }
        this.districtBranchID = village.districtBranchID;
        this.blockID = village.blockID+ "-" + village.blockName;
        this.panchayatName = village.panchayatName;
        this.villageName = village.villageName;
        this.habitat = village.habitat;
        this.pinCode = village.pinCode;
        this.govVillageID = village.govVillageID;
        this.govSubDistrictID = village.govSubDistrictID;
        
        this.getDistricts(village.stateID);
        this.GetTaluks(this.searchDistrictID);

        this.editable = true;
    }

    updateVillageData(village) {
        this.dataObj = {};
        this.dataObj.districtBranchID = village.districtBranchID;
        if(village.blockID!=undefined){
            this.dataObj.blockID = village.blockID.split("-")[0];
            this.dataObj.blockName = village.blockID.split("-")[1];
        }
        this.dataObj.panchayatName = village.panchayatName;
        this.dataObj.villageName = village.villageName;
        this.dataObj.habitat = village.habitat;
        this.dataObj.pinCode = village.pinCode;
        this.dataObj.govVillageID = village.govVillageID;
        this.dataObj.govSubDistrictID = village.govSubDistrictID;
        
        this.dataObj.modifiedBy = this.createdBy;
        this.villageMasterService.updateVillageData(this.dataObj).subscribe(response => this.updateHandler(response));
        
    }

    updateHandler(response) {
        this.editable = false;
        this.alertMessage.alert("updated successfully");
        this.GetBranches(this.dataObj.blockID);
        
    }

    clearEdit() {
        //this.initializeObj();
        this.showVillages = true;
        this.editable = false;
    }

    showList(){
        this.stateID = this.searchStateID;
        this.districtID = this.searchDistrictID;
        this.searchStateID ="";
        this.searchDistrictID ="";
        this.searchTalukID = "";
    }
}