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
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

import { ConfigService } from "../config/config.service";

@Injectable()
export class ZoneMasterService {
    headers = new Headers({ 'Content-Type': 'application/json' });

    providerAdmin_Base_Url: any;
    common_Base_Url: any;

    //CRUD
    saveZonesURL: any;
    getZonesURL: any;

    saveZoneDistrictMappingURL: any;
    getZoneDistrictMappingURL: any;

    _getStateListByServiceIDURL: any;
    _getStateListURL: any;
    _getDistrictListURL: any;
    _getTalukListURL: any;
    _getBlockListURL: any;
    _getBranchListURL: any;
    _getServiceLinesURL: any;

    getServiceLines_new_url: any;
    getStates_new_url: any;

    updateZOneStatusURL: any;
    updateZOneDistrictMappingURL: any;
    updateZoneDataURL: any;
    updateZoneMappingDataUrl: any;

    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        //this.providerAdmin_Base_Url = "http://localhost:9000/";
        this.saveZonesURL = this.providerAdmin_Base_Url + "zonemaster/save/zone";
        this.getZonesURL = this.providerAdmin_Base_Url + "zonemaster/get/zones";

        this.saveZoneDistrictMappingURL = this.providerAdmin_Base_Url + "zonemaster/save/zoneDistrictMapping";
        this.getZoneDistrictMappingURL = this.providerAdmin_Base_Url + "zonemaster/get/zoneDistrictMappings";

        this.updateZOneStatusURL = this.providerAdmin_Base_Url + "zonemaster/remove/zone";
        this.updateZOneDistrictMappingURL = this.providerAdmin_Base_Url + "zonemaster/remove/zoneDistrictMapping";

        this.updateZoneDataURL = this.providerAdmin_Base_Url + "zonemaster/update/zoneData";

        this._getStateListByServiceIDURL = this.providerAdmin_Base_Url + "m/location/getStatesByServiceID";
        this._getStateListURL = this.common_Base_Url + "location/states/";
        this._getDistrictListURL = this.common_Base_Url + "location/districts/";
        this._getTalukListURL = this.common_Base_Url + "location/taluks/";
        this._getBlockListURL = this.common_Base_Url + "location/districtblocks/";
        this._getBranchListURL = this.common_Base_Url + "location/village/";
        this._getServiceLinesURL = this.providerAdmin_Base_Url + "getServiceline";

        /* serviceline and state */

        this.getServiceLines_new_url = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this.getStates_new_url = this.providerAdmin_Base_Url + 'm/role/stateNew';
        this.updateZoneMappingDataUrl = this.providerAdmin_Base_Url + "/zonemaster/edit/zoneDistrictMapping";

    };

    saveZones(data) {
        return this.http.post(this.saveZonesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getZones(data) {
        return this.http.post(this.getZonesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    saveZoneDistrictMappings(data) {
        return this.http.post(this.saveZoneDistrictMappingURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getZoneDistrictMappings(data) {
        return this.http.post(this.getZoneDistrictMappingURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateZoneStatus(data) {
        return this.http.post(this.updateZOneStatusURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateZoneMappingData(data) {
        return this.http.post(this.updateZoneMappingDataUrl, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateZoneMappingStatus(data) {
        return this.http.post(this.updateZOneDistrictMappingURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateZoneData(data) {
        return this.http.post(this.updateZoneDataURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getServiceLinesNew(userID) {
        return this.httpIntercept
            .post(this.getServiceLines_new_url, { 'userID': userID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }
    getStatesNew(obj) {
        return this.httpIntercept
            .post(this.getStates_new_url, obj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getDistricts(stateId: number) {
        return this.http.get(this._getDistrictListURL + stateId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getTaluks(districtId: number) {
        return this.http.get(this._getTalukListURL + districtId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getSTBs(talukId: number) {
        return this.http.get(this._getBlockListURL + talukId)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getBranches(blockId: number) {
        return this.http.get(this._getBranchListURL + blockId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }

    handleSuccess(response: Response) {
        console.log(response.json().data, "--- in zone master SERVICE");
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        }
    }
    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'role service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID == 2 || item.serviceID == 4) {
                return item;
            }
        });
        return result;
    }

    handleError(error: Response | any) {
        return Observable.throw(error);
    }

}