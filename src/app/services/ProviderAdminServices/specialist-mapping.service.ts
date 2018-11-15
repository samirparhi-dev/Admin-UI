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

  providerAdmin_Base_Url: any;
  common_Base_Url: any;


  _saveUserSpecializationURL: any;
  _getSpecializationURL: any;
  _getUserTMURL: any;
  _getUserSpecializationURL: any;
  _activateUserSpecializationURL: any;

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



   getCurrentSpecializationMapping() {
    //  this.


   }

}
