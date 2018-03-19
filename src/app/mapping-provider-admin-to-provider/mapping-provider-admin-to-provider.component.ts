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

  // arrays
  providers: any = [];
  servicelines: any = [];
  states: any = [];
  bufferArray: any = [];
  providerAdminList: any = [];
  filteredServiceLines: any = [];

  // flags
  formMode = false;
  tableMode = true;
  editMode = false;
  disableUsername: boolean = false;
  // variables
  createdBy: any;
  toBeEditedObject: any;

  @ViewChild('form') form: NgForm;

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
      }, err => {
        console.log('Error', err);
      });
  }
  getAllProviderAdmins() {
    this.superadminService.getAllProviderAdmins()
      .subscribe(response => {
        if (response) {
          console.log('All Provider Admins Success Handeler', response);
          this.service_provider_admin_array = response;
          this.filteredServiceLines = [];
        }
      }, err => {
        console.log('Error', err);
      });
  }

  getProviderStates(state) {
    this.superadminService.getProviderStates(state.serviceProviderId || state.serviceProviderID).
      subscribe(response => this.getStatesSuccessHandeler(response));
  }

  getStatesSuccessHandeler(response) {
    if (response) {
      console.log(response, 'Provider States');
      this.states_array = response;
    }
  }

  getProviderServicesInState(state, providerAdmin, serviceProvider) {
    this.superadminService.getProviderServicesInState(serviceProvider.serviceProviderId || serviceProvider.serviceProviderID, state.stateID)
      .subscribe(response => {
        if (response) {
          console.log('Provider Services in State', response);
          this.services_array = response;
          this.getAvailableServiceLines(state, providerAdmin, serviceProvider.serviceProviderId || serviceProvider.serviceProviderID)
        }
      });

  }


  getServicesSuccessHandeler(response) {
    if (response) {
      console.log('Provider Services in State', response);
      this.services_array = response;
    }
  }

  getAvailableServiceLines(state, providerAdmin, serviceProviderId) {
    console.log(providerAdmin, state);
    const alreadyMappedServiceLines = [];
    for (let i = 0; i < this.providerAdminList.length; i++) {
      if (this.providerAdminList[i].userID === providerAdmin.userID &&
        this.providerAdminList[i].serviceProviderID === serviceProviderId &&
        this.providerAdminList[i].stateID === state.stateID) {
        const obj = {
          'serviceID': this.providerAdminList[i].serviceID,
          'serviceName': this.providerAdminList[i].serviceName
        }
        alreadyMappedServiceLines.push(obj);
      }
    }
    console.log('alredy', alreadyMappedServiceLines);
    const filteredServiceLines = this.services_array.filter(function (serviceLinesFromAllServices) {
      return !alreadyMappedServiceLines.find(function (serviceFromMappedservice) {
        return serviceLinesFromAllServices.serviceID === serviceFromMappedservice.serviceID
      })
    });


    console.log(this.filteredServiceLines, 'Filtered services');
    console.log(filteredServiceLines, 'const services');
    this.filteredServiceLines = [];
    if (filteredServiceLines.length === 0) {
      this.dialogService.alert('All servicelines for this state have been mapped');
    } else {
      this.filteredServiceLines = filteredServiceLines;

    }

  }
  // --end 
  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.resetDropdowns();
    }
    else {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
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
    this.resetDropdowns();
    console.log(form_values, 'form values after adding');
    const object = {
      'serviceProviderMapID1': [],
      'userID': form_values.ProviderAdmin.userID,
      'createdBy': this.createdBy,
      'stateName': form_values.state.stateName,
      'serviceProviderName': form_values.serviceProvider.serviceProviderName,
      'userName': form_values.ProviderAdmin.userName
    };

    let servicesArray = [];
    if (form_values.Services.length > 0) {
      for (let a = 0; a < form_values.Services.length; a++) {
        let obj = {
          'serviceProviderMapID1': form_values.Services[a].providerServiceMapID,
          'serviceName': form_values.Services[a].serviceName
        }

        servicesArray.push(obj);
      }

      object['serviceProviderMapID1'] = servicesArray;
    }

    this.checkDuplicates(object);
  }
  checkDuplicates(object) {
    console.log(object, 'BEFORE TESTING THE OBJECT SENT');
    /* case:1 If the buffer array is empty */
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
      this.resetForm();
    }

    /* case:2 If the buffer array is not empty */
    else if (this.bufferArray.length > 0) {
      let statesMatched = false;
      let providerCount = 0;
      for (let a = 0; a < this.bufferArray.length; a++) {
        /* if the ProviderID of object in BufferArray is same as that of new object */
        if (this.bufferArray[a].serviceProviderName === object.serviceProviderName && this.bufferArray[a].userID === object.userID) {
          providerCount = providerCount + 1;
          /* if the serviceID of object in BufferArray is same as that of new object */
          if (this.bufferArray[a].stateName === object.stateName) {
            statesMatched = true;
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
                this.resetForm();
              }
            }
          }
          else {
            continue;
          }
        }
      }
      if (providerCount === 1 && statesMatched === false) {
        this.bufferArray.push(object);
        this.resetForm();
      }
      if (providerCount === 0) {
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
        this.dialogService.alert('Provider admin mapped successfully');
        this.showTable();
        this.getAllMappedProviders();
        this.resetDropdowns();
        this.filteredServiceLines = [];
        this.services_array = [];
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
  activate(userID) {
    this.dialogService.confirm("Are you sure want to activate?").subscribe(response => {
      if (response) {
    const object = {
      'uSRMappingID': userID,
      'deleted': false
    };

    this.superadminService.activateProviderAdmin(object)
      .subscribe(response => {
        if (response) {
          this.dialogService.alert('Provider admin activated successfully');
          /* refresh table */
          this.getAllMappedProviders();
        }
      },
        err => {
          console.log('error', err);
        });
      }
    });
  }
  deactivate(userID) {
    this.dialogService.confirm("Are you sure want to deactivate?").subscribe(response => {
      if (response) {
    const object = { 'uSRMappingID': userID, 'deleted': true };

    this.superadminService.deactivateProviderAdmin(object)
      .subscribe(response => {
        if (response) {
          this.dialogService.alert('Provider deactivated successfully');
          /* refresh table */
          this.getAllMappedProviders();
        }
      },
        err => {
          console.log('error', err);
        });
      }
    });
  }
  editRow(rowObject) {
    this.showEditForm();
    this.disableUsername = true;
    this.uSRMappingID = rowObject.uSRMappingID;
    this.edit_Details = rowObject;
    this.getProviderStates(rowObject)
    this.getProviderServicesInState(rowObject, rowObject, rowObject);
  }
  update(editedDetails: any) {
    let duplicatecount = 0;
    const object = {
      'uSRMappingID': this.uSRMappingID,
      'providerServiceMapID': editedDetails.Serviceline,
      'userID': editedDetails.serviceProvider,
      'modifiedBy': this.createdBy
    }

    console.log('edited request object', object);
    this.superadminService.updateProviderAdminDetails(object)
      .subscribe(response => {
        console.log('Edit success callback', response);
        this.dialogService.alert('Mapping edited successfully');
        /* resetting form and ngModels used in editing */
        this.resetDropdowns();
        this.getAllMappedProviders();
        this.showTable();
        this.edit_Details = '';
      }, err => {
        console.log('error', err);
      });
  }
  resetDropdowns() {
    this.service_provider_admin = undefined;
    this.service_provider = undefined;
    this.provider = undefined
    this.serviceline = undefined
  }

}
