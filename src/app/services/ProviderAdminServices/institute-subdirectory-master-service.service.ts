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
 * Author: Diamond Khanna ( 352929 )
 * Date: 09-10-2017
 * Objective: # A service which would handle the INSTITUTE SUBDIRECTORY MASTER services.
 */

@Injectable()
export class InstituteSubDirectoryMasterService {
	admin_Base_Url: any;

	get_State_Url: any;
	get_Service_Url: any;
	get_InstituteDirectory_Url: any;

	get_InstituteSubDirectory_Url: any;
	save_InstituteSubDirectory_Url: any;
	edit_InstituteSubDirectory_Url: any;
	toggle_activate_InstituteSubDirectory_Url: any;
	getServiceLines_new_url: any;
	getStates_new_url: any;

	constructor(private http: SecurityInterceptedHttp,
		public basepaths: ConfigService,
		private httpIntercept: InterceptedHttp) {
		this.admin_Base_Url = this.basepaths.getAdminBaseUrl();

		this.get_Service_Url = this.admin_Base_Url + 'm/role/service';
		this.get_InstituteDirectory_Url = this.admin_Base_Url + 'm/getInstituteDirectory';

		this.get_InstituteSubDirectory_Url = this.admin_Base_Url + 'm/getInstutesubDirectory';
		this.save_InstituteSubDirectory_Url = this.admin_Base_Url + 'm/createInstutesubDirectory';
		this.edit_InstituteSubDirectory_Url = this.admin_Base_Url + 'm/editInstutesubDirectory';
		this.toggle_activate_InstituteSubDirectory_Url = this.admin_Base_Url + 'm/deleteInstutesubDirectory';
		this.getServiceLines_new_url = this.admin_Base_Url + 'm/role/serviceNew';
		this.getStates_new_url = this.admin_Base_Url + 'm/role/stateNew';
	};

	getStatesNew(obj) {
		return this.httpIntercept.post(this.getStates_new_url, obj).map(this.handleSuccess)
			.catch(this.handleError);
	}
	getServices(serviceProviderID, stateID) {
		return this.http.post(this.get_Service_Url,
			{
				'serviceProviderID': serviceProviderID,
				'stateID': stateID
			}).map(this.handleState_n_ServiceSuccess)
			.catch(this.handleError);
	}
	getServiceLinesNew(userID) {
		return this.httpIntercept.post(this.getServiceLines_new_url, { 'userID': userID })
			.map(this.handleState_n_ServiceSuccess)
			.catch(this.handleError);
	}
	getInstituteDirectory(providerServiceMapID) {
		console.log('psmID', providerServiceMapID);
		return this.http.post(this.get_InstituteDirectory_Url,
			{ 'providerServiceMapId': providerServiceMapID })
			.map(this.handleSuccess).catch(this.handleError);
	}

	getInstituteSubDirectory(data) {
		return this.httpIntercept.post(this.get_InstituteSubDirectory_Url, data).map(this.handleSuccess).catch(this.handleError);

	}

	saveInstituteSubDirectory(data) {
		return this.httpIntercept.post(this.save_InstituteSubDirectory_Url, data).map(this.handleSuccess).catch(this.handleError);

	}

	toggle_activate_InstituteSubDirectory(data) {
		return this.httpIntercept.post(this.toggle_activate_InstituteSubDirectory_Url, data).map(this.handleSuccess).catch(this.handleError);

	}

	editInstituteSubDirectory(data) {
		return this.httpIntercept.post(this.edit_InstituteSubDirectory_Url, data).map(this.handleSuccess).catch(this.handleError);

	}

	handleState_n_ServiceSuccess(response: Response) {

		console.log(response.json().data, 'role service file success response');
		let result = [];
		result = response.json().data.filter(function (item) {
			if (item.serviceID === 3 || item.serviceID === 1 || item.serviceID === 6) {
				return item;
			}
		});
		return result;
	}

	handleSuccess(res: Response) {
		console.log(res.json().data, 'INSTITUTE-SUBDIRECTORY file success response');
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



