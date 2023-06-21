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
export class DrugMasterService {
    providerAdmin_Base_Url: any;

    // CRUD

    /*Drug Group - Drug Mapping*/
    getServiceLines_new_url: any;
    getStates_new_url: any;

    saveDrugGroupsURL: any;
    saveDrugsURL: any;
    mapDrugGroupURL: any;

    getDrugsListURL: any;
    getDrugGroupsURL: any;
    getDrugMappingsURL: any;
    getAllDrugStrengthsUrl: any;

    updateDrugStatusURL: any;

    updateDrugDataURL: any;
    updateDrugGroupURL: any;
    updateDrugMappingsURL: any;

    /*Drug Group Master*/
    _getStateListBYServiceIDURL: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.saveDrugGroupsURL = this.providerAdmin_Base_Url + 'm/saveDrugGroup';
        this.saveDrugsURL = this.providerAdmin_Base_Url + 'm/saveDrug';
        this.mapDrugGroupURL = this.providerAdmin_Base_Url + 'm/mapDrugWithGroup';
        this.getDrugsListURL = this.providerAdmin_Base_Url + 'm/getDrugData';
        this.getDrugGroupsURL = this.providerAdmin_Base_Url + 'm/getDrugGroups';
        this.updateDrugStatusURL = this.providerAdmin_Base_Url + 'm/updateDrugStatus';
        this.updateDrugDataURL = this.providerAdmin_Base_Url + 'm/updateDrugMaster';
        this.updateDrugGroupURL = this.providerAdmin_Base_Url + 'm/updateDrugGroup';
        this.getDrugMappingsURL = this.providerAdmin_Base_Url + 'm/getDrugGroupMappings';
        this.updateDrugMappingsURL = this.providerAdmin_Base_Url + 'm/updateDrugMapping';
        this.getAllDrugStrengthsUrl = this.providerAdmin_Base_Url + '/getDrugStrangth';

        /*Drug Group - Drug Mapping*/

        this.getServiceLines_new_url = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this.getStates_new_url = this.providerAdmin_Base_Url + 'm/role/stateNew';

        /*Drug Group Master*/
        this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + 'm/location/getStatesByServiceID';

    };
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
    getDrugMappings(data) {
        return this.httpIntercept.post(this.getDrugMappingsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getDrugGroups(data) {
        return this.httpIntercept.post(this.getDrugGroupsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getDrugsList(data) {
        return this.httpIntercept.post(this.getDrugsListURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    mapDrugGroups(data) {
        return this.httpIntercept.post(this.mapDrugGroupURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    /* End Mapping */

    // getAllDrugStrengths() {
    //     return this.httpIntercept.post(this.getAllDrugStrengthsUrl, {})
    //     .map(this.handleSuccess)
    //     .catch(this.handleError);
    // }

    /*Drug Group Master*/
    getStatesByServiceID(serviceID, serviceProviderID) {
        return this.httpIntercept.post(this._getStateListBYServiceIDURL,
            { 'serviceID': serviceID, 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    saveDrugGroups(data) {
        return this.httpIntercept.post(this.saveDrugGroupsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateDrugGroup(data) {
        return this.httpIntercept.post(this.updateDrugGroupURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateDrugStatus(data) {
        return this.httpIntercept.post(this.updateDrugStatusURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    /**End Group Matser**/

    /*Drug List*/
    
    saveDrugs(data) {
        return this.httpIntercept.post(this.saveDrugsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateDrugData(data) {
        return this.httpIntercept.post(this.updateDrugDataURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    /**End drug list**/

    updateDrugMappings(data) {
        return this.httpIntercept.post(this.updateDrugMappingsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }


    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'role service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID == 3) {
                return item;
            }
        });
        return result;
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in drug master SERVICE');
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
