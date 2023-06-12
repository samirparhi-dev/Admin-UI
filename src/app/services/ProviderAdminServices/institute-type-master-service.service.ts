import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 09-10-2017
 * Objective: # A service which would handle the INSTITUTE TYPE MASTER services.
 */

@Injectable()
export class InstituteTypeMasterService {
  admin_Base_Url: any;

  get_State_Url: any;
  get_Service_Url: any;

  get_InstituteType_Url: any;
  save_InstituteType_Url: any;
  edit_InstituteType_Url: any;
  delete_InstituteType_Url: any;
  get_InstitutesType_Url: any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();

    this.get_State_Url = this.admin_Base_Url + 'm/role/stateNew';
    this.get_Service_Url = this.admin_Base_Url + 'm/role/serviceNew';

   this.get_InstitutesType_Url = this.admin_Base_Url + 'm/getInstituteType';
  //this.get_InstituteType_Url = this.admin_Base_Url + 'm/getInstituteTypeByDist';
   this.save_InstituteType_Url = this.admin_Base_Url + 'm/createInstituteType';
   //this.save_InstituteType_Url = this.admin_Base_Url + '/m/createInstituteTypeByDist';
    this.edit_InstituteType_Url = this.admin_Base_Url + 'm/editInstituteType';
    this.delete_InstituteType_Url = this.admin_Base_Url + 'm/deleteInstituteType';

  };

  getServices(userID) {
    return this.httpIntercept.post(this.get_Service_Url, { 'userID': userID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getServicesForInstTypeMaster(userID) {
    return this.httpIntercept.post(this.get_Service_Url, { 'userID': userID })
      .map(this.handleState_t_ServiceSuccess)
      .catch(this.handleError);
  }

  getStates(userID, serviceID, isNationalFlag) {
    return this.httpIntercept.post(this.get_State_Url, {
      'userID': userID,
      'serviceID': serviceID,
      'isNational': isNationalFlag
    })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }



  getInstitutesType(providerServiceMapID) {
    return this.httpIntercept.post(this.get_InstitutesType_Url, { 'providerServiceMapID': providerServiceMapID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
 /* getInstituteType(data) {
    return this.httpIntercept.post(this.get_InstituteType_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }*/

  toggle_activate_InstituteType(data) {
    return this.httpIntercept.post(this.delete_InstituteType_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  saveInstituteType(data) {
    return this.httpIntercept.post(this.save_InstituteType_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  editInstituteType(data) {
    return this.httpIntercept.post(this.edit_InstituteType_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  handleState_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'role service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.serviceID === 3 || item.serviceID === 1 || item.serviceID === 6) {
        return item;
      }
    });
    return result;
  }

  handleState_t_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'role service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.serviceID === 3 || item.serviceID === 11 || item.serviceID === 1 || item.serviceID === 6 || item.serviceID === 2 || item.serviceID === 4) {
        return item;
      }
    });
    return result;
  }

  handleSuccess(res: Response) {
    console.log(res.json().data, 'Institute-Type file success response');
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  handleError(error: Response | any) {
    return Observable.throw(error.json());

  }
};



