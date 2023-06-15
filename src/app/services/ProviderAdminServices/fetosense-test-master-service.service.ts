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
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { ConfigService } from '../config/config.service';

@Injectable()
export class ProviderAdminFetosenseTestMasterService {
    providerAdmin_Base_Url: any;
    _getStateListURL: any;
    _getServiceLineURL: any;
    create_Tests_Url: any;
    find_Tests_By_State_Service_Url: any;
    edit_Test_Url: any;
    delete_Test_Url: any;

    constructor( public basepaths: ConfigService,  private httpIntercept: InterceptedHttp, private http: SecurityInterceptedHttp){
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this._getStateListURL = this.providerAdmin_Base_Url + 'm/role/stateNew';
        this._getServiceLineURL = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this.create_Tests_Url = this.providerAdmin_Base_Url + '/fetosense/createFetosenseTestMaster';
        this.find_Tests_By_State_Service_Url = this.providerAdmin_Base_Url + '/fetosense/fetchFetosenseTestMaster/';
        this.edit_Test_Url = this.providerAdmin_Base_Url + '/fetosense/updateFetosenseTestMaster';
        this.delete_Test_Url= this.providerAdmin_Base_Url + '/fetosense/updateFetosenseTestMasterStatus';
    }

    getServices(userID) {
        return this.httpIntercept.post(this._getServiceLineURL, { 'userID': userID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getServicesForFetosense(userID) {
        return this.httpIntercept.post(this._getServiceLineURL, { 'userID': userID })
            .map(this.handleState_n_ServiceSuccessFetosense)
            .catch(this.handleError);
    }
    getStates(state) {
        return this.http.post(this._getStateListURL,
            {
                'userID': state.userID,
                'serviceID': state.serviceID,
                'isNational': state.isNational
            }).map(this.handleSuccess)
            .catch(this.handleError);
    }
    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'service point file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID == 2 || item.serviceID == 4) {
                return item;
            }
        });
        return result;
    }
    handleState_n_ServiceSuccessFetosense(response: Response) {

        console.log(response.json().data, 'service point file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID == 4) {
                return item;
            }
        });
        return result;
    }
    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }
    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in service point master SERVICE');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
    getTests(obj) {
        return this.httpIntercept.get(`${this.find_Tests_By_State_Service_Url}${obj}`)
          .map(this.handleSuccess)
          .catch(this.handleError);
      }
    createTests(roles_array) {
        return this.httpIntercept.post(this.create_Tests_Url, roles_array)
          .map(this.handleSuccess)
          .catch(this.handleError);
    }
    
    deleteTest(obj) {
        return this.httpIntercept.post(this.delete_Test_Url, obj)
          .map(this.handleSuccess)
          .catch(this.handleError);
      }
    
    updateTest(modified_Test_Object) {
        return this.httpIntercept.post(this.edit_Test_Url, modified_Test_Object)
          .map(this.handleSuccess)
          .catch(this.handleError);
      }
}