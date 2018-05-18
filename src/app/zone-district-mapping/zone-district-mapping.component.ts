import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ZoneMasterService } from '../services/ProviderAdminServices/zone-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-zone-district-mapping',
    templateUrl: './zone-district-mapping.component.html'
})
export class ZoneDistrictMappingComponent implements OnInit {

    userID: any;
    data: any;
    providerServiceMapID: any;
    service_provider_id: any;
    checkExistDistricts: any;
    zoneDistrictMappingObj: any;
    createdBy: any;

    editable: any = false;
    showMappings: any = true;

    bufferCount: any = 0;
    count: any = 0;

    /* array*/
    availableZoneDistrictMappings: any = [];
    services: any = [];
    states: any = [];
    availableZones: any = [];
    districts: any = [];
    mappedDistricts: any = [];
    districtID: any = [];
    existingDistricts: any = [];
    zoneDistrictMappingList: any = [];
    mappedDistrictIDs: any = [];



    @ViewChild('zoneDistrictMappingForm') zoneDistrictMappingForm: NgForm;
    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public zoneMasterService: ZoneMasterService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.createdBy = this.commonDataService.uname;
    }

    ngOnInit() {
        this.userID = this.commonDataService.uid;
        this.getAvailableZoneDistrictMappings();
    }

    getAvailableZoneDistrictMappings() {
        this.zoneMasterService.getZoneDistrictMappings({ "serviceProviderID": this.service_provider_id }).subscribe(response => this.getZoneDistrictMappingsSuccessHandler(response));
    }

    getZoneDistrictMappingsSuccessHandler(response) {
        this.availableZoneDistrictMappings = response;       
    }


    showForm() {
        this.showMappings = false;
        this.getServiceLines();
    }
    getServiceLines() {
        this.zoneMasterService.getServiceLinesNew(this.userID).subscribe((response) => {
            this.getServicesSuccessHandeler(response),
                (err) => {
                    console.log("ERROR in fetching serviceline", err);
                    // this.alertMessage.alert(err, 'error');
                }
        });
    }
    getServicesSuccessHandeler(response) {
        this.services = response;
    }
    getStates(value) {
        let obj = {
            'userID': this.userID,
            'serviceID': value.serviceID,
            'isNational': value.isNational
        }
        this.zoneMasterService.getStatesNew(obj).
            subscribe((response) => {
                this.getStatesSuccessHandeler(response),
                    (err) => {
                        console.log("error in fetching states", err);
                    }
                //this.alertMessage.alert(err, 'error');
            });

    }

    getStatesSuccessHandeler(response) {
        this.states = response;
    }
    setProviderServiceMapID(providerServiceMapID) {
        console.log("providerServiceMapID", providerServiceMapID);
        this.providerServiceMapID = providerServiceMapID;
        this.getAvailableZones();

    }
    getAvailableZones() {
        this.zoneMasterService.getZones({ "providerServiceMapID": this.providerServiceMapID }).subscribe(response => this.getZonesSuccessHandler(response));
    }

    service: any;
    zoneID: any;
    state: any;
    checkZone() {

        this.getDistricts(this.state);
    }

    getZonesSuccessHandler(response) {
        if (response != undefined) {
            for (let zone of response) {
                if (!zone.deleted) {
                    this.availableZones.push(zone);
                }
            }
        }
    }
    getDistricts(state) {
        debugger;
        this.zoneMasterService.getDistricts(state.stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));

    }
    getDistrictsSuccessHandeler(response) {
        this.districts = response;
        if (this.districts)
            this.checkExistance(this.service, this.zoneID);
    }

    // addZoneDistrictMappingToList(values) {  
    //     debugger;     
    //     console.log("values", values);
    //     let districtIds = [];
    //     for (let districts of values.districtID) {
    //         districtIds.push(districts.split("-")[0]);
    //     }

    //     //find district deselected from the list , and Remove zone mapping with that district       

    //     for (let mappedDistrict of this.mappedDistricts) { 
    //         debugger;         
    //         this.mappedDistrictIDs.push(mappedDistrict.districtID); // fetching mapped districtID's

    //         this.dataObj = {};
    //         this.dataObj.zoneDistrictMapID = mappedDistrict.zoneDistrictMapID;
    //         this.dataObj.modifiedBy = this.createdBy;
    //         console.log("b4 obj", districtIds.indexOf(mappedDistrict.districtID.toString()));
    //         if (districtIds.indexOf(mappedDistrict.districtID.toString()) == -1) {            
    //             this.dataObj.deleted = true;
    //             // this.zoneMasterService.updateZoneMappingStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));
    //         } else if (mappedDistrict.deleted) {
    //             this.dataObj.deleted = false;
    //             //  this.zoneMasterService.updateZoneMappingStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));
    //         }
    //     }



    //     for (let districts of values.districtID) { 
    //         debugger;         
    //         let districtId = districts.split("-")[0];
    //         //make a map of zone with District, If the districtId not in the mappedDistrictIDs( already mapped districtID's)
    //         if (this.mappedDistrictIDs.indexOf(parseInt(districtId)) == -1) {
    //             this.zoneDistrictMappingObj = {};
    //             this.zoneDistrictMappingObj.zoneID = values.zoneID.zoneID;
    //             this.zoneDistrictMappingObj.zoneName = values.zoneID.zoneName;
    //             this.zoneDistrictMappingObj.districtID = districtId;
    //             this.zoneDistrictMappingObj.districtName = districts.split("-")[1];
    //             this.zoneDistrictMappingObj.providerServiceMapID = values.zoneID.providerServiceMapID;
    //             this.zoneDistrictMappingObj.stateName = values.zoneID.stateName;
    //             this.zoneDistrictMappingObj.createdBy = this.createdBy;
    //             this.checkBufferDuplicates(this.zoneDistrictMappingObj);

    //         } else {               
    //             this.count = this.count + 1;
    //             console.log("already mapped with these districts");
    //         }
    //     }
    //     if (this.count > 0) { 
    //         debugger;           
    //         this.alertMessage.alert("Already mapped");
    //         this.zoneDistrictMappingForm.resetForm();  
    //         this.mappedDistrictIDs = [];
    //         this.resetDropdowns();
    //         this.count = 0;

    //     }
    //     if (this.bufferCount > 0) { 
    //         debugger;          
    //         this.alertMessage.alert("Already exists");
    //         this.zoneDistrictMappingForm.resetForm(); 
    //         this.resetDropdowns();
    //         this.bufferCount = 0;
    //     }      

    // }
    bufferDistrictsArray: any = [];
    addZoneDistrictMappingToList(values) {
        console.log("values", values);

        for (let districts of values.districtID) {
            let districtId = districts.districtID;

            this.zoneDistrictMappingObj = {};
            this.zoneDistrictMappingObj.zoneID = values.zoneID.zoneID;
            this.zoneDistrictMappingObj.zoneName = values.zoneID.zoneName;
            this.zoneDistrictMappingObj.districtID = districtId;
            this.zoneDistrictMappingObj.districtName = districts.districtName;
            this.zoneDistrictMappingObj.providerServiceMapID = values.zoneID.providerServiceMapID;
            this.zoneDistrictMappingObj.stateName = values.state.stateName;
            this.zoneDistrictMappingObj.serviceID = values.service.serviceID;
            this.zoneDistrictMappingObj.createdBy = this.createdBy;
            // this.checkBufferDuplicates(this.zoneDistrictMappingObj);
            this.zoneDistrictMappingList.push(this.zoneDistrictMappingObj);
            this.zoneDistrictMappingForm.resetForm();
            this.resetDropdowns();
            console.log('buffer', this.zoneDistrictMappingList);
            debugger;

        }


    }

    checkBufferDuplicates(zoneDistrictMappingObj) {
        debugger;
        /* case:1 If the buffer array is empty */
        if (this.zoneDistrictMappingList.length === 0) {
            this.zoneDistrictMappingList.push(zoneDistrictMappingObj);
            console.log('buffer', this.zoneDistrictMappingList);

        }

        /* case:2 If the buffer array is not empty */
        else if (this.zoneDistrictMappingList.length > 0) {
            debugger;
            for (let a = 0; a < this.zoneDistrictMappingList.length; a++) {
                if (this.zoneDistrictMappingList[a].zoneID === zoneDistrictMappingObj.zoneID
                    && this.zoneDistrictMappingList[a].zoneName === zoneDistrictMappingObj.zoneName
                    && this.zoneDistrictMappingList[a].stateName === zoneDistrictMappingObj.stateName
                    && this.zoneDistrictMappingList[a].districtID === zoneDistrictMappingObj.districtID
                    && this.zoneDistrictMappingList[a].districtName === zoneDistrictMappingObj.districtName) {

                    this.bufferCount = this.bufferCount + 1;
                    console.log('Duplicate Combo Exists', this.bufferCount);
                }

            }

            if (this.bufferCount === 0) {
                debugger;
                this.zoneDistrictMappingList.push(zoneDistrictMappingObj);
                this.zoneDistrictMappingForm.resetForm();
                this.resetDropdowns();

            }

        }
    }
    resetDropdowns() {
        this.availableDistricts = [];
        this.states = [];
        this.availableZones = [];
    }
    storezoneMappings() {
        console.log(this.zoneDistrictMappingList);
        let obj = { "zoneDistrictMappings": this.zoneDistrictMappingList };
        this.zoneMasterService.saveZoneDistrictMappings(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
    }

    successHandler(response) {
        this.zoneDistrictMappingList = [];
        this.alertMessage.alert("Mapping saved successfully", 'success');
        this.getAvailableZoneDistrictMappings();
        this.clearEdit();
    }
    remove_obj(index) {
        this.zoneDistrictMappingList.splice(index, 1);
        // debugger;
         this.checkExistance(this.zoneDistrictMappingList.serviceID, this.zoneDistrictMappingList.zoneID);
        //  console.log("exist",this.service.serviceID,  this.zoneID.zoneID);
         
    }
    dataObj: any = {};
    updateZoneMappingStatus(zoneMapping) {

        let flag = !zoneMapping.deleted;
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
                this.dataObj.zoneDistrictMapID = zoneMapping.zoneDistrictMapID;
                this.dataObj.deleted = !zoneMapping.deleted;
                this.dataObj.modifiedBy = this.createdBy;
                this.zoneMasterService.updateZoneMappingStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

                zoneMapping.deleted = !zoneMapping.deleted;
            }
            this.alertMessage.alert(status + "d successfully", 'success');
        });
    }
    updateStatusHandler(response) {
        console.log("Zone District Mapping status changed", response);
    }
    availableDistricts = [];
    checkExistance(service, zoneID) {
        debugger;
        this.mappedDistricts = [];
        this.districtID = [];
        this.existingDistricts = [];
        if (zoneID != undefined) {
            zoneID = zoneID.zoneID;
        }

        this.mappedDistricts = this.availableZoneDistrictMappings.filter((zoneDistrictMappings) => {
            if (zoneDistrictMappings.providerServiceMapID != undefined && zoneDistrictMappings.providerServiceMapID == this.providerServiceMapID && zoneDistrictMappings.zoneID != undefined && zoneDistrictMappings.zoneID == zoneID) {
                return zoneDistrictMappings;
            }
        });

        this.availableZoneDistrictMappings.forEach((zoneDistrictMappings) => {
            if (zoneDistrictMappings.providerServiceMapID != undefined && zoneDistrictMappings.providerServiceMapID == this.providerServiceMapID && zoneDistrictMappings.zoneID != undefined && zoneDistrictMappings.zoneID == zoneID) {
                if (!zoneDistrictMappings.deleted) {
                    this.existingDistricts.push(zoneDistrictMappings.districtID);
                }
            }
        });

        this.availableDistricts = this.districts;
        let temp = [];
        this.availableDistricts.forEach((district) => {
            let index = this.existingDistricts.indexOf(district.districtID);
            if (index < 0) {
                temp.push(district);
            }
        });

        this.availableDistricts = temp;

        console.log('district', this.availableDistricts);
        if (this.zoneDistrictMappingList.length > 0) {
            debugger;
            this.zoneDistrictMappingList.forEach((zoneDistrictMappings) => {
                console.log("zoneDistrictMappings", zoneDistrictMappings.zoneID);
                
                if (zoneDistrictMappings.zoneID != undefined && zoneDistrictMappings.zoneID == zoneID) {
                    if (!zoneDistrictMappings.deleted) {
                        this.bufferDistrictsArray.push(zoneDistrictMappings.districtID)
                    }
                }
            });

            // this.zoneDistrictMappingList.forEach((zoneDistrictMapping)=>{

            // console.log("zoneDistrictMapping",zoneDistrictMapping, zoneDistrictMapping.districtID);
            //     this.bufferDistrictsArray.push(zoneDistrictMapping.districtID)
            // })
            let temp = [];
            this.availableDistricts.forEach((district) => {
                let index = this.bufferDistrictsArray.indexOf(district.districtID);
                if (index < 0) {
                    temp.push(district);
                }
            });

            this.availableDistricts = temp;
        }

    }

    clearEdit() {
        this.showMappings = true;
        this.editable = false;
    }
    back() {
        this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                this.zoneDistrictMappingForm.resetForm();
                this.clearEdit();
                this.zoneDistrictMappingList = [];
                this.bufferCount = 0;
            }
        })
    }

}
