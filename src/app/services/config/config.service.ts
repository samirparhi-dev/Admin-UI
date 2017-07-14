import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class ConfigService
{
    // private _commonBaseURL: String = "http://l-185000861.wipro.com:9090/CommonV1/";
    // private _helpline1097BaseURL: String = "http://l-185000861.wipro.com:9090/helpline1097APIV1/";
    private _commonBaseURL: String = "http://10.152.3.152:1040/CommonV1/";
    private _helpline1097BaseURL: String = "http://10.152.3.152:1040/helpline1097API/";
    private _helpline104BaseURL: String = "http://10.152.3.152:1040/helpline104API/";

    private adminBaseUrl: String = "http://10.152.3.152:1040/adminAPI1.0/";
       
    getCommonBaseURL ()
    {
        return this._commonBaseURL;
    }
    get1097BaseURL ()
    {
        return this._helpline1097BaseURL;
    }
    get104BaseURL() {
        return this._helpline104BaseURL;
    }
    getAdminBaseUrl()
    {
        return this.adminBaseUrl;
    }
};