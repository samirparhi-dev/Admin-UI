import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class UserBeneficiaryData {
    _commonBaseURL = this._config.getCommonBaseURL();
    _getUserBeneficaryDataURL = this._commonBaseURL + "beneficiary/getRegistrationData/";

    constructor(
        private _http: SecurityInterceptedHttp,
        private _config: ConfigService,
        private _httpInterceptor: InterceptedHttp

    ) { }
    getUserBeneficaryData() {
        let data = {};
        return this._http.post(this._getUserBeneficaryDataURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    };

    private handleError(error: Response) {
        return Observable.throw(error);

    };
}
