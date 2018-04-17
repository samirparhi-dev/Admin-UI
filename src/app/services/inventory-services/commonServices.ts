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
            this.getStatesUrl = this.adminBaseUrl+ 'm/role/stateNew';
        };

        getServiceLines(userID) {
            return this.http
            .post(this.getServiceLinesUrl, { 'userID': userID })
                .map(this.extractData)
                .catch(this.handleError);
        }
        getStatesOnServices(obj) {
            return this.http
            .post(this.getStatesUrl, obj)
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