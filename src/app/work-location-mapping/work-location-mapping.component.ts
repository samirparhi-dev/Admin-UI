import { Component, OnInit, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { WorkLocationMapping } from '../services/ProviderAdminServices/work-location-mapping.service';

@Component({
  selector: 'app-work-location-mapping',
  templateUrl: './work-location-mapping.component.html',
  styleUrls: ['./work-location-mapping.component.css']
})
export class WorkLocationMappingComponent implements OnInit {
  serviceProviderID: any;
  createdBy: any;
  uSRMappingID: any;
  workLocationID: any;

  // Arrays
  userNamesList: any = [];
  services_array: any = [];
  states_array: any = [];
  districts_array: any = [];
  providerAdminList: any = [];
  filteredStates: any = [];
  mappedWorkLocationsList: any = [];
  workLocationsList: any = [];
  RolesList: any = [];
  bufferArray: any = [];
  edit_Details: any = [];
  previleges: any = [];
  workLocations: any = [];

  //  flag values
  formMode = false;
  tableMode = true;
  editMode = false;


  constructor(private alertService: ConfirmationDialogsService, private saved_data: dataService,
    private worklocationmapping: WorkLocationMapping) { }

  ngOnInit() {
    this.serviceProviderID = this.saved_data.service_providerID;
    this.createdBy = this.createdBy = this.saved_data.uname;
    this.getAllMappedWorkLocations();
    this.getUserName(this.serviceProviderID);
  }
  getAllMappedWorkLocations() {
    debugger;
    this.worklocationmapping.getMappedWorkLocationList()
      .subscribe(response => {
        if (response) {
          console.log('All Mapped Work Locations List Success Handeler', response);
          this.mappedWorkLocationsList = response;
        }
      }, err => {
        console.log('Error', err);
      });
  }
  getUserName(providerId: any) {
    debugger;
    this.worklocationmapping.getUserName(providerId)

      .subscribe(response => {
        if (response) {
          console.log('All User names under this provider Success Handeler', response);
          this.userNamesList = response;
        }
      }, err => {
        console.log('Error', err);
      });
  }
  getAllServicelines(serviceProvider: any) {
    this.worklocationmapping.getAllServiceLinesByProvider(serviceProvider.serviceProviderId || serviceProvider.serviceProviderID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all servicelines success handeler');
          this.services_array = response;
        }
      }, err => {

      });
  }
  getAllStates(serviceProvider: any, serviceLine: any) {
    debugger;
    this.worklocationmapping.getAllStatesByProvider(serviceProvider.serviceProviderId || serviceProvider.serviceProviderID, serviceLine.serviceID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all states success handeler');
          this.states_array = response;
          this.getAvailableStates(serviceProvider, serviceLine)
        }
      }, err => {

      });
  }
  getAvailableStates(provider, service) {
    debugger;
    console.log(provider, service);
    const alreadyMappedStates = [];
    for (let i = 0; i < this.mappedWorkLocationsList.length; i++) {
      if (this.mappedWorkLocationsList[i].userID === service.userID &&
        this.mappedWorkLocationsList[i].serviceID === service.serviceID) {
        const obj = {
          'stateID': this.mappedWorkLocationsList[i].stateID,
          'stateName': this.mappedWorkLocationsList[i].stateName
        }
        alreadyMappedStates.push(obj);
      }
    }
    console.log('alredy', alreadyMappedStates);
    const filteredStates = this.states_array.filter(function (stateFromAllState) {
      return !alreadyMappedStates.find(function (stateFromMappedState) {
        return stateFromAllState.stateID === stateFromMappedState.stateID
      })
    });

    console.log(this.filteredStates, 'Filtered States');
    console.log(filteredStates, 'const states');
    this.filteredStates = [];
    if (filteredStates.length === 0) {
      this.alertService.alert('All states for this serviceline have been mapped');
    } else {
      this.filteredStates = filteredStates;

    }

  }
  getAllDistricts(state: any) {
    debugger;
    this.worklocationmapping.getAllDistricts(state.stateID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all districts success handeler');
          this.districts_array = response;
        }
      }, err => {

      });
  }
  getAllWorkLocations(user: any, state: any, service: any) {
    debugger;
    this.worklocationmapping.getAllWorkLocations(user.serviceProviderId || user.serviceProviderID, state.stateID, service.serviceID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all work locations success handeler');
          this.workLocationsList = response;
        }
      }, err => {

      });
  }
  getAllRoles(user: any, state: any, service: any) {
    debugger;
    this.worklocationmapping.getAllRoles(user.serviceProviderId || user.serviceProviderID, state.stateID, service.serviceID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all roles success handeler');
          this.RolesList = response;
        }
      }, err => {

      });
  }

  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;

    }
    else {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
    }

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

  activate(userLangID) {
    const object = {
      'userLangID': userLangID,
      'deleted': false
    };

    this.worklocationmapping.DeleteWorkLocationMapping(object)
      .subscribe(response => {
        if (response) {
          this.alertService.alert('Worl location mapped admin activated successfully');
          /* refresh table */
          this.getAllMappedWorkLocations();
        }
      },
      err => {
        console.log('error', err);
      });
  }
  deactivate(userLangID) {
    debugger
    const object = { 'userLangID': userLangID, 'deleted': true };

    this.worklocationmapping.DeleteWorkLocationMapping(object)
      .subscribe(response => {
        if (response) {
          this.alertService.alert('Work location mapped deactivated successfully');
          /* refresh table */
          this.getAllMappedWorkLocations();
        }
      },
      err => {
        console.log('error', err);
      });
  }
  addWorkLocation(workLocations: any) {
    debugger;
    const workLocationObj = {
      'previleges': [],
      'userID': workLocations.user.userID,
      'serviceProviderName': workLocations.user.serviceProviderName,
      'serviceName': workLocations.serviceline.serviceName,
      'stateName': workLocations.state.stateName,
      'district': workLocations.district.districtName,
      'workingLocation': workLocations.worklocation.workLocationName,
      'roleID1': [],
      'providerServiceMapID': workLocations.state.providerServiceMapID,
      'createdBy': this.createdBy,
      'workingLocationID': workLocations.user.workingLocationID,
      'AgentID': workLocations.agentID,
      'AgentPassword': workLocations.password
    };
    let roleArray = [];
    if (workLocations.role.length > 0) {
      for (let a = 0; a < workLocations.role.length; a++) {
        let obj = {
          'roleID1': workLocations.role[a].roleID,
          'roleName': workLocations.role[a].roleName
        }
        roleArray.push(obj);
      }
      workLocationObj['roleID1'] = roleArray;
    }

    this.checkDuplicates(workLocationObj);
  }
  deleteRow(i) {
    this.bufferArray.splice(i, 1);
  }
  removeRole(rowIndex, roleIndex) {
    this.bufferArray[rowIndex].roleID1.splice(roleIndex, 1);

    if (this.bufferArray[rowIndex].roleID1.length === 0) {
      this.bufferArray.splice(rowIndex, 1);
    }
  }
  checkDuplicates(object) {
    debugger;
    // let LanguageMatched = false;
    // let Count = 0;
    console.log(object, 'BEFORE TESTING THE OBJECT SENT');
    /* case:1 If the buffer array is empty */
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
      // this.resetForm();
      this.resetDropdowns();
      console.log('buffer', this.bufferArray);
    }


    /* case:2 If the buffer array is not empty */
    else if (this.bufferArray.length > 0) {
      let servicelineMatched = false;
      let providerCount = 0;
      for (let a = 0; a < this.bufferArray.length; a++) {
        /* if the ProviderID of object in BufferArray is same as that of new object */
        if (this.bufferArray[a].serviceProviderName === object.serviceProviderName && this.bufferArray[a].userID === object.userID) {
          providerCount = providerCount + 1;
          /* if the serviceID of object in BufferArray is same as that of new object */
          if (this.bufferArray[a].serviceName === object.serviceName) {
            servicelineMatched = true;
            /* the loop will run i times , where i= no of objects in States Array
               of OBJECT sent for verification */
            for (let i = 0; i < object.roleID1.length; i++) {
              let count = 0;  // counter to check if duplicate state comes for a 'Existing Provider and Existing Service'

              /* running second loop which will run j times , where j= no of objects in States Array
               of an OBJECT in buffer array */
              for (let j = 0; j < this.bufferArray[a].roleID1.length; j++) {
                if (this.bufferArray[a].roleID1[j].roleID1 === object.roleID1[i].roleID1) {
                  count = count + 1;
                  console.log('Duplicate Combo Exists', count);
                }
              }
              if (count === 0) {
                this.bufferArray[a].roleID1.push(object.roleID1[i]);
                this.resetForm();
              }
              else if (count > 0) {
                console.log('Duplicate Entry Already exists for ' + object.roleID1[i].roleName);
                this.resetForm();
              }
            }
          }
          else {
            continue;
          }
        }
      }
      if (providerCount === 1 && servicelineMatched === false) {
        this.bufferArray.push(object);
        this.resetForm();
      }
      if (providerCount === 0) {
        this.bufferArray.push(object);
        this.resetForm();
      }
    }
  }
  saveWorkLocations() {
    debugger;
    console.log(this.bufferArray, 'Request Object');
    const requestArray = [];
    const workLocationObj = {
      'previleges': [],
      'userID': '',
      'createdBy': ''
    }
    let previleges = {
      'roleID': [],
      'providerServiceMapID': '',
      'workingLocationID': ''
    };
    for (let i = 0; i < this.bufferArray.length; i++) {
      let roleArray = [];
      if (this.bufferArray[i].roleID1.length > 0) {
        for (let a = 0; a < this.bufferArray[i].roleID1.length; a++) {
          roleArray.push(this.bufferArray[i].roleID1[a].roleID1);
        }
        previleges['roleID'] = roleArray;
        previleges['providerServiceMapID'] = this.bufferArray[i].providerServiceMapID;
        previleges['workingLocationID'] = this.bufferArray[i].workingLocationID;
        //  this.previleges.push(previleges);
        workLocationObj['userID'] = this.bufferArray[i].userID;
        workLocationObj['createdBy'] = this.createdBy;
        workLocationObj['previleges'].push(previleges);
        requestArray.push(workLocationObj);
      }
    }
    console.log(requestArray, 'after modification array');
    this.bufferArray = [];
    this.worklocationmapping.SaveWorkLocationMapping(requestArray)
      .subscribe(response => {
        console.log(response, 'after successful mapping of work-location');
        this.alertService.alert('work location admin mapped successfully');
        this.getAllMappedWorkLocations();
        this.resetDropdowns();
        this.showTable();
        this.filteredStates = [];
        this.services_array = [];
        this.bufferArray = [];
      }, err => {
        console.log(err, 'ERROR');
      });
  }
  editRow(rowObject) {
    debugger;
    this.showEditForm();
    this.uSRMappingID = rowObject.uSRMappingID;
    this.workLocationID = rowObject.workLocationID;
    this.edit_Details = rowObject;
  }
  updateWorkLocation(workLocations: any) {
    debugger;
    const langObj = {
      'uSRMappingID': this.uSRMappingID,
      'userID': workLocations.user.userID,
      'roleID': workLocations.role.roleID,
      'providerServiceMapID': workLocations.state.providerServiceMapID,
      'workingLocationID': workLocations.readweightage.value,
      'modifiedBy': this.createdBy
    };
    console.log('edited request object', langObj);
    this.worklocationmapping.UpdateWorkLocationMapping(langObj)
      .subscribe(response => {
        console.log(response, 'after successful mapping of work location to provider');
        this.alertService.alert('work location mapping edited successfully');
        this.showTable();
        this.getAllMappedWorkLocations();
        this.resetDropdowns();
        this.bufferArray = [];
      }, err => {
        console.log(err, 'ERROR');
      });


  }

  resetForm() {

  }
  resetDropdowns() {

  }
}
