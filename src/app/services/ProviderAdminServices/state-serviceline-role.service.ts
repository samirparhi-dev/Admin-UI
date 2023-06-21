/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
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
 * Date: 14-07-2017
 * Objective: # A service which would handle the creation of new roles for a service line,in a state,
 				for a provider.
 */

@Injectable()
export class ProviderAdminRoleService {

  admin_Base_Url: any;
  get_State_Url: any;
  get_Service_Url: any;
  find_Roles_By_State_Service_Url: any;
  create_Roles_Url: any;
  delete_Role_Url: any;
  edit_Role_Url: any;

  updateFeatureToRole_Url: any;

  getFeaturesUrl: any;

  getStates_new_url: any;
  getServiceLines_new_url: any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    console.log(this.admin_Base_Url);
    this.get_State_Url = this.admin_Base_Url + 'm/role/state';
    this.get_Service_Url = this.admin_Base_Url + 'm/role/service';
    this.find_Roles_By_State_Service_Url = this.admin_Base_Url + 'm/role/search';
    this.create_Roles_Url = this.admin_Base_Url + 'm/role/addRole';
    this.delete_Role_Url = this.admin_Base_Url + 'm/role/deleteRole';
    this.edit_Role_Url = this.admin_Base_Url + 'm/role/editRole';
    this.getFeaturesUrl = this.admin_Base_Url + 'm/searchFeature';
    this.updateFeatureToRole_Url = this.admin_Base_Url + 'mapExterafeature';

    this.getServiceLines_new_url = this.admin_Base_Url + 'm/role/serviceNew';
    this.getStates_new_url = this.admin_Base_Url + 'm/role/stateNew';

  };

  getStates(serviceProviderID) {
    return this.http.post(this.get_State_Url, { 'serviceProviderID': serviceProviderID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getStatesNew(obj) {
    return this.httpIntercept.post(this.getStates_new_url, obj).map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }
  getServices(serviceProviderID, stateID) {
    return this.http.post(this.get_Service_Url, {
      'serviceProviderID': serviceProviderID,
      'stateID': stateID
    }).map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }
  getServices_filtered(serviceProviderID, stateID) {
    return this.http.post(this.get_Service_Url, {
      'serviceProviderID': serviceProviderID,
      'stateID': stateID
    }).map(this.handleService_n_ServiceSuccess)
      .catch(this.handleError);
  }
  getServiceLinesNew(userID) {
    return this.httpIntercept.post(this.getServiceLines_new_url, { 'userID': userID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getServiceLinesCalibrationNew(userID){
    return this.httpIntercept.post(this.getServiceLines_new_url, { 'userID': userID })
    .map(this.handleState_n_ServiceSuccessCalibration)
    .catch(this.handleError);
  }

  getFeature(serviceID) {
    return this.httpIntercept.post(this.getFeaturesUrl, { 'serviceID': serviceID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getRoles(obj) {
    return this.httpIntercept.post(this.find_Roles_By_State_Service_Url, obj)
      .map(this.handleState_n_ServiceSuccess_role)
      .catch(this.handleError);
  }
  getRole(obj) {
    return this.httpIntercept.post(this.find_Roles_By_State_Service_Url, obj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  createRoles(roles_array) {
    return this.httpIntercept.post(this.create_Roles_Url, roles_array)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  deleteRole(obj) {
    console.log('service obj', obj);

    return this.httpIntercept.post(this.delete_Role_Url, obj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  editRole(modified_Role_Object) {
    return this.httpIntercept.post(this.edit_Role_Url, modified_Role_Object)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  updateFeatureToRole(requestArray) {
    return this.httpIntercept.post(this.updateFeatureToRole_Url, requestArray)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  handleSuccess(res: Response) {
    // console.log((response.json().data).json(), 'in service.ts');
    // console.log(response,'---1');
    // console.log(response.json(), '---2');
    console.log(res.json().data, 'role service file success response');
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
      if (item.statusID !== 4) {
        return item;
      }
    });
    return result;
  }

  handleState_n_ServiceSuccessCalibration(response: Response) {

    console.log(response.json().data, 'service point file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
        if (item.serviceID == 2 || item.serviceID == 4) {
            return item;
        }
    });
    return result;
}

  handleState_n_ServiceSuccess_role(response: Response) {

    console.log(response.json().data, 'role service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.deleted !== true) {
        return item;
      }
    });
    return result;
  }
  handleService_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'role service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.serviceName === "MMU") {
        return item;
      }
    });
    return result;
  }

  handleError(error: Response | any) {
    return Observable.throw(error.json());
  }




};



