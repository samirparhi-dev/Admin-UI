import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class SuppliermasterService {
    admin_Base_Url: any;
    common_Base_Url: any;
    get_State_Url: any;
    get_Service_Url: any;
    get_supplier_Url: any;
    getAll_Districts_Url: any;
    delete_supplier_Url: any;
    save_supplier_Url: any;
    update_supplier_Url: any;
    getAll_State_Url: any;
    getAll_Country:any;

    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();
        this.get_State_Url = this.admin_Base_Url + 'm/role/stateNew';
        this.get_Service_Url = this.admin_Base_Url + 'm/role/serviceNew';
        this.get_supplier_Url = this.admin_Base_Url + 'getSupplier';
        this.getAll_Districts_Url = this.common_Base_Url + 'location/districts/';
        this.delete_supplier_Url = this.admin_Base_Url + 'deleteSupplier';
        this.save_supplier_Url = this.admin_Base_Url + 'createSupplier';
        this.update_supplier_Url = this.admin_Base_Url + 'editSupplier';
        this.getAll_State_Url = this.common_Base_Url + 'location/states/';
        this.getAll_Country = this.common_Base_Url + 'location/getCountries';
    };
    getServices(userID) {
        return this.http.post(this.get_Service_Url,
            {
                'userID': userID

            }).map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }
    getStates(userID, serviceID, isNational) {
        return this.http.post(this.get_State_Url,
            {
                'userID': userID,
                'serviceID': serviceID,
                'isNational': isNational
            })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getAllSuppliers(providerServiceMapID) {
        return this.http.post(this.get_supplier_Url, { "providerServiceMapID": providerServiceMapID }
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    getAllDistricts(stateID) {
        return this.http
            .get(this.getAll_Districts_Url + stateID)
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    getAllStates() {
        return this.http
            .get(this.getAll_State_Url + 1)
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    getAllCountry() {
        return this.http
            .get(this.getAll_Country)
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    deleteSupplier(deleteObj) {
        return this.http.post(this.delete_supplier_Url, deleteObj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    saveSupplier(obj) {
        return this.http.post(this.save_supplier_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateSupplier(obj) {
        return this.http.post(this.update_supplier_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    handleSuccess(res: Response) {
        console.log(res.json().data, 'Main Stores file success response');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'Main Stores service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID != 1) {
                return item;
            }
        });
        return result;
    }
    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }
}