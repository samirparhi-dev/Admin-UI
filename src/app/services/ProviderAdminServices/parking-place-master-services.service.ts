import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class ParkingPlaceMasterService {

    providerAdmin_Base_Url: any;
    common_Base_Url: any;

    getServiceLines_new_url: any;
    getStates_new_url: any;
    _getZonesURL: any;
    getParkingPlacesURL: any;

    // CRUD - parking place master
    saveParkingPlacesURL: any;
    updateParkingPlaceStatusURL: any;
    updateParkingPlaceDetailsURL: any;

    /*Parking place - Sub-District Mapping*/
    _getDistrictListURL: any;
    _getTalukListURL: any;
    filterMappedTaluks_url: any;
    getAllParkingPlaceSubDistrictMapping_url: any;
    saveParkingPlaceSubDistrictMapping_url: any;
    mappingActivationDeactivation_url: any;
    updateTalukMapping_url: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        /* common serviceline and state */

        this.getServiceLines_new_url = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this.getStates_new_url = this.providerAdmin_Base_Url + 'm/role/stateNew';
        this._getZonesURL = this.providerAdmin_Base_Url + "zonemaster/get/zones";

        /* parking place master*/

        this.saveParkingPlacesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/create/parkingPlaces';
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/parkingPlacesbyzoneid';
        this.updateParkingPlaceStatusURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/remove/parkingPlace';
        this.updateParkingPlaceDetailsURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/update/parkingPlaceDetails';

        /* Parking place- taluk/sub-district mapping services*/

        this.getAllParkingPlaceSubDistrictMapping_url = this.providerAdmin_Base_Url + '/parkingPlaceTalukMapping/getall/parkingPlacesTalukMapping';
        this._getDistrictListURL = this.providerAdmin_Base_Url + '/zonemaster/getdistrictMappedtoZone';
        this._getTalukListURL = this.common_Base_Url + 'location/taluks/';
        this.saveParkingPlaceSubDistrictMapping_url = this.providerAdmin_Base_Url + '/parkingPlaceTalukMapping/create/parkingPlacesTalukMapping';
        this.mappingActivationDeactivation_url = this.providerAdmin_Base_Url + '/parkingPlaceTalukMapping/activate/parkingPlacesTalukMapping';
        this.updateTalukMapping_url = this.providerAdmin_Base_Url + '/parkingPlaceTalukMapping/update/parkingPlacesTalukMapping';
        this.filterMappedTaluks_url = this.providerAdmin_Base_Url + 'parkingPlaceTalukMapping/get/unmappedtaluk';
    }
    /*common services*/
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
    /* End common services*/

    /* parking place master services*/
    saveParkingPlace(data) {
        return this.http.post(this.saveParkingPlacesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getParkingPlaces(data) {
        return this.http.post(this.getParkingPlacesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateParkingPlaceStatus(data) {
        return this.http.post(this.updateParkingPlaceStatusURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateParkingPlaceDetails(data) {
        return this.http.post(this.updateParkingPlaceDetailsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    /* End parking place master*/


    /* Parking place- taluk/sub-district mapping services*/

    getAllParkingPlaceSubDistrictMapping(mappedReqObj) {
        return this.http
            .post(this.getAllParkingPlaceSubDistrictMapping_url, mappedReqObj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getDistricts(zoneID) {
        return this.http.post(this._getDistrictListURL, { 'zoneID': zoneID })
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getTaluks(districtID) {
        return this.http.get(this._getTalukListURL + districtID)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    filterMappedTaluks(unmappedObject) {
        return this.httpIntercept
            .post(this.filterMappedTaluks_url, unmappedObject)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    saveParkingPlaceSubDistrictMapping(reqObj) {
        return this.http
            .post(this.saveParkingPlaceSubDistrictMapping_url, reqObj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateTalukMapping(updateObj) {
        return this.http
            .post(this.updateTalukMapping_url, updateObj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    mappingActivationDeactivation(activateObj) {
        return this.http
            .post(this.mappingActivationDeactivation_url, activateObj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in parking place SERVICE');
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
            if (item.serviceName === "MMU") {
                return item;
            }
        });
        return result;
    }


    handleError(error: Response | any) {
        return Observable.throw(error);

    }
}
