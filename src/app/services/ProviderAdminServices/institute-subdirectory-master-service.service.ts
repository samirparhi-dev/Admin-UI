import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from "../config/config.service";



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 09-10-2017
 * Objective: # A service which would handle the INSTITUTE SUBDIRECTORY MASTER services.
 */

@Injectable()
export class InstituteSubDirectoryMasterService {
	admin_Base_Url:any;

	get_State_Url:any;
	get_Service_Url:any;
	get_InstituteDirectory_Url:any;

	get_InstituteSubDirectory_Url:any;
	save_InstituteSubDirectory_Url:any;
	edit_InstituteSubDirectory_Url:any;
	toggle_activate_InstituteSubDirectory_Url:any;
	

	constructor(private http: Http,public basepaths:ConfigService, private httpIntercept: InterceptedHttp) { 
		this.admin_Base_Url = this.basepaths.getAdminBaseUrl();

		this.get_State_Url = this.admin_Base_Url + "m/role/state";
		this.get_Service_Url = this.admin_Base_Url + "m/role/service";
		this.get_InstituteDirectory_Url=this.admin_Base_Url+"m/getInstituteDirectory";

		this.get_InstituteSubDirectory_Url=this.admin_Base_Url+"m/getInstutesubDirectory";
		this.save_InstituteSubDirectory_Url=this.admin_Base_Url+"m/createInstutesubDirectory";
		this.edit_InstituteSubDirectory_Url=this.admin_Base_Url+"m/editInstutesubDirectory";
		this.toggle_activate_InstituteSubDirectory_Url=this.admin_Base_Url+"m/deleteInstutesubDirectory";
		
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

	getInstituteDirectory(providerServiceMapID)
	{
		console.log("psmID",providerServiceMapID);
		return this.http.post(this.get_InstituteDirectory_Url,{"providerServiceMapId":providerServiceMapID}).map(this.handleSuccess).catch(this.handleError);
	}

	getInstituteSubDirectory(data)
	{
		return this.http.post(this.get_InstituteSubDirectory_Url,data).map(this.handleSuccess).catch(this.handleError);

	}

	saveInstituteSubDirectory(data)
	{
		return this.http.post(this.save_InstituteSubDirectory_Url,data).map(this.handleSuccess).catch(this.handleError);

	}

	toggle_activate_InstituteSubDirectory(data)
	{
		return this.http.post(this.toggle_activate_InstituteSubDirectory_Url,data).map(this.handleSuccess).catch(this.handleError);

	}

	editInstituteSubDirectory(data)
	{
		return this.http.post(this.edit_InstituteSubDirectory_Url,data).map(this.handleSuccess).catch(this.handleError);

	}


	handleSuccess(response: Response) {
		console.log(response.json().data, "INSTITUTE-SUBDIRECTORY file success response");
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



