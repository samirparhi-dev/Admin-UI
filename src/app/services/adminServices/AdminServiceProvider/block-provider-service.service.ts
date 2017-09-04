import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../../config/config.service";



@Injectable()
export class BlockProvider {

	admin_base_url: any;
	getAllProviderUrl: any;
	
	constructor(private _http: Http, public ConfigService: ConfigService) {
		this.admin_base_url=this.ConfigService.getAdminBaseUrl();

		this.getAllProviderUrl = this.admin_base_url + "getAllProvider";
	}

	getAllProviders()
	{
		return this._http.post(this.getAllProviderUrl, {}).map(this.handleSuccess).catch(this.handleError);
	}

	handleSuccess(response: Response)
	{
		console.log(response.json().data, "--- in Block-Provider Service");
		return response.json().data;
	}

	handleError(error: Response | any)
	{
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



