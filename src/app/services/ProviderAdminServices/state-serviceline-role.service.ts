import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 14-07-2017
 * Objective: # A service which would handle the creation of new roles for a service line,in a state,
 				for a provider.
 */

@Injectable()
export class ProviderAdminRoleService {

	admin_Base_Url: any;
	get_State_Url: any;
	get_Service_Url: any;
	find_Roles_By_State_Service_Url: any;
	create_Roles_Url: any;
	delete_Role_Url: any;
	edit_Role_Url: any;

	getFeaturesUrl:any;

	constructor(private http: Http,public basepaths:ConfigService) { 
		this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
		console.log(this.admin_Base_Url);
		this.get_State_Url = this.admin_Base_Url + "m/role/state ";
		this.get_Service_Url = this.admin_Base_Url + "m/role/service";
		this.find_Roles_By_State_Service_Url = this.admin_Base_Url + "m/role/search";
		this.create_Roles_Url = this.admin_Base_Url + "m/role/addRole";
		this.delete_Role_Url = this.admin_Base_Url + "m/role/deleteRole";
		this.edit_Role_Url = this.admin_Base_Url + "m/role/editRole";
		this.getFeaturesUrl=this.admin_Base_Url+"m/searchFeature";
	};

	getStates(serviceProviderID) {
		return this.http.post(this.get_State_Url, { "serviceProviderID": serviceProviderID })
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	getServices(serviceProviderID,stateID) {
		return this.http.post(this.get_Service_Url, { "serviceProviderID": serviceProviderID,
													  "stateID": stateID
													}).map(this.handleSuccess)
													.catch(this.handleError);
	}

	getFeature(serviceProviderMapID)
	{
		return this.http.post(this.getFeaturesUrl, { "providerServiceMapId" :serviceProviderMapID})
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	getRoles(serviceProviderID, stateID,serviceID) {
		return this.http.post(this.find_Roles_By_State_Service_Url,
		{
			"serviceProviderID": serviceProviderID,
			"stateID": stateID,
			"serviceID": serviceID
		})
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	createRoles(roles_array) {
		return this.http.post(this.create_Roles_Url, roles_array)
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	deleteRole(roleID)
	{
		return this.http.post(this.delete_Role_Url, { "roleID": roleID })
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	editRole(modified_Role_Object)
	{
		return this.http.post(this.edit_Role_Url, modified_Role_Object)
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	handleSuccess(response: Response) {
		// console.log((response.json().data).json(), "in service.ts");
		// console.log(response,"---1");
		// console.log(response.json(), "---2");
		console.log(response.json().data, "role service file success response");
		return response.json().data;
	}

	handleError(error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}

	


};



