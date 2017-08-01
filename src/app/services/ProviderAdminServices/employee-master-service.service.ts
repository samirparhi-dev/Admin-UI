import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 24-07-2017
 * Objective: # A service which would handle the creation of employees and their
               role provisioning
                */
@Injectable()
    export class EmployeeMasterService {

        providerAdmin_Base_Url: any;
        

        constructor(private http: Http,public basepaths:ConfigService) { 
            this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();

        };

        

        handleSuccess(response: Response) {
            console.log(response.json().data, "--- in employee master SERVICE");
            return response.json().data;
        }

        handleError(error: Response | any) {
            let errMsg: string;
            if (error instanceof Response) {
                const body = error.json() || '';
                const err = body.error || JSON.stringify(body);
                errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            } else {
                errMsg = error.message ? error.message : error.toString();
            }
            console.error(errMsg);
            return Observable.throw(errMsg);
        }
};



