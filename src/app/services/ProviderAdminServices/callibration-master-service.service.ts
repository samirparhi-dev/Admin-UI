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
  save_update_Calibration_Url: any;
  constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.getCalibrationMaster_Url = this.admin_Base_Url + 'fetchCalibrationStrips';
    this.delete_CalibrationStrip_Url = this.admin_Base_Url + 'deleteCalibrationStrip';
    this.save_update_Calibration_Url = this.basepaths.getAdminBaseUrl() + 'createCalibrationStrip';
  }
  fetCalibrationMasters(obj) {
    return this.httpIntercept.post(this.getCalibrationMaster_Url, obj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  deleteCalibrationStrip(obj) {
    console.log('service obj', obj);
    return this.httpIntercept.post(this.delete_CalibrationStrip_Url, obj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  createUpdateCalibrationStrip(calibrationObj) {
    return this.httpIntercept.post(this.save_update_Calibration_Url, calibrationObj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  handleSuccess(response: Response) {
    console.log(response.json().data, 'Calibration Strip save_update success response');
    let result = [];
    if (response.json().data) {
      return response.json().data;
    } else {
      return Observable.throw(response.json());
    }  
  }
  handleError(error: Response | any) {
    return Observable.throw(error.json());
  }

}
