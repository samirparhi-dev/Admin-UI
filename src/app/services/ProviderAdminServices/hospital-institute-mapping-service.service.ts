import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from "../config/config.service";



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 11-10-2017
 * Objective: # A service which would handle the HOSPITAL MASTER services.
 */

 @Injectable()
 export class HospitalInstituteMappingService {
 	admin_Base_Url:any;
 	common_Base_Url:any;

 	get_State_Url:any;
 	get_Service_Url:any;
 	get_District_Url:any;
 	get_Taluk_Url:any;

 	get_Institution_Url:any;
 	get_InstituteDirectory_Url:any;
 	get_InstituteSubDirectory_Url:any;
 	
 	getMappingList_Url:any;
 	createMapping_Url:any;
 	toggleMappingStatus_Url:any;

 	constructor(private http: Http,public basepaths:ConfigService, private httpIntercept: InterceptedHttp) { 
 		this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
 		this.common_Base_Url=this.basepaths.getCommonBaseURL();

 		this.get_State_Url = this.admin_Base_Url + "m/role/state";
 		this.get_Service_Url = this.admin_Base_Url + "m/role/service";
 		this.get_District_Url=this.common_Base_Url + "location/districts/";
 		this.get_Taluk_Url=this.common_Base_Url + "location/taluks/";

 		this.get_Institution_Url=this.admin_Base_Url+"m/getInstution";
 		this.get_InstituteDirectory_Url=this.admin_Base_Url+"m/getInstituteDirectory";
		this.get_InstituteSubDirectory_Url=this.admin_Base_Url+"m/getInstutesubDirectory";

		this.getMappingList_Url=this.common_Base_Url+"directory/getInstitutesDirectories";
		this.createMapping_Url=this.admin_Base_Url+"m/createInstutesubDirectoryMapping";
		this.toggleMappingStatus_Url=this.admin_Base_Url+"m/deleteInstutesubDirectoryMapping";




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

 	getDistricts (stateId)
 	{
 		return this.http.get( this.get_District_Url + stateId)
 		.map( this.handleSuccess)
 		.catch( this.handleError );

 	}

 	getTaluks (districtId)
 	{
 		return this.http.get( this.get_Taluk_Url + districtId)
 		.map( this.handleSuccess)
 		.catch( this.handleError );

 	}


 	getInstitutions(data)
 	{
 		return this.http.post(this.get_Institution_Url,data)
 		.map(this.handleSuccess)
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

	getMappingList(data)
	{
		return this.http.post(this.getMappingList_Url,data).map(this.handleSuccess).catch(this.handleError);
	}

	createMapping(data)
	{
		return this.http.post(this.createMapping_Url,data).map(this.handleSuccess).catch(this.handleError);
	}

	toggleMappingStatus(data)
	{
		return this.http.post(this.toggleMappingStatus_Url,data).map(this.handleSuccess).catch(this.handleError);

	}


 	handleSuccess(response: Response) {
 		console.log(response.json().data, "HOSPITAL-MASTER-SERVICE file success response");
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



