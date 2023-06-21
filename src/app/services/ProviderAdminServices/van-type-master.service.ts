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

import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class VanTypeMasterService {
     headers = new Headers( { 'Content-Type': 'application/json' } );
     
     providerAdmin_Base_Url: any;
     common_Base_Url:any;

     //CRUD
     saveVanTypesURL:any;
     getVanTypesURL:any;
     updateVanTypeStatusURL:any;

     _getStateListBYServiceIDURL:any;
     _getServiceLineURL:any;

     constructor(private http: SecurityInterceptedHttp,public basepaths:ConfigService, private httpIntercept: InterceptedHttp) { 
          this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
          this.common_Base_Url = this.basepaths.getCommonBaseURL();

          this.saveVanTypesURL = this.providerAdmin_Base_Url + "vanMaster/save/vanTypeDetails";
          this.getVanTypesURL = this.providerAdmin_Base_Url + "vanMaster/get/vanTypes";
          this.updateVanTypeStatusURL = this.providerAdmin_Base_Url + "vanMaster/remove/vanTypeDetails";

          this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + "m/location/getStatesByServiceID";
          this._getServiceLineURL = this.providerAdmin_Base_Url + "m/role/service";
     }

     saveVanType(data){
        return this.http.post(this.saveVanTypesURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
     }

     getVanTypes(data){
        return this.http.post(this.getVanTypesURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

     updateVanTypeStatus(data){
        return this.http.post(this.updateVanTypeStatusURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getStatesByServiceID(serviceID,serviceProviderID) {
		return this.http.post(this._getStateListBYServiceIDURL, { "serviceID": serviceID,"serviceProviderID": serviceProviderID })
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	getServices(serviceProviderID,stateID) {
		return this.http.post(this._getServiceLineURL, { "serviceProviderID": serviceProviderID,
													  "stateID": stateID
													}).map(this.handleSuccess)
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

    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }
}