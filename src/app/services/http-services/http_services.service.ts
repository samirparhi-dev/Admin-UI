import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 29-05-2017
 * Objective: A common service for all HTTP services, just pass the URL and required DATA
 */ 

@Injectable()
export class HttpServices {

	constructor(private http: SecurityInterceptedHttp) { };

	getData(url:string)
	{
		return this.http.get(url)
				.map(this.handleGetSuccess)
				.catch(this.handleGetError);
	}

	handleGetSuccess(response:Response)
	{
		console.log(response.json());
		return response.json();
	}

	handleGetError(error: Response | any)
	{
		return Observable.throw(error.json());
	}

	postData(url:string,data:any)
	{
		return this.http.post(url,data)
				.map(this.handleGetSuccess)
				.catch(this.handleGetError);
	}
	
	
};



