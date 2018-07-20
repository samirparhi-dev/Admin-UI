import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class EmailConfigurationService {
    adminBaseUrl: any;
    commonBaseUrl: any;
    getMailConfigUrl: any;
    getServiceLinesUrl: any;
    getStatesUrl: any;
    getDistrictURL: any;
    getInstituteTypesUrl: any;
    getDesignationsUrl: any;
    getTalukUrl: any;
    saveMailConfigUrl: any;
    updateMailConfigUrl: any;



    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
        this.commonBaseUrl = this.basepaths.getCommonBaseURL();
        this.getMailConfigUrl = this.adminBaseUrl + '/getEmailConfigs';
        this.getServiceLinesUrl = this.adminBaseUrl + 'm/role/serviceNew';
        this.getStatesUrl = this.adminBaseUrl + 'm/role/stateNew';
        this.getDistrictURL = this.commonBaseUrl + 'location/districts/';
        this.getInstituteTypesUrl = this.commonBaseUrl + '/institute/getInstituteTypes';
        this.getDesignationsUrl = this.commonBaseUrl + '/institute/getDesignations';
        this.getTalukUrl = this.commonBaseUrl + 'location/taluks/';
        this.saveMailConfigUrl = this.adminBaseUrl + '/saveConfig';
        this.updateMailConfigUrl = this.adminBaseUrl + '/updateEmailConfig';

    }
    getMailConfig(data) {
        return this.http.post(this.getMailConfigUrl, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getServiceLines(userID) {
        return this.httpIntercept.post(this.getServiceLinesUrl, { 'userID': userID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getStates(obj) {
        return this.httpIntercept.post(this.getStatesUrl, obj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getDistricts(stateId: number) {
        return this.http.get(this.getDistrictURL + stateId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getAllDesignations() {
        return this.http
            .get(this.getDesignationsUrl, {})
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    getTaluks(districtID) {
        return this.httpIntercept.get(this.getTalukUrl + districtID)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    saveMailConfig(data) {
        return this.httpIntercept.post(this.saveMailConfigUrl, data)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    updateMailConfig(data) {
        return this.httpIntercept.post(this.updateMailConfigUrl, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    emailActivationDeactivation(data) {
        return this.httpIntercept.post(this.updateMailConfigUrl, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }
    handleSuccess(res: Response) {
        console.log(res.json().data, 'Email configuration success response');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }
}