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
    getUserDetailUrl: any;
    resetUserPasswordUrl: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
        this.commonbaseurl = this.basepaths.getCommonBaseURL();
        this.getUserListUrl = this.adminBaseUrl + 'm/SearchEmployee4';
        this.getUserDetailUrl = this.adminBaseUrl + '/m/FindEmployeeDetailsByUserName';
        this.resetUserPasswordUrl = this.adminBaseUrl + '/m/ResetUserPassword';
    }

    getUserList(serviceProviderID) {
        return this.http
            .post(this.getUserListUrl, { 'serviceProviderID': serviceProviderID })
            .map(this.handleState_n_username)
            .catch(this.handleError);
    }
    getUserDetail(userName) {
        return this.http
            .post(this.getUserDetailUrl, { 'userName': userName })
            .map(this.extractData)
            .catch(this.handleError);
    }
    resetUserPassword(resetObject) {
        return this.http
            .post(this.resetUserPasswordUrl, resetObject)
            .map(this.extractData)
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
    private extractData(res: Response) {
        if (res.json().data && res.json().statusCode == 200) {
            console.log('reset user password', res.json(), res.json().data);
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
    handleError(error: Response | any) {
        return Observable.throw(error.json());

    }
}
