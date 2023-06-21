/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { VanTypeMasterService } from '../services/ProviderAdminServices/van-type-master.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
    selector: 'app-van-type',
    templateUrl: './van-type-master.component.html'
})
export class VanTypeComponent implements OnInit {

    showVanTypes: any = true;
    availableVanTypes: any = [];
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    availableVanTypeNames: any = [];
    countryID: any;
    searchStateID: any;
    searchDistrictID: any;
    searchParkingPlaceID: any;
    serviceID: any;
    createdBy: any;
    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public vanTypeMasterService: VanTypeMasterService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.serviceID = this.commonDataService.serviceIDMMU;
        this.createdBy = this.commonDataService.uname;
    }

    showForm() {
        this.showVanTypes = false;
    }
    ngOnInit() {

        //this.getStates();
        this.getStatesByServiceID();
        this.getVanTypes();
    }

    obj: any;
    getVanTypes() {
        this.obj = {};
        this.obj.providerServiceMapID = this.providerServiceMapID;
        this.vanTypeMasterService.getVanTypes(this.obj).subscribe(response => this.getVanTypeSuccessHandler(response));
    }
    getVanTypeSuccessHandler(response) {
        this.availableVanTypes = response;
        for (let availableVanType of this.availableVanTypes) {
            this.availableVanTypeNames.push(availableVanType.vanTypeName);
        }
    }

    vanTypeObj: any;
    vanTypeList: any = [];
    addVanTypeToList(values) {

        this.vanTypeObj = {};
        if (values.stateID != undefined) {
            this.vanTypeObj.stateID = values.stateID.split("-")[0];
            this.vanTypeObj.stateName = values.stateID.split("-")[1];
        }

        this.vanTypeObj.vanType = values.vanType;
        this.vanTypeObj.vanTypeDesc = values.vanTypeDesc;

        this.vanTypeObj.providerServiceMapID = this.providerServiceMapID;

        this.vanTypeObj.createdBy = this.createdBy;

        this.vanTypeList.push(this.vanTypeObj);

        if (this.vanTypeList.length <= 0) {
            this.alertMessage.alert("No Service available with the state selected");
        }
    }

    storeVanTypes() {
        let obj = { "vanTypeMaster": this.vanTypeList };
        console.log(obj);
        this.vanTypeMasterService.saveVanType(obj).subscribe(response => this.vanTypeSuccessHandler(response));
    }

    vanTypeSuccessHandler(response) {
        this.vanTypeList = [];
        this.alertMessage.alert("Saved successfully", 'success');
    }

    stateSelection(stateID) {
        this.getServices(stateID);
    }

    getServices(stateID) {
        this.vanTypeMasterService.getServices(this.service_provider_id, stateID).subscribe(response => this.getServicesSuccessHandeler(response));
    }

    getStatesByServiceID() {
        this.vanTypeMasterService.getStatesByServiceID(this.serviceID, this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    }

    getStatesSuccessHandeler(response) {
        this.provider_states = response;
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
    updateVanTypeStatus(vanType) {

        this.dataObj = {};
        this.dataObj.vanTypeID = vanType.vanTypeID;
        this.dataObj.deleted = !vanType.deleted;
        this.dataObj.modifiedBy = this.createdBy;
        this.vanTypeMasterService.updateVanTypeStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

        vanType.deleted = !vanType.deleted;

    }
    updateStatusHandler(response) {
        console.log("VanType updated changed", 'success');
    }

    showList() {
        this.getVanTypes();
        this.showVanTypes = true;
    }

    vanTypeNameExist: any = false;
    checkExistance(vanTypeName) {
        this.vanTypeNameExist = this.availableVanTypeNames.includes(vanTypeName);
        console.log(this.vanTypeNameExist);
    }

}