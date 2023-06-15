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
export class ServicePointMasterService {


    updateServicePointsURL: string;
    providerAdmin_Base_Url: any;
    common_Base_Url: any;

    _getStateListURL: any;
    _getServiceLineURL: any;
    _getZonesURL: any;
    getParkingPlacesURL: any;
    _getDistrictListURL: any;
    _getTalukListURL: any;

    // CRUD
    saveServicePointsURL: any;
    getServicePointsURL: any;
    updateServicePointStatusURL: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        this._getStateListURL = this.providerAdmin_Base_Url + 'm/role/stateNew';
        this._getServiceLineURL = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this._getZonesURL = this.providerAdmin_Base_Url + "zonemaster/get/zones";
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/parkingPlacesbyzoneid';
        this._getDistrictListURL = this.providerAdmin_Base_Url + '/zonemaster/getdistrictMappedtoZone';
        this._getTalukListURL = this.providerAdmin_Base_Url + '/parkingPlaceTalukMapping/getbyppidanddid/parkingPlacesTalukMapping';

        this.saveServicePointsURL = this.providerAdmin_Base_Url + 'servicePointMaster/create/servicePoints';
        this.getServicePointsURL = this.providerAdmin_Base_Url + 'servicePointMaster/get/servicePoints';
        this.updateServicePointStatusURL = this.providerAdmin_Base_Url + 'servicePointMaster/remove/servicePoint';      
        this.updateServicePointsURL = this.providerAdmin_Base_Url + '/servicePointMaster/edit/servicePoint';
    }
    getServices(userID) {
        return this.httpIntercept.post(this._getServiceLineURL, { 'userID': userID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getStates(userID, serviceID, isNationalFlag) {
        return this.http.post(this._getStateListURL,
            {
                'userID': userID,
                'serviceID': serviceID,
                'isNational': isNationalFlag
            }).map(this.handleSuccess)
            .catch(this.handleError);
    }

    getZones(data) {
        return this.http.post(this._getZonesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getParkingPlaces(data) {
        return this.http.post(this.getParkingPlacesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getDistricts(zoneID) {
        return this.http.post(this._getDistrictListURL, { 'zoneID': zoneID })
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    
    getServicePoints(data) {
        return this.http.post(this.getServicePointsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    
    getTaluks(talukObj) {
        return this.http.post(this._getTalukListURL, talukObj)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }

    saveServicePoint(data) {
        return this.http.post(this.saveServicePointsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateServicePoint(data) {
        return this.http.post(this.updateServicePointsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }


    updateServicePointStatus(data) {
        return this.http.post(this.updateServicePointStatusURL, data)
            .map(this.handleSuccess)
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
    handleState_n_parkingplaces(response: Response) {

        console.log(response.json().data, 'service point file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (!item.deleted) {
                return item;
            }
        });
        return result;
    }


    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in service point master SERVICE');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleError(error: Response | any) {
        return Observable.throw(error.json());

    }
}
