import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class SwymedUserConfigurationService {

    providerAdmin_base_url: any;
    getMappedUserDetails: any;

    constructor(private http: InterceptedHttp,
        public basePaths: ConfigService,
        private httpSecurity: SecurityInterceptedHttp) {

        this.providerAdmin_base_url = this.basePaths.getAdminBaseUrl();
        this.getMappedUserDetails = this.providerAdmin_base_url + '/swymed/getmappedUsers/';
    }

    getSwymedUserDetails(serviceProviderID) {
        return this.httpSecurity
            .post(this.getMappedUserDetails, { 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess)
            .catch(this.handleError)
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in swymed user config service ');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleError(error: Response | any) {
        return Observable.throw(error);

    }
}