import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { SuperAdmin_ServiceProvider_Service } from '../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service';

@Component({
  selector: 'app-mapping-provider-admin-to-provider',
  templateUrl: './mapping-provider-admin-to-provider.component.html',
  styleUrls: ['./mapping-provider-admin-to-provider.component.css']
})
export class MappingProviderAdminToProviderComponent implements OnInit {

  service_provider_array: any = [];
  service_provider_admin_array: any = [];
  states_array: any = [];
  services_array: any = [];
  // constants & variables

  isNational = false;
  providerServiceMapID_for1097: any;

  providerNameBeforeEdit: any;
  ////////////////////////////////
  service_provider_admin: any;
  service_provider: any;
  provider: any;
  serviceline: any;
  state: any;
  serviceProviderMapID: any;
  edit_Details: any;
  uSRMappingID: any;
  serviceProviderID: any;
  providermapID: any;

  // arrays
  providers: any = [];
  servicelines: any = [];
  states: any = [];
  bufferArray: any = [];
  providerAdminList: any = [];
  filteredStates: any = [];
  edit_state: any;

  // flags
  formMode = false;
  tableMode = true;
  editMode = false;
  disableUsername: boolean = false;
  // variables
  createdBy: any;
  toBeEditedObject: any;

  @ViewChild('form') form: NgForm;

  @ViewChild('myForm') myForm: NgForm;

  constructor(public superadminService: SuperAdmin_ServiceProvider_Service,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.getAllMappedProviders();
    this.getAllProviders();
    this.getAllProviderAdmins();
  }
  //--start ** Populating Drop downs data from services
  getAllMappedProviders() {
    this.superadminService.getAllMappedProviders()
      .subscribe(response => {
        if (response) {
          console.log('All Provider Admins Mapping Success Handeler', response);
          this.providerAdminList = response;
        }
      }, err => {
        this.dialogService.alert(err, 'error');
        console.log('Error', err);
      });
  }
  getAllProviders() {
    this.superadminService.getAllProvider()
      .subscribe(response => {
        if (response) {
          console.log('All Providers Success Handeler', response);
          this.service_provider_array = response;
        }
      }, (err) => this.dialogService.alert(err, 'error'));
  }
  getAllProviderAdmins() {
    this.superadminService.getAllProviderAdmins()
      .subscribe(response => {
        if (response) {
          console.log('All Provider Admins Success Handeler', response);
          this.service_provider_admin_array = response;
          this.filteredStates = [];
        }
      }, err => {
        this.dialogService.alert(err, 'error');
        console.log('Error', err);
      });
  }

  // getProviderStates(state) {
  //   this.superadminService.getProviderStates(state.serviceProviderId || state.serviceProviderID).
  //     subscribe(response => this.getStatesSuccessHandeler(response));
  // }
  getProviderServices(serviceProvider) {
    this.superadminService.getProviderServices(serviceProvider.serviceProviderId || serviceProvider.serviceProviderID).
      subscribe(response => this.getServiceSuccessHandeler(response),
        (err) => this.dialogService.alert(err, 'error'));
  }
  getProviderServices_Edit(serviceProvider) {
    this.superadminService.getProviderServices(serviceProvider).
      subscribe(response => this.getServiceSuccessHandeler(response),
        (err) => this.dialogService.alert(err, 'error'));
  }
  getServiceSuccessHandeler(response) {
    if (response) {
      console.log(response, 'Provider States');
      this.services_array = response;
    }
  }

  // getStatesSuccessHandeler(response) {
  //   if (response) {
  //     console.log(response, 'Provider States');
  //     this.states_array = response;
  //   }
  // }
  getProviderStatesInService(providerAdmin, serviceProvider, service, national) {
    this.superadminService.getProviderStatesInService(serviceProvider.serviceProviderId || serviceProvider.serviceProviderID, service.serviceID)
      .subscribe(response => {
        if (response) {
          console.log('Provider states in service', response);
          this.states_array = response;
          if (response.stateID === undefined) {
            this.providerServiceMapID_for1097 = this.states_array[0].providerServiceMapID;

          }
        }
        this.getAvailableStates(providerAdmin, serviceProvider.serviceProviderId || serviceProvider.serviceProviderID, service, national)

      });

  }
  getProviderStatesInService_edit(providerAdmin, serviceProvider, service, national) {
    if (national === 1) {
      national = true;
      this.edit_Details.stateID = undefined;
    }
    else {
      national = false;
    }
    this.superadminService.getProviderStatesInService(serviceProvider.serviceProviderId || serviceProvider.serviceProviderID, service)
      .subscribe(response => {
        if (response) {
          console.log('Provider states in service', response);
          this.states_array = response;
          if (response.stateID === undefined) {
            this.providerServiceMapID_for1097 = this.states_array.providerServiceMapID;

          }
        }
        this.getAvailableStates_edit(providerAdmin, serviceProvider.serviceProviderId || serviceProvider.serviceProviderID, service, national)
        this.setIsNational(national);

      },
        (err) => this.dialogService.alert(err, 'error'));

  }

  setIsNational(value) {
    this.isNational = value;
    if (value) {
      // this.myForm.form.patchValue({ 'state': undefined });
      this.state = undefined;
      this.edit_state = undefined;
      // this.providerServiceMapID_for1097 = this.states_array[0].providerServiceMapID;

    }

  }

  // getProviderServicesInState(state, providerAdmin, serviceProvider) {
  //   this.superadminService.getProviderServicesInState(serviceProvider.serviceProviderId || serviceProvider.serviceProviderID, state.stateID)
  //     .subscribe(response => {
  //       if (response) {
  //         console.log('Provider Services in State', response);
  //         this.services_array = response;
  //         this.getAvailableServiceLines(state, providerAdmin, serviceProvider.serviceProviderId || serviceProvider.serviceProviderID)
  //       }
  //     });

  // }


  getServicesSuccessHandeler(response) {
    if (response) {
      console.log('Provider Services in State', response);
      this.services_array = response;
    }
  }

  getAvailableStates(providerAdmin, serviceProviderId, service, national) {
    console.log(providerAdmin, service, national);
    const alreadyMappedStates = [];
    if (!national) {
      for (let i = 0; i < this.providerAdminList.length; i++) {
        if (this.providerAdminList[i].userID === (providerAdmin.userID || providerAdmin) &&
          this.providerAdminList[i].serviceProviderID === serviceProviderId &&
          this.providerAdminList[i].serviceID === (service.serviceID || service)) {
          if (this.providerAdminList[i].stateID !== undefined) {
            const obj = {
              'stateID': this.providerAdminList[i].stateID,
              'stateName': this.providerAdminList[i].stateName
            }
            alreadyMappedStates.push(obj);
          }

        }
      }
      console.log('alredy ampped states', alreadyMappedStates);
      const filteredStates = this.states_array.filter(function (statesFromAllStates) {
        return !alreadyMappedStates.find(function (stateFromMappedstates) {
          return statesFromAllStates.stateID === stateFromMappedstates.stateID
        })

      });
      console.log(this.filteredStates, 'Filtered states');
      console.log(filteredStates, 'const services');
      this.filteredStates = [];
      if (filteredStates.length === 0) {
        this.dialogService.alert('All states for this serviceline have been mapped');
      } else {
        this.filteredStates = filteredStates;

      }

    }
  }
  getAvailableStates_edit(providerAdmin, serviceProviderId, service, national) {
    console.log(providerAdmin, service, national);
    const alreadyMappedStates = [];
    if (!national) {
      for (let i = 0; i < this.providerAdminList.length; i++) {
        if (this.providerAdminList[i].userID === providerAdmin &&
          this.providerAdminList[i].serviceProviderID === serviceProviderId &&
          this.providerAdminList[i].serviceID === (service)) {
          if (this.providerAdminList[i].stateID !== undefined) {
            const obj = {
              'stateID': this.providerAdminList[i].stateID,
              'stateName': this.providerAdminList[i].stateName
            }
            alreadyMappedStates.push(obj);
          }

        }
      }
      console.log('alredy ampped states', alreadyMappedStates);
      const filteredStates = this.states_array.filter(function (statesFromAllStates) {
        return !alreadyMappedStates.find(function (stateFromMappedstates) {
          return statesFromAllStates.stateID === stateFromMappedstates.stateID
        })

      });
      console.log(this.filteredStates, 'Filtered states');
      console.log(filteredStates, 'const services');
      this.filteredStates = [];
      if (filteredStates.length === 0) {
        this.dialogService.alert('All states for this serviceline have been mapped');
      } else {
        this.filteredStates = filteredStates;

      }

    }
  }
  // --end 
  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.bufferArray = [];
      this.resetDropdowns();
    }
    else {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.bufferArray = [];
      this.resetDropdowns();
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
  add2bufferArray(form_values) {
    debugger;
    this.resetDropdowns();
    console.log(form_values, 'form values after adding');
    const object = {
      'serviceProviderMapID1': [],
      'userID': form_values.ProviderAdmin.userID,
      'createdBy': this.createdBy,
      'serviceName': form_values.Services.serviceName,
      'serviceProviderName': form_values.serviceProvider.serviceProviderName,
      'userName': form_values.ProviderAdmin.userName
    };

    let providerServiceMapIDs = [];
    if (form_values.state != undefined) {
      if (form_values.state.length > 0) {
        for (let a = 0; a < form_values.state.length; a++) {
          let obj = {
            'serviceProviderMapID1': form_values.state[a].providerServiceMapID,
            'stateName': form_values.state[a].stateName
          }

          providerServiceMapIDs.push(obj);
        }

        object['serviceProviderMapID1'] = providerServiceMapIDs;
        this.checkDuplicates(object);
      }
    }
    else if (form_values.state === undefined) {

      let obj = {
        'serviceProviderMapID1': this.providerServiceMapID_for1097,
        'stateName': "All states",
      }

      providerServiceMapIDs.push(obj);
      object['serviceProviderMapID1'] = providerServiceMapIDs;
      this.checkDuplicates(object);
    }
  }
  checkDuplicates(object) {
    debugger;
    console.log(object, 'BEFORE TESTING THE OBJECT SENT');
    /* case:1 If the buffer array is empty */
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
      console.log("bufferArray", this.bufferArray);
      this.resetForm();
    }

    /* case:2 If the buffer array is not empty */
    else if (this.bufferArray.length > 0) {
      let servicesMatched = false;
      let providerCount = 0;
      for (let a = 0; a < this.bufferArray.length; a++) {
        /* if the ProviderID of object in BufferArray is same as that of new object */
        if (this.bufferArray[a].serviceProviderName === object.serviceProviderName && this.bufferArray[a].userID === object.userID) {
          providerCount = providerCount + 1;
          console.log("this.bufferArray[a].userID", this.bufferArray[a].userID);

          /* if the serviceID of object in BufferArray is same as that of new object */
          if (this.bufferArray[a].serviceName === object.serviceName) {
            servicesMatched = true;
            /* the loop will run i times , where i= no of objects in States Array
               of OBJECT sent for verification */
            for (let i = 0; i < object.serviceProviderMapID1.length; i++) {
              let count = 0;  // counter to check if duplicate state comes for a 'Existing Provider and Existing Service'

              /* running second loop which will run j times , where j= no of objects in States Array
               of an OBJECT in buffer array */
              for (let j = 0; j < this.bufferArray[a].serviceProviderMapID1.length; j++) {
                if (this.bufferArray[a].serviceProviderMapID1[j].serviceProviderMapID1 === object.serviceProviderMapID1[i].serviceProviderMapID1) {
                  count = count + 1;
                  console.log('Duplicate Combo Exists', count);
                }
              }
              if (count === 0) {
                this.bufferArray[a].serviceProviderMapID1.push(object.serviceProviderMapID1[i]);
                this.resetForm();
              }
              else if (count > 0) {
                console.log('Duplicate Entry Already exists for ' + object.serviceProviderMapID1[i].serviceName);
                this,this.dialogService.alert('Already exists');
                this.resetForm();
              }
            }
          }
          else {
            continue;
          }
        }
      }
      // if (providerCount === 1 && servicesMatched === false) {
      //   this.bufferArray.push(object);
      //   this.resetForm();
      // }
      // if (providerCount === 2 && servicesMatched === false) {
      //   this.bufferArray.push(object);
      //   this.resetForm();
      // }
      // if (providerCount === 0) {
      //   this.bufferArray.push(object);
      //   this.resetForm();
      // }
      if (servicesMatched === false) {
        this.bufferArray.push(object);
        this.resetForm();
      }    
    }
  }
  mapServicelineState() {
    console.log(this.bufferArray, 'Request Object');
    const requestArray = Object.assign([], this.bufferArray)
    for (let i = 0; i < this.bufferArray.length; i++) {
      const array_set = [];
      for (let j = 0; j < requestArray[i].serviceProviderMapID1.length; j++) {
        array_set.push(requestArray[i].serviceProviderMapID1[j].serviceProviderMapID1);
      }
      requestArray[i].serviceProviderMapID1 = array_set;
    }

    console.log('After modification', requestArray);
    this.bufferArray = [];

    this.superadminService.createMappingProviderAdmin(requestArray)
      .subscribe(response => {
        console.log(response, 'after successful mapping of provider to service and state');
        this.dialogService.alert('Mapping saved successfully', 'success');
        this.showTable();
        this.getAllMappedProviders();
        this.resetDropdowns();
        this.filteredStates = [];
        this.services_array = [];
        this.states_array = [];
        this.bufferArray = [];
      }, err => {
        console.log(err, 'ERROR');
      });
  }
  resetForm() {
    this.form.reset();
    this.provider = undefined;
    this.serviceline = undefined;
    this.state = undefined;
    this.uSRMappingID = undefined;
    this.edit_Details = undefined;
  }
  removeService(rowIndex, serviceIndex) {
    this.bufferArray[rowIndex].serviceProviderMapID1.splice(serviceIndex, 1);
    if (this.bufferArray[rowIndex].serviceProviderMapID1.length === 0) {
      this.bufferArray.splice(rowIndex, 1);
    }
  }
  removeRow(index) {
    this.bufferArray.splice(index, 1);
  }
  back() {
    this.dialogService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.showTable();
        this.resetForm();
      }
    })
  }
  activate(userID) {
    this.dialogService.confirm('Confirm', "Are you sure want to Activate?").subscribe(response => {
      if (response) {
        const object = {
          'uSRMappingID': userID,
          'deleted': false
        };

        this.superadminService.activateProviderAdmin(object)
          .subscribe(response => {
            if (response) {
              this.dialogService.alert('Activated successfully', 'success');
              /* refresh table */
              this.getAllMappedProviders();
            }
          },
            err => {
              this.dialogService.alert(err, 'error');
              console.log('error', err);
            });
      }
    });
  }
  deactivate(userID) {
    this.dialogService.confirm('Confirm', "Are you sure want to Deactivate?").subscribe(response => {
      if (response) {
        const object = { 'uSRMappingID': userID, 'deleted': true };

        this.superadminService.deactivateProviderAdmin(object)
          .subscribe(response => {
            if (response) {
              this.dialogService.alert('Deactivated successfully', 'success');
              /* refresh table */
              this.getAllMappedProviders();
            }
          },
            err => {
              this.dialogService.alert(err, 'error');
              console.log('error', err);
            });
      }
    });
  }
  editRow(rowObject) {
    this.showEditForm();
    this.disableUsername = true;
    this.uSRMappingID = rowObject.uSRMappingID;
    this.providermapID = rowObject.providerServiceMapID;
    this.edit_Details = rowObject;
    this.edit_state = rowObject.stateID
    this.getProviderServices(rowObject)
    //  this.getProviderServicesInState(rowObject, rowObject, rowObject);
    if (rowObject.serviceName === "1097") {
      this.getProviderStatesInService_edit(this.edit_Details.userID, this.edit_Details, this.edit_Details.serviceID, this.edit_Details.serviceID);

    }
    else {
      this.getProviderStatesInService_edit(this.edit_Details.userID, this.edit_Details, this.edit_Details.serviceID, this.edit_Details.serviceID);
    }
  }
  getPrividerMapID(value) {
    this.providermapID = value;
  }
  update(editedDetails: any) {
    let duplicatecount = 0;
    const object = {
      'uSRMappingID': this.uSRMappingID,
      'providerServiceMapID': this.providermapID,
      'userID': editedDetails.ProviderAdmin,
      'modifiedBy': this.createdBy
    }

    console.log('edited request object', object);
    this.superadminService.updateProviderAdminDetails(object)
      .subscribe(response => {
        console.log('Edit success callback', response);
        this.dialogService.alert('Mapping updated successfully', 'success');
        /* resetting form and ngModels used in editing */
        this.resetDropdowns();
        this.getAllMappedProviders();
        this.showTable();
        this.edit_Details = '';
        this.uSRMappingID = '';
        this.providermapID = '';
      }, err => {
        this.dialogService.alert(err, 'error');
        console.log('error', err);
      });
  }
  resetDropdowns() {
    debugger;
    this.service_provider_admin = undefined;
    this.service_provider = undefined;
    this.provider = undefined
    this.serviceline = undefined
  }

}
