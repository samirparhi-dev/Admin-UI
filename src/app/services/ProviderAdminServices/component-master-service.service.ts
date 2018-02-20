import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ComponentMasterServiceService {


  providerAdmin_Base_Url: any;
  common_Base_Url: any;

  _getComponentListURL: any;
  _postComponentURL: any;
  _toggleComponentURL: any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();
    this._postComponentURL = this.providerAdmin_Base_Url + 'labModule/createComponentMaster';
    this._getComponentListURL = this.providerAdmin_Base_Url + 'labModule/fetchComponentMaster/';
    this._toggleComponentURL = this.providerAdmin_Base_Url + 'labModule/updateComponentStatus';
  }
  getCurrentComponents(providerServiceMapID) {
    return this.http.get(`${this._getComponentListURL}${providerServiceMapID}`)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  postComponentData(reqObject) {
    // console.log(JSON.stringify(reqObject, null, 4))
    // return Observable.of(reqObject);
    return this.http.post(this._postComponentURL, reqObject)
      .map(this.handleSuccess)
      .catch(this.handleError);

  }
 

  toggleComponent(reqObject) {
    return this.http.post(this._toggleComponentURL, reqObject)
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
