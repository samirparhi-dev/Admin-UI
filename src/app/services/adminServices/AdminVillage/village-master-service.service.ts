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

import { ConfigService } from '../../config/config.service';
import { InterceptedHttp } from './../../../http.interceptor';
import { SecurityInterceptedHttp } from './../../../http.securityinterceptor';


@Injectable()
export class VillageMasterService {


    admin_base_url: any;
    _commonBaseURL: any;
    getAllStatesOfProvider_Url: any;
    _getStateListURL: any;
    _getDistrictListURL: any;
    _getTalukListURL: any;
    _getBlockListURL: any;
    _getBranchListURL: any;
    storeVillagesURL: any;
    deleteVillageURL: any;
    updateVillageDataURL: any;

    constructor(private _http: SecurityInterceptedHttp,
        public configService: ConfigService,
        private httpInterceptor: InterceptedHttp) {

        this.admin_base_url = this.configService.getAdminBaseUrl();
        this._commonBaseURL = this.configService.getCommonBaseURL();
        this._getStateListURL = this._commonBaseURL + 'location/states/';
        this._getDistrictListURL = this._commonBaseURL + 'location/districts/';
        this._getTalukListURL = this._commonBaseURL + 'location/taluks/';
        this._getBlockListURL = this._commonBaseURL + 'location/districtblocks/';
        this._getBranchListURL = this.admin_base_url + 'villageMaster/get/Villages';
        this.storeVillagesURL = this.admin_base_url + 'villageMaster/save/VillageDetails';
        this.deleteVillageURL = this.admin_base_url + 'villageMaster/remove/village';
        this.updateVillageDataURL = this.admin_base_url + 'villageMaster/update/villageData';
    }

    getStates(countryId: number) {
        return this._http.get(this._getStateListURL + countryId)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getDistricts(stateId: number) {
        return this._http.get(this._getDistrictListURL + stateId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getTaluks(districtId) {
        return this._http.get(this._getTalukListURL + districtId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }

    getBranches(data) {
        return this._http.post(this._getBranchListURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    storeVillages(data) {
        return this._http.post(this.storeVillagesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateVillageStatus(data) {
        return this._http.post(this.deleteVillageURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateVillageData(data) {
        return this._http.post(this.updateVillageDataURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in zone master SERVICE');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleError(error: Response | any) {
        return Observable.throw(error);
    }

    getVillage(requestObj) {
        return this._http.post(this._getBranchListURL, requestObj)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }

}
