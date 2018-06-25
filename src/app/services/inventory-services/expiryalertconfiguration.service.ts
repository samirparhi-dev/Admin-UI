import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class ExpiryAlertConfigurationService {
    admin_Base_Url: any;
    common_Base_Url: any;
    getItemsCategoryUrl: any;

    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();
    };

    getAllItemsCategory(serviceMapID, flag) {
        console.log("serviceMapID", serviceMapID, flag);
        this.getItemsCategoryUrl = this.admin_Base_Url + 'getItemCategory/' + serviceMapID + '/' + flag;
        return this.http
            .get(this.getItemsCategoryUrl)
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }
    handleSuccess(res: Response) {
        console.log(res.json().data, 'Expiry Date Alert file success response');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
}