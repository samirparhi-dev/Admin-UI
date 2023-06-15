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
export class UomMasterService {
  adminBaseUrl: String;

  constructor(
    private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
  }

  getAllUOMMaster(serviceMapID) {
    let getUOMUrl = this.adminBaseUrl + 'getUom';
    return this.http
      .post(getUOMUrl, { providerServiceMapID: serviceMapID })
      .map(this.extractData)
      .catch(this.handleError)
  }

  postUOMMaster(UOMMaster) {
    let postUOMUrl = this.adminBaseUrl + 'createUom';
    return this.http
      .post(postUOMUrl, UOMMaster)
      .map(this.extractData)
      .catch(this.handleError)
  }

  updateUOMMaster(UOMMaster) {
    let updateUOMUrl = this.adminBaseUrl + 'editUom';
    return this.http
      .post(updateUOMUrl, UOMMaster)
      .map(this.extractData)
      .catch(this.handleError)
  }

  checkForUniqueUOMCode(uOMCode, providerServiceMapID) {
    let checkUniqueUOMCodeUrl = this.adminBaseUrl + 'checkUomCode';
    return this.http
      .post(checkUniqueUOMCodeUrl, { uOMCode, providerServiceMapID })
      .map(this.extractData)
      .catch(this.handleError)
  }

  toggleDeleted(uomID, flag) {
    let toggleDeletedUrl = this.adminBaseUrl + 'deleteUom';
    return this.http
      .post(toggleDeletedUrl, { uOMID: uomID, deleted: flag })
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(res: Response) {
    if (res.json().data && res.json().statusCode == 200) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  private handleError(error: Response | any) {
    return Observable.throw(error.json());
  }

}
