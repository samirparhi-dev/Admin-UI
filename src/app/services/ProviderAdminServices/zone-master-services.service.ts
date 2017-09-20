import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";

@Injectable()
export class ZoneMasterService {
     headers = new Headers( { 'Content-Type': 'application/json' } );
     options = new RequestOptions( { headers: this.headers } );

     providerAdmin_Base_Url: any;
     common_Base_Url:any;

     //CRUD
     saveZonesURL:any;
     getZonesURL:any;

     saveZoneDistrictMappingURL:any;
     getZoneDistrictMappingURL:any;

     _getStateListByServiceIDURL:any;
     _getStateListURL:any;
     _getDistrictListURL:any;
     _getTalukListURL:any;
     _getBlockListURL:any;
     _getBranchListURL:any;
     _getServiceLinesURL:any;

     updateZOneStatusURL:any;
     updateZOneDistrictMappingURL:any;
     updateZoneDataURL:any;

     constructor(private http: Http,public basepaths:ConfigService) { 
          this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
          this.common_Base_Url = this.basepaths.getCommonBaseURL();

          //this.providerAdmin_Base_Url = "http://localhost:9000/";
          this.saveZonesURL = this.providerAdmin_Base_Url + "zonemaster/save/zone";
          this.getZonesURL = this.providerAdmin_Base_Url + "zonemaster/get/zones";

          this.saveZoneDistrictMappingURL = this.providerAdmin_Base_Url + "zonemaster/save/zoneDistrictMapping";
          this.getZoneDistrictMappingURL = this.providerAdmin_Base_Url + "zonemaster/get/zoneDistrictMappings";

          this.updateZOneStatusURL = this.providerAdmin_Base_Url + "zonemaster/remove/zone";
          this.updateZOneDistrictMappingURL = this.providerAdmin_Base_Url + "zonemaster/remove/zoneDistrictMapping";
          
          this.updateZoneDataURL = this.providerAdmin_Base_Url + "zonemaster/update/zoneData";

          this._getStateListByServiceIDURL = this.providerAdmin_Base_Url + "m/location/getStatesByServiceID";
          this._getStateListURL = this.common_Base_Url + "location/states/";
          this._getDistrictListURL = this.common_Base_Url + "location/districts/";
          this._getTalukListURL = this.common_Base_Url + "location/taluks/";
          this._getBlockListURL = this.common_Base_Url + "location/districtblocks/";
          this._getBranchListURL = this.common_Base_Url + "location/village/";
          this._getServiceLinesURL = this.providerAdmin_Base_Url + "getServiceline";
                    
    };

    saveZones(data){
         return this.http.post(this.saveZonesURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getZones(){
        return this.http.post(this.getZonesURL, {})
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

     saveZoneDistrictMappings(data){
         return this.http.post(this.saveZoneDistrictMappingURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getZoneDistrictMappings(){
        return this.http.post(this.getZoneDistrictMappingURL, {})
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    updateZoneStatus(data){
        return this.http.post(this.updateZOneStatusURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    updateZoneMappingStatus(data){
        return this.http.post(this.updateZOneDistrictMappingURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    updateZoneData(data){
        return this.http.post(this.updateZoneDataURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getServiceLines(){
        return this.http.post(this._getServiceLinesURL, {})
			.map(this.handleSuccess)
			.catch(this.handleError);
    }

    getStatesByServiceID(serviceID,serviceProviderID) {
		return this.http.post(this._getStateListByServiceIDURL, { "serviceID": serviceID,"serviceProviderID": serviceProviderID })
			.map(this.handleSuccess)
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