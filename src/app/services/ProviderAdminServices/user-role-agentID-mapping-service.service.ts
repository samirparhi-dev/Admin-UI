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
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

import { ConfigService } from '../config/config.service';



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

    this.get_State_Url = this.admin_Base_Url + 'm/role/stateNew';
    this.get_Service_Url = this.admin_Base_Url + 'm/role/serviceNew';
    // this.get_Roles_Url = this.admin_Base_Url + 'm/role/search';
    // this.get_Roles_Url_new = this.admin_Base_Url + 'm/role/search1';
    this.get_Roles_Url = this.admin_Base_Url + 'm/role/searchV1';

    this.get_Campaigns_Url = this.admin_Base_Url + 'getAvailableCampaigns';
    this.get_AgentIDs_Url = this.admin_Base_Url + 'getAvailableAgentIds';

    this.getEmployeeUrl = this.admin_Base_Url + 'm/SearchEmployeeFilter';
    this.mapAgentID_Url = this.admin_Base_Url + 'usrRoleAndCtiMapping';
  };

  getStates(userID, serviceID, isNational) {
    return this.httpIntercept.post(this.get_State_Url,
      {
        'userID': userID,
        'serviceID': serviceID,
        'isNational': isNational
      })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getServices(userID) {
    return this.http.post(this.get_Service_Url, {
      'userID': userID
    }).map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getRoles(providerServiceMapID) {
    return this.http.post(this.get_Roles_Url,
      {
        'providerServiceMapID': providerServiceMapID

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
    return this.httpIntercept.post(this.get_Campaigns_Url, { 'providerServiceMapID': providerServiceMapID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getAgentIDs(providerServiceMapID, campaign_name) {
    return this.httpIntercept.post(this.get_AgentIDs_Url,
      {
        'providerServiceMapID': providerServiceMapID,
        'cti_CampaignName': campaign_name
      })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  mapAgentID(data) {
    return this.httpIntercept.post(this.mapAgentID_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }


  handleState_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'role service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.serviceID === 1 || item.serviceID === 3 || item.serviceID === 6 || item.serviceID === 10) {
        return item;
      }
    });
    return result;
  }

  handleSuccess(response: Response) {
    console.log(response.json().data, '--- in User-Role-AgentID-Mapping SERVICE');
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



