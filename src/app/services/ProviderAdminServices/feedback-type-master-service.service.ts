import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

import { ConfigService } from '../config/config.service';



@Injectable()
export class FeedbackTypeService {

  providerAdmin_Base_Url: any;
  getStates_url: any;
  getServiceLines_url: any;
  getFeedbackTypes_url: any;
  deleteFeedback_url: any;
  editFeedback_url: any;
  saveFeedback_url: any;
  getFeedbackNaturesTypes_url: any;
  deleteFeedbackNatureType_url: any;
  saveFeedbackNatureType_url: any;
  editFeedbackNatureType_url: any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();

    this.getStates_url = this.providerAdmin_Base_Url + 'm/role/stateNew';
    this.getServiceLines_url = this.providerAdmin_Base_Url + 'm/role/serviceNew';
    this.getFeedbackTypes_url = this.providerAdmin_Base_Url + 'm/getFeedbackType';
    this.deleteFeedback_url = this.providerAdmin_Base_Url + 'm/deleteFeedbackType';
    this.saveFeedback_url = this.providerAdmin_Base_Url + 'm/saveFeedbackType';
    this.editFeedback_url = this.providerAdmin_Base_Url + 'm/editFeedbackType';
    this.getFeedbackNaturesTypes_url = this.providerAdmin_Base_Url + 'm/getFeedbackNatureType';
    this.deleteFeedbackNatureType_url = this.providerAdmin_Base_Url + 'm/deleteFeedbackNatureType';
    this.saveFeedbackNatureType_url = this.providerAdmin_Base_Url + 'm/createFeedbackNatureType';
    this.editFeedbackNatureType_url = this.providerAdmin_Base_Url + 'm/editFeedbackNatureType';
  };

  getStates(userID, serviceID, isNational) {
    return this.httpIntercept.post(this.getStates_url,
      {
        'userID': userID,
        'serviceID': serviceID,
        'isNational': isNational
      })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getServiceLines(userID) {
    return this.httpIntercept.post(this.getServiceLines_url,
      { 'userID': userID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getFeedbackTypes(data) {
    // console.log(data,'reqObj');
    return this.httpIntercept.post(this.getFeedbackTypes_url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  getFeedbackTypes_nature(data) {
    // console.log(data,'reqObj');
    return this.httpIntercept.post(this.getFeedbackTypes_url, data)
      .map(this.handleState_n_feedbacktypes)
      .catch(this.handleError);
  }

  saveFeedback(data) {
    return this.httpIntercept.post(this.saveFeedback_url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  deleteFeedback(data) {
    return this.httpIntercept.post(this.deleteFeedback_url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  editFeedback(data) {
    return this.httpIntercept.post(this.editFeedback_url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }


  getFeedbackNatureTypes(data) {
    return this.httpIntercept.post(this.getFeedbackNaturesTypes_url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  deleteFeedbackNatureType(data) {
    return this.httpIntercept.post(this.deleteFeedbackNatureType_url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  saveFeedbackNatureType(data) {
    return this.httpIntercept.post(this.saveFeedbackNatureType_url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  editFeedbackNatureType(data) {
    return this.httpIntercept.post(this.editFeedbackNatureType_url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  handleState_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'feedback type master service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.statusID !== 4) {
        return item;
      }
    });
    return result;
  }
  handleState_n_feedbacktypes(response: Response) {

    console.log(response.json().data, 'feedback type master service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.deleted === false) {
        return item;
      }
    });
    return result;
  }

  handleSuccess(res: Response) {
    console.log(res.json().data, '--- in feedback-type-master-service');
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
