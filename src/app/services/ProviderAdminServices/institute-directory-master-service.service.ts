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
 * Objective: # A service which would handle the INSTITUTE DIRECTORY MASTER services.
 */

@Injectable()
export class InstituteDirectoryMasterService {
	admin_Base_Url:any;

	get_State_Url:any;
	get_Service_Url:any;
	get_InstituteDirectory_Url:any;
	

	constructor(private http: Http,public basepaths:ConfigService, private httpIntercept: InterceptedHttp) { 
		this.admin_Base_Url = this.basepaths.getAdminBaseUrl();

		this.get_State_Url = this.admin_Base_Url + "m/role/state";
		this.get_Service_Url = this.admin_Base_Url + "m/role/service";
		this.get_InstituteDirectory_Url=this.admin_Base_Url+"m/getInstituteDirectory";
		
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


	handleSuccess(response: Response) {
		console.log(response.json().data, "INSTITUTE-DIRECTORY file success response");
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



