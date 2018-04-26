import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class PharmacologicalMasterService {
    adminBaseUrl: any;
    getPharmacologyListUrl: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
    };

    getAllPharmacologyList(providerServiceMapID) {       
        this.getPharmacologyListUrl = this.adminBaseUrl + 'getPharmacologicalcategory';        
        return this.http
            .post(this.getPharmacologyListUrl , {"providerServiceMapID": providerServiceMapID})
            .map(this.extractData)
            .catch(this.handleError)

    }




    private extractCustomData(res: Response) {
        if (res.json().data) {
            console.log('Pharmacology Category Master Custom Service', res.json().data);
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
        private extractData(res: Response) {
        if (res.json().data && res.json().statusCode == 200) {
            console.log('Pharmacology Category Master Service', res.json(), res.json().data);
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