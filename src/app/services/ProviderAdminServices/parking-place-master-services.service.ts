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

    // CRUD
    saveParkingPlacesURL: any;
    getParkingPlacesURL: any;
    updateParkingPlaceStatusURL: any;
    updateParkingPlaceDetailsURL: any;

    _getStateListBYServiceIDURL: any;
    _getStateListURL: any;
    _getServiceLineURL: any;
    _getDistrictListURL: any;
    _getTalukListURL: any;
    _getBlockListURL: any;
    _getBranchListURL: any;

    getServiceLines_new_url: any;
    getStates_new_url: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        this.saveParkingPlacesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/create/parkingPlaces';
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/parkingPlaces';
        this.updateParkingPlaceStatusURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/remove/parkingPlace';
        this.updateParkingPlaceDetailsURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/update/parkingPlaceDetails';

        this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + 'm/location/getStatesByServiceID';
        this._getStateListURL = this.common_Base_Url + 'location/states/';
        this._getServiceLineURL = this.providerAdmin_Base_Url + 'm/role/service';
        this._getDistrictListURL = this.common_Base_Url + 'location/districts/';
        this._getTalukListURL = this.common_Base_Url + 'location/taluks/';
        this._getBlockListURL = this.common_Base_Url + 'location/districtblocks/';
        this._getBranchListURL = this.common_Base_Url + 'location/village/';

          /* serviceline and state */

          this.getServiceLines_new_url = this.providerAdmin_Base_Url + 'm/role/serviceNew';
          this.getStates_new_url = this.providerAdmin_Base_Url + 'm/role/stateNew';
  
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
    saveParkingPlace(data) {
        return this.http.post(this.saveParkingPlacesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getParkingPlaces(data) {
        return this.http.post(this.getParkingPlacesURL, data)
            .map(this.handleState_n_ServiceSuccess_parking)
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

    getStatesByServiceID(serviceID, serviceProviderID) {
        return this.http.post(this._getStateListBYServiceIDURL, { 'serviceID': serviceID, 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getStates(serviceProviderID) {
        return this.http.post(this._getStateListURL, { 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getServices(serviceProviderID, stateID) {
        return this.http.post(this._getServiceLineURL, {
            'serviceProviderID': serviceProviderID,
            'stateID': stateID
        }).map(this.handleSuccess)
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

    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in zone master SERVICE');
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
    handleState_n_ServiceSuccess_parking(response: Response) {

        console.log(response.json().data, 'role service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.deleted !=true) {
                return item;
            }
        });
        return result;
    }

    handleError(error: Response | any) {
        return Observable.throw(error);

    }
}
