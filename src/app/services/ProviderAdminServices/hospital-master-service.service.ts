import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';


/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 11-10-2017
 * Objective: # A service which would handle the HOSPITAL MASTER services.
 */

@Injectable()
export class HospitalMasterService {
  admin_Base_Url: any;
  common_Base_Url: any;

  get_State_Url: any;
  get_Service_Url: any;
  get_District_Url: any;
  get_Taluk_Url: any;
  get_Village_Url: any;

  get_Institution_Url: any;
  create_Institution_Url: any;
  edit_Institution_Url: any;
  delete_Institution_Url: any;
  file_upload_url: string;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();

    this.get_State_Url = this.admin_Base_Url + 'm/role/stateNew';
    this.get_Service_Url = this.admin_Base_Url + 'm/role/serviceNew';
    this.get_District_Url = this.common_Base_Url + 'location/districts/';
    this.get_Taluk_Url = this.common_Base_Url + 'location/taluks/';
    this.get_Village_Url = this.common_Base_Url + 'location/village/';

    this.get_Institution_Url = this.admin_Base_Url + 'm/getInstution';
   // this.get_Institution_Url = this.admin_Base_Url + 'm/getInstutionByVillage';
    //this.create_Institution_Url = this.admin_Base_Url + 'm/createInstution';
    this.create_Institution_Url = this.admin_Base_Url + 'm/createInstutionByVillage';
    this.edit_Institution_Url = this.admin_Base_Url + 'm/editInstution';
    this.delete_Institution_Url = this.admin_Base_Url + 'm/deleteInstution';
    this.file_upload_url=this.admin_Base_Url + 'm/createInstitutionByFile';
  };


 postFormData(formData) {

 /*return this.httpIntercept.post(this.get_Service_Url, {
    'userID': 655
  });*/
  return this.httpIntercept.post(this.file_upload_url, formData)
  .map(this.onSuccess)
  .catch(this.handleError);
 /*return this.httpIntercept.post(this.file_upload_url, formData)
  .map(this.handleSuccess)
  .catch(this.handleError);*/
 
   /* return this.httpIntercept.post(this.file_upload_url, formData).catch(this.onCatch).do((res: Response) => {
      this.onSuccess(res);
    }, (error: any) => {
      this.onError(error);
    })
      .finally(() => {
        this.onEnd();
      });*/
  }
  /*getUploadStatus(psmID) {
    /*let url = this.configService.getMctsBaseURL() + 'mctsDataHandlerController/mcts/data/upload/status';
    return this._http.post(url,{'providerServiceMapID':psmID}).map(this.extractData).catch(this.handleError);
  }*/
  getServices(userID) {
    return this.httpIntercept.post(this.get_Service_Url, {
      'userID': userID
    }).map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getStates(userID, serviceID, isNational) {
    return this.httpIntercept.post(this.get_State_Url,
      {
        'userID': userID,
        'serviceID': serviceID,
        'isNational': isNational
      })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getDistricts(stateId) {
    return this.httpIntercept.get(this.get_District_Url + stateId)
      .map(this.handleSuccess)
      .catch(this.handleError);

  }

  getTaluks(districtId) {
    return this.httpIntercept.get(this.get_Taluk_Url + districtId)
      .map(this.handleSuccess)
      .catch(this.handleError);

  }

  getVillages(blockID){
    return this.httpIntercept.get(this.get_Village_Url + blockID)
    .map(this.handleSuccess)
    .catch(this.handleError);
  }
  getInstitutions(data) {
    return this.httpIntercept.post(this.get_Institution_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  saveInstitution(data) {
    return this.httpIntercept.post(this.create_Institution_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  editInstitution(data) {
    return this.httpIntercept.post(this.edit_Institution_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  deleteInstitution(data) {
    return this.httpIntercept.post(this.delete_Institution_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }


  handleState_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'role service file success response');
    let result = [];
    result = response.json().data;
    return result;
  }


  handleSuccess(res: Response) {
    console.log(res.json().data, 'HOSPITAL-MASTER-SERVICE file success response');
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  handleError(error: Response | any) {
    return Observable.throw(error.json());

  }
   onSuccess(response: any) {
    if (response.json().data) {
      return response;
    }
  }



};



