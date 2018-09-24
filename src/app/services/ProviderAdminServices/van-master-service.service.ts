import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class VanMasterService {
    headers = new Headers({ 'Content-Type': 'application/json' });

    providerAdmin_Base_Url: any;
    common_Base_Url: any;

    //CRUD
    saveVansURL: any;
    getVansURL: any;
    updateVanStatusURL: any;
    updateVanURL: any;
    getVanTypesURL: any;
    getParkingPlacesURL: any;

    _getStateListBYServiceIDURL: any;
    _getStateListURL: any;
    _getServiceLineURL: any;
    _getDistrictListURL: any;
    _getTalukListURL: any;
    _getBlockListURL: any;
    _getBranchListURL: any;

    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        this.saveVansURL = this.providerAdmin_Base_Url + "vanMaster/save/vanDetails";
        this.getVansURL = this.providerAdmin_Base_Url + "vanMaster/get/vanDetails";
        this.updateVanURL = this.providerAdmin_Base_Url + "vanMaster/update/vanDetails";
        this.updateVanStatusURL = this.providerAdmin_Base_Url + "vanMaster/remove/vanDetails";
        this.getVanTypesURL = this.providerAdmin_Base_Url + "vanMaster/get/vanTypes";
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + "parkingPlaceMaster/get/parkingPlaces";

        this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + "m/location/getStatesByServiceID";
        this._getStateListURL = this.common_Base_Url + "location/states/";
        this._getServiceLineURL = this.providerAdmin_Base_Url + "m/role/service";
        this._getDistrictListURL = this.providerAdmin_Base_Url + "/zonemaster/getdistrictMappedtoZone";
        this._getTalukListURL = this.providerAdmin_Base_Url + "/parkingPlaceTalukMapping/getbyppidanddid/parkingPlacesTalukMapping";
        this._getBlockListURL = this.common_Base_Url + "location/districtblocks/";
        this._getBranchListURL = this.common_Base_Url + "location/village/";
    }

    saveVan(data) {
        return this.http.post(this.saveVansURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getVans(data) {
        return this.http.post(this.getVansURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateVanStatus(data) {
        return this.http.post(this.updateVanStatusURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateVanData(data) {
        return this.http.post(this.updateVanURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getVanTypes() {
        return this.http.post(this.getVanTypesURL, {})
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getParkingPlaces(data) {
        return this.http.post(this.getParkingPlacesURL, data)
            .map(this.handleState_n_ServiceSuccess_parking)
            .catch(this.handleError);
    }


    getStatesByServiceID(serviceID, serviceProviderID) {
        return this.http.post(this._getStateListBYServiceIDURL, { "serviceID": serviceID, "serviceProviderID": serviceProviderID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getStates(serviceProviderID) {
        return this.http.post(this._getStateListURL, { "serviceProviderID": serviceProviderID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getServices(serviceProviderID, stateID) {
        return this.http.post(this._getServiceLineURL, {
            "serviceProviderID": serviceProviderID,
            "stateID": stateID
        }).map(this.handleSuccess)
            .catch(this.handleError);
    }

    getDistricts(zoneID) {
        return this.http.post(this._getDistrictListURL, { 'zoneID': zoneID })
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getTaluks(talukObj) {
        return this.http.post(this._getTalukListURL, talukObj)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getSTBs(talukId: number) {
        return this.http.get(this._getBlockListURL + talukId)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getBranches(blockId: number) {
        return this.http.get(this._getBranchListURL + blockId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    handleState_n_ServiceSuccess_parking(response: Response) {

        console.log(response.json().data, 'role service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.deleted != true) {
                return item;
            }
        });
        return result;
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, "--- in zone master SERVICE");
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }
}