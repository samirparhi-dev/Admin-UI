import { Component, OnInit } from '@angular/core';
import { BlockProvider } from '../services/adminServices/AdminServiceProvider/block-provider-service.service';

@Component({
  selector: 'app-create-sub-service',
  templateUrl: './create-sub-service.component.html',
  styleUrls: ['./create-sub-service.component.css']
})
export class CreateSubServiceComponent implements OnInit {
  services: any = [];
  subServices: any = [];
  services_array: any = [];
  serviceProviders: any = [];
  states = [];
  // ngModels
  serviceObj: any;
  subService: any;
  subServiceDesc: any;
  showTable: boolean = false;
  serviceProvider: any;
  state: any;


  constructor(private sub_service: BlockProvider) { }

  ngOnInit() {
    this.sub_service.getAllProviders().subscribe(response => this.getAllProvidersSuccesshandeler(response));
  }
  getAllProvidersSuccesshandeler(response) {
    this.serviceProviders = response;
  }
  getStates(serviceProviderID) {
    this.sub_service.getStates(serviceProviderID.serviceProviderId).subscribe(response => {
      this.getStatesSuccesshandeler(response);
    });
  }

  getStatesSuccesshandeler(response) {
    this.states = response;
  }
  getServicesInState(serviceProviderObj, stateObj) {
    this.sub_service.getServicesInState(serviceProviderObj.serviceProviderId, stateObj.stateID)
      .subscribe(response => this.getServicesInStatesSuccesshandeler(response));
  }

  getServicesInStatesSuccesshandeler(response) {

    this.services = response;
  }
  getProviderMapID(serviceProviderObj, serviceObj, stateObj) {

  }
  add(providerServiceMapID, state, service, subServices, subServiceDesc) {
    const array = [];
    let obj = {};
    obj['providerServiceMapID'] = service.providerServiceMapID;
    obj['subServiceDetails'] = [
      { 'subServiceName': subServices, 'subServiceDesc': subServiceDesc }
    ];
    obj['createdBy'] = 'neeraj';
    array.push(obj);
    this.sub_service.save_SubService(array).subscribe((response) => {
      if (response.length > 0) {
        alert('Added Sucessfully');
      }
      else {
        alert('Something went wrong');
      }
    }, (err) => {

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


}
