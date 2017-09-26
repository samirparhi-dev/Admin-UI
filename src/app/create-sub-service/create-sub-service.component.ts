import { Component, OnInit } from '@angular/core';
import { BlockProvider } from '../services/adminServices/AdminServiceProvider/block-provider-service.service';
import { dataService } from './../services/dataService/data.service';
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
  dummmy:any=[];


  constructor(private sub_service: BlockProvider, private commonData: dataService) { }

  ngOnInit() {
    this.subServiceAvailable = false;
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
  getExistingSubService(service) {
    this.sub_service.getSubServiceDetails(service.providerServiceMapID)
      .subscribe(response => this.existingSubServiceHandler(response))
  }
  existingSubService:any=[];
  existingSubServiceHandler(response) {
    this.existingSubService=[];
    this.existingSubService = response;
    this.getSubServices(this.serviceObj);

  }
  add(providerServiceMapID, state, service, subServices, subServiceDesc) {
    const array = [];
    const obj = {};
    obj['providerServiceMapID'] = service.providerServiceMapID;
    obj['serviceID'] = service.serviceID;
    obj['subServiceDetails'] = [
      { 'subServiceName': subServices.subServiceName, 'subServiceDesc': subServiceDesc }
    ];
    obj['createdBy'] = 'neeraj';
    array.push(obj);
    this.sub_service.save_SubService(array).subscribe((response) => {
      if (response.length > 0) {
        alert('Added Sucessfully');
        this.sub_service.getSubServiceDetails(service.providerServiceMapID).subscribe((res) => {
          this.showSubService(res, service.serviceName);
        }, (err) => {

        })
      } else {
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
  getSubServices(service) {
    this.allServicesAdded = false;
    this.subServices=[];
    this.sub_service.getAllSubService(service.serviceID).subscribe((res) => {
      if (res) {
        if (res.length === 0) {
          this.subServiceAvailable = true;
        }
        else {

          let tempService = {};
          let temp: boolean;
          for (var i = 0; i < res.length; i++) {
            temp = true;
            for (var a = 0; a < this.existingSubService.length; a++) {
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
          if(this.subServices.length==0) {
            this.allServicesAdded = true;
          }
        }
      }
    }, (err) => {

    })
  }
  showSubService(response: any, serviceName) {

    this.showTable = true;
    this.data = response.map(function (element) {
      element.serviceName = serviceName
      return element;
    });
    // this.data = response.map(function (item) {
    //   item.serviceName = serviceName;
    // });
  }


}
