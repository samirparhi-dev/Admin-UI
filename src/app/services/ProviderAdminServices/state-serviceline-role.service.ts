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
  getFeature(serviceID) {
    return this.httpIntercept.post(this.getFeaturesUrl, { 'serviceID': serviceID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getRoles(obj) {
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
    return Observable.throw(error);
  }




};



