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
import { InterceptedHttp } from 'app/http.interceptor';
import { SecurityInterceptedHttp } from 'app/http.securityinterceptor';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CallibrationMasterServiceService {

  admin_Base_Url: any;
  delete_CalibrationStrip_Url: any;
  getCalibrationMaster_Url: any;
  save_Calibration_Url: any;
  update_Calibration_Url: any;
  constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.getCalibrationMaster_Url = this.admin_Base_Url + 'fetchCalibrationStrips';
    this.delete_CalibrationStrip_Url = this.admin_Base_Url + 'deleteCalibrationStrip';
    this.save_Calibration_Url = this.basepaths.getAdminBaseUrl() + 'createCalibrationStrip';
    this.update_Calibration_Url = this.basepaths.getAdminBaseUrl() + 'updateCalibrationStrip';
  }
  fetCalibrationMasters(obj) {
    return this.http.post(this.getCalibrationMaster_Url, obj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  deleteCalibrationStrip(obj) {
    console.log('service obj', obj);
    return this.http.post(this.delete_CalibrationStrip_Url, obj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  createCalibrationStrip(calibrationObj) {
    return this.http.post(this.save_Calibration_Url, calibrationObj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  updateCalibrationStrip(calibrationObj) {
    return this.http.post(this.update_Calibration_Url, calibrationObj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  handleSuccess(response: Response) {
    console.log(response.json().data, 'Calibration Strip save_update success response');
    let result = [];
    if (response.json()) {
      return response.json();
    } else {
      return Observable.throw(response.json());
    }  
  }
  handleError(error: Response | any) {
    return Observable.throw(error.json());
  }

}
