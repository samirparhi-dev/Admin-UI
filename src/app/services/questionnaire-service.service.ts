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
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from 'app/services/config/config.service';
import { InterceptedHttp } from 'app/http.interceptor';
import { SecurityInterceptedHttp } from 'app/http.securityinterceptor';
import { adminDataService } from './adminServices/SMSMaster/data.service';


@Injectable()
export class QuestionnaireServiceService {
  saveQuestionnaire_url: any;
  adminBaseUrl: any;
  commonBaseUrl:any;
  deleteQuestionnaire_url: any;
  get_Service_Url: any;
  getQuestionType_url: string;
  getQuestionnaire_url: string;
  editQuestionnaire_url: any;
  constructor(private _http: SecurityInterceptedHttp,       
    public _config: ConfigService,
    private httpIntercept: InterceptedHttp,
    private dataService: adminDataService) {
      this.adminBaseUrl = this._config.getAdminBaseUrl();
      this.commonBaseUrl = this._config.getCommonBaseURL();
      this.saveQuestionnaire_url = this.adminBaseUrl + 'saveQuestionnaire';
      this.deleteQuestionnaire_url= this.adminBaseUrl + 'deleteQuestionnaire';
      this.getQuestionnaire_url=this.adminBaseUrl + 'getQuestionnaireList';
      this.get_Service_Url = this.adminBaseUrl + 'm/role/serviceNew';
      this.getQuestionType_url= this.commonBaseUrl + "questionTypeController/get/questionTypeList";
      this.editQuestionnaire_url= this.adminBaseUrl + 'editQuestionnaire';
     }
     getServices(userID) {
      return this.httpIntercept.post(this.get_Service_Url,
        {
          'userID': userID
  
        }).map(this.handleState_n_ServiceSuccess)
        .catch(this.handleError);
    }
    getQuestionTypes() {
      return this.httpIntercept.post(this.getQuestionType_url, {}).map(this.handleState_n_questionTypeSuccess)
      .catch(this.handleError);
    }
     saveQuestionnaire(obj) {
      return this.httpIntercept.post(this.saveQuestionnaire_url, obj)
          .map(this.handleSuccess)
          .catch(this.handleError);
  }
  deleteQuestionaire(obj)
  {
    return this.httpIntercept.post(this.deleteQuestionnaire_url, obj)
          .map(this.handleSuccess)
          .catch(this.handleError);
  }
  fetchQuestionnaire(obj)
  {
    console.log(obj);
    return this.httpIntercept.post(this.getQuestionnaire_url, obj)
    .map(this.handleSuccess)
    .catch(this.handleError);
  }
  editQuestionnaire(obj) {
    return this.httpIntercept.post(this.editQuestionnaire_url, obj)
        .map(this.handleSuccess)
        .catch(this.handleError);
}

  handleSuccess(response: Response) {
    if (response.json().data) {
      return response.json();
  }  else {
        return Observable.throw(response.json());
    }
}

private handleError(error: Response | any) {
    return Observable.throw(error.json());
};

handleState_n_ServiceSuccess(response: Response) {

  // console.log(response.json().data, 'AGENT LIST CREATION service file success response');
  let result = [];
  result = response.json().data.filter(function (item) {
    if (item.serviceID === 3) {
      return item;
    }
  });
  return result;
}

handleState_n_questionTypeSuccess(response: Response) {

  // console.log(response.json().data, 'AGENT LIST CREATION service file success response');
  let result = [];
  result = response.json().data.filter(function (item) {
    console.log("Items1",item)
    if (item.questionTypeID == 4 || item.questionTypeID == 5 ||  item.questionTypeID == 6) {
      console.log("Items",item)
      return item;
    }
  });
  console.log("ItemsResult",result)
  return result;
}

}
