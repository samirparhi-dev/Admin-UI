import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../../config/config.service';



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

  constructor(private _http: Http, public ConfigService: ConfigService) {
    this.admin_base_url = this.ConfigService.getAdminBaseUrl();
    this.getAllStatus_URL = this.admin_base_url + 'getStatus';
    this.getAllProviderUrl = this.admin_base_url + 'getAllProvider';
    this.getAllStatesOfProvider_Url = this.admin_base_url + 'm/role/state';
    this.getAllServicesInStateOfProvider_Url = this.admin_base_url + 'm/role/service';
    this.getAllServicesOfProvider_Url = this.admin_base_url + 'getServiceLinesUsingProvider';

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
    return this._http.post(this.getAllProviderUrl, {}).map(this.success_handeler).catch(this.error_handeler);
  }
  getAllSubService(serviceID) {
    return this._http.post(this.getAllSubService_URL, { 'serviceID': serviceID })
      .map(this.success_handeler).catch(this.error_handeler);
  }
  getStates(serviceProviderID) {
    return this._http.post(this.getAllStatesOfProvider_Url, { 'serviceProviderID': serviceProviderID })
      .map(this.success_handeler)
      .catch(this.error_handeler);
  }

  getServicesInState(serviceProviderID, stateID) {
    return this._http.post(this.getAllServicesInStateOfProvider_Url, {
      'serviceProviderID': serviceProviderID,
      'stateID': stateID
    }).map(this.success_handeler)
      .catch(this.error_handeler);
  }

  getServicesOfProvider(serviceProviderID) {
    return this._http.post(this.getAllServicesOfProvider_Url, {
      'serviceProviderID': serviceProviderID
    }).map(this.success_handeler)
      .catch(this.error_handeler);
  }

  // status apis
  getProviderLevelStatus(serviceProviderID) {
    return this._http.post(this.getProviderLevelStatus_Url, {
      'serviceProviderID': serviceProviderID
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }

  getProvider_StateLevelStatus(serviceProviderID, stateID) {
    return this._http.post(this.getProvider_StateLevelStatus_Url, {
      'serviceProviderID': serviceProviderID,
      'stateID': stateID
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }

  getProvider_ServiceLineLevelStatus(serviceProviderID, serviceID) {
    return this._http.post(this.getProvider_ServiceLineLevelStatus_Url, {
      'serviceProviderID': serviceProviderID,
      'serviceID': serviceID
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }

  getProvider_State_ServiceLineLevelStatus(serviceProviderID, stateID, serviceID) {
    return this._http.post(this.getProvider_State_ServiceLineLevelStatus_Url, {
      'serviceProviderID': serviceProviderID,
      'stateID': stateID,
      'serviceID': serviceID
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }


  // blocking unblocking apis
  block_unblock_provider(serviceProviderID, statusID, reason) {

    return this._http.post(this.block_unblock_provider_url, {
      'serviceProviderID': serviceProviderID,
      'statusID': statusID,
      'reason': reason
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }

  block_unblock_state(serviceProviderID, stateID, statusID, reason) {
    return this._http.post(this.block_unblock_state_url, {
      'serviceProviderID': serviceProviderID,

      'stateID': stateID,
      'statusID': statusID,
      'reason': reason

    })
      .map(this.success_handeler).catch(this.error_handeler);
  }

  block_unblock_serviceline(serviceProviderID, serviceID, statusID, reason) {
    return this._http.post(this.block_unblock_serviceline_url, {
      'serviceProviderID': serviceProviderID,
      'statusID': statusID,
      'serviceID': serviceID,
      'reason': reason
    }
    )
      .map(this.success_handeler).catch(this.error_handeler);
  }

  block_unblock_serviceOfState(serviceProviderID, stateID, serviceID, statusID, reason) {
    return this._http.post(this.block_unblock_serviceOfState_url, {
      'serviceProviderID': serviceProviderID,
      'statusID': statusID,
      'stateID': stateID,
      'serviceID': serviceID,
      'reason': reason
    })
      .map(this.success_handeler).catch(this.error_handeler);
  }
  save_SubService(subServiceObj: any) {
    return this._http.post(this.saveSubService, subServiceObj).map(this.success_handeler)
      .catch(this.error_handeler);
  }
  getSubServiceDetails(providerServiceMapID: any) {
    return this._http.post(this.getSubServiceDetails_URL, {
      "providerServiceMapID": providerServiceMapID
    }).map(this.success_handeler)
      .catch(this.error_handeler);
  }
  
  deleteSubService(sebserviceId: any) {
    debugger;
    return this._http.post(this.deleteSubserviceUrl, {
      "subServiceID": sebserviceId
    }).map(this.success_handeler)
    .catch(this.error_handeler);
  }
  editProvider(serviceProviderObj: any) {
    return this._http.post(this.editProvider_URL, serviceProviderObj).map(this.success_handeler)
      .catch(this.error_handeler);
  }
  success_handeler(response: Response) {
    console.log(response.json().data, '--- in Block-Provider Service');
    return response.json().data;
  }

  error_handeler(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
};



