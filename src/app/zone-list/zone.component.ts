import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ZoneMasterService } from '../services/ProviderAdminServices/zone-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
    selector: 'app-zone',
    templateUrl: './zone.component.html'
})
export class ZoneComponent implements OnInit {

    showZones: any = true;
    availableZones: any = [];
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    availableZoneNames: any = [];
    countryID: any;
    createdBy:any;
    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public zoneMasterService: ZoneMasterService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.createdBy = this.commonDataService.uname;
    }

    showForm() {
        this.showZones = false;
    }
    ngOnInit() {
        this.getAvailableZones();
        this.getStates();
        //this.getServiceLines();
    }

    stateSelection(stateID) {
        this.getServices(stateID);
    }

    getServices(stateID) {
        this.providerAdminRoleService.getServices(this.service_provider_id, stateID).subscribe(response => this.getServicesSuccessHandeler(response));
    }

    getStates() {
        this.providerAdminRoleService.getStates(this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    }

    getServiceLines(){
        this.zoneMasterService.getServiceLines().subscribe(response => this.getServicesSuccessHandeler(response));
    }

    getStatesByServiceID(serviceID){
        this.zoneMasterService.getStatesByServiceID(serviceID,this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    }

    getStatesSuccessHandeler(response) {
        this.provider_states = response;
    }

    districts: any = [];
    getDistricts(stateID) {
        this.zoneMasterService.getDistricts(stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        this.districts = response;
        console.log(this.districts)
    }
    taluks: any = [];
    GetTaluks(districtID: number) {
        this.zoneMasterService.getTaluks(districtID)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
    }

    branches: any = [];
    GetBranches(talukID: number) {
        this.zoneMasterService.getBranches(talukID)
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
    }

    getAvailableZones() {
        this.zoneMasterService.getZones({"serviceProviderID":this.service_provider_id}).subscribe(response => this.getZonesSuccessHandler(response));
    }


    getZonesSuccessHandler(response) {
        this.availableZones = response;
        for (let availableZone of this.availableZones) {
            this.availableZoneNames.push(availableZone.zoneName);
        }
    }

    zoneNameExist: any = false;
    checkExistance(zoneName) {
        this.zoneNameExist = this.availableZoneNames.includes(zoneName);
        console.log(this.zoneNameExist);
    }

    zoneObj: any;
    zoneList: any = [];
    addZoneToList(values) {
       // for(let services of values.serviceID){
            this.zoneObj = {};
            this.zoneObj.countryID = this.countryID;
            this.zoneObj.zoneName = values.zoneName;
            this.zoneObj.zoneDesc = values.zoneDesc;
            if(values.stateID!=undefined){
                this.zoneObj.stateID = values.stateID.split("-")[0];
                this.zoneObj.stateName = values.stateID.split("-")[1];
            }
            if(values.districtID!=undefined){
                this.zoneObj.districtID = values.districtID.split("-")[0];
                this.zoneObj.districtName = values.districtID.split("-")[1];
            }
            if(values.talukID!=undefined && values.talukID!=""){
                this.zoneObj.districtBlockID = values.talukID.split("-")[0];
                this.zoneObj.blockName = values.talukID.split("-")[1];
            }
            if(values.branchID!=undefined && values.branchID!=""){
                this.zoneObj.districtBranchID = values.branchID.split("-")[0];
                this.zoneObj.villageName = values.branchID.split("-")[1];
            }
            if(values.serviceID!=undefined){
                this.zoneObj.providerServiceMapID = values.serviceID.split("-")[1];
            }
            this.zoneObj.zoneHQAddress = values.zoneHQAddress;

            this.zoneObj.createdBy = this.createdBy;

            this.zoneList.push(this.zoneObj);
        //}
    }

    storezone() {
        console.log(this.zoneList);
        let obj = { "zones": this.zoneList };
        this.zoneMasterService.saveZones(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
    }

    successHandler(response) {
        this.zoneList = [];
        this.alertMessage.alert("Zone stored successfully");
        this.getAvailableZones();
    }

    dataObj: any = {};
    updateZoneStatus(zone) {

        this.dataObj = {};
        this.dataObj.zoneID = zone.zoneID;
        this.dataObj.deleted = !zone.deleted;
        this.dataObj.modifiedBy = this.createdBy;
        this.zoneMasterService.updateZoneStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

        zone.deleted = !zone.deleted;

    }
    updateStatusHandler(response) {
        console.log("Zone status changed");
    }

    zoneID: any;
    zoneName: any;
    zoneDesc: any;
    zoneHQAddress: any;
    stateID: any;
    districtID: any;
    talukID: any;
    branchID: any;
    serviceID: any;
    initializeObj() {
        this.zoneID = "";
        this.zoneName = "";
        this.zoneDesc = "";
        this.zoneHQAddress = "";
        this.stateID = "";
        this.districtID = "";
        this.talukID = "";
        this.branchID = "";
        this.serviceID = "";
    }
    editZoneData(zone) {

        this.zoneID = zone.zoneID;
        this.zoneName = zone.zoneName
        this.zoneDesc = zone.zoneDesc;
        this.zoneHQAddress = zone.zoneHQAddress;
        this.stateID = zone.stateID+"-"+ zone.stateName;
        this.districtID = zone.districtID + "-" + zone.districtName;
        if(zone.districtBlockID!=undefined){
            this.talukID = zone.districtBlockID + "-" + zone.blockName;
        }
        if(zone.districtBranchID!=undefined){
            this.branchID = zone.districtBranchID + "-" + zone.villageName;
        }
        this.serviceID = zone.m_providerServiceMapping.m_serviceMaster.serviceID+"-"+zone.providerServiceMapID;
        this.getDistricts(zone.stateID);
        this.GetTaluks(zone.districtID);
        this.GetBranches(zone.districtBlockID);
        this.getStates();
        this.getServices(zone.stateID);

        this.editable = true;
    }

    updateZoneData(zone) {
        this.dataObj = {};
        this.dataObj.zoneID = zone.zoneID;
        this.dataObj.zoneName = zone.zoneName;
        this.dataObj.zoneDesc = zone.zoneDesc;
        this.dataObj.zoneHQAddress = zone.zoneHQAddress;
        //this.dataObj.providerServiceMapID = zone.serviceID.split("-")[0];
        if(zone.stateID!=undefined){
            this.dataObj.stateID = zone.stateID.split("-")[0];
            this.dataObj.providerServiceMapID = zone.stateID.split("-")[1];
        }
        if(zone.districtID!=undefined){
            this.dataObj.districtID = zone.districtID.split("-")[0];
        }
        if(zone.talukID!=undefined){
            this.dataObj.districtBlockID = zone.talukID.split("-")[0];
        }
        if(zone.branchID!=undefined){
            this.dataObj.districtBranchID = zone.branchID.split("-")[0];
        }
        this.dataObj.modifiedBy = this.createdBy;
        this.zoneMasterService.updateZoneData(this.dataObj).subscribe(response => this.updateHandler(response));

    }

    updateHandler(response) {
        this.editable = false;
        this.alertMessage.alert("updated successfully");
        this.getAvailableZones();
        //this.initializeObj();
    }

    clearEdit() {
        //this.initializeObj();
        this.showZones = true;
        this.editable = false;
    }
}