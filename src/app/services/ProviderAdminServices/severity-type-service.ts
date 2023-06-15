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


@Injectable()
export class SeverityTypeService {

  admin_Base_Url: any;
  get_State_Url: any;
  get_State_Url_new: any;
  get_Service_Url_new: any;
  getServicelines_url: any;
  addSeverityUrl: any;
  deleteSeverityUrl: any;
  modifySeverityUrl: any;
  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {

    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.get_State_Url = this.admin_Base_Url + '/m/getServerity';

    this.get_State_Url_new = this.admin_Base_Url + 'm/role/stateNew';
    this.get_Service_Url_new = this.admin_Base_Url + 'm/role/serviceNew';

    this.addSeverityUrl = this.admin_Base_Url + '/m/saveServerity ';
    this.deleteSeverityUrl = this.admin_Base_Url + '/m/deleteServerity';
    this.modifySeverityUrl = this.admin_Base_Url + 'm/editServerity'
  };

  getStates(userID, serviceID, isNationalFlag) {
    return this.httpIntercept.post(this.get_State_Url_new,
      {
        'userID': userID,
        'serviceID': serviceID,
        'isNational': isNationalFlag
      }).map(this.handleSuccess)
      .catch(this.handleError);
  }

  getServices(userID) {
    return this.httpIntercept.post(this.get_Service_Url_new, { 'userID': userID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getSeverity(providerServiceMapID) {
    return this.httpIntercept.post(this.get_State_Url, { 'providerServiceMapID': providerServiceMapID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }


  addSeverity(array) {
    return this.httpIntercept.post(this.addSeverityUrl, array)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  modifySeverity(obj) {
    return this.httpIntercept.post(this.modifySeverityUrl, obj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  deleteSeverity(obj) {
    return this.httpIntercept.post(this.deleteSeverityUrl, obj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  handleSuccess(res: Response) {
    console.log(res.json(), 'calltype-subtype service file success response');
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  handleState_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'severity service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.serviceID === 3 || item.serviceID === 1 || item.serviceID === 6) {
        return item;
      }
    });
    return result;
  }

  handleError(error: Response | any) {
    return Observable.throw(error.json());
  }

}
