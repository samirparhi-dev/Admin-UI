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
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class EmployeeParkingPlaceMappingService {

    getUsernamesURL: string;
    deleteEmployeesURL: string;
    providerAdmin_Base_Url: any;
    common_Base_Url: any;

    saveEmployeeParkingPlaceMappingURL: any;
    updateEmployeeParkingPlaceMappingURL: any;
    userNameURL: any;
    getEmployeeURL: any;
    _getStateListBYServiceIDURL: any;
    _getServiceLineURL: any;
    getParkingPlacesURL: any;
    getDesignationsURL: any;
    getEmployeesURL: any;
    _getZonesURL: any;
    getVansURL: any;
    getMappedVansListURL: any;
    removeMappedVanURL: any;

    /* user signature upload service */
    getUsernamesBasedDesigUrl: any;
    checkUsersignExistUrl: any;
    uploadSignUrl: any;
    downloadSignUrl: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        public httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + 'm/role/stateNew';
        this._getServiceLineURL = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this._getZonesURL = this.providerAdmin_Base_Url + "zonemaster/get/zones";
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/parkingPlacesbyzoneid';
        this.getDesignationsURL = this.providerAdmin_Base_Url + 'm/getDesignation';
        this.getEmployeesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/userParkingPlaces1';
        this.deleteEmployeesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/delete/userParkingPlaces1';
        this.getUsernamesURL = this.providerAdmin_Base_Url + '/parkingPlaceMaster/get/unmappeduser';
        this.saveEmployeeParkingPlaceMappingURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/save/userParkingPlaces';
        this.updateEmployeeParkingPlaceMappingURL = this.providerAdmin_Base_Url + '/parkingPlaceMaster/edit/userParkingPlaces1';
        this.userNameURL = "";
        this.getVansURL = this.providerAdmin_Base_Url + 'vanMaster/get/vanDetails';
        this.getMappedVansListURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/mappedvan/';
        this.removeMappedVanURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/delete/mappedvan';

        /* user signature upload service */
        this.getUsernamesBasedDesigUrl = this.providerAdmin_Base_Url + 'm/getEmployeeByDesignation';
        this.checkUsersignExistUrl = this.providerAdmin_Base_Url + 'signature1/signexist/';
        this.uploadSignUrl = this.providerAdmin_Base_Url + 'signature1/upload';
        this.downloadSignUrl = this.providerAdmin_Base_Url + 'signature1/';
    }
    getServices(userID) {
        return this.httpIntercept.post(this._getServiceLineURL, { 'userID': userID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getStates(userID, serviceID, isNationalFlag) {
        return this.http.post(this._getStateListBYServiceIDURL,
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
            .map(this.CommonSuccessHandler)
            .catch(this.handleError);
    }

    DeleteEmpParkingMapping(requestObject) {
        return this.http.post(this.deleteEmployeesURL, requestObject)
            .map(this.handleSuccessForActivationUser)
            .catch(this.handleError);
    }
    getUsernames(userObj) {
        return this.http.post(this.getUsernamesURL, userObj)
            .map(this.CommonSuccessHandler)
            .catch(this.handleError);
    }


    getDesignations() {
        return this.http.post(this.getDesignationsURL, {})
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getEmployees(requestObject) {
        return this.http.post(this.getEmployeesURL, requestObject)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getVans(reqObj) {
        return this.http.post(this.getVansURL, reqObj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    saveEmployeeParkingPlaceMappings(data) {
        return this.http.post(this.saveEmployeeParkingPlaceMappingURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getMappedVansList(userParkingPlaceMapID) {
        return this.http.post(this.getMappedVansListURL + userParkingPlaceMapID, {})
            .map((res: Response) => res.json());
    }
    removeMappedVan(removeVanObj) {
        return this.http.post(this.removeMappedVanURL, removeVanObj)
            .map((res: Response) => res.json());
    }
    updateEmployeeParkingPlaceMappings(data) {
        return this.http.post(this.updateEmployeeParkingPlaceMappingURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    CommonSuccessHandler(response: Response) {

        console.log(response.json().data, 'employee parking place master SERVICE');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (!item.deleted) {
                return item;
            }
        });
        return result;
    }
    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in employee parking place master SERVICE');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
    handleSuccessForActivationUser(res: Response) {
        console.log(res.json(), '--- in employee parking place master SERVICE check');
        return res.json()
    }
    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'employee parking place master SERVICE');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID == 2 || item.serviceID == 4) {
                return item;
            }
        });
        return result;
    }
    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }

    /* User signature upload services*/
    getUserNameBasedOnDesig(reqObj) {
        return this.http.post(this.getUsernamesBasedDesigUrl, reqObj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    checkUsersignatureExist(userID) {
        return this.http.get(this.checkUsersignExistUrl + userID)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    uploadSignature(signObj) {
        return this.http.post(this.uploadSignUrl, signObj)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }
    downloadSign(userID) {
        let option = new RequestOptions({ responseType: ResponseContentType.Blob});
        return this.http.get(this.downloadSignUrl + userID, option).map((res) =>  res);
    }
}
