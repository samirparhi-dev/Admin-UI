import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const IP = '10.208.122.38:8080';

@Injectable()
export class ConfigService {

    private _helpline1097BaseURL: String = `http://${IP}/1097api-v1.0/`;
    private adminBaseUrl: String = `http://${IP}/adminapi-v1.0/`;
    private superadminBaseURL: String = `http://${IP}/adminapi-v1.0/`;
    private _commonBaseURL: String = `http://${IP}/commonapi-v1.0/`;


    getCommonBaseURL() {
        return this._commonBaseURL;
    }
    getAdminBaseUrl() {
        return this.adminBaseUrl;
    }
    getSuperAdminBaseUrl() {
        return this.superadminBaseURL;
    }
    get1097BaseURL() {
        return this._helpline1097BaseURL;
    }
};
