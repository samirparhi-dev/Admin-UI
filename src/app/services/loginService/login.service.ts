import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';


@Injectable()
export class loginService {
	_baseURL = this._config.getCommonBaseURL();
	_userAuthURL = this._baseURL + "user/userAuthenticate/";
	redis_session_removal_url = this._baseURL + 'user/userLogout';

	superadmin_auth_url = this._baseURL + 'user/superUserAuthenticate';
	_forgotPasswordURL = this._baseURL + "user/forgetPassword/";
	_authorisedUser = this._baseURL + 'user/getLoginResponse';
	admin_base_path: any;
	// newlogin = "http://l-156100778.wipro.com:8080/CommonV1/user/userAuthenticate";
	newlogin = this._baseURL + "user/userAuthenticate";
	getServiceProviderID_url: any;
	constructor(
		private _http: SecurityInterceptedHttp,
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
	public checkAuthorisedUser() {
		return this._httpInterceptor.post(this._authorisedUser, {})
			.map(this.extractData)
			.catch(this.handleError);
	}
	superAdminAuthenticate(uname, pwd) {
		return this._httpInterceptor.post(this.superadmin_auth_url, { 'userName': uname.toLowerCase(), 'password': pwd })
			.map(this.extractData)
			.catch(this.handleError);
	}

	removeTokenFromRedis() {
		return this._http.post(this.redis_session_removal_url, {})
			.map(this.extractData)
			.catch(this.handleError);
	}

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
		console.log("response in service", res.json());			
		if (res.json().data) {
			return res.json().data;
		} else {
			return Observable.throw(res.json());
		}
	};

	private handleError(error: Response | any) {
		console.log("http error", error);
		// In a real world app, you might use a remote logging infrastructure
		return Observable.throw(error);
	};
};



