import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class ServicePointMasterService {


    updateServicePointsURL: string;
    providerAdmin_Base_Url: any;
    common_Base_Url: any;

    // CRUD
    saveServicePointsURL: any;
    getServicePointsURL: any;
    updateServicePointStatusURL: any;
    getParkingPlacesURL: any;

    _getStateListBYServiceIDURL: any;
    _getStateListURL: any;
    _getServiceLineURL: any;
    _getDistrictListURL: any;
    _getTalukListURL: any;
    _getBlockListURL: any;
    _getBranchListURL: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        this.saveServicePointsURL = this.providerAdmin_Base_Url + 'servicePointMaster/create/servicePoints';
        this.getServicePointsURL = this.providerAdmin_Base_Url + 'servicePointMaster/get/servicePoints';
        this.updateServicePointStatusURL = this.providerAdmin_Base_Url + 'servicePointMaster/remove/servicePoint';
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/parkingPlaces';

        this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + 'm/location/getStatesByServiceID';
        this._getStateListURL = this.providerAdmin_Base_Url + 'm/role/stateNew';
        this._getServiceLineURL = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this._getDistrictListURL = this.common_Base_Url + 'location/districts/';
        this._getTalukListURL = this.common_Base_Url + 'location/taluks/';
        this._getBlockListURL = this.common_Base_Url + 'location/districtblocks/';
        this._getBranchListURL = this.common_Base_Url + 'location/village/';
        this.updateServicePointsURL = this.providerAdmin_Base_Url + '/servicePointMaster/edit/servicePoint';
    }

    saveServicePoint(data) {
        return this.http.post(this.saveServicePointsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateServicePoint(data) {
        return this.http.post(this.updateServicePointsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getServicePoints(data) {
        return this.http.post(this.getServicePointsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateServicePointStatus(data) {
        return this.http.post(this.updateServicePointStatusURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getParkingPlaces(data) {
        return this.http.post(this.getParkingPlacesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }


    getStatesByServiceID(serviceID, serviceProviderID) {
        return this.http.post(this._getStateListBYServiceIDURL,
            { 'serviceID': serviceID, 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    // getStates(serviceProviderID) {
    //     return this.http.post(this._getStateListURL,
    //         { 'serviceProviderID': serviceProviderID })
    //         .map(this.handleSuccess)
    //         .catch(this.handleError);
    // }
    getStates(userID, serviceID, isNationalFlag) {
        return this.http.post(this._getStateListURL,
            {
                'userID': userID,
                'serviceID': serviceID,
                'isNational': isNationalFlag
            }).map(this.handleSuccess)
            .catch(this.handleError);
    }

    // getServices(serviceProviderID, stateID) {
    //     return this.http.post(this._getServiceLineURL, {
    //         'serviceProviderID': serviceProviderID,
    //         'stateID': stateID
    //     }).map(this.handleSuccess)
    //         .catch(this.handleError);
    // }
    getServices(userID) {
        return this.httpIntercept.post(this._getServiceLineURL, { 'userID': userID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }
    getDistricts(stateId: number) {
        return this.http.get(this._getDistrictListURL + stateId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getTaluks(districtId: number) {
        return this.http.get(this._getTalukListURL + districtId)
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
    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'service point file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceName == "MMU") {
                return item;
            }
        });
        return result;
    }


    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in service point master SERVICE');
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
