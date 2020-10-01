import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

const adminIP = environment.adminIP;
const commonIP = environment.commonIP;

@Injectable()
export class ConfigService {

    private adminBaseUrl: String = `${adminIP}adminapi-v1.0/`;
    // private adminBaseUrl: String = `http://localhost:8082/`;
    private superadminBaseURL: String = `${adminIP}adminapi-v1.0/`;
    private _commonBaseURL: String = `${commonIP}commonapi-v1.0/`;

    getCommonBaseURL() {
        return this._commonBaseURL;
    }
    getAdminBaseUrl() {
        return this.adminBaseUrl;
    }
    getSuperAdminBaseUrl() {
        return this.superadminBaseURL;
    }
};
