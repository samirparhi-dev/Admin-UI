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
import { FacilityMasterService } from '../services/inventory-services/facilitytypemaster.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { NgForm } from '@angular/forms';
import { CommonServices } from '../services/inventory-services/commonServices';

@Component({
  selector: 'app-facility-type-master',
  templateUrl: './facility-type-master.component.html',
  styleUrls: ['./facility-type-master.component.css']
})
export class FacilityTypeMasterComponent implements OnInit {

  createButton: boolean = false;
  providerServiceMapID: any;
  facilityCode: any;
  facilityDiscription: any;
  facilityName: any;
  facilityTypeID: any;
  edit_facilityDiscription: void;
  edit_facilityCode: any;
  edit_facilityName: any;
  state: any;
  edit_State: any;
  serviceline: any;
  edit_Serviceline: any;
  createdBy: any;
  serviceProviderID: any;
  create_filterTerm: string;

  services_array: any = [];
  states_array: any = [];
  facilityMasterList: any = [];
  bufferArray: any = [];
  filteredfacilityMasterList: any = [];
  availableFacilityTypeCode: any = [];

  tableMode: boolean = true;
  formMode: boolean = false;
  editMode: boolean = false;
  showTableFlag: boolean = false;

  @ViewChild('facilitySearchForm') facilitySearchForm: NgForm;
  @ViewChild('facilityAddForm') facilityAddForm: NgForm;
  @ViewChild('faciliTypEditForm') faciliTypEditForm: NgForm;

  constructor(public commonservice: CommonServices, private facility: FacilityMasterService, public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.getServices();
  }

  getServices() {
    this.commonservice.getServiceLines(this.commonDataService.uid).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.services_array = response;
      }
    })
  }
  getstates(service) {
    this.facility.getStates(this.commonDataService.uid, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
      }
    })
  }
  getAllFacilities(providerServiceMapID) {
    this.createButton = true;
    this.providerServiceMapID = providerServiceMapID;
    this.facility.getfacilities(providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.facilityMasterList = response;
        this.filteredfacilityMasterList = response;
        this.showTableFlag = true;
        for (let availableFacilityCode of this.facilityMasterList) {
          this.availableFacilityTypeCode.push(availableFacilityCode.facilityTypeCode);
        }
      }
    })
  }

  showTable() {
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;
    this.bufferArray = [];
    this.resetDropdowns();
    this.getAllFacilities(this.providerServiceMapID);
    this.create_filterTerm = '';
  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
  }
  showEditForm() {
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
  }
  filterfacilityMasterList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredfacilityMasterList = this.facilityMasterList;
    }
    else {
      this.filteredfacilityMasterList = [];
      this.facilityMasterList.forEach((item) => {
        for (let key in item) {
          if (key == 'facilityTypeCode' || key == 'facilityTypeName' || key == 'facilityTypeDesc') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredfacilityMasterList.push(item); break;
            }
          }
        }
      });
    }

  }
  activate(facilityTypeID) {
    this.dialogService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
      if (response) {
        const object = {
          "facilityTypeID": facilityTypeID,
          "deleted": false

        };

        this.facility.deleteFacility(object)
          .subscribe(response => {
            if (response) {
              this.dialogService.alert('Activated successfully', 'success');
              this.getAllFacilities(this.providerServiceMapID);
              this.create_filterTerm = '';
            }
          },
          err => {
            console.log('error', err);
          });
      }
    });

  }
  deactivate(facilityTypeID) {
    this.dialogService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
      if (response) {
        const object = {
          "facilityTypeID": facilityTypeID,
          "deleted": true
        };

        this.facility.deleteFacility(object)
          .subscribe(response => {
            if (response) {
              this.dialogService.alert('Deactivated successfully', 'success');
              this.getAllFacilities(this.providerServiceMapID);
              this.create_filterTerm = '';
            }
          },
          err => {
            console.log('error', err);
          });
      }
    });

  }
  add2bufferArray(formvalues) {
    this.resetDropdowns();
    console.log("form values", formvalues);
    const obj = {
      "serviceName": this.serviceline.serviceName,
      "stateName": this.state.stateName,
      "facilityTypeName": formvalues.facilityName,
      "facilityTypeDesc": formvalues.facilityDescription,
      "facilityTypeCode": formvalues.facilityCode,
      "status": "acive",
      "providerServiceMapID": this.providerServiceMapID,
      "createdBy": this.createdBy
    }
    this.checkDuplictes(obj);

  }
  checkDuplictes(object) {
    let duplicateStatus = 0
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
    }
    else {
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].facilityTypeCode === object.facilityTypeCode
        ) {
          duplicateStatus = duplicateStatus + 1;
        }
      }
      if (duplicateStatus === 0) {
        this.bufferArray.push(object);
      }
    }
  }
  removeRow(index) {
    this.bufferArray.splice(index, 1);
  }
  saveFacilityTypes() {
    this.facility.savefacilities(this.bufferArray).subscribe(response => {
      if (response) {
        console.log(response, 'after successful creation of facility type master');
        this.dialogService.alert('Saved successfully', 'success');
        this.resetDropdowns();
        this.showTable();
        this.getAllFacilities(this.providerServiceMapID);
      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  editFacility(editFormValues) {
    this.edit_Serviceline = this.serviceline;
    this.edit_State = this.state;
    this.facilityTypeID = editFormValues.facilityTypeID;
    this.edit_facilityName = editFormValues.facilityTypeName;
    this.edit_facilityCode = editFormValues.facilityTypeCode;
    this.edit_facilityDiscription = editFormValues.facilityTypeDesc;//facilityTypeID

    this.showEditForm();
    console.log("edit form values", editFormValues)
  }
  updateFacilityType(editedFormValues) {
    const editObj = {
      "facilityTypeID": this.facilityTypeID,
      //  "facilityTypeName": editedFormValues.facilityName,
      "modifiedBy": this.createdBy,
      "facilityTypeDesc": editedFormValues.facilityDescription
      // "facilityTypeCode": editedFormValues.facilityCode
    }
    this.facility.updateFacility(editObj).subscribe(response => {
      if (response) {
        console.log(response, 'after successful updation of facility type master');
        this.dialogService.alert('Updated successfully', 'success');
        this.resetDropdowns();
        this.showTable();
        this.getAllFacilities(this.providerServiceMapID);
      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  resetDropdowns() {
    // this.facilityAddForm.resetForm();
    // this.faciliTypEditForm.resetForm();
    // this.facilitySearchForm.resetForm();
    // this.facilityName = undefined;
    this.facilityCode = undefined;
    this.facilityDiscription = undefined;
    this.edit_facilityName = undefined;
    this.edit_facilityCode = undefined;
    this.edit_facilityDiscription = undefined;
  }
  FacilityCodeExist: any = false;
  checkExistance(facilityCode) {
    this.FacilityCodeExist = this.availableFacilityTypeCode.includes(facilityCode);
    console.log(this.FacilityCodeExist);
  }
}
