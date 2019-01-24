import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { ConfigService } from '../config/config.service';



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 24-07-2017
 * Objective: # A service which would handle the CRUD of master data in "calltype-subtype" for a provider in its state
                */
@Injectable()
export class CallTypeSubtypeService {

  admin_Base_Url: any;

  get_CallTypeSubType_Url: any;
  save_CallTypeSubType_Url: any;
  delete_SubCallType_Url: any;
  modify_CallTypeSubType_Url: any;

  getServiceLines_new_url: any;
  getStates_new_url: any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
   
    this.get_CallTypeSubType_Url = this.admin_Base_Url + 'm/getCalltypedata';
    this.save_CallTypeSubType_Url = this.admin_Base_Url + 'm/createCalltypedata';
    this.delete_SubCallType_Url = this.admin_Base_Url + 'm/deleteCalltype';
    this.modify_CallTypeSubType_Url = this.admin_Base_Url + 'm/updateCalltypedata';

    this.getServiceLines_new_url = this.admin_Base_Url + 'm/role/serviceNew';
    this.getStates_new_url = this.admin_Base_Url + 'm/role/stateNew';
  };


  getServiceLinesNew(userID) {
    return this.httpIntercept.post(this.getServiceLines_new_url, { 'userID': userID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getStatesNew(obj) {
    return this.httpIntercept.post(this.getStates_new_url, obj).map(this.handleSuccess)
      .catch(this.handleError);
  }
  // C.R.U.D

  getCallTypeSubType(serviceProviderMapID) {
    return this.httpIntercept.post(this.get_CallTypeSubType_Url, {
      'providerServiceMapID': serviceProviderMapID
    }).map(this.handleSuccess)
      .catch(this.handleError);
  }

  saveCallTypeSubtype(request_obj) {
    return this.httpIntercept.post(this.save_CallTypeSubType_Url, request_obj).map(this.handleSuccess)
      .catch(this.handleError);
  }
  deleteSubCallType(obj) {
    return this.httpIntercept.post(this.delete_SubCallType_Url, obj).map(this.handleSuccess)
      .catch(this.handleError);
  }
  modificallType(obj) {
    return this.httpIntercept.post(this.modify_CallTypeSubType_Url, obj).map(this.handleSuccess)
      .catch(this.handleError);
  }

  // C.R.U.D *ends*

  handleSuccess(res: Response) {
    console.log(res.json(), 'calltype-subtype service file success response');
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  handleState_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'role service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.serviceID === 3 || item.serviceID === 1) {
        return item;
      }
    });
    return result;
  }


  handleError(error: Response | any) {
    return Observable.throw(error.json());
  }

}



