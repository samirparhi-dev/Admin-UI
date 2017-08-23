import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../../config/config.service";



@Injectable()
export class SuperAdmin_ServiceProvider_Service {
	// _baseURL = "";
	// _createServiceProviderURL = this._baseURL + "user/userAuthenticate/";
	superadmin_base_url: any;
	providerAdminBaseUrl: any; 
	commonbaseurl: any;
	
	service_provider_setup_url: any;
	getAllStatesUrl: any;
	getAllServiceLinesUrl: any;

	checkProviderNameAvailabilityUrl:any;
	

	constructor(private _http: Http, public ConfigService: ConfigService)
	 { 
		this.superadmin_base_url = this.ConfigService.getSuperAdminBaseUrl();
		this.providerAdminBaseUrl = this.ConfigService.getAdminBaseUrl();
		this.commonbaseurl = this.ConfigService.getCommonBaseURL();

		this.service_provider_setup_url = this.superadmin_base_url+"providerCreationAndMapping"
		this.getAllStatesUrl = this.commonbaseurl + "location/states/";
		this.getAllServiceLinesUrl = this.providerAdminBaseUrl + "getServiceline";

		this.checkProviderNameAvailabilityUrl=this.providerAdminBaseUrl+"checkProvider";

	}

	checkProviderNameAvailability(provider_name)
	{
		return this._http.post(this.checkProviderNameAvailabilityUrl,{
			"serviceProviderName" : provider_name
		})
		.map(this.extractData)
		.catch(this.handleError);
	}

	getAllStates(countryID:any)
	{
		return this._http.get(this.getAllStatesUrl + countryID)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getAllServiceLines() {
		return this._http.post(this.getAllServiceLinesUrl,{})
			.map(this.extractData)
			.catch(this.handleError);
	}

	public createServiceProvider = function(serviceProviderRequestObject) {
		return this._http.post(this.service_provider_setup_url, serviceProviderRequestObject)
			.map(this.extractData)
			.catch(this.handleError);
	};

	private extractData(res: Response) {
		console.log(res, "in SA service");
		return res.json().data;
	};

	private handleError(error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
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
	};
};



