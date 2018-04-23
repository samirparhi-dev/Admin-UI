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
  userID: any;
  serviceProviderID: any;
  createdBy: any;
  uSRMappingID: any;
  workLocationID: any;
  providerServiceMapID: any;
  edit = false;
  Role: any;
  User: any;
  State: any;
  Serviceline: any;
  District: any;
  WorkLocation: any;

  // Arrays
  filteredRoles: any = '';
  userNamesList: any = [];
  services_array: any = [];
  states_array: any = [];
  districts_array: any = [];
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
  disableUsername: boolean = false;
  saveButtonStatus: boolean = false;
  duplicatestatus: boolean = false;
  duplicatestatus_editPart: boolean = false;

  isNational = false;

  @ViewChild('workplaceform') eForm: NgForm;
  constructor(private alertService: ConfirmationDialogsService,
    private saved_data: dataService,
    private worklocationmapping: WorkLocationMapping) { }

  ngOnInit() {
    this.serviceProviderID = this.saved_data.service_providerID;
    this.userID = this.saved_data.uid;
    this.createdBy = this.saved_data.uname;

    this.getProviderServices(this.userID);
    this.getAllMappedWorkLocations();
    this.getUserName(this.serviceProviderID);
    // this.getAllServicelines(this.serviceProviderID);
  }


  setIsNational(value) {
    this.isNational = value;
  }

  getStates(serviceID, isNational) {
    this.worklocationmapping.getStates(this.userID, serviceID, isNational).
      subscribe(response => this.getStatesSuccessHandeler(response, isNational), err => {
        this.alertService.alert(err, 'error');
      });
  }


  getStatesSuccessHandeler(response, isNational) {
    this.State = '';
    if (response) {
      console.log(response, 'Provider States');
      this.states_array = response;
      // this.services_array = [];
      this.districts_array = [];
      this.workLocationsList = [];
      this.RolesList = []

      if (isNational) {
        this.State = '';
        this.District = '';
        this.getAllWorkLocations(this.states_array[0], this.Serviceline, this.Serviceline.isNational);
      }
    }
  }



  getProviderServices(userID) {
    this.worklocationmapping.getServices(userID)
      .subscribe(response => {
        this.services_array = response;
      }, err => {
        this.alertService.alert(err, 'error');
      });

  }



  getAllMappedWorkLocations() {
    // debugger;
    this.worklocationmapping.getMappedWorkLocationList(this.serviceProviderID)
      .subscribe(response => {
        if (response) {
          console.log('All Mapped Work Locations List Success Handeler', response);
          this.mappedWorkLocationsList = response;
        }
      }, err => {
        console.log('Error', err);
        this.alertService.alert(err, 'error');
      });
  }
  getUserName(serviceProviderID) {
    // debugger;
    this.worklocationmapping.getUserName(serviceProviderID)
      .subscribe(response => {
        if (response) {
          console.log('All User names under this provider Success Handeler', response);
          this.userNamesList = response;
          // this.services_array = [];
          this.states_array = [];
          this.districts_array = [];
          this.workLocationsList = [];
          this.RolesList = []

          // this.getProviderStates(serviceID, isNational);
        }
      }, err => {
        console.log('Error', err);
        this.alertService.alert(err, 'error');
      });
  }

  getAllDistricts(state: any) {
    // debugger;
    this.worklocationmapping.getAllDistricts(state.stateID || state)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all districts success handeler');
          this.districts_array = response;
          this.workLocationsList = [];
          this.RolesList = [];
        }
      }, err => {
        this.alertService.alert(err, 'error');
      });
  }


  getAllWorkLocations(state: any, service: any, isNational) {
    this.worklocationmapping.getAllWorkLocations(this.serviceProviderID, state.stateID || state, service.serviceID || service, isNational)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all work locations success handeler');
          this.workLocationsList = response;
          this.RolesList = [];
        }
      }, err => {
        this.alertService.alert(err, 'error');
      });
  }


  getAllRoles(providerServiceMapID) {
    // if value passed is undefined, means NGMODEL is not set, i.e undefined. So, getting the PSMID from the states array
    const psmID = providerServiceMapID ? providerServiceMapID : this.states_array[0].providerServiceMapID
    // debugger;
    this.worklocationmapping.getAllRoles(psmID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all roles success handeler');
          this.RolesList = response;

        }
      }, err => {
        this.alertService.alert(err, 'error');
      });
  }
  getAvailableMappings(formvalues, role) {
    const alreadyMappedWorklocations = [];

    for (let i = 0; i < this.mappedWorkLocationsList.length; i++) {
      if (this.mappedWorkLocationsList[i].userID === formvalues.user.userID
        && this.mappedWorkLocationsList[i].providerServiceMapID === formvalues.serviceline.providerServiceMapID
        && parseInt(this.mappedWorkLocationsList[i].workingDistrictID) === formvalues.district.districtID
        && this.mappedWorkLocationsList[i].locationName === formvalues.worklocation.locationName) {

        for (let j = 0; j < role.length; j++) {
          if (this.mappedWorkLocationsList[i].roleID === role[j].roleID) {
            if (this.filteredRoles != '') {
              this.filteredRoles = this.filteredRoles + ', ' + role[j].roleName;

            } else {
              this.filteredRoles = role[j].roleName

            }
          }
        }
      }
    }
    var filteredRole = this.filteredRoles;
    if (this.filteredRoles != '') {
      this.alertService.alert('This mapping already exists with  ' + filteredRole + ' role');
      // this.saveButtonStatus = true;
      this.filteredRoles = '';
      this.duplicatestatus = true;
    }
    return this.duplicatestatus;
  }
  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.bufferArray = [];
      this.resetDropdowns();

    }
    else {

      if (this.bufferArray.length > 0) {
        this.alertService.confirm('Confirm', "Do you really want to go back? Any unsaved data would be lost").subscribe(response => {
          if (response) {
            this.tableMode = true;
            this.formMode = false;
            this.editMode = false;
            this.bufferArray = [];
            this.resetDropdowns();
          }
        });
      }
      else {
        this.tableMode = true;
        this.formMode = false;
        this.editMode = false;
        this.bufferArray = [];
        this.resetDropdowns();
      }
    }

  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
    this.edit = false;
    // this.getUserName(this.serviceProviderID);
  }
  showEditForm() {
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
    this.edit = true;
    // this.getUserName(this.serviceProviderID);
  }

  activate(uSRMappingID) {
    // debugger;
    this.alertService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
      if (response) {
        const object = {
          'uSRMappingID': uSRMappingID,
          'deleted': false
        };

        this.worklocationmapping.DeleteWorkLocationMapping(object)
          .subscribe(response => {
            if (response) {
              this.alertService.alert('Work location mapped admin activated successfully', 'success');
              /* refresh table */
              this.getAllMappedWorkLocations();
            }
          },
          err => {
            console.log('error', err);
            this.alertService.alert(err, 'error');
          });
      }
    });

  }
  deactivate(uSRMappingID) {
    // debugger
    this.alertService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
      if (response) {
        const object = { 'uSRMappingID': uSRMappingID, 'deleted': true };

        this.worklocationmapping.DeleteWorkLocationMapping(object)
          .subscribe(res => {
            if (res) {
              this.alertService.alert('Work location mapped deactivated successfully', 'success');
              /* refresh table */
              this.getAllMappedWorkLocations();
            }
          },
          err => {
            console.log('error', err);
            this.alertService.alert(err, 'error');
          });
      }
    });

  }
  addWorkLocation(objectToBeAdded: any, role) {
    if (!this.getAvailableMappings(objectToBeAdded, role)) {
      console.log(objectToBeAdded, "FORM VALUES");
      const workLocationObj = {
        'previleges': [],
        'userID': objectToBeAdded.user.userID,
        'userName': objectToBeAdded.user.userName,
        'serviceName': objectToBeAdded.serviceline.serviceName,
        // 'stateName': objectToBeAdded.state ? objectToBeAdded.state.stateName : '-',
        // 'district': objectToBeAdded.district ? objectToBeAdded.district.districtName : '-',
        'workingLocation': objectToBeAdded.worklocation.locationName,
        'roleID1': [],
        // tslint:disable-next-line:max-line-length
        'providerServiceMapID': objectToBeAdded.state ? objectToBeAdded.state.providerServiceMapID : this.states_array[0].providerServiceMapID,
        'createdBy': this.createdBy,
        'workingLocationID': objectToBeAdded.worklocation.pSAddMapID

      };

      if (objectToBeAdded.state) {
        workLocationObj['stateName'] = objectToBeAdded.state.stateName;
      }
      else {
        workLocationObj['stateName'] = 'All States';
      }

      if (objectToBeAdded.district) {
        workLocationObj['district'] = objectToBeAdded.district.districtName;
      }
      else {
        workLocationObj['district'] = '-';
      }

      let roleArray = [];
      if (objectToBeAdded.role.length > 0) {
        for (let a = 0; a < objectToBeAdded.role.length; a++) {
          let obj = {
            'roleID1': objectToBeAdded.role[a].roleID,
            'roleName': objectToBeAdded.role[a].roleName
          }
          roleArray.push(obj);
        }
        workLocationObj['roleID1'] = roleArray;
      }

      this.checkDuplicates(workLocationObj);


    }
    else {
      this.duplicatestatus = false;
    }
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
    // debugger;
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
      for (let a = 0; a < this.bufferArray.length; a++) {
        /* if the ProviderID of object in BufferArray is same as that of new object */
        // if (this.bufferArray[a].userID === object.userID) {
        /* if the serviceID of object in BufferArray is same as that of new object */
        if (this.bufferArray[a].userID === object.userID
          && this.bufferArray[a].serviceName === object.serviceName
          && this.bufferArray[a].stateName === object.stateName
          && this.bufferArray[a].district === object.district
          && this.bufferArray[a].workingLocation === object.workingLocation) {
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
        // }
      }
      if (servicelineMatched === false) {
        this.bufferArray.push(object);
        this.resetForm();
      }
    }
  }
  saveWorkLocations() {
    debugger;
    console.log(this.bufferArray, 'Request Object');
    let requestArray = [];
    let workLocationObj = {
      'previleges': [
        {
          'roleID': [],
          'providerServiceMapID': '',
          'workingLocationID': ''
        }
      ],
      'userID': '',
      'createdBy': '',
      'serviceProviderID': this.serviceProviderID
    }
    // let previleges = {
    //   'roleID': [],
    //   'providerServiceMapID': '',
    //   'workingLocationID': ''
    // };
    for (let i = 0; i < this.bufferArray.length; i++) {
      // const workLocationObj = {
      //   'previleges': [],
      //   'userID': '',
      //   'createdBy': '',
      //   'serviceProviderID': this.serviceProviderID
      // }
      // let previleges = {
      //   'roleID': [],
      //   'providerServiceMapID': '',
      //   'workingLocationID': ''
      // };
      let roleArray = [];
      if (this.bufferArray[i].roleID1.length > 0) {
        for (let a = 0; a < this.bufferArray[i].roleID1.length; a++) {
          roleArray.push(this.bufferArray[i].roleID1[a].roleID1);
        }
        // let priv = Object.assign({}, previleges); // to create new instance
        // priv['roleID'] = roleArray;
        // priv['providerServiceMapID'] = this.bufferArray[i].providerServiceMapID;
        // priv['workingLocationID'] = this.bufferArray[i].workingLocationID;

        // let reqObj = Object.assign({}, workLocationObj); // to create new instance
        // let priv = Object.assign([], reqObj.previleges);
        // priv[0].roleID = roleArray;
        // priv[0].providerServiceMapID = this.bufferArray[i].providerServiceMapID;
        // priv[0].workingLocationID = this.bufferArray[i].workingLocationID;

        // reqObj.previleges = priv;
        // reqObj['userID'] = this.bufferArray[i].userID;
        // reqObj['createdBy'] = this.createdBy;

        let workLocationObj = {
          'previleges': [
            {
              'roleID': roleArray,
              'providerServiceMapID': this.bufferArray[i].providerServiceMapID,
              'workingLocationID': this.bufferArray[i].workingLocationID
            }
          ],
          'userID': this.bufferArray[i].userID,
          'createdBy': this.createdBy,
          'serviceProviderID': this.serviceProviderID
        }

        requestArray.push(workLocationObj);
        // roleArray = [];
      }
    }
    console.log(requestArray, 'after modification array');
    this.bufferArray = [];
    this.worklocationmapping.SaveWorkLocationMapping(requestArray)
      .subscribe(response => {
        console.log(response, 'after successful mapping of work-location');
        this.alertService.alert('Work location  mapped successfully', 'success');
        this.getAllMappedWorkLocations();
        this.resetDropdowns();
        this.showTable();
        this.filteredStates = [];
        // this.services_array = [];
        this.bufferArray = [];
      }, err => {
        console.log(err, 'ERROR');
        this.alertService.alert(err, 'error');
      });
  }

  //################### EDIT SECTION ##########################


  userID_duringEdit: any;
  stateID_duringEdit: any;
  providerServiceMapID_duringEdit: any;
  district_duringEdit: any;
  workLocationID_duringEdit: any;
  roleID_duringEdit: any;
  serviceID_duringEdit: any;

  isNational_edit = false;

  set_currentPSM_ID_duringEdit(psmID) {
    this.providerServiceMapID_duringEdit = psmID;
  }

  editRow(rowObject) {

    this.showEditForm();
    this.edit = true;
    this.disableUsername = true;
    this.edit_Details = rowObject;
    this.userID_duringEdit = rowObject.userID;
    console.log('TO BE EDITED REQ OBJ', this.edit_Details);
    this.uSRMappingID = rowObject.uSRMappingID;
    this.workLocationID_duringEdit = parseInt(this.edit_Details.workingLocationID, 10);
    this.userID_duringEdit = this.edit_Details.userID;
    this.stateID_duringEdit = this.edit_Details.stateID;
    this.providerServiceMapID_duringEdit = this.edit_Details.providerServiceMapID;
    this.district_duringEdit = parseInt(this.edit_Details.workingDistrictID, 10);
    this.roleID_duringEdit = this.edit_Details.roleID;
    this.serviceID_duringEdit = this.edit_Details.serviceID;


    this.getProviderServices(this.userID);
    this.checkService_forIsNational();
    this.getProviderStates_duringEdit(this.serviceID_duringEdit, this.isNational_edit);
    this.getAllDistricts_duringEdit(this.edit_Details.stateID);
    this.getAllWorkLocations_duringEdit(this.stateID_duringEdit, this.serviceID_duringEdit, this.isNational_edit);
    this.getAllRoles_duringEdit(this.providerServiceMapID_duringEdit);

  }
  // autoPopulateDropdowns() {
  //   this.worklocationmapping.getServices(this.userID)
  //     .subscribe(response => {
  //       this.services_array=
  //     });

  // }

  checkService_forIsNational() {
    for (let i = 0; i < this.services_array.length; i++) {
      if (this.serviceID_duringEdit === this.services_array[i].serviceID && this.services_array[i].isNational) {
        this.isNational_edit = this.services_array[i].isNational;
        break;
      }
      else {
        this.isNational_edit = false;
      }
    }
  }

  setIsNational_edit(value) {
    this.isNational_edit = value;
  }

  getProviderServices_edit(userID) {
    this.worklocationmapping.getServices(this.userID)
      .subscribe(response => this.getServicesSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });

  }

  getServicesSuccessHandeler(response) {
    if (response) {
      console.log('Provider Services in State', response);
      this.services_array = response;

    }
  }

  getProviderStates_duringEdit(serviceID, isNational) {
    this.worklocationmapping.getStates(this.userID, serviceID, isNational).
      subscribe(response => this.getStatesSuccessHandeler_duringEdit(response, isNational), err => {
        this.alertService.alert(err, 'error');
      });
  }

  getStatesSuccessHandeler_duringEdit(response, isNational) {
    // this.stateID_duringEdit = '';
    if (response) {
      console.log(response, 'Provider States');
      this.states_array = response;
      this.districts_array = [];
      this.workLocationsList = [];
      this.RolesList = []

      if (isNational) {
        this.set_currentPSM_ID_duringEdit(this.states_array[0].providerServiceMapID);
        this.stateID_duringEdit = '';
        this.district_duringEdit = '';
        this.getAllWorkLocations_duringEdit(this.states_array[0].stateID, this.serviceID_duringEdit, this.isNational_edit);
        this.getAllRoles_duringEdit(this.providerServiceMapID_duringEdit);
      }
      // this.getProviderServicesInState_duringEdit(this.stateID_duringEdit);
      // this.getAllDistricts_duringEdit(this.stateID_duringEdit);
    }

  }

  refresh1() {
    // refreshing ngModels of district, worklocation, servicelines, roles
    this.district_duringEdit = undefined;
    this.workLocationID_duringEdit = undefined;
    // this.serviceID_duringEdit = undefined;
    this.roleID_duringEdit = undefined;
  }

  refresh2() {
    this.refresh3();
  }

  refresh3() {
    // refreshing ngModels of worklocation, roles
    this.workLocationID_duringEdit = undefined;
    this.roleID_duringEdit = undefined;
  }

  refresh4() {
    // refreshing ngModels of roles
    this.roleID_duringEdit = undefined;
  }



  getAllDistricts_duringEdit(state: any) {
    this.worklocationmapping.getAllDistricts(state)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all districts success handeler');
          this.districts_array = response;

          // this.getAllWorkLocations_duringEdit(this.userID_duringEdit, this.stateID_duringEdit, this.serviceID_duringEdit);
        }
      }, err => {
        this.alertService.alert(err, 'error');
      });
  }
  getAllWorkLocations_duringEdit(stateID: any, serviceID: any, isNational_edit) {
    // debugger;
    this.worklocationmapping.getAllWorkLocations(this.serviceProviderID, stateID, serviceID, isNational_edit)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all work locations success handeler');
          this.workLocationsList = response;

          // this.getAllRoles_duringEdit(this.providerServiceMapID_duringEdit);

        }
      }, err => {
        this.alertService.alert(err, 'error');

      });
  }


  getAllRoles_duringEdit(psmID) {
    // debugger;
    this.worklocationmapping.getAllRoles(psmID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all roles success handeler');
          this.RolesList = response;
        }
      }, err => {
        this.alertService.alert(err, 'error');

      });
  }
  getAvailableMappings_duringEdit(formvalues) {

    const alreadyMappedWorklocations = [];
    for (let i = 0; i < this.mappedWorkLocationsList.length; i++) {
      if (this.mappedWorkLocationsList[i].userID === this.userID_duringEdit
        && this.mappedWorkLocationsList[i].serviceID === formvalues.serviceID
        && this.mappedWorkLocationsList[i].stateID === formvalues.state
        && parseInt(this.mappedWorkLocationsList[i].workingDistrictID) === formvalues.district
        && parseInt(this.mappedWorkLocationsList[i].workingLocationID) === formvalues.worklocation
        && this.mappedWorkLocationsList[i].roleID === formvalues.role) {
        this.alertService.alert('All work locations for this user have been mapped');
        this.duplicatestatus_editPart = true;
      }
    }
    return this.duplicatestatus_editPart;
  }
  updateWorkLocation(workLocations: any) {
    if (!this.getAvailableMappings_duringEdit(workLocations)) {
      const langObj = {
        'uSRMappingID': this.uSRMappingID,
        'userID': this.userID_duringEdit,
        'roleID': workLocations.role,
        'providerServiceMapID': this.providerServiceMapID_duringEdit,
        'workingLocationID': workLocations.worklocation,
        'modifiedBy': this.createdBy
      };
      console.log('edited request object to be sent to API', langObj);
      this.worklocationmapping.UpdateWorkLocationMapping(langObj)
        .subscribe(response => {
          console.log(response, 'after successful mapping of work location to provider');
          this.alertService.alert('Work location mapping edited successfully', 'success');
          this.showTable();
          this.getAllMappedWorkLocations();
          this.resetDropdowns();
          this.bufferArray = [];
        }, err => {
          console.log(err, 'ERROR');
          this.alertService.alert(err, 'error');
        });

    }
    else { this.duplicatestatus_editPart = false; }
  }

  resetForm() {

  }
  resetDropdowns() {
    this.User = undefined;
    this.State = undefined;
    this.Serviceline = undefined;
    this.District = undefined;
    this.WorkLocation = undefined;
    this.Role = undefined;
  }
}
