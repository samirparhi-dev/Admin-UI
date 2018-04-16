import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class CallServices {


  _baseUrl = this._config.get1097BaseURL();
  _commoUrl = this._config.getCommonBaseURL();
  providerAdmin_Base_Url = this._config.getAdminBaseUrl();
  _closecallurl = 'services/closeCall/';
  _callsummaryurl = '/services/getCallSummary/';
  _getCampaign = this._commoUrl + '/cti/getCampaignNames';
  _addCampaign = this.providerAdmin_Base_Url + '/createCitMappingwithServiceLines'
  constructor(
    private _http: SecurityInterceptedHttp,
    private _config: ConfigService,
    private _httpInterceptor: InterceptedHttp
  ) { }

  closeCall(values: any) {

    console.log('data to be updated in service is', values)
    return this._http.post(this._baseUrl + this._closecallurl, values).map(this.extractData).catch(this.handleError);
  }

  getCallSummary(values: any) {

    console.log('Call summary to be retreived for ', values)
    return this._http.post(this._baseUrl + this._callsummaryurl, values).map(this.extractData).catch(this.handleError);
  }

  getCapmaign(serviceName: any) {
    const obj = { 'serviceName': serviceName };
    return this._httpInterceptor.post(this._getCampaign, obj).map(this.extractData).catch(this.handleError);
  }

  addCampaign(campaignObj) {
    return this._httpInterceptor.post(this._addCampaign, campaignObj).map(this.extractData).catch(this.handleError);
  }
  private extractData(res: Response) {
    console.log('after updation', res);
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  };

  private handleError(err: Response) {
    return Observable.throw(err.json());
  };

}
