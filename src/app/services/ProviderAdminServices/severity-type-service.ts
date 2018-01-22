import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

import { ConfigService } from '../config/config.service';


@Injectable()
export class SeverityTypeService {

  admin_Base_Url: any;
  get_State_Url: any;
  addSeverityUrl: any;
  deleteSeverityUrl: any;
  modifySeverityUrl: any;
  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {

    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.get_State_Url = this.admin_Base_Url + '/m/getServerity';
    this.addSeverityUrl = this.admin_Base_Url + '/m/saveServerity ';
    this.deleteSeverityUrl = this.admin_Base_Url + '/m/deleteServerity';
    this.modifySeverityUrl = this.admin_Base_Url + 'm/editServerity'
  };

  getSeverity(providerServiceMapID) {
    return this.httpIntercept.post(this.get_State_Url, { 'providerServiceMapID': providerServiceMapID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }


  addSeverity(array) {
    return this.httpIntercept.post(this.addSeverityUrl, array)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  modifySeverity(obj) {
    return this.httpIntercept.post(this.modifySeverityUrl, obj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  deleteSeverity(obj) {
    return this.httpIntercept.post(this.deleteSeverityUrl, obj)
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

}
