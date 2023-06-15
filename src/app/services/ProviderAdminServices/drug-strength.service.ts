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
