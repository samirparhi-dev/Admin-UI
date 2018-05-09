import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

import { ConfigService } from "../config/config.service";

@Injectable()
export class ZoneMasterService {
     headers = new Headers( { 'Content-Type': 'application/json' } );

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

     constructor(private http: SecurityInterceptedHttp,public basepaths:ConfigService, private httpIntercept: InterceptedHttp) { 
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

    getZones(data){
        return this.http.post(this.getZonesURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

     saveZoneDistrictMappings(data){
         return this.http.post(this.saveZoneDistrictMappingURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getZoneDistrictMappings(data){
        return this.http.post(this.getZoneDistrictMappingURL, data)
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
        return this.http.get( this._getDistrictListURL + stateId )
            .map( this.handleSuccess )
            .catch( this.handleError );

    }
    getTaluks ( districtId: number )
    {
        return this.http.get( this._getTalukListURL + districtId )
            .map( this.handleSuccess )
            .catch( this.handleError );

    }
    getSTBs ( talukId: number )
    {
        return this.http.get( this._getBlockListURL + talukId )
            .map( this.handleSuccess )
            .catch( this.handleError );
    }

    getBranches ( blockId: number )
    {
        return this.http.get( this._getBranchListURL + blockId )
            .map( this.handleSuccess )
            .catch( this.handleError );

    }

    handleSuccess(response: Response) {
        console.log(response.json().data, "--- in zone master SERVICE");
        if (response.json().data) {
			return response.json().data;
		} else {
		    return Observable.throw(response.json());
		}
    }

    handleError(error: Response | any) {
        return Observable.throw(error);
    }

}