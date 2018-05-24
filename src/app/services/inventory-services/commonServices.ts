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
        debugger;
        result = response.json().data.filter(function (item) {
            if (item.serviceID != 1 && item.serviceID != 3) {
                return item;
            }
        });
        return result;
    }

    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }

}