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
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { ConfigService } from "../config/config.service";

@Injectable()
export class WrapupTimeConfigurationService {

    providerAdmin_Base_Url: any;
    common_Base_Url: any;
    getServiceLines_new_url: any;
    getStates_new_url: any;
    getRolesUrl: any;
    saveUrl: any;

    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        /* serviceline and state */

        this.getServiceLines_new_url = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this.getStates_new_url = this.providerAdmin_Base_Url + 'm/role/stateNew';
        this.getRolesUrl = this.providerAdmin_Base_Url + '/m/role/search/active';
        this.saveUrl = this.providerAdmin_Base_Url + '/m/role/configWrap';

    }
    getServiceLines(userID) {
        return this.httpIntercept
            .post(this.getServiceLines_new_url, { 'userID': userID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }
    getStates(obj) {
        return this.httpIntercept
            .post(this.getStates_new_url, obj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getActiveRoles(providerServiceMapID) {
         return this.httpIntercept
            .post(this.getRolesUrl, {'providerServiceMapID': providerServiceMapID})
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    saveWrapUpTime(roleObj) {
        return this.httpIntercept
        .post(this.saveUrl, roleObj)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }
    handleSuccess(response: Response) {
        console.log(response.json().data, "--- in wrapup time service");
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        }
    }
    
    handleState_n_ServiceSuccess(response: Response) {
        console.log(response.json().data, 'role service file success response');
        let result = [];
        if (response.json().data) {
            result = response.json().data.filter(function (item) {
                if (item.serviceID == 3) {
                    return item;
                }
            });
            return result;
        }
    }
   //Shubham Shekhar,24-0802021,Wrapup configuaration to be enabled in MCTS and 1097
   getServiceLinesWrapup(userID) {
    return this.httpIntercept
        .post(this.getServiceLines_new_url, { 'userID': userID })
        .map(this.handleState_n_ServiceSuccessWrapup)
        .catch(this.handleError);
}
   handleState_n_ServiceSuccessWrapup(response: Response) {
    console.log(response.json().data, 'role service file success response');
    let result = [];
    if (response.json().data) {
        result = response.json().data.filter(function (item) {
            if (item.serviceID == 3 ||item.serviceID == 6 ||item.serviceID == 1) {
                return item;
            }
        });
        return result;
    }
}
    handleError(error: Response | any) {
        return Observable.throw(error);
    }
}