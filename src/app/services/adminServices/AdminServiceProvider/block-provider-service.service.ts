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
	getStateLevelBlockList_Url: any;
	getServiceLineLevelBlockList_Url: any;

	block_unblock_provider_url: any;
	block_unblock_state_url: any;
	block_unblock_serviceline_url: any;
	
	constructor(private _http: Http, public ConfigService: ConfigService) {
		this.admin_base_url=this.ConfigService.getAdminBaseUrl();

		this.getAllProviderUrl = this.admin_base_url + "getAllProvider";
		this.getStateLevelBlockList_Url="";
		this.getServiceLineLevelBlockList_Url="";

		this.block_unblock_provider_url="";
		this.block_unblock_state_url="";
		this.block_unblock_serviceline_url="";

	}

	getAllProviders()
	{
		return this._http.post(this.getAllProviderUrl, {}).map(this.success_handeler).catch(this.error_handeler);
	}

	getStateLevelBlockList()
	{
		return this._http.post(this.getStateLevelBlockList_Url, {}).map(this.success_handeler).catch(this.error_handeler);
	}

	getServiceLineLevelBlockList() {
		return this._http.post(this.getServiceLineLevelBlockList_Url, {}).map(this.success_handeler).catch(this.error_handeler);
	}

	block_unblock_provider() {
		return this._http.post(this.block_unblock_provider_url, {}).map(this.success_handeler).catch(this.error_handeler);
	}

	block_unblock_state() {
		return this._http.post(this.block_unblock_state_url, {}).map(this.success_handeler).catch(this.error_handeler);
	}

	block_unblock_serviceline() {
		return this._http.post(this.block_unblock_serviceline_url, {}).map(this.success_handeler).catch(this.error_handeler);
	}

	success_handeler(response: Response)
	{
		console.log(response.json().data, "--- in Block-Provider Service");
		return response.json().data;
	}

	error_handeler(error: Response | any)
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



