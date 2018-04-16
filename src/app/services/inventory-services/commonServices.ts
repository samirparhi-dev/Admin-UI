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
    getStatesUrl: any;



    constructor(private http: SecurityInterceptedHttp,
		public basepaths: ConfigService,
		private httpIntercept: InterceptedHttp) {
            this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
            this.getStatesUrl = this.adminBaseUrl+ 'm/role/state';
        };

        getStates(serviceProviderID) {
            return this.http
            .post(this.getStatesUrl, {'serviceProviderID': serviceProviderID})
            .map(this.extractData)
            .catch(this.handleError)
        }




        private extractCustomData(res: Response) {
            if (res.json().data) {
                console.log('Item master service', res.json().data);
                return res.json().data;
            } else {
                return Observable.throw(res.json());
            }
        }
        private extractData(res: Response) {
            if (res.json().data && res.json().statusCode == 200) {
                console.log('Item master service', res.json(), res.json().data);
                return res.json().data;
            } else {
                return Observable.throw(res.json());
            }
        }
        private handleCustomError(error: Response | any) {
            return Observable.throw(error.json());
        }
        private handleError(error: Response | any) {
            return Observable.throw(error.json());
        }
}