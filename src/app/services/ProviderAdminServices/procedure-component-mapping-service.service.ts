import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class ProcedureComponentMappingServiceService {
  providerAdmin_Base_Url: any;
  common_Base_Url: any;

  _getProcedureListURL: any;
  _getComponentListURL: any;
  _setProcedureComponentMapURL: any;
  _getCurrentMappingsURL: any;
  _getprocedureConfigDetailsURL: any;
  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();
    this._setProcedureComponentMapURL = this.providerAdmin_Base_Url + 'labModule/createProcedureComponentMapping';
    this._getComponentListURL = this.providerAdmin_Base_Url + 'labModule/fetchComponentMasterDelFalse/';
    this._getProcedureListURL = this.providerAdmin_Base_Url + 'labModule/fetchProcedureMasterDelFalse/';
    this._getCurrentMappingsURL = this.providerAdmin_Base_Url + '';
    this._getprocedureConfigDetailsURL = this.providerAdmin_Base_Url + '';
  }

  getProceduresList(providerServiceMapID) {
    return this.http.get(`${this._getProcedureListURL}${providerServiceMapID}`)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getSelectedProcedureMappings(procedureID) {
    // return this.http.get(`${this._getprocedureConfigDetailsURL}${procedureID}`)
    // .map(this.handleSuccess)
    // .catch(this.handleSuccess)

    return Observable.of({
      procedureID: 4,
      procedureName: 'procedure',
      procedureDesc: 'something',
      compList: [{
        testComponentID: 12,
        testComponentName: 'component 1'
      },
      {
        testComponentID: 16,
        testComponentName: 'otherone'
      }]
    })
  }

  getCurrentMappings(providerServiceMapID) {
    // return this.http.get(`${this._getCurrentMappingsURL}${providerServiceMapID}`)
    // .map(this.handleSuccess)
    // .catch(this.handleError)
    return Observable.of([{
      procedureName: 'name here',
      procedureDesc: 'some random description',
      componentList: 'anovnv,webweb,webwebbw,webweb',
      createdBy: 'mySelf'
    }])
  }

  getComponentsList(providerServiceMapID) {
    return this.http.get(`${this._getComponentListURL}${providerServiceMapID}`)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  saveProcedureComponentMapping(apiObject) {
    return this.http.post(this._setProcedureComponentMapURL, apiObject )
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

