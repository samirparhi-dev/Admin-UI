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
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { DrugMasterService } from '../services/ProviderAdminServices/drug-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-drug-mapping',
  templateUrl: './drug-mapping.component.html'
})
export class DrugMappingComponent implements OnInit {

  data: any;
  providerServiceMapID: any;
  provider_states: any;
  provider_services: any;
  service_provider_id: any;
  serviceID104: any;
  createdBy: any;
  drug_strength: any;
  userID: any;
  state: any;
  service: any;

  editable: any = false;
  showMappings: any = true;
  disableSelection: boolean = false;
  showDrudGroupMappedList: boolean = false;

  /*Arrays*/
  services: any = [];
  states: any = [];
  availableDrugMappings: any = [];
  availableDrugGroups: any = [];
  availableDrugs: any = [];
  filteredavailableDrugMappings: any = [];
  mappedDrugs: any = [];
  availableStrengths: any = [];

  @ViewChild('drugMappingForm') drugMappingForm: NgForm;
  constructor(public providerAdminRoleService: ProviderAdminRoleService,
    public commonDataService: dataService,
    public drugMasterService: DrugMasterService,
    private alertMessage: ConfirmationDialogsService) {
    this.data = [];
    this.service_provider_id = this.commonDataService.service_providerID;
    this.serviceID104 = this.commonDataService.serviceID104;
    this.createdBy = this.commonDataService.uname;

  }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    this.getServiceLines();

    // /this.getAvailableStrengths();
  }
  /*
 * Service line
 */
  getServiceLines() {
    this.drugMasterService.getServiceLinesNew(this.userID).subscribe((response) => {
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
  /*
  * State
  */
  getStates(value) {
    this.filteredavailableDrugMappings = [];
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.drugMasterService.getStatesNew(obj).
      subscribe((response) => {
        this.getStatesSuccessHandeler(response),
          (err) => {
            console.log("error in fetching states", err);
          }
      });

  }

  getStatesSuccessHandeler(response) {
    this.states = response;
  }

  setProviderServiceMapID(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID
    this.getAvailableMappings();

  }

  getAvailableMappings() {
    this.filteredavailableDrugMappings = [];
    this.drugObj = {};
    this.drugObj.serviceProviderID = this.service_provider_id;
    this.drugObj.serviceID = this.serviceID104;
    this.drugMasterService.getDrugMappings(this.drugObj).subscribe(response => this.getDrugMappingsSuccessHandeler(response),
      (err) => console.log(err, 'error'));
  }

  getDrugMappingsSuccessHandeler(response) {
    this.availableDrugMappings = response;
    this.availableDrugMappings.forEach((availableMappings) => {
      if (availableMappings.providerServiceMapID == this.providerServiceMapID) {
        this.filteredavailableDrugMappings.push(availableMappings);
      }
    })
    // this.filteredavailableDrugMappings = response;
    this.showDrudGroupMappedList = true;
  }

  showForm() {
    this.showMappings = false;
    this.disableSelection = true;
    this.getAvailableDrugGroups();
    this.getAvailableDrugs();
  }

  getAvailableDrugGroups() {
    this.drugObj = {};
    this.drugObj.deleted = false;
    this.drugObj.serviceProviderID = this.service_provider_id;
    this.drugMasterService.getDrugGroups(this.drugObj).subscribe(response => this.getDrugGroupsSuccessHandeler(response),
      (err) => console.log("error", err));
  }
  getDrugGroupsSuccessHandeler(response) {
    this.availableDrugGroups = response;
  }

  getAvailableDrugs() {
    this.drugObj = {};
    this.drugObj.deleted = false;
    this.drugObj.serviceProviderID = this.service_provider_id;
    this.drugMasterService.getDrugsList(this.drugObj).subscribe(response => this.getDrugsSuccessHandeler(response),
      (err) => console.log(err, 'error'));
  }

  getDrugsSuccessHandeler(response) {
    this.availableDrugs = response;
  }
  // getAvailableStrengths() {
  //   this.drugMasterService.getAllDrugStrengths().subscribe(strengthResponse => {
  //     this.availableStrengths = strengthResponse;
  //   })
  // }

  getStatesByServiceID() {
    this.drugMasterService.getStatesByServiceID(this.serviceID104, this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response),
      (err) => console.log(err, 'error'));
  }

  drugObj: any;
  // = {
  // 	'drug':'',
  //   'drugDesc':'',
  //   'providerServiceMapID':'',
  //   'createdBy':''
  // };
  drugMapping: any = [];
  drugIdList: any = [];
  mappedDrugIDs: any = [];
  mappedDrugDuplicateStatus: any = 0;
  addDrugToList(values) {

    let drugIdList = [];
    for (let drugs of values.drugIdList) {
      drugIdList.push(drugs.split("-")[0]);
      console.log("drugIdList", this.drugIdList);

    }

    //find drug deselected from the list , and Remove drugGroup mapping with that drug
    for (let mappedDrug of this.mappedDrugs) {
      this.mappedDrugIDs.push(mappedDrug.drugId); // fetching mapped drugID's

      this.dataObj = {};
      this.dataObj.drugMapID = mappedDrug.drugMapID;
      this.dataObj.modifiedBy = this.createdBy;
      if (drugIdList.indexOf(mappedDrug.drugId.toString()) == -1) {
        this.dataObj.deleted = true;
        this.drugMasterService.updateDrugStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response),
          (err) => console.log(err, 'error'));
      } else if (mappedDrug.deleted) {
        this.dataObj.deleted = false;
        this.drugMasterService.updateDrugStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response),
          (err) => console.log(err, 'error'));
      }
    }
    this.mappedDrugDuplicateStatus = 0;
    values.drugIdList.forEach((drugIds) => {
      let drugId = drugIds.split("-")[0];
      //make a map of drug group with Drug, If the drugId not in the mappedDrugIDs( already mapped drugID's)
      if (this.mappedDrugIDs.indexOf(parseInt(drugId)) == -1) {

        this.drugObj = {};
        this.drugObj.drugGroupID = values.drugGroupID.split("-")[0];
        this.drugObj.drugGroupName = values.drugGroupID.split("-")[1];
        this.drugObj.drugId = drugIds.split("-")[0];
        this.drugObj.drugName = drugIds.split("-")[1];
        // this.drugObj.drugStrength = values.drug_strength.drugStrength;
        this.drugObj.remarks = values.remarks;
        // for(let provider_service of this.provider_services){
        //   if("104"==provider_service.serviceName){
        this.drugObj.providerServiceMapID = this.providerServiceMapID;
        // this.drugObj.stateName = values.stateID.split("-")[1];
        this.drugObj.stateName = this.state.stateName;
        //   }
        // } 

        this.drugObj.createdBy = this.createdBy;
        this.checkDuplicates(this.drugObj);
        // this.drugMapping.push(this.drugObj);
      } else {
        console.log("already mapped with these drugs");
        this.mappedDrugDuplicateStatus = this.mappedDrugDuplicateStatus + 1;
      }
    })
    if (this.mappedDrugDuplicateStatus > 0) {
      this.alertMessage.alert("Already mapped with these drugs");
      this.mappedDrugIDs = [];
    } else {
      if (this.duplicateStatus > 0) {
        this.alertMessage.alert("Already exists");

      }
    }
  }
  duplicateStatus: any = 0;

  checkDuplicates(object) {
    this.duplicateStatus = 0;
    if (this.drugMapping.length === 0) {
      this.drugMapping.push(object);
    }
    else {
      for (let i = 0; i < this.drugMapping.length; i++) {
        if (this.drugMapping[i].drugId === object.drugId
          && this.drugMapping[i].drugGroupID === object.drugGroupID) {
          this.duplicateStatus = this.duplicateStatus + 1;
        }
      }
      if (this.duplicateStatus === 0) {
        this.drugMapping.push(object);
      }
    }

  }

  storedrugMappings() {
    let obj = { "drugMappings": this.drugMapping };
    this.drugMasterService.mapDrugGroups(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
  }

  successHandler(response) {
    this.drugMapping = [];
    this.alertMessage.alert("Saved successfully", 'success');
    this.getAvailableMappings();
    this.clearEdit();
  }

  dataObj: any = {};
  updateDrugMappingStatus(drugMapping, druggroupexist) {
    if (druggroupexist) {
      this.alertMessage.alert("Drug group is inactive")
    }
    else {
      let flag = !drugMapping.deleted;
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
          this.dataObj.drugMapID = drugMapping.drugMapID;
          this.dataObj.deleted = !drugMapping.deleted;
          this.dataObj.modifiedBy = this.createdBy;
          this.drugMasterService.updateDrugStatus(this.dataObj).subscribe(response => {
            this.alertMessage.alert(status + "d successfully", 'success')
            drugMapping.deleted = !drugMapping.deleted
          }), (err) => {
            console.log("error", err);
            //console.log(err,'error')
          };
        }
      });
    }
  }

  updateStatusHandler(response) {
    console.log("Drug Mapping status changed");
  }
  remove_obj(index) {
    this.drugMapping.splice(index, 1);
  }
  clearEdit() {
    this.showMappings = true;
    this.editable = false;
    this.disableSelection = false;
  }
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredavailableDrugMappings = this.availableDrugMappings;
    } else {
      this.filteredavailableDrugMappings = [];
      this.availableDrugMappings.forEach((item) => {
        for (let key in item) {
          if (key == 'drugGroupName' || key == 'drugName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredavailableDrugMappings.push(item); break;
            }
          }
        }
      });
    }

  }
  back() {
    this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.drugMappingForm.resetForm();
        this.clearEdit();
        this.drugMapping = [];
      }
    })
  }

  existingDrugs: any = [];
  checkExistance(stateID, drugGroupID) {
    this.mappedDrugs = [];
    this.drugIdList = [];
    this.existingDrugs = [];
    if (drugGroupID != undefined) {
      drugGroupID = drugGroupID.split("-")[0];
    }

    this.availableDrugMappings.forEach((availableDrugMapping) => {
      if (availableDrugMapping.providerServiceMapID == this.providerServiceMapID && availableDrugMapping.drugGroupID == drugGroupID) {
        // finding exsting drug group mappings with drugs
        this.mappedDrugs.push(availableDrugMapping);
        if (!availableDrugMapping.deleted) {
          this.existingDrugs.push(availableDrugMapping.drugId + "-" + availableDrugMapping.drugName);
        }
      }
    })
    console.log(this.mappedDrugs);
    this.drugIdList = this.existingDrugs;
    console.log(this.drugIdList);

  }

}