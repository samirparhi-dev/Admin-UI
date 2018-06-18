import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class ManufacturemasterService {
    admin_Base_Url: any;
    common_Base_Url: any;
    get_manufacture_Url: any;
    save_manufacture_Url: any;
    update_manufacture_Url:any;
    delete_manufacture_Url:any;
    getAll_Districts_Url: any;
    getAll_State_Url: any;
    getAll_Country: any;

    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();
        this.get_manufacture_Url = this.admin_Base_Url + 'getManufacturer';
        this.save_manufacture_Url=this.admin_Base_Url + 'createManufacturer';
        this.update_manufacture_Url=this.admin_Base_Url + 'editManufacturer';
        this.delete_manufacture_Url=this.admin_Base_Url + 'deleteManufacturer';
        this.getAll_Districts_Url = this.common_Base_Url + 'location/districts/';
        this.getAll_State_Url = this.common_Base_Url + 'location/states/';
        this.getAll_Country = this.common_Base_Url + 'location/getCountries';
    };

    getAllManufacture(providerServiceMapID) {
        return this.http.post(this.get_manufacture_Url, { "providerServiceMapID": providerServiceMapID }
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    
    saveManufacture(obj) {
        return this.http.post(this.save_manufacture_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateManufacture(obj){
        return this.http.post(this.update_manufacture_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    deleteManufacture(obj){
        return this.http.post(this.delete_manufacture_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    getAllDistricts(stateID) {
        return this.http
            .get(this.getAll_Districts_Url + stateID)
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    getAllStates(countryID) {
        return this.http
            .get(this.getAll_State_Url + countryID)
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    getAllCountry() {
        return this.http
            .get(this.getAll_Country)
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }
    handleSuccess(res: Response) {
        console.log(res.json().data, 'Manufacture file success response');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
}