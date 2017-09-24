import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";

@Injectable()
export class ServicePointVillageMapService {
     headers = new Headers( { 'Content-Type': 'application/json' } );
     options = new RequestOptions( { headers: this.headers } );

     providerAdmin_Base_Url: any;
     common_Base_Url:any;

     //CRUD
     saveServicePointVillageMapsURL:any;
     getServicePointVillageMapsURL:any;
     updateServicePointVillageMapStatusURL:any;
     getServicePointsURL:any;
     getParkingPlacesURL:any;

     _getStateListBYServiceIDURL:any;
     _getStateListURL:any;
     _getServiceLineURL:any;
     _getDistrictListURL:any;
     _getTalukListURL:any;
     _getBlockListURL:any;
     _getBranchListURL:any;

     constructor(private http: Http,public basepaths:ConfigService) { 
          this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
          this.common_Base_Url = this.basepaths.getCommonBaseURL();

          this.saveServicePointVillageMapsURL =  this.providerAdmin_Base_Url + "servicePointMaster/create/servicePointVillageMaps";
          this.getServicePointVillageMapsURL =  this.providerAdmin_Base_Url + "servicePointMaster/get/servicePointVillageMaps";
          this.updateServicePointVillageMapStatusURL =  this.providerAdmin_Base_Url + "servicePointMaster/remove/servicePointVillageMap";
          this.getServicePointsURL = this.providerAdmin_Base_Url + "servicePointMaster/get/servicePoints";
          this.getParkingPlacesURL = this.providerAdmin_Base_Url + "parkingPlaceMaster/get/parkingPlaces";

          this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + "m/location/getStatesByServiceID";
          this._getStateListURL = this.common_Base_Url + "location/states/";
          this._getServiceLineURL = this.providerAdmin_Base_Url + "m/role/service";
          this._getDistrictListURL = this.common_Base_Url + "location/districts/";
          this._getTalukListURL = this.common_Base_Url + "location/taluks/";
          this._getBlockListURL = this.common_Base_Url + "location/districtblocks/";
          this._getBranchListURL = this.common_Base_Url + "location/village/";
     }

     saveServicePointVillageMaps(data){
        return this.http.post(this.saveServicePointVillageMapsURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
     }

      getServicePointVillageMaps(data){
        return this.http.post(this.getServicePointVillageMapsURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

     updateServicePointVillageMapStatus(data){
        return this.http.post(this.updateServicePointVillageMapStatusURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getServicePoints(data){
         return this.http.post(this.getServicePointsURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
     }
    getParkingPlaces(data){
         return this.http.post(this.getParkingPlacesURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
     }


    getStatesByServiceID(serviceID,serviceProviderID) {
		return this.http.post(this._getStateListBYServiceIDURL, { "serviceID": serviceID,"serviceProviderID": serviceProviderID })
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

    getStates(serviceProviderID) {
		return this.http.post(this._getStateListURL, { "serviceProviderID": serviceProviderID })
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
    getTaluks ( districtId: number )
    {
        return this.http.get( this._getTalukListURL + districtId, this.options )
            .map( this.handleSuccess )
            .catch( this.handleError );

    }
    getSTBs ( talukId: number )
    {
        return this.http.get( this._getBlockListURL + talukId, this.options )
            .map( this.handleSuccess )
            .catch( this.handleError );
    }

    getBranches ( blockId: number )
    {
        return this.http.get( this._getBranchListURL + blockId, this.options )
            .map( this.handleSuccess )
            .catch( this.handleError );

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