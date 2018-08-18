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
  _addCampaign = this.providerAdmin_Base_Url + '/createCitMappingwithServiceLines';
  _getCampaignList = this.providerAdmin_Base_Url + '/getMappedServiceLinesAndStatetoProvider';
  
  get_State_Url = this.providerAdmin_Base_Url + 'm/role/stateNew';
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
  getAllMappedServicelinesAndStates(serviceProviderID) {
    console.log("Mappedservice",serviceProviderID);
    
    return this._httpInterceptor.post(this._getCampaignList, {"serviceProviderID":serviceProviderID}).map(this.extractData_campaignList).catch(this.handleError);
  }
  getStates(userID, serviceID, isNational) {
    return this._httpInterceptor.post(this.get_State_Url,
        {
            'userID': userID,
            'serviceID': serviceID,
            'isNational': isNational
        })
        .map(this.extractData)
        .catch(this.handleError);
}

  getCampaign(serviceName: any) {
    return this._httpInterceptor.post(this._getCampaign,
       {"serviceName":serviceName}
      ).map(this.extractData_campaign)
      .catch(this.handleError);
  }

  addCampaign(campaignObj) {
    return this._httpInterceptor.post(this._addCampaign, campaignObj).map(this.extractData).catch(this.handleError);
  }
  /* For edit and create same API - /createCitMappingwithServiceLines */
  editCampaign(campaignObj) {
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
  private extractData_campaign(res: Response) {
    console.log('campaign values', res);
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  };

  // For specific serviceline
  extractData_campaignList(response: Response) {

    console.log(response.json().data, 'Mapped list');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.serviceID === 1 || item.serviceID === 3 || item.serviceID === 6 ) {
        return item;
      }
    });
    return result;
  }
  private handleError(err: Response) {
    return Observable.throw(err.json());
  };

}
