import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class EmployeeParkingPlaceMappingService {

    providerAdmin_Base_Url: any;
    common_Base_Url: any;

    saveEmployeeParkingPlaceMappingURL: any;
    getEmployeeURL: any;
    _getStateListBYServiceIDURL: any;
    _getServiceLineURL: any;
    _getDistrictListURL: any;
    getParkingPlacesURL: any;
    getDesignationsURL: any;
    getEmployeesURL: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        public httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        // this.getEmployeeURL = this.providerAdmin_Base_Url + 'm/SearchEmployeeFilter';
        this.saveEmployeeParkingPlaceMappingURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/save/userParkingPlaces';
        this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + 'm/location/getStatesByServiceID';
        this._getServiceLineURL = this.providerAdmin_Base_Url + 'm/role/service';
        this._getDistrictListURL = this.common_Base_Url + 'location/districts/';
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/parkingPlaces';
        this.getDesignationsURL = this.providerAdmin_Base_Url + 'm/getDesignation';
        this.getEmployeesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/userParkingPlaces';
    }

    getDesignations() {
        return this.http.post(this.getDesignationsURL, {})
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getEmployees(requestObject) {
        return this.http.post(this.getEmployeesURL, requestObject)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    saveEmployeeParkingPlaceMappings(data) {
        return this.http.post(this.saveEmployeeParkingPlaceMappingURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getStatesByServiceID(serviceID, serviceProviderID) {
        return this.http.post(this._getStateListBYServiceIDURL,
            { 'serviceID': serviceID, 'serviceProviderID': serviceProviderID })
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

    getParkingPlaces(data) {
        return this.http.post(this.getParkingPlacesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in employee parking place master SERVICE');
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
