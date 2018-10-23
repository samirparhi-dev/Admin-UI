import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class VanServicePointMappingService {
    headers = new Headers({ 'Content-Type': 'application/json' });

    providerAdmin_Base_Url: any;
    common_Base_Url: any;

    getServiceLines_new_url: any;
    getStates_new_url: any;
    _getZonesURL: any;
    getParkingPlacesURL: any;

    saveVanServicePointMappingsURL: any;
    getVanServicePointMappingsURL: any;
    updateVanServicePointMappingsURL: any;
    getVanTypesURL: any;
    getServicePointsURL: any;

    getVansURL: any;
    _getStateListBYServiceIDURL: any;
    _getDistrictListURL: any;
    _getTalukListURL: any;


    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        /* serviceline and state */

        this.getServiceLines_new_url = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this.getStates_new_url = this.providerAdmin_Base_Url + 'm/role/stateNew';
        this._getZonesURL = this.providerAdmin_Base_Url + "zonemaster/get/zones";
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/parkingPlacesbyzoneid';
 
        this.saveVanServicePointMappingsURL = this.providerAdmin_Base_Url + "vanMaster/save/vanServicePointMappings";
        this.getVanServicePointMappingsURL = this.providerAdmin_Base_Url + "vanMaster/get/vanServicePointMappingsV1";
        this.updateVanServicePointMappingsURL = this.providerAdmin_Base_Url + "vanMaster/remove/vanServicePointMapping";
        this.getVanTypesURL = this.providerAdmin_Base_Url + "vanMaster/get/vanTypes";
        this.getServicePointsURL = this.providerAdmin_Base_Url + "servicePointMaster/get/servicePoints";

        this._getDistrictListURL = this.providerAdmin_Base_Url + '/zonemaster/getdistrictMappedtoZone';
        this._getTalukListURL = this.providerAdmin_Base_Url + '/parkingPlaceTalukMapping/getbyppidanddid/parkingPlacesTalukMapping';
        this.getVansURL = this.providerAdmin_Base_Url + "vanMaster/get/vanDetails";


    }

    getServiceLinesNew(userID) {
        return this.httpIntercept
            .post(this.getServiceLines_new_url, { 'userID': userID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }
    getStatesNew(obj) {
        return this.httpIntercept
            .post(this.getStates_new_url, obj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getZones(data) {
        return this.http.post(this._getZonesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    
    getParkingPlaces(data) {
        return this.http.post(this.getParkingPlacesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getTaluks(talukObj) {
        return this.http.post(this._getTalukListURL, talukObj)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getDistricts(zoneID) {
        return this.http.post(this._getDistrictListURL, { 'zoneID': zoneID })
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    saveVanServicePointMappings(data) {
        return this.http.post(this.saveVanServicePointMappingsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getVanServicePointMappings(data) {
        return this.http.post(this.getVanServicePointMappingsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateVanServicePointMappings(data) {
        return this.http.post(this.updateVanServicePointMappingsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }



    getVanTypes(data) {
        return this.http.post(this.getVanTypesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getVans(data) {
        return this.http.post(this.getVansURL, data)
            .map(this.handleState_n_ServiceSuccess_vans)
            .catch(this.handleError);
    }


    getServicePoints(data) {
        return this.http.post(this.getServicePointsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, "--- in zone master SERVICE");
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'role service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID == 2 || item.serviceID == 4) {
                return item;
            }
        });
        return result;
    }
    handleState_n_ServiceSuccess_vans(response: Response) {

        console.log(response.json().data, 'role service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.deleted != true) {
                return item;
            }
        });
        return result;
    }
    handleError(error: Response | any) {
        return Observable.throw(error);
    }
}