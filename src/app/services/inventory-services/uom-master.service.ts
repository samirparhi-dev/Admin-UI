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
      .post(getUOMUrl, { providerServiceMapID: serviceMapID})
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

  toggleDeleted(uomID, flag) {
    let toggleDeletedUrl = this.adminBaseUrl + 'deleteUom';
    return this.http
    .post(toggleDeletedUrl, { uOMID: uomID, deleted: flag})
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
