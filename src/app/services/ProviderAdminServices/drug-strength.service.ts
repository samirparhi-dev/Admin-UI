import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class DrugStrengthService {
    adminBaseUrl: any;
    commonbaseurl: any;
    getDrugStrengthUrl: any;
    saveDrugStrengthUrl: any;
    updateDrugStrengthUrl: any;
    drugStrengthActivationDeactivationUrl: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
        this.commonbaseurl = this.basepaths.getCommonBaseURL();
        this.getDrugStrengthUrl = this.adminBaseUrl + '/getDrugStrangth';
        this.saveDrugStrengthUrl = this.adminBaseUrl + '/createDrugStrangth';
        this.updateDrugStrengthUrl = this.adminBaseUrl + '/updateDrugStrangth';
        this.drugStrengthActivationDeactivationUrl = this.adminBaseUrl + '/deleteDrugStrangth';
    }

    getDrugStrength() {
        return this.http
            .post(this.getDrugStrengthUrl, {})
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveDrugStrength(reqObj) {
        return this.http
            .post(this.saveDrugStrengthUrl, reqObj)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateDrugStrength(updateObj) {
        return this.http
            .post(this.updateDrugStrengthUrl, updateObj)
            .map(this.extractData)
            .catch(this.handleError);
    }
    drugStrengthActivationDeactivation(toggleObj) {
        return this.http
            .post(this.drugStrengthActivationDeactivationUrl, toggleObj)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        if (res.json().data && res.json().statusCode == 200) {
            console.log('drug strength response', res.json(), res.json().data);
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
    handleError(error: Response | any) {
        return Observable.throw(error.json());

    }
}
