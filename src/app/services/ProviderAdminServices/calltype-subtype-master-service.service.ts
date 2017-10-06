import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from "../config/config.service";



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 24-07-2017
 * Objective: # A service which would handle the CRUD of master data in "calltype-subtype" for a provider in its state
                */
@Injectable()
export class CallTypeSubtypeService {

  admin_Base_Url: any;
  get_State_Url: any;
  get_Service_Url: any;

  get_CallTypeSubType_Url: any;
  save_CallTypeSubType_Url: any;
  delete_SubCallType_Url: any;
  modify_CallTypeSubType_Url : any;
  constructor(private http: Http, public basepaths: ConfigService,private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.get_State_Url = this.admin_Base_Url + "m/role/state";
    this.get_Service_Url = this.admin_Base_Url + "m/role/service";
    this.get_CallTypeSubType_Url = this.admin_Base_Url + "m/getCalltypedata";
    this.save_CallTypeSubType_Url = this.admin_Base_Url + "m/createCalltypedata";
    this.delete_SubCallType_Url = this.admin_Base_Url + "m/deleteCalltype";
    this.modify_CallTypeSubType_Url = this.admin_Base_Url + "m/updateCalltypedata";
   };

   getStates(serviceProviderID) {
     return this.http.post(this.get_State_Url, { "serviceProviderID": serviceProviderID })
       .map(this.handleSuccess)
       .catch(this.handleError);
   }

   getServices(serviceProviderID, stateID) {
     return this.http.post(this.get_Service_Url, {
       "serviceProviderID": serviceProviderID,
       "stateID": stateID
     }).map(this.handleSuccess)
       .catch(this.handleError);
   }

   // C.R.U.D

   getCallTypeSubType(serviceProviderMapID)
   {
     return this.httpIntercept.post(this.get_CallTypeSubType_Url, {
       "providerServiceMapID": serviceProviderMapID
     }).map(this.handleSuccess)
       .catch(this.handleError);
   }

   saveCallTypeSubtype(request_obj)
   {
     return this.httpIntercept.post(this.save_CallTypeSubType_Url, request_obj).map(this.handleSuccess)
       .catch(this.handleError);
   }
   deleteSubCallType(obj){
     return this.httpIntercept.post(this.delete_SubCallType_Url, obj).map(this.handleSuccess)
       .catch(this.handleError);    
   }
   modificallType(obj) {
     return this.httpIntercept.post(this.modify_CallTypeSubType_Url, obj).map(this.handleSuccess)
       .catch(this.handleError);
   }

   // C.R.U.D *ends*

   handleSuccess(response: Response) {
     console.log(response.json(), "calltype-subtype service file success response");
     return response.json().data;
   }

   handleError(error: Response | any) {
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

}



