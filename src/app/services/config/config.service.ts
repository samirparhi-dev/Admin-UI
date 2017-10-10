import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class ConfigService {
    // private _commonBaseURL: String = "http://14.142.214.242:8080/commonapi-v1.0/";
    // private _helpline1097BaseURL: String = "http://14.142.214.242:8080/1097api-v1.0/";
    // private _helpline104BaseURL: String = "http://14.142.214.242:8080/104api-v1.0/";
    // private adminBaseUrl: String = "http://14.142.214.242:8080/adminapi-v1.0/";
    // private superadminBaseURL: String = "http://14.142.214.242:8080/adminapi-v1.0/";
    // private _commonBaseURL: String = "http://10.152.3.99:8080/commonapi-v1.0/";
    // private _helpline1097BaseURL: String = "http://10.152.3.99:8080/1097api-v1.0/";
    // private _helpline104BaseURL: String = "http://10.152.3.99:8080/104api-v1.0/";
    // private adminBaseUrl: String = "http://10.152.3.99:8080/adminapi-v1.0/";
    // private superadminBaseURL: String = "http://10.152.3.99:8080/adminapi-v1.0/";
    private _commonBaseURL: String = "http://10.152.3.99:8080/commonapi-v1.0/";
    private _helpline1097BaseURL: String = "http://10.152.3.99:8080/1097api-v1.0/";
    private _helpline104BaseURL: String = "http://10.152.3.99:8080/104api-v1.0/";
    private adminBaseUrl: String = "http://10.152.3.99:8080/adminapi-v1.0/";
    private superadminBaseURL: String = "http://10.152.3.99:8080/adminapi-v1.0/";
    // private adminBaseUrl: String = "http://10.201.44.25:8080/";
    // private superadminBaseURL: String = "http://10.201.44.25:8080/";



    getCommonBaseURL() {
        return this._commonBaseURL;
    }
    get1097BaseURL() {
        return this._helpline1097BaseURL;
    }
    get104BaseURL() {
        return this._helpline104BaseURL;
    }
    getAdminBaseUrl() {
        return this.adminBaseUrl;
    }
    getSuperAdminBaseUrl() {
        return this.superadminBaseURL;
    }
};
