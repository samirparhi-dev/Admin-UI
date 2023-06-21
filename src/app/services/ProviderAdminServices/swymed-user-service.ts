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
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class SwymedUserConfigurationService {

    providerAdmin_base_url: any;
    getMappedUserDetails: any;
    getAllDesignationsUrl: any;
    getUserNameUrl: any;
    getSwymedDomainUrl: any;
    saveSwymedUserDetailsUrl: any;
    updateUserDetailsUrl: any;
    mappingActivationDeactivationUrl: any;

    constructor(private http: InterceptedHttp,
        public basePaths: ConfigService,
        private httpSecurity: SecurityInterceptedHttp) {

        this.providerAdmin_base_url = this.basePaths.getAdminBaseUrl();
        this.getMappedUserDetails = this.providerAdmin_base_url + 'swymed/getmappedUsers/';
        this.getAllDesignationsUrl = this.providerAdmin_base_url + 'm/getDesignation';
        this.getUserNameUrl = this.providerAdmin_base_url + '/swymed/getunmappedUser/';
        this.getSwymedDomainUrl = this.providerAdmin_base_url + 'swymed/getdomain/';
        this.saveSwymedUserDetailsUrl = this.providerAdmin_base_url + '/swymed/createUser';
        this.updateUserDetailsUrl = this.providerAdmin_base_url + 'swymed/editUser';
        this.mappingActivationDeactivationUrl = this.providerAdmin_base_url + '/swymed/deleteUser/';
    }

    getSwymedUserDetails(serviceProviderID) {
        return this.httpSecurity
            .post(this.getMappedUserDetails + serviceProviderID, {})
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    getAllDesignations() {
        return this.httpSecurity
            .post(this.getAllDesignationsUrl, {})
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    getUserName(designationID, serviceProviderID) {
        return this.httpSecurity
            .get(this.getUserNameUrl + serviceProviderID + '/' + designationID)
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    getSwymedDomain(serviceProviderID) {
        return this.httpSecurity
            .post(this.getSwymedDomainUrl + serviceProviderID , { })
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    saveSwymedUserDetails(reqObj) {
        return this.httpSecurity
            .post(this.saveSwymedUserDetailsUrl, reqObj)
            .map(this.successHandler)
            .catch(this.handleError)
    }
    updateUserDetails(updateObj) {
        return this.httpSecurity
        .post(this.updateUserDetailsUrl, updateObj)
        .map(this.successHandler)
        .catch(this.handleError)
    }
    mappingActivationDeactivation(userSwymedMapID, flag, modifiedBy) {
        return this.httpSecurity
        .get(this.mappingActivationDeactivationUrl + userSwymedMapID + '/' + flag + '/' + modifiedBy, {})
        .map(this.handleSuccess)
        .catch(this.handleError)
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in swymed user config service ');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
    successHandler(res: Response) {
        console.log(res.json().data, '--- in swymed user config service ');
        if (res.json().data) {
            return res.json();
        } else {
            return Observable.throw(res.json());
        }
    }
    handleError(error: Response | any) {
        return Observable.throw(error);

    }
}