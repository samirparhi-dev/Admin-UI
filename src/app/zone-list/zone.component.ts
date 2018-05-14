import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ZoneMasterService } from '../services/ProviderAdminServices/zone-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
    selector: 'app-zone',
    templateUrl: './zone.component.html'
})
export class ZoneComponent implements OnInit {

    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    countryID: any;
    createdBy: any;
    userID: any;
    nationalFlag: any;
    zoneObj: any;
    zoneNameExist: any = false;
    editable: any = false;
    showZones: any = true;

    /*arrays*/
    states: any = [];
    services: any = [];
    districts: any = [];
    taluks: any = [];
    branches: any = [];    
    zoneList: any = [];
    availableZoneNames: any = [];
    availableZones: any = [];


    @ViewChild('zoneForm') ZoneForm: NgForm;
    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public zoneMasterService: ZoneMasterService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.createdBy = this.commonDataService.uname;
    }

    ngOnInit() {
        this.userID = this.commonDataService.uid;
        this.getAvailableZones();
    }

    getAvailableZones() {
        this.zoneMasterService.getZones({ "serviceProviderID": this.service_provider_id }).subscribe(response => this.getZonesSuccessHandler(response));
    }

    getZonesSuccessHandler(response) {
        console.log("all zones", response);
        
        this.availableZones = response;
        for (let availableZone of this.availableZones) {
            this.availableZoneNames.push(availableZone.zoneName);
        }
    }

    showForm() {
        this.showZones = false;
        this.editable = false;
        this.getServiceLines();
    }
    getServiceLines() {
        // this.zoneMasterService.getServiceLines().subscribe(response => this.getServicesSuccessHandeler(response));
        this.zoneMasterService.getServiceLinesNew(this.userID).subscribe((response) => {
            console.log("service response", response);
            this.getServicesSuccessHandeler(response),
                (err) => {
                    console.log("ERROR in fetching serviceline", err);
                    //this.alertMessage.alert(err, 'error');
                }
        });
    }
    getServicesSuccessHandeler(response) {
        this.services = response;
        console.log("services array", this.services);       
    }
    getStates(value) {
        console.log("value", value);
        let obj = {
            'userID': this.userID,
            'serviceID': value.serviceID,
            'isNational': value.isNational
        }
        this.zoneMasterService.getStatesNew(obj).
            subscribe((response) => {
                console.log("state response", response);
                
                this.getStatesSuccessHandeler(response),
                    (err) => {
                        console.log("error in fetching states", err);
                    }
                //this.alertMessage.alert(err, 'error');
            });

    }
    
    getStatesSuccessHandeler(response) {
        console.log("state response", response);
        this.states = response;      
    }
    setProviderServiceMapID(providerServiceMapID) {
        console.log("providerServiceMapID", providerServiceMapID);
        this.providerServiceMapID = providerServiceMapID;
        //this.search();
    }
    getDistricts(state) {
        console.log("stateID", state);
        this.zoneMasterService.getDistricts(state.stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));
       
    }
    getDistrictsSuccessHandeler(response) {
        console.log("response", response);
        this.districts = response;
        console.log(this.districts);
    }
    GetTaluks(districtID: number) {
        this.zoneMasterService.getTaluks(districtID)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
    }

    GetBranches(talukID: number) {
        console.log("GetBranches", talukID);
        
        this.zoneMasterService.getBranches(talukID)
            .subscribe(response => this.SetBranches(response));
    }
    SetBranches(response: any) {
        console.log("village response", response);
        this.branches = response;
    }
    checkExistance(zoneName) {
        this.zoneNameExist = this.availableZoneNames.includes(zoneName);
        console.log(this.zoneNameExist);
    }
    addZoneToList(values) {
        console.log("values", values);
        // for(let services of values.serviceID){
        this.zoneObj = {};
        this.zoneObj.countryID = this.countryID;
        this.zoneObj.zoneName = values.zoneName;
        this.zoneObj.zoneDesc = values.zoneDesc;
        if (values.state.stateID != undefined) {
            this.zoneObj.stateID = values.state.stateID;
            this.zoneObj.stateName = values.state.stateName;
        }
        if (values.districtID != undefined) {
            this.zoneObj.districtID = values.districtID.split("-")[0];
            this.zoneObj.districtName = values.districtID.split("-")[1];
        }
        if (values.talukID != undefined && values.talukID != "") {
            this.zoneObj.districtBlockID = values.talukID.split("-")[0];
            this.zoneObj.blockName = values.talukID.split("-")[1];
        }
        if (values.branchID != undefined && values.branchID != "") {
            this.zoneObj.districtBranchID = values.branchID.split("-")[0];
            this.zoneObj.villageName = values.branchID.split("-")[1];
        }
        
        this.zoneObj.zoneHQAddress = values.zoneHQAddress;
        this.zoneObj.providerServiceMapID = this.providerServiceMapID;
        this.zoneObj.createdBy = this.createdBy;

        if (this.zoneList.length == 0) {
            this.zoneList.push(this.zoneObj);
        }
        else {
            let count = 0
            for (let a; a < this.zoneList.length; a++) {
                if (this.zoneObj[a].providerServiceMapID == this.zoneObj.providerServiceMapID &&
                    this.zoneObj[a].zoneName == this.zoneObj.zoneName) {
                    count = count + 1;
                }
            }
            if (count >= 0)
                this.alertMessage.alert("Already exists");
            else {
                this.zoneList.push(this.zoneObj);
                console.log("this.zonelist", this.zoneList);
            }

        }

    }

    storezone() {
        console.log("zonelist",this.zoneList);
        let obj = { "zones": this.zoneList };
        this.zoneMasterService.saveZones(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
    }

    successHandler(response) {
        console.log("save response", response);
        this.zoneList = [];
        this.alertMessage.alert("Saved successfully", 'success');
        this.getAvailableZones();
        this.showZones = true;
        this.editable = false;
    }

// getStatesByServiceID(serviceID) {
    //     this.zoneMasterService.getStatesByServiceID(serviceID, this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    // }
    stateSelection(stateID) {
        this.getServices(stateID);
    }

    getServices(stateID) {
        this.providerAdminRoleService.getServices_filtered(this.service_provider_id, stateID).subscribe(response => this.getServicesSuccessHandeler(response));
    }

    // getStates() {
    //     this.providerAdminRoleService.getStates(this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    // }
  

    
  

   
   
    remove_obj(index) {
        this.zoneList.splice(index, 1);
    }

    dataObj: any = {};
    updateZoneStatus(zone) {

        let flag = !zone.deleted;
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
                this.dataObj.zoneID = zone.zoneID;
                this.dataObj.deleted = !zone.deleted;
                this.dataObj.modifiedBy = this.createdBy;
                this.zoneMasterService.updateZoneStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

                zone.deleted = !zone.deleted;
            }
            this.alertMessage.alert(status + "d successfully", 'success');
        });

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
        this.stateID = zone.stateID + "-" + zone.stateName;
        this.districtID = zone.districtID + "-" + zone.districtName;
        if (zone.districtBlockID != undefined) {
            this.talukID = zone.districtBlockID + "-" + zone.blockName;
        }
        if (zone.districtBranchID != undefined) {
            this.branchID = zone.districtBranchID + "-" + zone.villageName;
        }
        this.serviceID = zone.m_providerServiceMapping.m_serviceMaster.serviceID + "-" + zone.providerServiceMapID;
        this.getDistricts(zone.stateID);
        this.GetTaluks(zone.districtID);
        this.GetBranches(zone.districtBlockID);
        // this.getStates();
        this.getServices(zone.stateID);

        this.editable = true;
    }

    updateZoneData(zone) {
        this.dataObj = {};
        this.dataObj.zoneID = this.zoneID;
        this.dataObj.zoneName = zone.zoneName;
        this.dataObj.zoneDesc = zone.zoneDesc;
        this.dataObj.zoneHQAddress = zone.zoneHQAddress;
        //this.dataObj.providerServiceMapID = zone.serviceID.split("-")[0];
        if (zone.stateID != undefined) {
            this.dataObj.stateID = zone.stateID.split("-")[0];
        }
        if (zone.districtID != undefined) {
            this.dataObj.districtID = zone.districtID.split("-")[0];
        }
        if (zone.talukID != undefined) {
            this.dataObj.districtBlockID = zone.talukID.split("-")[0];
        }
        if (zone.branchID != undefined) {
            this.dataObj.districtBranchID = zone.branchID.split("-")[0];
        }
        this.dataObj.modifiedBy = this.createdBy;
        // this.dataObj.zoneID = this.zoneID;
        this.zoneMasterService.updateZoneData(this.dataObj).subscribe(response => this.updateHandler(response));

    }

    updateHandler(response) {
        // this.editable = false;
        this.alertMessage.alert("Updated successfully", 'success');
        this.getAvailableZones();
        this.clearEdit();
        //this.initializeObj();
    }

    clearEdit() {
        //this.initializeObj();
        this.showZones = true;
        this.editable = false;
    }
    back() {
        this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                this.ZoneForm.resetForm();
                this.zoneList = [];
                this.clearEdit();

            }
        })
    }
}