import { Component, OnInit, ViewChild } from '@angular/core';
import { BlockProvider } from '../services/adminServices/AdminServiceProvider/block-provider-service.service';
import { dataService } from './../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
declare let jQuery: any;
@Component({
  selector: 'app-create-sub-service',
  templateUrl: './create-sub-service.component.html',
  styleUrls: ['./create-sub-service.component.css']
})
export class CreateSubServiceComponent implements OnInit {
  providerServiceMapID: any;
  services: any = [];
  subServices: any = [];
  services_array: any = [];
  serviceProviders: any = [];
  states = [];
  data: any = [];
  // ngModels
  serviceObj: any;
  subService: any;
  subServiceDesc: any;
  showTable: boolean = false;
  subServiceAvailable: boolean = false;
  allServicesAdded: boolean = false;
  serviceProvider: any;
  state: any;
  dummmy: any = [];
  searchServiceProvider: any;
  searchState: any;
  searchServiceObj: any;
  searchForm: boolean = true;
  statesSearched: any = [];
  servicesSearched: any = [];
  existingSubService: any = [];
  added: boolean = false;

  isNational = false;
  @ViewChild('form') form: NgForm;
  constructor(private sub_service: BlockProvider,
    private commonData: dataService,
    private message: ConfirmationDialogsService) { }

  ngOnInit() {
    this.subServiceAvailable = false;
    this.sub_service.getAllProviders()
      .subscribe(response => this.getAllProvidersSuccesshandeler(response),
        err => {
          //  this.message.alert(err, 'error');
          console.log(err, 'error response');
        });

  }
  getAllProvidersSuccesshandeler(response) {
    this.serviceProviders = response;
  }
  // getAllStates(serviceProviderID) {
  //   this.sub_service.getStates(serviceProviderID.serviceProviderId).subscribe(response => {
  //     this.getAllStatesSuccesshandeler(response);
  //   });
  // }

  // getAllStatesSuccesshandeler(response) {

  //   this.states = response;
  //   this.services = [];
  //   // if(this.added){
  //   //   this.searchState = this.state;
  //   //   ;
  //   // }
  // }
  // getAllServicesInState(serviceProviderObj, stateObj) {
  //   this.sub_service.getServicesInState(serviceProviderObj.serviceProviderId, stateObj.stateID)
  //     .subscribe(response => this.getAllServicesInStatesSuccess(response));
  // }

  // getAllServicesInStatesSuccess(response) {

  //   this.services = response.filter(function (obj) {
  //     return obj.serviceID == 3 || obj.serviceID == 1;
  //   });
  // }

  getAllStatesInService(serviceProviderID, serviceID) {
    let data = {
      'serviceProviderID': serviceProviderID,
      'serviceID': serviceID
    };
    this.state = undefined;
    this.data = [];
    this.sub_service.getStatesInServices(data).subscribe(response => {
      console.log(response, 'successful response');
      this.states = undefined;
      this.states = response;
    }, err => {
      console.log(err, 'error response');
      //   this.message.alert(err, 'error');
    });
  }

  getServicesFromProvider(serviceProviderID) {
    this.sub_service.getServicesOfProvider(serviceProviderID)
      .subscribe(response => {
        console.log(response, 'Success in getting Services from Provider');
        this.serviceObj = undefined;
        this.state = undefined;
        this.data = [];
        this.services = response.filter(function (obj) {
          return obj.serviceID == 3 || obj.serviceID == 1;
        });
      }, err => {
        console.log(err, 'Error in getting Services from Provider');
        //   this.message.alert(err, 'error');
      });
  }

  setIsNational(value, psmID) {
    this.isNational = value;

    if (value) {
      this.getExistingOnSearch(psmID);
    }
  }

  // getStates(serviceProviderID) {
  //   this.sub_service.getStates(serviceProviderID.serviceProviderId).subscribe(response => {
  //     this.getStatesSuccesshandeler(response);
  //   });
  // }

  // getStatesSuccesshandeler(response) {
  //   this.states = response;
  // }
  // getServicesInState(serviceProviderObj, stateObj) {
  //   this.sub_service.getServicesInState(serviceProviderObj.serviceProviderId, stateObj.stateID)
  //     .subscribe(response => this.getServicesInStatesSuccesshandeler(response));
  // }

  // getServicesInStatesSuccesshandeler(response) {
  //   this.services = response;
  // }
  getExistingOnSearch(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID;
    this.sub_service.getSubServiceDetails(providerServiceMapID)
      .subscribe(response => this.populateTable(response, providerServiceMapID),
        err => {
          console.log(err, 'error response');
          //  this.message.alert(err, 'error');
        });
  }
  populateTable(response, providerServiceMapID) {
    this.showTable = true;
    this.data = response;
    this.getExistingSubService(providerServiceMapID);
  }
  getExistingSubService(providerServiceMapID) {
    this.sub_service.getSubServiceDetails(providerServiceMapID)
      .subscribe(response => this.existingSubServiceHandler(response),
        err => {
          console.log(err, 'error response');
          //   this.message.alert(err, 'error');
        })
  }

  existingSubServiceHandler(response) {
    this.existingSubService = [];
    this.existingSubService = response;
    if (this.state) {
      this.getSubServices(this.state);
    }
    else {
      this.getSubServices(this.serviceObj);
    }

  }

  add(serviceProvider, state, service, subServices, subServiceDesc) {
    const array = [];
    const obj = {};
    if (state) {
      obj['providerServiceMapID'] = state.providerServiceMapID;
    }
    else {
      obj['providerServiceMapID'] = this.states[0].providerServiceMapID;
    }
    obj['serviceID'] = service.serviceID;
    obj['subServiceDetails'] = [
      { 'subServiceName': subServices.subServiceName, 'subServiceDesc': subServiceDesc }
    ];
    obj['createdBy'] = this.commonData.uname;
    array.push(obj);
    this.sub_service.save_SubService(array).subscribe((response) => {
      if (response.length > 0) {
        this.message.alert('Saved successfully', 'success');
        this.searchForm = true;
        this.getExistingOnSearch(this.providerServiceMapID);
        this.sub_service.getSubServiceDetails(service.providerServiceMapID).subscribe((res) => {
          // this.showSubService(res, service.serviceName);
          this.clearFields();

        }, (err) => {
          console.log(err, 'error response');
          //  this.message.alert(err, 'error');
        })
      } else {
        this.message.alert('Something went wrong', 'error');
      }
    }, (err) => {
      console.log(err, 'error response');
      //  this.message.alert(err, 'error');
    });
    // const data_obj = {
    //   'providerServiceId': providerService.serviceProviderId,
    //   'providerServiceName': providerService.serviceProviderName,
    //   'serviceName': service.serviceName,
    //   'serviceId': service.serviceID,
    //   'stateName': state.stateName,
    //   'stateId': state.stateID,
    //   'subServices': subServices,
    //   'subServiceDesc': subServiceDesc
    // }
    // if (this.services_array.length > 0) {
    //   let count = 0;
    //   for (let i = 0; i < this.services_array.length; i++) {
    //     data_obj = data_obj.filter(val => !(this.services_array[i].subServices.includes(val)));
    //     if (data_obj.subServices.length === 0) {
    //       count = count + 1;
    //     }
    //   }
    //   if (count === 0) {
    //     if (data_obj.serviceId !== '') {
    //       this.services_array.push(data_obj);
    //     }
    //   }
    // } else {
    //   if (data_obj.serviceId !== '') {
    //     this.services_array.push(data_obj);
    //   }

    //   console.log(this.services_array);

    // }

    // /** once data is pushed in the table array..do the following */
    // this.serviceObj = '';
    // this.showTable = true;

  }
  getSubServices(service) {
    this.allServicesAdded = false;
    this.subServices = [];
    this.sub_service.getAllSubService(service.serviceID).subscribe((res) => {
      if (res) {
        if (res.length === 0) {
          this.subServiceAvailable = true;
          // this.message.alert('No Sub Service available please select different service');
        } else {

          let tempService = {};
          let temp: boolean;
          for (let i = 0; i < res.length; i++) {
            temp = true;
            for (let a = 0; a < this.existingSubService.length; a++) {
              if (res[i].subServiceName === this.existingSubService[a].subServiceName) {
                temp = false;
              }
            }
            if (temp) {
              tempService = res[i];
              this.subServices.push(tempService);
              tempService = {};
            }
          }
          this.subServiceAvailable = false;
          if (this.subServices.length == 0) {
            this.allServicesAdded = true;
            // this.message.alert('All services Mapped');
          }
        }
      }
    }, (err) => {
      console.log(err, 'error response');
      //  this.message.alert(err, 'error');
    })
  }

  showSubService(response: any, serviceName) {

    this.added = true;
    // this.getAllStatesInService(this.serviceProvider, this.serviceID);
    this.searchServiceProvider = this.serviceProvider;
    this.getServicesFromProvider(this.serviceProvider);
    this.searchState = this.state;
    this.searchServiceObj = this.serviceObj;
    if (this.state) {

      this.getExistingOnSearch(this.state.providerServiceMapID);
    }
    else {
      this.getExistingOnSearch(this.states[0].providerServiceMapID);
    }
    // this.addSubService(true);
    // this.showTable = true;
    // this.data = response.map(function (element) {
    //   element.serviceName = serviceName
    //   return element;
    // });
    // this.data = response.map(function (item) {
    //   item.serviceName = serviceName;
    // });
  }
  addSubService(flag) {
    this.searchForm = flag;
    // if (flag) {
    if (this.state) {

      this.getExistingOnSearch(this.state.providerServiceMapID);
    }
    else {
      this.getExistingOnSearch(this.states[0].providerServiceMapID);
    }
    //  }
    // this.serviceProvider = this.searchServiceProvider;
    // this.state = this.searchState;
    // this.serviceObj = this.searchServiceObj;
    // jQuery('#addingForm').trigger('reset');
  }
  back() {
    this.message.confirm('Confirm', 'Do you really want to cancel? Any unsaved data would be lost')
      .subscribe(res => {
        if (res) {
          this.addSubService(true);
          this.form.controls.subServiceDesc.reset();
        }
      })
  }
  confirmMessage: any;
  deleteSubService(subserviceID, flag) {
    let obj = {
      'subServiceID': subserviceID,
      'deleted': flag
    }
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.message.confirm('Confirm', 'Are you sure want to ' + this.confirmMessage + '?').subscribe((res) => {
      if (res) {
        this.sub_service.deleteSubService(obj).subscribe(response => {
          this.deletedSuccessHandler(response)
        })
      }
    }, (err) => {
      console.log(err, 'error response');
      //  this.message.alert(err, 'error');
    });
  }
  clearFields() {
    this.subServiceDesc = '';
    jQuery("#form2").trigger('reset');
    if (this.state) {

      this.getExistingSubService(this.state.providerServiceMapID);
    }
    else {
      this.getExistingSubService(this.states[0].providerServiceMapID);
    }
  }
  deletedSuccessHandler(res) {
    this.message.alert(this.confirmMessage + 'd successfully', 'success');
    if (this.state) {

      this.getExistingOnSearch(this.state.providerServiceMapID);
    }
    else {
      this.getExistingOnSearch(this.states[0].providerServiceMapID);
    }

  }

}
