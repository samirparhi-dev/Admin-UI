import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../../config/config.service';

import { InterceptedHttp } from './../../../http.interceptor';
import { SecurityInterceptedHttp } from './../../../http.securityinterceptor';


@Injectable()
export class BlockProvider {

  admin_base_url: any;
  getAllStatus_URL: any;
  getAllProviderUrl: any;
  getAllStatesOfProvider_Url: any;
  getAllServicesInStateOfProvider_Url: any;
  getAllServicesOfProvider_Url: any;

  getProviderLevelStatus_Url: any;
  getProvider_StateLevelStatus_Url: any;
  getProvider_ServiceLineLevelStatus_Url: any;
  getProvider_State_ServiceLineLevelStatus_Url: any;

  block_unblock_provider_url: any;
  block_unblock_state_url: any;
  block_unblock_serviceline_url: any;
  block_unblock_serviceOfState_url: any;

  saveSubService: any;
  getAllSubService_URL: any;
  getSubServiceDetails_URL: any;
  editProvider_URL: any;
  deleteSubserviceUrl: any;
  getAllServicesOfProvider_CTI_Url: any;

  constructor(private _http: SecurityInterceptedHttp,
    public configService: ConfigService,
    private httpInterceptor: InterceptedHttp) {
    this.admin_base_url = this.configService.getAdminBaseUrl();
    this.getAllStatus_URL = this.admin_base_url + 'getStatus';
    this.getAllProviderUrl = this.admin_base_url + 'getAllProvider';
    this.getAllStatesOfProvider_Url = this.admin_base_url + 'm/role/state';
    this.getAllServicesInStateOfProvider_Url = this.admin_base_url + 'm/role/service';

    this.getAllServicesOfProvider_Url = this.admin_base_url + 'getServiceLinesUsingProvider';
    this.getAllServicesOfProvider_CTI_Url = this.admin_base_url + 'm/role/serviceNew';

    // get status of blocked/unblocked
    this.getProviderLevelStatus_Url = this.admin_base_url + 'getProviderStatus';
    this.getProvider_StateLevelStatus_Url = this.admin_base_url + 'getProviderStatusByState';
    this.getProvider_ServiceLineLevelStatus_Url = this.admin_base_url + 'getProviderStatusByProviderAndServiceId';
    this.getProvider_State_ServiceLineLevelStatus_Url = this.admin_base_url + 'getProviderStatusByService';

    // blocking apis
    this.block_unblock_provider_url = this.admin_base_url + 'blockProvider';
    this.block_unblock_state_url = this.admin_base_url + 'blockProviderByState';
    this.block_unblock_serviceline_url = this.admin_base_url + 'blockProviderByServiceId';
    this.block_unblock_serviceOfState_url = this.admin_base_url + 'blockProviderByService';
    this.saveSubService = this.admin_base_url + 'm/saveSubserviceData';
    this.getAllSubService_URL = this.admin_base_url + 'm/FindSubSerive';
    this.getSubServiceDetails_URL = this.admin_base_url + 'm/getSubSerive';
    this.editProvider_URL = this.admin_base_url + 'updateProvider';
    this.deleteSubserviceUrl = this.admin_base_url + '/m/deleteSubSerive';


  }

  // all the status of Provider
  getAllStatus() {
    return this._http.post(this.getAllStatus_URL, {}).map(this.success_handeler).catch(this.error_handeler);
  }

  getAllProviders() {
    return this.httpInterceptor.post(this.getAllProviderUrl, {}).map(this.success_handeler).catch(this.error_handeler);
  }
  getAllSubService(serviceID) {
    return this._http.post(this.getAllSubService_URL, { 'serviceID': serviceID })
      .map(this.success_handeler).catch(this.error_handeler);
  }
  getStates(serviceProviderID) {
    return this._http.post(this.getAllStatesOfProvider_Url, { 'serviceProviderID': serviceProviderID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.error_handeler);
  }

  getServicesInState(serviceProviderID, stateID) {
    return this._http.post(this.getAllServicesInStateOfProvider_Url, {
      'serviceProviderID': serviceProviderID,
      'stateID': stateID
    }).map(this.handleState_n_ServiceSuccess)
      .catch(this.error_handeler);
  }

  // *** new ****
  getStatesInServices(data) {
    return this._http.post(this.getProvider_ServiceLineLevelStatus_Url, data)
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.error_handeler);
  }

  getServicesOfProvider(serviceProviderID) {
    debugger;
    return this._http.post(this.getAllServicesOfProvider_Url, {
      'serviceProviderID': serviceProviderID
    }).map(this.success_handeler)
      .catch(this.error_handeler);
  }
  getServicesOfProvider_CTI(userID) {
    debugger;
    return this._http.post(this.getAllServicesOfProvider_CTI_Url, {
      'userID': userID
    }).map(this.success_handeler)
      .catch(this.error_handeler);
  }

  // status apis
  getProviderLevelStatus(serviceProviderID) {
    return this.httpInterceptor.post(this.getProviderLevelStatus_Url, {
      'serviceProviderID': serviceProviderID
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }

  getProvider_StateLevelStatus(serviceProviderID, stateID) {
    return this.httpInterceptor.post(this.getProvider_StateLevelStatus_Url, {
      'serviceProviderID': serviceProviderID,
      'stateID': stateID
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }

  getProvider_ServiceLineLevelStatus(serviceProviderID, serviceID) {
    return this.httpInterceptor.post(this.getProvider_ServiceLineLevelStatus_Url, {
      'serviceProviderID': serviceProviderID,
      'serviceID': serviceID
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }

  getProvider_State_ServiceLineLevelStatus(serviceProviderID, stateID, serviceID) {
    return this.httpInterceptor.post(this.getProvider_State_ServiceLineLevelStatus_Url, {
      'serviceProviderID': serviceProviderID,
      'stateID': stateID,
      'serviceID': serviceID
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }


  // blocking unblocking apis
  block_unblock_provider(serviceProviderID, statusID, reason) {

    return this.httpInterceptor.post(this.block_unblock_provider_url, {
      'serviceProviderID': serviceProviderID,
      'statusID': statusID,
      'reason': reason
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }

  block_unblock_state(serviceProviderID, stateID, statusID, reason) {
    return this.httpInterceptor.post(this.block_unblock_state_url, {
      'serviceProviderID': serviceProviderID,

      'stateID': stateID,
      'statusID': statusID,
      'reason': reason

    })
      .map(this.success_handeler).catch(this.error_handeler);
  }

  block_unblock_serviceline(serviceProviderID, serviceID, statusID, reason) {
    return this.httpInterceptor.post(this.block_unblock_serviceline_url, {
      'serviceProviderID': serviceProviderID,
      'statusID': statusID,
      'serviceID': serviceID,
      'reason': reason
    }
    )
      .map(this.success_handeler).catch(this.error_handeler);
  }

  block_unblock_serviceOfState(serviceProviderID, stateID, serviceID, statusID, reason) {
    return this.httpInterceptor.post(this.block_unblock_serviceOfState_url, {
      'serviceProviderID': serviceProviderID,
      'statusID': statusID,
      'stateID': stateID,
      'serviceID': serviceID,
      'reason': reason
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }
  save_SubService(subServiceObj: any) {
    return this.httpInterceptor.post(this.saveSubService, subServiceObj).map(this.success_handeler)
      .catch(this.customErrorHandler);
  }
  getSubServiceDetails(providerServiceMapID: any) {
    return this.httpInterceptor.post(this.getSubServiceDetails_URL, {
      'providerServiceMapID': providerServiceMapID
    }).map(this.success_handeler)
      .catch(this.error_handeler);
  }

  deleteSubService(obj) {
    return this.httpInterceptor.post(this.deleteSubserviceUrl, obj).map(this.success_handeler)
      .catch(this.error_handeler);
  }
  editProvider(serviceProviderObj: any) {
    return this.httpInterceptor.post(this.editProvider_URL, serviceProviderObj).map(this.success_handeler)
      .catch(this.error_handeler);
  }
  success_handeler(res: Response) {
    console.log(res.json().data, '--- in Block-Provider Service');
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  handleState_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'block provider service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.statusID !== 4) {
        return item;
      }
    });
    return result;
  }

  customErrorHandler(error: Response | any) {
    return Observable.throw(error.json());
  }
  error_handeler(error: Response | any) {
    return Observable.throw(error.json());
  }
};



