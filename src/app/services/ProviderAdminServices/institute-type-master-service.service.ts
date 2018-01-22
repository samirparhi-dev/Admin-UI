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
 * Objective: # A service which would handle the INSTITUTE TYPE MASTER services.
 */

@Injectable()
export class InstituteTypeMasterService {
	admin_Base_Url: any;

	get_State_Url: any;
	get_Service_Url: any;

	get_InstituteType_Url: any;
	save_InstituteType_Url: any;
	edit_InstituteType_Url: any;
	delete_InstituteType_Url: any;

	constructor(private http: SecurityInterceptedHttp,
		public basepaths: ConfigService,
		private httpIntercept: InterceptedHttp) {
		this.admin_Base_Url = this.basepaths.getAdminBaseUrl();

		this.get_State_Url = this.admin_Base_Url + 'm/role/state';
		this.get_Service_Url = this.admin_Base_Url + 'm/role/service';

		this.get_InstituteType_Url = this.admin_Base_Url + 'm/getInstituteType';
		this.save_InstituteType_Url = this.admin_Base_Url + 'm/createInstituteType';
		this.edit_InstituteType_Url = this.admin_Base_Url + 'm/editInstituteType';
		this.delete_InstituteType_Url = this.admin_Base_Url + 'm/deleteInstituteType';

	};

	getStates(serviceProviderID) {
		return this.http.post(this.get_State_Url, { 'serviceProviderID': serviceProviderID })
			.map(this.handleState_n_ServiceSuccess)
			.catch(this.handleError);
	}

	getServices(serviceProviderID, stateID) {
		return this.http.post(this.get_Service_Url, {
			'serviceProviderID': serviceProviderID,
			'stateID': stateID
		}).map(this.handleState_n_ServiceSuccess)
			.catch(this.handleError);
	}

	getInstituteType(providerServiceMapID) {
		return this.http.post(this.get_InstituteType_Url, { 'providerServiceMapID': providerServiceMapID })
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	toggle_activate_InstituteType(data) {
		return this.http.post(this.delete_InstituteType_Url, data)
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	saveInstituteType(data) {
		return this.http.post(this.save_InstituteType_Url, data)
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	editInstituteType(data) {
		return this.http.post(this.edit_InstituteType_Url, data)
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	handleState_n_ServiceSuccess(response: Response) {

		console.log(response.json().data, 'role service file success response');
		let result = [];
		result = response.json().data.filter(function (item) {
			if (item.statusID !== 4) {
				return item;
			}
		});
		return result;
	}

	handleSuccess(res: Response) {
		console.log(res.json().data, 'Institute-Type file success response');
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



