import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";

@Injectable()
export class VanServicePointMappingService {
     headers = new Headers( { 'Content-Type': 'application/json' } );
     options = new RequestOptions( { headers: this.headers } );

     providerAdmin_Base_Url: any;
     common_Base_Url:any;

     saveVanServicePointMappingsURL:any;
     getVanServicePointMappingsURL:any;
     updateVanServicePointMappingsURL:any;
     getVanTypesURL:any;
     getParkingPlacesURL:any;
     getServicePointsURL:any;

     getVansURL:any;
    _getStateListBYServiceIDURL:any;
    _getServiceLineURL:any;
    _getDistrictListURL:any;

    constructor(private http: Http,public basepaths:ConfigService) { 
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        this.saveVanServicePointMappingsURL = this.providerAdmin_Base_Url + "vanMaster/save/vanServicePointMappings";
        this.getVanServicePointMappingsURL = this.providerAdmin_Base_Url + "vanMaster/get/vanServicePointMappings";
        this.updateVanServicePointMappingsURL = this.providerAdmin_Base_Url + "vanMaster/remove/vanServicePointMapping";
        this.getVanTypesURL = this.providerAdmin_Base_Url + "vanMaster/get/vanTypes";
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + "parkingPlaceMaster/get/parkingPlaces";
        this.getServicePointsURL = this.providerAdmin_Base_Url + "servicePointMaster/get/servicePoints";

        this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + "m/location/getStatesByServiceID";
        this._getServiceLineURL = this.providerAdmin_Base_Url + "m/role/service";
        this._getDistrictListURL = this.common_Base_Url + "location/districts/";
        this.getVansURL = this.providerAdmin_Base_Url + "vanMaster/get/vanDetails";
    }

    saveVanServicePointMappings(data){
        return this.http.post(this.saveVanServicePointMappingsURL, data)
			.map(this.handleSuccess)
			.catch(this.handleError);
    }

    getVanServicePointMappings(data){
        return this.http.post(this.getVanServicePointMappingsURL, data)
			.map(this.handleSuccess)
			.catch(this.handleError);
    }

    updateVanServicePointMappings(data){
        return this.http.post(this.updateVanServicePointMappingsURL, data)
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

    getDistricts ( stateId: number )
    {
        return this.http.get( this._getDistrictListURL + stateId, this.options )
            .map( this.handleSuccess )
            .catch( this.handleError );

    }

    getVanTypes(data){
        return this.http.post(this.getVanTypesURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getVans(data){
         return this.http.post(this.getVansURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getParkingPlaces(data){
        return this.http.post(this.getParkingPlacesURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getServicePoints(data){
         return this.http.post(this.getServicePointsURL, data)
        .map(this.handleSuccess)
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