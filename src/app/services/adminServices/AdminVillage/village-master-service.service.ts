import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../../config/config.service';
import { InterceptedHttp } from './../../../http.interceptor';



@Injectable()
export class VillageMasterService {

     headers = new Headers( { 'Content-Type': 'application/json' } );
     options = new RequestOptions( { headers: this.headers } );

     admin_base_url:any;
     _commonBaseURL:any;
     getAllStatesOfProvider_Url:any;
     _getStateListURL:any;
     _getDistrictListURL:any;
     _getTalukListURL:any;
     _getBlockListURL:any;
     _getBranchListURL:any;
     storeVillagesURL:any;
     deleteVillageURL:any;
     updateVillageDataURL:any;

     constructor(private _http: Http, public ConfigService: ConfigService, private httpInterceptor: InterceptedHttp) { 
        
        this.admin_base_url = this.ConfigService.getAdminBaseUrl();
        this._commonBaseURL = this.ConfigService.getCommonBaseURL();
        this._getStateListURL = this._commonBaseURL + "location/states/";
        this._getDistrictListURL = this._commonBaseURL + "location/districts/";
        this._getTalukListURL = this._commonBaseURL + "location/taluks/";
        this._getBlockListURL = this._commonBaseURL + "location/districtblocks/";
        this._getBranchListURL = this.admin_base_url + "villageMaster/get/Villages";
        this.storeVillagesURL = this.admin_base_url + "villageMaster/save/VillageDetails";
        this.deleteVillageURL = this.admin_base_url + "villageMaster/remove/village";
        this.updateVillageDataURL = this.admin_base_url + "villageMaster/update/villageData";
     }

    getStates ( countryId: number )
    {
        return this._http.get( this._getStateListURL + countryId, this.options )
            .map( this.handleSuccess )
            .catch( this.handleError );
    }

    getDistricts ( stateId: number )
    {
        return this._http.get( this._getDistrictListURL + stateId, this.options )
            .map( this.handleSuccess )
            .catch( this.handleError );

    }
    getTaluks ( districtId: number )
    {
        return this._http.get( this._getTalukListURL + districtId, this.options )
            .map( this.handleSuccess )
            .catch( this.handleError );

    }

    getBranches ( data )
    {
        return this._http.post( this._getBranchListURL, data, this.options )
            .map( this.handleSuccess )
            .catch( this.handleError );
    }

    storeVillages(data){
         return this._http.post( this.storeVillagesURL, data, this.options)
            .map( this.handleSuccess )
            .catch( this.handleError );
    }

    updateVillageStatus(data){
        return this._http.post( this.deleteVillageURL, data, this.options )
            .map( this.handleSuccess )
            .catch( this.handleError );
    }

    updateVillageData(data){
        return this._http.post( this.updateVillageDataURL, data, this.options )
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
