import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 10-09-2017
 * Objective: # A service which would handle the mapping of category n subcategory
				for a subservice of a state,for a service provider
				*/

@Injectable()
export class CategorySubcategoryService {

	providerAdmin_Base_Url: any;
	getStates_url: any;
	getServiceLines_url: any;

	get_sub_serviceID_url: any;

	get_category_subcategory_url: any;

	



	constructor(private http: Http, public basepaths: ConfigService) {
		this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();

		this.getStates_url = this.providerAdmin_Base_Url + "m/location/state";
		this.getServiceLines_url = this.providerAdmin_Base_Url + "m/location/service";
		
	};

	getStates(serviceProviderID) {
		return this.http.post(this.getStates_url, { "serviceProviderID": serviceProviderID })
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	
	getServiceLines(serviceProviderID, stateID) {
		return this.http.post(this.getServiceLines_url, { "serviceProviderID": serviceProviderID, "stateID": stateID })
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	

	handleSuccess(response: Response) {
		console.log(response.json().data, "--- in location-serviceline-mapping service");
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



