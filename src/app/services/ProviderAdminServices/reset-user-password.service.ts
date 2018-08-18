import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class ResetUserPasswordService {
    adminBaseUrl: any;
    commonbaseurl: any;
    getUserListUrl: any;


    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
        this.commonbaseurl = this.basepaths.getCommonBaseURL();
        this.getUserListUrl = this.adminBaseUrl + 'm/SearchEmployee4';

    }


    getUserList(serviceProviderID) {
        return this.http
            .post(this.getUserListUrl, { 'serviceProviderID': serviceProviderID })
            .map(this.handleState_n_username)
            .catch(this.handleError);
    }

    handleState_n_username(response: Response) {

        console.log(response.json().data, 'username success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.deleted === false) {
                return item;
            }
        });
        return result;
    }

    handleError(error: Response | any) {
        return Observable.throw(error.json());

    }
}
