import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
@Injectable()
export class SpecialistMappingService {

  private providerAdmin_Base_Url: any;
  private common_Base_Url: any;


  private _saveUserSpecializationURL: any;
  private _getSpecializationURL: any;
  private _getUserTMURL: any;
  private _getUserSpecializationURL: any;
  private _activateUserSpecializationURL: any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();
    this._saveUserSpecializationURL = this.providerAdmin_Base_Url + 'TM/saveUserSpecialization';
    this._getSpecializationURL = this.providerAdmin_Base_Url + 'TM/getSpecialization';
    this._getUserTMURL = this.providerAdmin_Base_Url + 'TM/getUser';
    this._getUserSpecializationURL = this.providerAdmin_Base_Url + 'TM/getUserSpecialization';
    this._activateUserSpecializationURL = this.providerAdmin_Base_Url + 'TM/activateUserSpecialization';

   }


   toggleMapping(userSpecializationMapID, deleted, modifiedBy) {
     return this.http.post(this._activateUserSpecializationURL, {userSpecializationMapID, deleted, modifiedBy})
     .map(this.handleSuccess)
     .catch(this.handleError);
    }

    getDoctorList(serviceproviderID, screenName) {
      return this.http.post(this._getUserTMURL, {serviceproviderID, screenName})
      .map(this.handleSuccess)
      .catch(this.handleError);

    }

    getSpecializationList() {
      return this.http.post(this._getSpecializationURL, {})
      .map(this.handleSuccess)
      .catch(this.handleError);
    }

   getCurrentMappings(serviceproviderID) {
     return this.http.post(this._getUserSpecializationURL, {serviceproviderID})
     .map(this.handleSuccess)
     .catch(this.handleError);

   }

   saveMappings(apiObj) {
     return this.http.post(this._saveUserSpecializationURL, apiObj)
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
