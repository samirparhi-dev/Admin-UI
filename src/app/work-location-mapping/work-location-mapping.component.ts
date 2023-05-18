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
  filteredmappedWorkLocationsList: any;
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
  searchTerm:any;

  @ViewChild('workplaceform') eForm: NgForm;
  @ViewChild('workplaceeform') editWorkplaceForm: NgForm;
  showInOutBound = false;
  isInbound=false;
  isOutbound=false;
  showInOutBoundEdit=false;
  singleSelectForEcd: boolean = false;
  disableSelectRoles: boolean = false;
  
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
    this.availableRoles = [];
    this.worklocationmapping.getStates(this.userID, serviceID, isNational).
      subscribe(response => this.getStatesSuccessHandeler(response, isNational), err => {
        console.log(err, 'error');
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
        console.log(err, 'error');
      });

  }
  getAllMappedWorkLocations() {
    this.worklocationmapping.getMappedWorkLocationList(this.serviceProviderID)
      .subscribe(response => {
        if (response) {
          console.log('All Mapped Work Locations List Success Handeler', response);
          this.mappedWorkLocationsList = response;
          this.filteredmappedWorkLocationsList = response;
        }
      }, err => {
        console.log('Error', err);
      });
  }
  getUserName(serviceProviderID) {
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
        console.log(err, 'error');
      });
  }

  getAllDistricts(serviceID, user, state: any) {
    this.showAlertsForMappedRoles(serviceID, user.userID, state.providerServiceMapID);
    this.worklocationmapping.getAllDistricts(state.stateID || state)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all districts success handeler');
          this.districts_array = response;
          this.workLocationsList = [];
          this.RolesList = [];
        }
      }, err => {
        console.log(err, 'error');
      });
      this.disableSelectRoles = false; //For resetting the disbaled selected role field on change of states
  }
  showAlertsForMappedRoles(serviceID, userID, providerServiceMapID) {
    let reqObj = {
      "userID": userID,
      "providerServiceMapID": providerServiceMapID
    }
    this.worklocationmapping.getAllMappedRolesForTm(reqObj).subscribe(response => {
      console.log("mappedroles of tm", response);
      response.forEach((mappedRolesOfTm) => {
        if (mappedRolesOfTm.screenName == 'TC Specialist' || mappedRolesOfTm.screenName == 'Supervisor') {
          this.alertService.alert('This user is already mapped to supervisor/TC Specialist');
          this.State = null;
        }
      })
    })
    if (this.bufferArray.length > 0) {
      this.bufferArray.forEach((bufferScreenList) => {
        if ((bufferScreenList.providerServiceMapID == providerServiceMapID && bufferScreenList.userID == userID) &&
          (bufferScreenList.roleID1[0].screenName == 'TC Specialist' || bufferScreenList.roleID1[0].screenName == 'Supervisor')) {
          this.alertService.alert('This user is already mapped to supervisor/TC Specialist');
          this.State = null;
        }
      })
    }
  }

  getAllWorkLocations(state: any, service: any, isNational) {
    this.worklocationmapping.getAllWorkLocations(this.serviceProviderID, state.stateID || state, service.serviceID || service, isNational, this.District.districtID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all work locations success handeler');
          this.workLocationsList = response;
          this.RolesList = [];
        }
      }, err => {
        console.log(err, 'error');
      });
  }


  getAllRoles(serviceID, providerServiceMapID, userID) {
    // if value passed is undefined, means NGMODEL is not set, i.e undefined. So, getting the PSMID from the states array
    if (serviceID == 4) {
      this.worklocationmapping.getAllRolesForTM(providerServiceMapID)
        .subscribe(response => {
          console.log(response, 'get all roles success handeler');
          this.RolesList = response;
          if (this.RolesList) {
            this.checkExistance(serviceID, providerServiceMapID, userID);
          }

        }, err => {
          console.log(err, 'error');
        });

    } else {
      const psmID = providerServiceMapID ? providerServiceMapID : this.states_array[0].providerServiceMapID
      this.worklocationmapping.getAllRoles(psmID)
        .subscribe(response => {
          console.log(response, 'get all roles success handeler');
          this.RolesList = response;
          if (this.RolesList) {
            this.checkExistance(serviceID, psmID, userID);
          }

        }, err => {
          console.log(err, 'error');
        });
    }
  }
  existingRoles: any = [];
  availableRoles: any = [];
  bufferArrayTemp: any = [];
  bufferRoleIds: any = [];

  supAndSpecScreenNames: any = [];
  bufferSupAndSpecScreenNames: any = [];


  checkExistance(serviceID, providerServiceMapID, userID) {
    this.existingRoles = [];
    this.bufferRoleIds = [];
    this.disableSelectRoles = false;
    this.mappedWorkLocationsList.forEach((mappedWorkLocations) => {
      if(mappedWorkLocations.serviceName === "ECD" && mappedWorkLocations.providerServiceMapID != undefined && mappedWorkLocations.providerServiceMapID == providerServiceMapID && mappedWorkLocations.userID == userID){
        if (!mappedWorkLocations.userServciceRoleDeleted) {
          // this.existingRoles.push(mappedWorkLocations.roleID); // existing roles has roles which are already mapped.
          // this.existingRoles = this.RolesList.slice();
          this.disableSelectRoles = true;
          return;
        }
      } else if (mappedWorkLocations.providerServiceMapID != undefined && mappedWorkLocations.providerServiceMapID == providerServiceMapID && mappedWorkLocations.userID == userID) {
        if (!mappedWorkLocations.userServciceRoleDeleted) {
          this.existingRoles.push(mappedWorkLocations.roleID); // existing roles has roles which are already mapped.
        }
      }
    });
    this.availableRoles = this.RolesList.slice();

    let temp = [];
    this.availableRoles.forEach((roles) => {
      let index = this.existingRoles.indexOf(roles.roleID);
      if (index < 0) {
        temp.push(roles);
      }
    });
    this.availableRoles = temp.slice();

    // filtering supervisor / TC specialist roles if other roles are mapped to the user
    if (this.bufferArray.length > 0) {
      this.bufferArray.forEach((bufferList) => {
        if (bufferList.userID == userID && bufferList.providerServiceMapID == providerServiceMapID) {
          if (bufferList.roleID1.length > 0) {
            this.availableRoles.forEach((removeScreenNameOfSupAndSpec) => {
              if (removeScreenNameOfSupAndSpec.screenName == 'TC Specialist' || removeScreenNameOfSupAndSpec.screenName == 'Supervisor') {
                this.bufferSupAndSpecScreenNames.push(removeScreenNameOfSupAndSpec.screenName);
              }
            })
          }
        }
      })
    }
    this.availableRoles.forEach((removeScreenNameOfSupAndSpec) => {
      if (removeScreenNameOfSupAndSpec.screenName == 'TC Specialist' || removeScreenNameOfSupAndSpec.screenName == 'Supervisor') {
        this.supAndSpecScreenNames.push(removeScreenNameOfSupAndSpec.screenName);
      }
    })

    // filter the supervisor/specialist from the available roles (from already mapped roles)

    let tempsupAndSpecScreenNames = [];
    if (this.existingRoles.length > 0) {
      this.availableRoles.forEach((screenNames) => {
        let index = this.supAndSpecScreenNames.indexOf(screenNames.screenName);
        if (index < 0) {
          tempsupAndSpecScreenNames.push(screenNames);
        }

      })
      this.availableRoles = tempsupAndSpecScreenNames.slice();
    }

    if (this.bufferArray.length > 0) {
      this.bufferArray.forEach((bufferArrayList) => {
        if(bufferArrayList.serviceName === "ECD" && bufferArrayList.userID == userID && bufferArrayList.providerServiceMapID == providerServiceMapID ){
          this.disableSelectRoles = true;
          return;
        }
        else if (bufferArrayList.userID == userID) {
          this.bufferArrayTemp.push(bufferArrayList.roleID1);
        }
      });
    }
    this.bufferArrayTemp.forEach((roleId) => {
      roleId.forEach((role) => {
        this.bufferRoleIds.push(role.roleID1); //  buffer roleID which has role ID's pushed to temp table (yet to save).
      });
    });

    // filtered the roles which is mapped to the user in buffer
    let bufferTemp = [];
    this.availableRoles.forEach((bufferRoles) => {
      let index = this.bufferRoleIds.indexOf(bufferRoles.roleID);
      if (index < 0) {
        bufferTemp.push(bufferRoles);
      }
    });
    // available roles has roles except mapped roles with the user(both temp mapping and already mapped);
    this.availableRoles = bufferTemp.slice();

    // filter the supervisor/specialist from the available roles in buffer
    let bufferTempsupAndSpecScreenNames = [];
    this.availableRoles.forEach((screenNames) => {
      let index = this.bufferSupAndSpecScreenNames.indexOf(screenNames.screenName);
      if (index < 0) {
        bufferTempsupAndSpecScreenNames.push(screenNames);
      }

    })
    this.availableRoles = bufferTempsupAndSpecScreenNames.slice();

    // reset all buffer values
    this.bufferArrayTemp = [];
    this.bufferSupAndSpecScreenNames = [];
    this.supAndSpecScreenNames = [];
  }
  
  allowSingleRoleOnlyForECD(serviceline){
    if(serviceline === "ECD"){
      this.singleSelectForEcd = true;
    } else {
      this.singleSelectForEcd = false;
    }
  }

  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.bufferArray = [];
      this.editWorkplaceForm.resetForm();
      this.showInOutBoundEdit=false;
      this.isOutboundEdit = false;
      this.isInboundEdit = false;
      this.searchTerm=null;
      this.disableSelectRoles = false;
    }
    else {

      if (this.bufferArray.length > 0) {
        // this.alertService.confirm('Confirm', "Do you really want to go back? Any unsaved data would be lost").subscribe(response => {
        //   if (response) {
        this.tableMode = true;
        this.formMode = false;
        this.editMode = false;
        this.bufferArray = [];
        this.eForm.resetForm();
        this.isNational = false;
        this.isInbound = false;
        this.isOutbound = false;
        this.showInOutBound=false;
        this.availableRoles = [];
        this.RolesList=[];
        this.searchTerm=null;
        this.disableSelectRoles = false;
        //   }
        // });
      }
      else {
        // this.alertService.confirm('Confirm', "Do you really want to go back? Any unsaved data would be lost").subscribe(response => {
        //   if (response) {
        this.tableMode = true;
        this.formMode = false;
        this.editMode = false;
        this.bufferArray = [];
        this.eForm.resetForm();
        this.isNational = false;
        this.isInbound = false;
        this.isOutbound = false;
        this.showInOutBound=false;
        this.availableRoles = [];
        this.RolesList=[];
        this.searchTerm=null;
        this.disableSelectRoles = false;
        //   }
        // });
      }
    }

  }
  back() {
    this.alertService.confirm('Confirm', "Do you really want to go back? Any unsaved data would be lost").subscribe(response => {
      if (response) {
        this.showTable();
        this.getAllMappedWorkLocations();
        
      }
    });

  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
    this.edit = false;
    this.isInbound = false;
    this.isOutbound = false;
    // this.getUserName(this.serviceProviderID);
  }
  showEditForm() {
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
    this.edit = true;
    this.isInbound = false;
    this.isOutbound = false;
    // this.getUserName(this.serviceProviderID);
  }

  activate(serviceID, uSRMappingID, userDeactivated, providerServiceMappingDeleted) {
    if (userDeactivated) {
      this.alertService.alert('User is inactive');
    }
    else if (providerServiceMappingDeleted) {
      this.alertService.alert('State is inactive');
    }
    else {
      if (serviceID == 4) {
        this.alertService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
          if (response) {
            const object = {
              'uSRMappingID': uSRMappingID,
              'deleted': false
            };

            this.worklocationmapping.DeleteWorkLocationMappingForTM(object)
              .subscribe(response => {
                if (response) {
                  this.alertService.alert('Activated successfully', 'success');
                  /* refresh table */
                  this.searchTerm=null;
                  this.getAllMappedWorkLocations();
                }
              },
                err => {
                  console.log('error', err);
                  this.alertService.alert(err.errorMessage);
                });
          }
        });
      } else {
        this.alertService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
          if (response) {
            const object = {
              'uSRMappingID': uSRMappingID,
              'deleted': false
            };

            this.worklocationmapping.DeleteWorkLocationMapping(object)
              .subscribe(response => {
                if (response) {
                  this.alertService.alert('Activated successfully', 'success');
                  /* refresh table */
                  this.searchTerm=null;
                  this.getAllMappedWorkLocations();
                }
              },
                err => {
                  console.log('error', err);
                });
          }
        });
      }
    }

  }
  deactivate(serviceID, uSRMappingID) {
    if (serviceID == 4) {
      this.alertService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
        if (response) {
          const object = { 'uSRMappingID': uSRMappingID, 'deleted': true };

          this.worklocationmapping.DeleteWorkLocationMappingForTM(object)
            .subscribe(res => {
              if (res) {
                this.alertService.alert('Deactivated successfully', 'success');
                /* refresh table */
                this.searchTerm=null;
                this.getAllMappedWorkLocations();
              }
            },
              err => {
                console.log('error', err);
                console.log(err, 'error');
              });
        }
      });

    } else {
      this.alertService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
        if (response) {
          const object = { 'uSRMappingID': uSRMappingID, 'deleted': true };

          this.worklocationmapping.DeleteWorkLocationMapping(object)
            .subscribe(res => {
              if (res) {
                this.alertService.alert('Deactivated successfully', 'success');
                /* refresh table */
                this.searchTerm=null;
                this.getAllMappedWorkLocations();
              }
            },
              err => {
                console.log('error', err);
                console.log(err, 'error');
              });
        }
      });
    }
  }
  addWorkLocation(objectToBeAdded: any, role) {
    let statesIDEdit = objectToBeAdded.serviceline.isNational === false ? objectToBeAdded.state.providerServiceMapID : this.states_array[0].providerServiceMapID;
    let districtEdit = objectToBeAdded.serviceline.isNational === false ? objectToBeAdded.district.districtID : null;
    console.log(objectToBeAdded, "FORM VALUES");
    if (objectToBeAdded.serviceline.serviceName === "1097") {
      if((this.isInbound === false || this.isInbound === null || this.isInbound == undefined)  && (this.isOutbound === false || this.isOutbound === null || this.isOutbound === undefined) && objectToBeAdded.role.some((item) => item.roleName.toLowerCase() !== "supervisor"))
      {
      this.alertService.alert('Select checkbox Inbound/Outbound/Both');
      }
      else
      {
        if(objectToBeAdded.role.some((item) => item.roleName.toLowerCase() === "supervisor") && (this.isOutbound == true || this.isInbound == true))
        {
          this.alertService.alert("Supervisor doesn't have the privilege for Inbound/Outbound");
         
        }

     
    
        
        if (objectToBeAdded.role.length > 0) {
          if (objectToBeAdded.role.length == 1) {
            for (let a = 0; a < objectToBeAdded.role.length; a++) {
             
              let obj = {
                'roleID1': objectToBeAdded.role[a].roleID,
                'roleName': objectToBeAdded.role[a].roleName,
                'screenName': objectToBeAdded.role[a].screenName
              }
              // roleArray.push(obj);
              if(objectToBeAdded.role[a].roleName.toLowerCase() === "supervisor" )
                   this.setWorkLocationObject(objectToBeAdded,obj,false,false);
              else
              this.setWorkLocationObject(objectToBeAdded,obj,objectToBeAdded.Inbound,objectToBeAdded.Outbound); 
              
            }
    
          } else {
            if (objectToBeAdded.role.length > 1) {
              for (let i = 0; i < objectToBeAdded.role.length; i++) {
                if (objectToBeAdded.role[i].screenName == 'TC Specialist' || objectToBeAdded.role[i].screenName == 'Supervisor') {
                  this.Role = null;
                  // roleArray = [];
                  this.alertService.alert('Invaild role mapping');
                  break;
                } else {
                  let obj = {
                    'roleID1': objectToBeAdded.role[i].roleID,
                    'roleName': objectToBeAdded.role[i].roleName,
                    'screenName': objectToBeAdded.role[i].screenName
                  }
                  // roleArray.push(obj);
                  if(objectToBeAdded.role[i].roleName.toLowerCase() === "supervisor" )
                  this.setWorkLocationObject(objectToBeAdded,obj,false,false);
                 else
                    this.setWorkLocationObject(objectToBeAdded,obj,objectToBeAdded.Inbound,objectToBeAdded.Outbound); 
                }
    
              }
            }
          }
         
            
            this.resetAllArrays();
            this.isNational = false;
            
    
          
    
        }
        if (this.bufferArray.length > 0) {
          this.eForm.resetForm();
        }
        console.log("Result Array",this.bufferArray)
      }
    } else if( objectToBeAdded.serviceline.serviceName === "ECD") {
      // for (let a = 0; a < objectToBeAdded.role.length; a++) {
      //   let obj = {
      //     'roleID1': objectToBeAdded.role[a].roleID,
      //     'roleName': objectToBeAdded.role[a].roleName,
      //     'screenName': objectToBeAdded.role[a].screenName
      //   }
        // roleArray.push(obj);
        let obj = {
          'roleID1': objectToBeAdded.role.roleID,
          'roleName': objectToBeAdded.role.roleName,
          'screenName': objectToBeAdded.role.screenName
        }
        this.setWorkLocationObject(objectToBeAdded,obj,false,false);  
        if (this.bufferArray.length > 0) {
          this.eForm.resetForm();
        }
        console.log("Result Array",this.bufferArray);
        if (this.bufferArray.length > 0) {
          this.eForm.resetForm();
        }
      // }

    }
  else
  {
   
    if (objectToBeAdded.role.length > 0) {
      if (objectToBeAdded.role.length == 1) {
        for (let a = 0; a < objectToBeAdded.role.length; a++) {
         
          let obj = {
            'roleID1': objectToBeAdded.role[a].roleID,
            'roleName': objectToBeAdded.role[a].roleName,
            'screenName': objectToBeAdded.role[a].screenName
          }
          // roleArray.push(obj);
       
               this.setWorkLocationObject(objectToBeAdded,obj,false,false);
        
          
        }

      } else {
        if (objectToBeAdded.role.length > 1) {
          for (let i = 0; i < objectToBeAdded.role.length; i++) {
            if (objectToBeAdded.role[i].screenName == 'TC Specialist' || objectToBeAdded.role[i].screenName == 'Supervisor') {
              this.Role = null;
              // roleArray = [];
              this.alertService.alert('Invaild role mapping');
              break;
            } else {
              let obj = {
                'roleID1': objectToBeAdded.role[i].roleID,
                'roleName': objectToBeAdded.role[i].roleName,
                'screenName': objectToBeAdded.role[i].screenName
              }
              // roleArray.push(obj);
             
              this.setWorkLocationObject(objectToBeAdded,obj,false,false);
            
            }

          }
        }
      }
     
        
        this.resetAllArrays();

      

    }
    if (this.bufferArray.length > 0) {
      this.eForm.resetForm();
      this.disableSelectRoles = false;
    }
    console.log("Result Array",this.bufferArray)



  }
  }

  setWorkLocationObject(objectToBeAdded,obj,InboundValue,OnboundValue)
  {
    let roleArr=[];
    roleArr.push(obj);
    const workLocationObj = {
      'previleges': [],
      'userID': objectToBeAdded.user.userID,
      'userName': objectToBeAdded.user.userName,
      'serviceID': objectToBeAdded.serviceline.serviceID,
      'serviceName': objectToBeAdded.serviceline.serviceName,
      // 'stateName': objectToBeAdded.state ? objectToBeAdded.state.stateName : '-',
      // 'district': objectToBeAdded.district ? objectToBeAdded.district.districtName : '-',
      'workingLocation': objectToBeAdded.worklocation.locationName,
      'roleID1': roleArr,
      'Inbound':objectToBeAdded.serviceline.serviceName === "1097"?InboundValue:"N/A",
      'Outbound':objectToBeAdded.serviceline.serviceName === "1097"?OnboundValue:"N/A",
      // tslint:disable-next-line:max-line-length
      'providerServiceMapID': objectToBeAdded.serviceline.isNational === false ? objectToBeAdded.state.providerServiceMapID : this.states_array[0].providerServiceMapID,
      'createdBy': this.createdBy,
      'workingLocationID': objectToBeAdded.worklocation.pSAddMapID

    };

    if (objectToBeAdded.state) {
      workLocationObj['stateName'] = objectToBeAdded.state.stateName;
    }
    else {
      workLocationObj['stateName'] = 'All States';
    }

    if (objectToBeAdded.district != undefined) {
      workLocationObj['district'] = objectToBeAdded.district.districtName;
    }
    else {
      workLocationObj['district'] = null;
    }


   
    
        this.bufferArray.push(workLocationObj);

    
    
}
  
  resetAllArrays() {
    this.states_array = [];
    this.districts_array = [];
    this.workLocationsList = [];
    this.availableRoles = [];
    this.RolesList=[];
    this.showInOutBound=false;
  }
  deleteRow(i, serviceID, providerServiceMapID, userID) {
    this.bufferArray.splice(i, 1);
    this.getAllRoles(serviceID, providerServiceMapID, userID);
    this.availableRoles = [];
    this.RolesList=[];

  }
  removeRole(rowIndex, roleIndex) {
    this.bufferArray[rowIndex].roleID1.splice(roleIndex, 1);

    this.getAllRoles(this.bufferArray[rowIndex].serviceID, this.bufferArray[rowIndex].providerServiceMapID, this.bufferArray[rowIndex].userID);
    if (this.bufferArray[rowIndex].roleID1.length === 0) {
      this.bufferArray.splice(rowIndex, 1);
    }
  }

  saveWorkLocations() {
    console.log(this.bufferArray, 'Request Object');
    let requestArray = [];
    let workLocationObj = {
      'previleges': [
        {

          'ID': [
            {
            'roleID': '',
            'inbound': '',
            'outbound': ''
            }
          ],
          'providerServiceMapID': '',
          'workingLocationID': ''
        }
      ],
      'userID': '',
      'createdBy': '',
      'serviceProviderID': this.serviceProviderID
    }
    for (let i = 0; i < this.bufferArray.length; i++) {
 
        let workLocationObj = {
          // "is1097": this.bufferArray[i].serviceName == "1097" ? true : false,
          'previleges': [
            {
              'ID': [
                {
                'roleID': this.bufferArray[i].roleID1[0].roleID1,
                'inbound': this.bufferArray[i].serviceName == "1097"?this.bufferArray[i].Inbound:null,
                'outbound': this.bufferArray[i].serviceName == "1097"?this.bufferArray[i].Outbound:null
                }
              ],
              'providerServiceMapID': this.bufferArray[i].providerServiceMapID,
               'workingLocationID': this.bufferArray[i].workingLocationID
            }
          ],
          'userID': this.bufferArray[i].userID,
          'createdBy': this.createdBy,
          'serviceProviderID': this.serviceProviderID
        }

        requestArray.push(workLocationObj);
        
      
    }
    console.log(requestArray, 'after modification array');
    this.bufferArray = [];
    this.worklocationmapping.SaveWorkLocationMapping(requestArray)
      .subscribe(response => {
        console.log(response, 'after successful mapping of work-location');
        this.alertService.alert('Mapping saved successfully', 'success');
        this.getAllMappedWorkLocations();
        this.eForm.resetForm();
        this.showTable();
        this.resetAllArrays();
        this.disableSelectRoles = false;
        this.filteredStates = [];
        // this.services_array = [];
        this.bufferArray = [];
      }, err => {
        console.log(err, 'ERROR');
        console.log(err, 'error');
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
  isInboundEdit=false;
  isOutboundEdit=false;
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
    this.isInboundEdit=this.edit_Details.inbound;
    this.isOutboundEdit=this.edit_Details.outbound;
  
   
    if(this.edit_Details.serviceName === "1097" && !(this.edit_Details.roleName.toLowerCase() === "supervisor"))
    {
        this.showInOutBoundEdit=true;
        
    }
   else
   {
    this.showInOutBoundEdit=false;
   }
    this.getProviderServices(this.userID);
    this.checkService_forIsNational();
    this.getProviderStates_duringEdit(this.serviceID_duringEdit, this.isNational_edit);
    if (this.edit_Details.stateID === undefined) {
      this.set_currentPSM_ID_duringEdit(this.edit_Details.providerServiceMapID);
      this.stateID_duringEdit = '';
      this.district_duringEdit = null;
      this.getAllWorkLocations_duringEdit2(this.states_array[0].stateID, this.serviceID_duringEdit, this.isNational_edit, this.district_duringEdit,this.providerServiceMapID_duringEdit, this.userID_duringEdit);
      // this.getAllRoles_duringEdit(this.serviceID_duringEdit, this.providerServiceMapID_duringEdit, this.userID_duringEdit);
    }
    else {
      this.getAllDistricts_duringEdit2(this.edit_Details.stateID,this.stateID_duringEdit, this.serviceID_duringEdit, this.isNational_edit, this.district_duringEdit,this.providerServiceMapID_duringEdit, this.userID_duringEdit);
      // this.getAllWorkLocations_duringEdit2(this.stateID_duringEdit, this.serviceID_duringEdit, this.isNational_edit, this.district_duringEdit,this.providerServiceMapID_duringEdit, this.userID_duringEdit);
      // this.getAllRoles_duringEdit(this.serviceID_duringEdit, this.providerServiceMapID_duringEdit, this.userID_duringEdit);
    }


  }
  getAllDistricts_duringEdit2(state: any,stateID: any, serviceID: any, isNational_edit, districtID,psmID, userID) {
    this.worklocationmapping.getAllDistricts(state)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all districts success handeler');
          this.districts_array = response;
          this.getAllWorkLocations_duringEdit2(stateID, serviceID, isNational_edit, districtID,psmID, userID);
          // this.getAllWorkLocations_duringEdit(this.userID_duringEdit, this.stateID_duringEdit, this.serviceID_duringEdit);
        }
      }, err => {
        console.log(err, 'error');
      });
  }

  getAllWorkLocations_duringEdit2(stateID: any, serviceID: any, isNational_edit, districtID,psmID, userID) {
    this.worklocationmapping.getAllWorkLocations(this.serviceProviderID, stateID, serviceID, isNational_edit, districtID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all work locations success handeler edit');
          this.workLocationsList = response;
          this.getAllRoles_duringEdit2(serviceID,psmID,userID);

        }
      }, err => {
        console.log(err, 'error');

      });
  }


  getAllRoles_duringEdit2(serviceID, psmID, userID) {
    this.worklocationmapping.getAllRoles(psmID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all roles success handeler');
          this.RolesList = response;
          this.checkExistance(serviceID, psmID, userID);
        }
        //on edit - populate roles
        if (this.edit_Details != undefined) {
          if (this.RolesList) {
            let edit_role = this.RolesList.filter((mappedRole) => {
              if (this.edit_Details.roleID == mappedRole.roleID) {
                return mappedRole;
              }
            })[0];
            if (edit_role) {
              // this.roleID_duringEdit = edit_role;
              this.availableRoles.push(edit_role);
            }
          }
        }
      }, err => {
        console.log(err, 'error');

      });
  }


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
        console.log(err, 'error');
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
      subscribe(response => this.getStatesSuccessHandeler_duringEdit(serviceID, response, isNational), err => {
        console.log(err, 'error');
      });
  }

  getStatesSuccessHandeler_duringEdit(serviceID, response, isNational) {
    // this.stateID_duringEdit = '';
    if (response) {
      console.log(response, 'Provider States');
      this.states_array = response;
      this.districts_array = [];
      this.workLocationsList = [];
      this.RolesList = []
      this.availableRoles=[];

      if (isNational) {
        this.set_currentPSM_ID_duringEdit(this.states_array[0].providerServiceMapID);
        this.stateID_duringEdit = '';
        this.district_duringEdit = null;
        this.getAllWorkLocations_duringEdit(this.states_array[0].stateID, this.serviceID_duringEdit, this.isNational_edit, this.district_duringEdit);
        this.getAllRoles_duringEdit(serviceID, this.providerServiceMapID_duringEdit, this.userID_duringEdit);
      }
      // this.getProviderServicesInState_duringEdit(this.stateID_duringEdit);
      this.getAllDistricts_duringEdit(this.stateID_duringEdit);
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
    this.district_duringEdit = undefined;
    this.workLocationID_duringEdit = undefined;
    this.roleID_duringEdit = undefined;
  }
  refresh5() {
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
        console.log(err, 'error');
      });
  }
  getAllWorkLocations_duringEdit(stateID: any, serviceID: any, isNational_edit, districtID) {
    this.worklocationmapping.getAllWorkLocations(this.serviceProviderID, stateID, serviceID, isNational_edit, districtID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all work locations success handeler edit');
          this.workLocationsList = response;

          // this.getAllRoles_duringEdit(this.providerServiceMapID_duringEdit);

        }
      }, err => {
        console.log(err, 'error');

      });
  }


  getAllRoles_duringEdit(serviceID, psmID, userID) {
    this.worklocationmapping.getAllRoles(psmID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all roles success handeler');
          this.RolesList = response;
          this.checkExistance(serviceID, psmID, userID);
        }
        //on edit - populate roles
        if (this.edit_Details != undefined) {
          if (this.RolesList) {
            let edit_role = this.RolesList.filter((mappedRole) => {
              if (this.edit_Details.roleID == mappedRole.roleID) {
                return mappedRole;
              }
            })[0];
            if (edit_role) {
              // this.roleID_duringEdit = edit_role;
              this.availableRoles.push(edit_role);
            }
          }
        }
      }, err => {
        console.log(err, 'error');

      });
  }

  updateWorkLocation(workLocations: any) {
    if (workLocations.serviceID === 1) {
      let updateRoleName = this.RolesList.filter((response) => {
        if (workLocations.role == response.roleID) {
          return response;
        }
      })[0];
    if((this.isInboundEdit === false || this.isInboundEdit === null || this.isInboundEdit === undefined)  && (this.isOutboundEdit === false || this.isOutboundEdit === null || this.isOutboundEdit === undefined) && !(updateRoleName.roleName.toLowerCase() === "supervisor"))
    {
    this.alertService.alert('Select checkbox Inbound/Outbound/Both');
    }
    else
    {
     
      
        this.updateData(workLocations,updateRoleName.roleName);
      

     

    }
   }
    else
    {

    
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
        this.alertService.alert('Mapping updated successfully', 'success');
        this.showTable();
        this.getAllMappedWorkLocations();
        this.bufferArray = [];
      }, err => {
        console.log(err, 'ERROR');
      });
    }
  }
updateData(workLocations,roleValue)
{
  const langObj = {
    'uSRMappingID': this.uSRMappingID,
    'userID': this.userID_duringEdit,
    'roleID': workLocations.role,
    'inbound':roleValue.toLowerCase() === "supervisor"?false:this.isInboundEdit,
    'outbound':roleValue.toLowerCase() === "supervisor"?false:this.isOutboundEdit,
    'providerServiceMapID': this.providerServiceMapID_duringEdit,
    'workingLocationID': workLocations.worklocation,
    'modifiedBy': this.createdBy
  };
  console.log('edited request object to be sent to API', langObj);
  this.worklocationmapping.UpdateWorkLocationMapping(langObj)
    .subscribe(response => {
      console.log(response, 'after successful mapping of work location to provider');
      this.alertService.alert('Mapping updated successfully', 'success');
      this.showTable();
      this.getAllMappedWorkLocations();
      this.bufferArray = [];
    }, err => {
      console.log(err, 'ERROR');
    });
}



  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredmappedWorkLocationsList = this.mappedWorkLocationsList;
    } else {
      this.filteredmappedWorkLocationsList = [];
      this.mappedWorkLocationsList.forEach((item) => {
        for (let key in item) {
          if (key == 'userName' || key == 'serviceName' || key == 'stateName' || key == 'workingDistrictName' || key == 'locationName' || key == 'roleName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredmappedWorkLocationsList.push(item); break;
            }
          }
        }
      });
    }

  }
  // resetDropdowns() {
  //   this.User = undefined;
  //   this.State = undefined;
  //   this.Serviceline = undefined;
  //   this.District = undefined;
  //   this.WorkLocation = undefined;
  //   this.Role = undefined;
  // }
  resetAllFields() {
    this.State = undefined;
    this.Serviceline = undefined;
    this.District = undefined;
    this.WorkLocation = undefined;
    this.Role = undefined;
    this.resetAllArrays();
  }

  showInboundOutbound(value)
  {
    // this.isInbound=null;
    // this.isOutbound=null;
    this.isInbound=false;
    this.isOutbound=false;
    if(value == "1097")
       this.showInOutBound=true;
    else
       this.showInOutBound=false;
  }

  setInbound(event) {
   
    if (!event.checked) {
      this.isInbound=false;
    }
    else
    this.isInbound=true;
  }

  setOutbound(event) {
   
    if (!event.checked) {
      this.isOutbound=false;
    }
    else
    this.isOutbound=true;
  }

  showInboundOutboundEdit(value,role)
  {
    let editRoleName = this.RolesList.filter((response) => {
      if (role == response.roleID) {
        return response;
      }
    })[0];
    
  
    this.isInboundEdit=false;
    this.isOutboundEdit=false;
    if(value === 1 && !(editRoleName.roleName.toLowerCase() === "supervisor"))
       this.showInOutBoundEdit=true;
    else
       this.showInOutBoundEdit=false;
  }

}
