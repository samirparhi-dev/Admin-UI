/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class CommonServices {
    adminBaseUrl: any;
    getServiceLinesUrl: any;
    getStatesUrl: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
        this.getServiceLinesUrl = this.adminBaseUrl + 'm/role/serviceNew';
        this.getStatesUrl = this.adminBaseUrl + 'm/role/stateNew';
    };
    /*
    * Servicelines based on service provider ID
    */

    getServiceLines(userID) {
        return this.http.post(this.getServiceLinesUrl,
            {
                'userID': userID

            }).map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }
     /*
    * States based on service lines and service provider 
    */

    getStatesOnServices(userID, serviceID, isNational) {
        return this.http.post(this.getStatesUrl,
            {
                'userID': userID,
                'serviceID': serviceID,
                'isNational': isNational
            })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    /*
    * Success and Error Handlers
    */

    handleSuccess(res: Response) {
        console.log(res.json().data, 'state success response');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'service line success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID == 2 || item.serviceID == 4) {
                return item;
            }
        });
        return result;
    }

    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }

}