import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'


@Injectable()
export class loginService {
	_baseURL = this._config.getCommonBaseURL();
	_userAuthURL = this._baseURL + "user/userAuthenticate/";
	_forgotPasswordURL = this._baseURL + "user/forgetPassword/";
	admin_base_path: any;
	// newlogin = "http://l-156100778.wipro.com:8080/CommonV1/user/userAuthenticate";
	newlogin = this._baseURL + "user/userAuthenticate";
	getServiceProviderID_url: any;
	constructor(
		private _http: Http,
		private _httpInterceptor: InterceptedHttp,
		private _config: ConfigService
	) {
		this.admin_base_path = this._config.getAdminBaseUrl();
		this.getServiceProviderID_url = this.admin_base_path + "getServiceProviderid";
	}

	public authenticateUser = function (uname: any, pwd: any) {
		return this._httpInterceptor.post(this.newlogin, { 'userName': uname.toLowerCase(), 'password': pwd })
			.map(this.extractData)
			.catch(this.handleError);
	};

	getSecurityQuestions(uname: any): Observable<any> {

		return this._http.post(this._forgotPasswordURL, { 'userName': uname.toLowerCase() })
			.map(this.extractData)
			.catch(this.handleError);
	};

	getServiceProviderID(providerServiceMapID) {
		return this._http.post(this.getServiceProviderID_url, { 'providerServiceMapID': providerServiceMapID })
			.map(this.extractData)
			.catch(this.handleError);
	}

	private extractData(res: Response) {
		// console.log("inside extractData:"+JSON.stringify(res.json()));
		// let body = res.json();
		//return body.data || {};
		console.log('response in service', res);
		return res.json().data;
	};

	private handleError(error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
		return Observable.throw(error.json());
	};
};



