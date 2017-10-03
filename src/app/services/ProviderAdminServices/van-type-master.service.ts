import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";

@Injectable()
export class VanTypeMasterService {
     headers = new Headers( { 'Content-Type': 'application/json' } );
     options = new RequestOptions( { headers: this.headers } );

     providerAdmin_Base_Url: any;
     common_Base_Url:any;

     //CRUD
     saveVanTypesURL:any;
     getVanTypesURL:any;
     updateVanTypeStatusURL:any;

     _getStateListBYServiceIDURL:any;
     _getServiceLineURL:any;

     constructor(private http: Http,public basepaths:ConfigService) { 
          this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
          this.common_Base_Url = this.basepaths.getCommonBaseURL();

          this.saveVanTypesURL = this.providerAdmin_Base_Url + "vanMaster/save/vanTypeDetails";
          this.getVanTypesURL = this.providerAdmin_Base_Url + "vanMaster/get/vanTypes";
          this.updateVanTypeStatusURL = this.providerAdmin_Base_Url + "vanMaster/remove/vanTypeDetails";

          this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + "m/location/getStatesByServiceID";
          this._getServiceLineURL = this.providerAdmin_Base_Url + "m/role/service";
     }

     saveVanType(data){
        return this.http.post(this.saveVanTypesURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
     }

     getVanTypes(data){
        return this.http.post(this.getVanTypesURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

     updateVanTypeStatus(data){
        return this.http.post(this.updateVanTypeStatusURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getStatesByServiceID(serviceID,serviceProviderID) {
		return this.http.post(this._getStateListBYServiceIDURL, { "serviceID": serviceID,"serviceProviderID": serviceProviderID })
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

	getServices(serviceProviderID,stateID) {
		return this.http.post(this._getServiceLineURL, { "serviceProviderID": serviceProviderID,
													  "stateID": stateID
													}).map(this.handleSuccess)
													.catch(this.handleError);
	}
   

    handleSuccess(response: Response) {
        console.log(response.json().data, "--- in zone master SERVICE");
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
}