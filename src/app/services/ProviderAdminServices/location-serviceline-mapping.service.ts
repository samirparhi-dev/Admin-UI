import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from "../config/config.service";



@Injectable()
export class LocationServicelineMapping {

	providerAdmin_Base_Url: any;
	getStates_url: any;
	getDistricts_url: any;
	getServiceLines_url: any;

	getWorkLocations_url: any;
	add_WorkLocation_url: any;
	edit_WorkLocation_url: any;
	delete_WorkLocation_url: any;
	getWorkLocationsOnState_url : any
	getOfficesUrl: any;

	constructor(private http: Http,public basepaths:ConfigService, private httpIntercept: InterceptedHttp) { 
		this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();

		this.getStates_url = this.providerAdmin_Base_Url + "m/role/state";
		this.getDistricts_url = this.providerAdmin_Base_Url + "m/location/findDistrict";
		this.getServiceLines_url = this.providerAdmin_Base_Url + "m/role/service";
		this.getWorkLocations_url = this.providerAdmin_Base_Url + "m/location/getAlllocation";
		this.add_WorkLocation_url = this.providerAdmin_Base_Url + "m/location/addLocation";
		this.edit_WorkLocation_url = this.providerAdmin_Base_Url + "m/location/editLocation";
		this.delete_WorkLocation_url = this.providerAdmin_Base_Url + "m/location/deleteLocation";
		this.getWorkLocationsOnState_url = this.providerAdmin_Base_Url + "/m/location/getLocationByStateId";
		this.getOfficesUrl = this.providerAdmin_Base_Url + "/m/location/getOfficeNameByMapId";
	};

	getStates(serviceProviderID) {
		return this.http.post(this.getStates_url, { "serviceProviderID": serviceProviderID })
		.map(this.handleState_n_ServiceSuccess)
		.catch(this.handleError);
	}

	getDistricts(serviceProviderID,stateID) {
		return this.http.post(this.getDistricts_url, { "serviceProviderID": serviceProviderID, "stateID": stateID })
		.map(this.handleState_n_ServiceSuccess)
		.catch(this.handleError);
	}

	getServiceLines(serviceProviderID, stateID) {
		return this.httpIntercept.post(this.getServiceLines_url, { "serviceProviderID": serviceProviderID, "stateID": stateID })
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	getWorkLocations(reqObj)
	{
		return this.httpIntercept.post(this.getWorkLocations_url, reqObj)
		.map(this.handleSuccess)
		.catch(this.handleError);
	}
	getWorkLocationsOnState(reqObj) {
		return this.httpIntercept.post(this.getWorkLocationsOnState_url, reqObj)
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	addWorkLocation(requestObject)
	{
		return this.httpIntercept.post(this.add_WorkLocation_url, requestObject)
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	editWorkLocation(requestObject) {
		return this.httpIntercept.post(this.edit_WorkLocation_url, requestObject)
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	deleteWorkLocation(obj) {
		return this.httpIntercept.post(this.delete_WorkLocation_url, obj)
		.map(this.handleSuccess)
		.catch(this.handleError);
	}
	getWorklocationOnProviderArray(ProvidepMapIDArray){
	
				return this.httpIntercept.post(this.getOfficesUrl, { "providerServiceMapID": ProvidepMapIDArray })
		.map(this.handleSuccess)
		.catch(this.handleError);

	}
	handleSuccess(response: Response) {
		console.log(response.json().data, "--- in location-serviceline-mapping service");
		return response.json().data;
	}

	handleState_n_ServiceSuccess(response: Response) {
		
		console.log(response.json().data, "loc-serviceline-service file success response");
		let result=[];
		result=response.json().data.filter(function(item)
		{
			if(item.statusID!=4)
			{
				return item;
			}
		});
		return result;
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



