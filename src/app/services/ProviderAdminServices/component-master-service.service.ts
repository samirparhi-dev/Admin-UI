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
export class ComponentMasterServiceService {


  providerAdmin_Base_Url: any;
  common_Base_Url: any;

  _getComponentListURL: any;
  _getCurrentComponentURL: any;
  _postComponentURL: any;
  _updateComponentURL: any;
  _toggleComponentURL: any;
  _iotComponentURL:any;
  getLOINCRecord: any;
  // diagnosisSnomedCTRecordUrl: string;


  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();
    this._postComponentURL = this.providerAdmin_Base_Url + 'labModule/createComponentMaster';
    this._updateComponentURL = this.providerAdmin_Base_Url + 'labModule/updateComponentMaster ';
    this._getComponentListURL = this.providerAdmin_Base_Url + 'labModule/fetchComponentMaster/';
    this._getCurrentComponentURL = this.providerAdmin_Base_Url + 'labModule/fetchComponentDetailsForComponentID/';
    this._toggleComponentURL = this.providerAdmin_Base_Url + 'labModule/updateComponentStatus';
    this._iotComponentURL=this.providerAdmin_Base_Url+'iotController/getIOTComponent';
    this.getLOINCRecord=this.common_Base_Url+'lonic/getlonicRecordList'
    // this.diagnosisSnomedCTRecordUrl = `http://10.208.122.38:8080/tmapi-v1.0/snomed/getSnomedCTRecordList`;
  }

  getCurrentComponents(providerServiceMapID) {
    return this.http.get(`${this._getComponentListURL}${providerServiceMapID}`)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  postComponentData(reqObject) {
    // console.log(JSON.stringify(reqObject, null, 4))
    // return Observable.of(reqObject);
    return this.http.post(this._postComponentURL, reqObject)
      .map(this.handleSuccess)
      .catch(this.handleError);

  }

  getCurrentComponentForEdit(componentID) {
    return this.http.get(`${this._getCurrentComponentURL}${componentID}`)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  updateComponentData(reqObject) {
    // console.log(JSON.stringify(reqObject, null, 4))
    // return Observable.of(reqObject);
    return this.http.post(this._updateComponentURL, reqObject)
      .map(this.handleSuccess)
      .catch(this.handleError);

  }
 

  toggleComponent(reqObject) {
    return this.http.post(this._toggleComponentURL, reqObject)
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

  getIOTComponent() {
    return this.http.post(this._iotComponentURL,{})
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  searchComponent(searchTerm, pageNo) {
    const body = {
      "term": searchTerm,
      "pageNo":pageNo
    }
   
    return this.http.post(this.getLOINCRecord, body)
      .map(res => res.json());
  }
}
