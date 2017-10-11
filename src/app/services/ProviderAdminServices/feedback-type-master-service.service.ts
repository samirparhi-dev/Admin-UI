import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from "../config/config.service";



@Injectable()
export class FeedbackTypeService {

	providerAdmin_Base_Url: any;
    getStates_url: any;
    getServiceLines_url: any;
    getFeedbackTypes_url: any;
    deleteFeedback_url: any;
    editFeedback_url: any;
    saveFeedback_url: any;
	getFeedbackNaturesTypes_url: any;
	deleteFeedbackNatureType_url: any;
	saveFeedbackNatureType_url: any;
	editFeedbackNatureType_url: any;

	constructor(private http: Http,public basepaths:ConfigService, private httpIntercept: InterceptedHttp) { 
		this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();

		this.getStates_url = this.providerAdmin_Base_Url + "m/location/state";
		this.getServiceLines_url = this.providerAdmin_Base_Url + "m/location/service";
        this.getFeedbackTypes_url = this.providerAdmin_Base_Url + "m/getFeedbackType";
        this.deleteFeedback_url = this.providerAdmin_Base_Url + "m/deleteFeedbackType";
        this.saveFeedback_url = this.providerAdmin_Base_Url + "m/saveFeedbackType";
        this.editFeedback_url = this.providerAdmin_Base_Url + "m/editFeedbackType";
		this.getFeedbackNaturesTypes_url = this.providerAdmin_Base_Url + "m/getFeedbackNatureType";
		this.deleteFeedbackNatureType_url = this.providerAdmin_Base_Url + "m/deleteFeedbackNatureType";
		this.saveFeedbackNatureType_url = this.providerAdmin_Base_Url + "m/createFeedbackNatureType";
		this.editFeedbackNatureType_url = this.providerAdmin_Base_Url + "m/editFeedbackNatureType";
	};

	getStates(serviceProviderID) {
		return this.http.post(this.getStates_url, { "serviceProviderID": serviceProviderID })
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	getServiceLines(serviceProviderID, stateID) {
		return this.httpIntercept.post(this.getServiceLines_url, { "serviceProviderID": serviceProviderID, "stateID": stateID })
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

    getFeedbackTypes(data){
        // console.log(data,"reqObj");
        return this.httpIntercept.post(this.getFeedbackTypes_url, data)
		.map(this.handleSuccess)
		.catch(this.handleError);
    }

    saveFeedback(data){
        return this.httpIntercept.post(this.saveFeedback_url, data)
		.map(this.handleSuccess)
		.catch(this.handleError);
    }

    deleteFeedback(data){
        return this.httpIntercept.post(this.deleteFeedback_url, data)
		.map(this.handleSuccess)
		.catch(this.handleError);
    }

    editFeedback(data){
        return this.httpIntercept.post(this.editFeedback_url, data)
		.map(this.handleSuccess)
		.catch(this.handleError);
    }


	getFeedbackNatureTypes(data){
		return this.httpIntercept.post(this.getFeedbackNaturesTypes_url, data)
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	deleteFeedbackNatureType(data){
		return this.httpIntercept.post(this.deleteFeedbackNatureType_url, data)
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	saveFeedbackNatureType(data){
		return this.httpIntercept.post(this.saveFeedbackNatureType_url, data)
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	editFeedbackNatureType(data){
		return this.httpIntercept.post(this.editFeedbackNatureType_url, data)
		.map(this.handleSuccess)
		.catch(this.handleError);
	}

	handleSuccess(response: Response) {
		console.log(response.json().data, "--- in feedback-type-master-service");
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