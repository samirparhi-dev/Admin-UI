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
import { NgForm } from '@angular/forms';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { SuperAdmin_ServiceProvider_Service } from '../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service';
@Component({
  selector: 'app-provider-serviceline-state-mapping',
  templateUrl: './provider-serviceline-state-mapping.component.html',
  styleUrls: ['./provider-serviceline-state-mapping.component.css']
})
/* Created By: Diamond Khanna , 15 Jan,2018
   Intention: Creates provider-service-state mappings
 */

export class ProviderServicelineStateMappingComponent implements OnInit {
  filteredsearchResult: any = [];
  // ngModels
  provider: any;
  serviceline: any;
  state: any;

  edit_provider: any;
  edit_serviceline: any;
  edit_state: any;

  // arrays
  providers: any = [];
  servicelines: any = [];
  states: any = [];

  filteredStates: any = [];
  services: any = [];


  searchResult: any = [];
  bufferArray: any = [];

  // flags
  formMode = false;
  tableMode = true;
  editMode = false;

  isNational = false;
  isNational_edit = false;


  // variables
  createdBy: any;
  countryID: any = 1;
  toBeEditedObject: any;

  @ViewChild('mappingFieldsForm') mappingFieldsForm: NgForm;




  constructor(public superadminService: SuperAdmin_ServiceProvider_Service,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.getAllMappings();
    this.getAllProviders();
    this.getAllStates();
    this.getAllServicelines();
  }

  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
  }
  back() {
    this.dialogService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.showTable();
        this.resetForm();
      }
    })
  }

  showTable() {
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;
    this.bufferArray = [];
  }

  showEditForm() {
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
  }

  getAllProviders() {
    this.superadminService.getAllProvider()
      .subscribe(response => {
        if (response) {
          console.log('All Providers Success Handeler', response);
          this.providers = response;
        }
      }, err => {

        console.log('Error', err);
      });
  }

  getAllMappings() {
    this.superadminService.getAllProviderMappings()
      .subscribe(response => {
        if (response) {
          console.log('All Providers Mapping Success Handeler', response);
          this.searchResult = response;
          this.filteredsearchResult = response;
        }
      }, err => {
        console.log(err, 'error')
        console.log('Error', err);
      });
  }

  getAllStates() {
    this.superadminService.getAllStates(this.countryID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all states success handeler');
          this.states = response;
        }
      }, err => {
        console.log(err, 'error')
      });
  }

  getAllServicelines() {
    this.superadminService.getAllServiceLines()
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all servicelines success handeler');
          this.servicelines = response;
        }
      }, err => {
        console.log(err, 'error')
      });
  }

  add2bufferArray(form_values) {
    this.resetDropDowns();
    console.log(form_values, 'form values after adding');
    const object = {
      'serviceProviderID': form_values.provider.serviceProviderId,
      'providerName': form_values.provider.serviceProviderName,
      'serviceID': form_values.serviceline.serviceID,
      'serviceName': form_values.serviceline.serviceName,
      'stateID1': [],
      'createdBy': this.createdBy
    };

    let stateArray = [];
    if (form_values.state != undefined && form_values.state.length > 0) {
      for (let a = 0; a < form_values.state.length; a++) {
        let obj = {
          'stateID': form_values.state[a].stateID,
          'stateName': form_values.state[a].stateName
        }

        stateArray.push(obj);
      }

      object['stateID1'] = stateArray;
    }

    if (this.isNational) {
      this.checkDuplicate_for1097(object);
    } else {
      this.checkDuplicates(object);
    }
  }

  checkDuplicate_for1097(object) {
    console.log(object, 'while checking dupes in case of 1097');
    let duplicate_exists = false;


    let existing_record = this.searchResult.filter(function (item) {
      return item.serviceID === object.serviceID &&
        item.serviceProviderID === object.serviceProviderID;
    })
    if (existing_record.length < 1) {
      this.checkBufferDuplictesFor1097(object);
      //this.bufferArray.push(object);
      this.resetForm();
    }
    else {
      this.resetForm();
      this.dialogService.alert('Already exists');
    }
  }
  checkBufferDuplictesFor1097(object) {
    let duplicateStatus = 0
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
    }
    else {
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].serviceID === object.serviceID && this.bufferArray[i].serviceProviderID === object.serviceProviderID) {
          duplicateStatus = duplicateStatus + 1;
        }
      }
      if (duplicateStatus === 0) {
        this.bufferArray.push(object);
      }
      else {
        this.dialogService.alert('Already exists');
      }
    }
  }
  count: any = 0;
  checkDuplicates(object) {
    console.log(object, 'BEFORE TESTING THE OBJECT SENT');
    /* case:1 If the buffer array is empty */
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
      this.resetForm();
    }

    /* case:2 If the buffer array is not empty */
    else if (this.bufferArray.length > 0) {
      let servicelineMatched = false;
      let providerCount = 0;
      for (let a = 0; a < this.bufferArray.length; a++) {
        /* if the ProviderID of object in BufferArray is same as that of new object */
        if (this.bufferArray[a].serviceProviderID === object.serviceProviderID) {
          providerCount = providerCount + 1;
          /* if the serviceID of object in BufferArray is same as that of new object */
          if (this.bufferArray[a].serviceID === object.serviceID) {
            servicelineMatched = true;
            /* the loop will run i times , where i= no of objects in States Array
               of OBJECT sent for verification */
            for (let i = 0; i < object.stateID1.length; i++) {
              this.count = 0;  // counter to check if duplicate state comes for a 'Existing Provider and Existing Service'

              /* running second loop which will run j times , where j= no of objects in States Array
               of an OBJECT in buffer array */
              for (let j = 0; j < this.bufferArray[a].stateID1.length; j++) {
                if (this.bufferArray[a].stateID1[j].stateID === object.stateID1[i].stateID) {
                  this.count = this.count + 1;
                  console.log('Duplicate Combo Exists', this.count);
                }
              }

              if (this.count === 0) {
                this.bufferArray[a].stateID1.push(object.stateID1[i]);
                this.resetForm();
              }
            }
            // if (this.count > 0) {
            //   // console.log('Duplicate Entry Already exists for ' + object.serviceProviderMapID1[i].serviceName);
            //   this.dialogService.alert('Already exists');
            //   this.resetForm();
            // }

          }
          // else {
          //   continue;
          // }
        }
      }
      if (this.count > 0) {
        this.dialogService.alert("Already exists");
        this.resetForm();
        this.count = [];
      }
      if (providerCount > 0 && servicelineMatched === false) {
        this.bufferArray.push(object);
        this.resetForm();
      }
      if (providerCount === 0) {
        this.bufferArray.push(object);
        this.resetForm();
      }
    }
  }

  resetForm() {
    this.mappingFieldsForm.reset();
    this.provider = undefined;
    this.serviceline = undefined;
    this.state = undefined;
    this.isNational = false;
  }

  removeState(rowIndex, stateIndex) {
    this.bufferArray[rowIndex].stateID1.splice(stateIndex, 1);

    if (this.bufferArray[rowIndex].stateID1.length === 0) {
      this.bufferArray.splice(rowIndex, 1);
    }
  }

  removeRow(index) {
    this.bufferArray.splice(index, 1);
  }

  mapServicelineState() {
    console.log(this.bufferArray, 'Request Object');

    const requestArray = Object.assign([], this.bufferArray);
    for (let i = 0; i < requestArray.length; i++) {
      const array_set = [];
      for (let j = 0; j < requestArray[i].stateID1.length; j++) {
        array_set.push(requestArray[i].stateID1[j].stateID);
      }
      requestArray[i].stateID1 = array_set;
    }

    console.log('After modification', requestArray);
    this.bufferArray = [];

    this.superadminService.mapProviderServiceState(requestArray)
      .subscribe(response => {
        console.log(response, 'after successful mapping of provider to service and state');
        this.dialogService.alert('Mapping saved successfully', 'success');
        this.showTable();
        this.getAllMappings();
        this.bufferArray = [];
        this.services = [];
        this.filteredStates = [];
      }, err => {

        console.log(err, 'ERROR');
      });
  }

  getServices() {
    this.serviceline = '';
    this.state = '';
    this.filteredStates = [];
    this.services = this.servicelines;
    console.log(this.services, 'services');
  }

  resetDropDowns() {
    this.serviceline = '';
    this.state = '';
    this.filteredStates = [];
    this.services = [];
  }

  getAvailableStates(provider, serviceID, service) {
    console.log(provider, serviceID);
    this.isNational = service.isNational;
    console.log('is NATIONAL', this.isNational);
    const alreadyMappedStates = [];
    for (let i = 0; i < this.searchResult.length; i++) {
      if (this.searchResult[i].serviceProviderID === provider &&
        this.searchResult[i].serviceID === serviceID) {
        const obj = {
          'stateID': this.searchResult[i].stateID,
          'stateName': this.searchResult[i].stateName
        }
        alreadyMappedStates.push(obj);
      }
    }

    const filteredStates = this.states.filter(function (stateFromAllState) {
      return !alreadyMappedStates.find(function (stateFromMappedState) {
        return stateFromAllState.stateID === stateFromMappedState.stateID
      })
    });

    console.log(filteredStates, 'Filtered States');
    console.log(this.states, 'All States');

    if (filteredStates.length === 0) {
      this.dialogService.alert('All states for this serviceline have been mapped');
    } else {
      this.filteredStates = filteredStates;

    }


  }

  edit(row_object) {
    this.showEditForm();
    console.log('to be edited object', row_object);
    this.toBeEditedObject = row_object;

    this.edit_provider = row_object.serviceProviderID;
    this.edit_serviceline = row_object.serviceID;
    this.edit_state = row_object.stateID;

    // to disable the state field if the serviceline is National
    for (let i = 0; i < this.servicelines.length; i++) {
      if (this.servicelines[i].serviceID === this.edit_serviceline && this.servicelines[i].isNational) {
        this.edit_state = undefined;
        this.isNational_edit = true;
        break;
      }
      else {
        this.edit_state = row_object.stateID;
        this.isNational_edit = false;
      }
    }
  }

  setIsNationalFlag_while_edit(value) {
    this.edit_state = undefined;
    this.isNational_edit = value;
  }

  update(form_values) {
    console.log(form_values, 'after editing form values');
    let duplicatecount = 0;
    const object = {
      'providerServiceMapID': this.toBeEditedObject.providerServiceMapID,
      'serviceProviderID': form_values.provider,
      'serviceID': form_values.serviceline,
      'stateID': form_values.state,
      'modifiedBy': this.createdBy
    }

    console.log('request object for editing', object);

    for (let i = 0; i < this.searchResult.length; i++) {
      const rowObject = {
        'providerServiceMapID': this.searchResult[i].providerServiceMapID,
        'serviceProviderID': this.searchResult[i].serviceProviderID,
        'serviceID': this.searchResult[i].serviceID,
        'stateID': this.searchResult[i].stateID
      }

      if (
        object.serviceProviderID === rowObject.serviceProviderID &&
        object.serviceID === rowObject.serviceID &&
        object.stateID === rowObject.stateID) {
        duplicatecount = duplicatecount + 1;
        this.dialogService.alert('Mapping for this combination already exists');
        break;
      }
    }

    if (duplicatecount === 0) {

      this.superadminService.editMappedProviderServiceState(object)
        .subscribe(response => {
          console.log(response, 'edited successfully success handeler');
          this.dialogService.alert('Mapping updated successfully', 'success');
          this.showTable();
          this.getAllMappings();

        }, err => {

          console.log(err, 'update error handeler');
        });
    }


  }

  activate(providerServiceMapID, providerexists) {
    if (providerexists) {
      this.dialogService.alert('Provider is  inactive');
    }
    else {
      // this.dialogService.alert('Work In Progress for activate');
      const object = {
        'providerServiceMapID': providerServiceMapID,
        'deleted': false
      }
      this.dialogService.confirm('Confirm', "Are you sure want to Activate?").subscribe((res) => {
        if (res) {
          this.superadminService.deleteMappedProviderServiceState(object)
            .subscribe(response => {
              console.log(response, 'success handeler after activation');
              this.dialogService.alert('Activated successfully', 'success');
              this.getAllMappings();
            },
              (err) => {

                console.log(err);
              })
        }
      })
    }
  }
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredsearchResult = this.searchResult;
    } else {
      this.filteredsearchResult = [];
      this.searchResult.forEach((item) => {
        for (let key in item) {
          if (key == 'serviceProviderName' || key == 'serviceName' || key == 'stateName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredsearchResult.push(item); break;
            }
          }
        }
      });
    }

  }

  deactivate(providerServiceMapID) {
    // this.dialogService.alert('Work In Progress for deactivate');
    const object = {
      'providerServiceMapID': providerServiceMapID,
      'deleted': true
    }
    this.dialogService.confirm('Confirm', "Are you sure want to Deactivate?").subscribe((res) => {
      if (res) {
        this.superadminService.deleteMappedProviderServiceState(object)
          .subscribe(response => {
            console.log(response, 'success handeler after deactivation');
            this.dialogService.alert('Deactivated successfully', 'success');
            this.getAllMappings();
          },
            (err) => {

              console.log(err);
            })
      }
    })
  }

}