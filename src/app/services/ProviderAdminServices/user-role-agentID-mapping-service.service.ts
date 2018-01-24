import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

import { ConfigService } from "../config/config.service";



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 24-07-2017
 * Objective: # A service which would handle the creation of employees and their
               role provisioning
               */
@Injectable()
export class UserRoleAgentID_MappingService {

  admin_Base_Url: any;
  common_Base_Url: any;

  get_State_Url: any;
  get_Service_Url: any;
  get_Roles_Url: any;
  get_Roles_Url_new: any;

  get_Campaigns_Url: any;
  get_AgentIDs_Url: any;

  //  CRUD
  getEmployeeUrl: any;
  mapAgentID_Url: any;


  constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();

    this.get_State_Url = this.admin_Base_Url + "m/role/state";
    this.get_Service_Url = this.admin_Base_Url + "m/role/service";
    this.get_Roles_Url = this.admin_Base_Url + "m/role/search";
    this.get_Roles_Url_new = this.admin_Base_Url + 'm/role/search1';

    this.get_Campaigns_Url = this.admin_Base_Url + "getAvailableCampaigns";
    this.get_AgentIDs_Url = this.admin_Base_Url + "getAvailableAgentIds";

    this.getEmployeeUrl = this.admin_Base_Url + "m/SearchEmployeeFilter";
    this.mapAgentID_Url = this.admin_Base_Url + "usrRoleAndCtiMapping";
  };

  getStates(serviceProviderID) {
    return this.http.post(this.get_State_Url, { "serviceProviderID": serviceProviderID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getServices(serviceProviderID, stateID) {
    return this.http.post(this.get_Service_Url, {
      "serviceProviderID": serviceProviderID,
      "stateID": stateID
    }).map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getRoles(serviceProviderID, stateID, serviceID) {
    return this.http.post(this.get_Roles_Url_new,
      {
        "serviceProviderID": serviceProviderID,
        "stateID": stateID,
        "serviceID": serviceID
      })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getEmployees(requestObject) {
    return this.httpIntercept.post(this.getEmployeeUrl, requestObject)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getAvailableCampaigns(providerServiceMapID) {
    return this.http.post(this.get_Campaigns_Url, { "providerServiceMapID": providerServiceMapID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getAgentIDs(providerServiceMapID, campaign_name) {
    return this.http.post(this.get_AgentIDs_Url,
      {
        "providerServiceMapID": providerServiceMapID,
        "cti_CampaignName": campaign_name
      })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  mapAgentID(data) {
    return this.http.post(this.mapAgentID_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }


  handleState_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, "role service file success response");
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.statusID != 4) {
        return item;
      }
    });
    return result;
  }

  handleSuccess(response: Response) {
    console.log(response.json().data, "--- in User-Role-AgentID-Mapping SERVICE");
    if (response.json().data) {
      return response.json().data;
    } else {
      return Observable.throw(response.json());
    }
  }

  handleError(error: Response | any) {
    return Observable.throw(error.json());
  }
};



