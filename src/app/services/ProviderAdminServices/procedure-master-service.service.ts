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
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ProcedureMasterServiceService {


  providerAdmin_Base_Url: any;
  common_Base_Url: any;

  _getProcedureListURL: any;
  _postProcedureURL: any;
  _updateProcedureURL: any;
  _toggleProcedureURL: any;
  _iotProcedureURL:any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();
    this._postProcedureURL = this.providerAdmin_Base_Url + 'labModule/createProcedureMaster';
    this._getProcedureListURL = this.providerAdmin_Base_Url + 'labModule/fetchProcedureMaster/';
    this._toggleProcedureURL = this.providerAdmin_Base_Url + 'labModule/updateProcedureStatus';
    this._updateProcedureURL = this.providerAdmin_Base_Url + 'labModule/updateProcedureMaster';
    this._iotProcedureURL = this.providerAdmin_Base_Url + 'iotController/getIOTProcedure';
  }

  getCurrentProcedures(providerServiceMapID) {
    return this.http.get(`${this._getProcedureListURL}${providerServiceMapID}`)
    .map(this.handleSuccess)
      .catch(this.handleError);
  }

  postProcedureData(reqObject) {
    return this.http.post(this._postProcedureURL, reqObject)
    .map(this.handleSuccess)
      .catch(this.handleError);
  }

  updateProcedureData(reqObject) {
    return this.http.post(this._updateProcedureURL, reqObject)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  toggleProcedure(reqObject) {
    return this.http.post(this._toggleProcedureURL, reqObject)
    .map(this.handleSuccess)
    .catch(this.handleError);
  }

  handleSuccess(res: Response) {
    console.log(res.json(), 'calltype-subtype service file success response');
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  handleError(error: Response | any) {
    return Observable.throw(error.json());
  }

  getIOTProcedure() {
    return this.http.post(this._iotProcedureURL, {})
    .map(this.handleSuccess)
    .catch(this.handleError);
  }



}
