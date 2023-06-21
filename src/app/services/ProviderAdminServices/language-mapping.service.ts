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
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
/**
 * Author: krishna Gunti ( 378952 )
 * Date: 02-22-2018
 * Objective: # A service which would handle the Language Mapping services.
 */

@Injectable()
export class LanguageMapping {
    admin_Base_Url: any;
    commonbaseurl: any;
    get_ProviderName_Url: any;
    get_LanguageList_Url: any;
    get_LanguageMappedDetails_Url: any;
    get_SaveLanguageMappedDetails_Url: any;
    get_UpdateLanguageMappedDetails_Url: any;
    get_DeleteLanguageMappedDetails_Url;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.commonbaseurl = this.basepaths.getCommonBaseURL();

        this.get_ProviderName_Url = this.admin_Base_Url + 'm/SearchEmployee4';
        this.get_LanguageList_Url = this.commonbaseurl + 'beneficiary/getLanguageList';
        this.get_LanguageMappedDetails_Url = this.admin_Base_Url + 'getUserMappedLanguage';

        this.get_SaveLanguageMappedDetails_Url = this.admin_Base_Url + 'userLanguageMapping';
        this.get_UpdateLanguageMappedDetails_Url = this.admin_Base_Url + 'updateUserLanguageMapping';
        this.get_DeleteLanguageMappedDetails_Url = this.admin_Base_Url + 'deleteUserLanguageMapping';
    };

    getUserName(serviceProviderID) {
        return this.http.post(this.get_ProviderName_Url, { 'serviceProviderID': serviceProviderID })
            .map(this.handleState_n_username).catch(this.handleError);
    }


    getLanguageList() {
        return this.http.get(this.get_LanguageList_Url)
            .map(this.handleSuccess).catch(this.handleError);
    }

    getMappedLanguagesList(serviceProviderID) {
        return this.http.post(this.get_LanguageMappedDetails_Url,
            { 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess).catch(this.handleError);
    }

    SaveLanguageMapping(data) {
        return this.httpIntercept.post(this.get_SaveLanguageMappedDetails_Url, data).map(this.handleSuccess).catch(this.handleError);

    }

    UpdateLanguageMapping(data) {
        return this.httpIntercept.post(this.get_UpdateLanguageMappedDetails_Url, data).map(this.handleSuccess).catch(this.handleError);

    }

    DeleteLanguageMapping(data) {
        return this.httpIntercept.post(this.get_DeleteLanguageMappedDetails_Url, data).map(this.handleSuccess).catch(this.handleError);

    }

    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'language service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.statusID !== 4) {
                return item;
            }
        });
        return result;
    }
    handleState_n_username(response: Response) {

        console.log(response.json().data, 'usernamelang mapping file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.deleted === false) {
                return item;
            }
        });
        return result;
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, 'language mapping file success response');
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



