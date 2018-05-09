import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../../config/config.service';

import { InterceptedHttp } from './../../../http.interceptor';
import { SecurityInterceptedHttp } from './../../../http.securityinterceptor';

@Injectable()
export class SuperAdmin_ServiceProvider_Service {
  // _baseURL = "";
  // _createServiceProviderURL = this._baseURL + "user/userAuthenticate/";
  superadmin_base_url: any;
  providerAdminBaseUrl: any;
  commonbaseurl: any;

  service_provider_setup_url: any;
  getAllStatesUrl: any;
  getAllServiceLinesUrl: any;
  checkProviderNameAvailabilityUrl: any;

  /* Mapping Provider Admin */
  getAllStatesByProviderUrl: any;
  getAllServiceLinesByProviderUrl: any;
  getAllProviderAdminUrl: any;
  getAllProviderAdminMappingsUrl: any;
  providerAdminActivateUrl: any;
  providerAdminDeactivateUrl: any;
  providerAdminUpdateUrl: any;
  MappingProviderAdminUrl: any;

  getRegistrationDataUrl: any;
  getAllProviderUrl: any;
  getProviderInfoUrl: any;
  addProviderStateAndServiceLinesUrl: any;
  getAllStatus_URL: any;

  // provider admin url
  getAllProviderAdmin_url: any;
  checkUserAvailabilityUrl: any;
  getAllGendersUrl: any;
  getAllTitlesUrl: any;
  getAllQualificationsUrl: any;
  getAllMaritalStatusUrl: any;
  createProviderAdminUrl: any;
  updateProviderAdminUrl: any;
  delete_toggle_activationUrl: any;
  getAdminDetailsUrl: any;
  checkID: any;
  // updateProviderPersonalDetailsUrl: any;


  /* new APIs */
  createProviderUrl: any;
  providerUpdateUrl: any;
  providerDeleteUrl: any;

  getAllProviderMappingsUrl: any;
  mapProviderServiceStateUrl: any;
  editMappedProviderServiceStateUrl: any;
  deleteMappedProviderServiceStateUrl: any;

  getServicelinesFromProvider_url: any;
  getAllServicesByProviderUrl: any;
  getProvider_ServiceLineLevelStatus_Url: any;



  constructor(
    private _http: SecurityInterceptedHttp,
    public configService: ConfigService,
    private _httpInterceptor: InterceptedHttp
  ) {
    this.superadmin_base_url = this.configService.getSuperAdminBaseUrl();
    this.providerAdminBaseUrl = this.configService.getAdminBaseUrl();
    this.commonbaseurl = this.configService.getCommonBaseURL();

    this.service_provider_setup_url =
      this.superadmin_base_url + 'providerCreationAndMapping';
    this.getAllStatesUrl = this.commonbaseurl + 'location/states/';
    this.getAllServiceLinesUrl = this.providerAdminBaseUrl + 'getServiceline';


    this.checkProviderNameAvailabilityUrl =
      this.providerAdminBaseUrl + 'checkProvider';

    this.getRegistrationDataUrl =
      this.commonbaseurl + 'beneficiary/getRegistrationData';

    this.checkProviderNameAvailabilityUrl = this.providerAdminBaseUrl + 'checkProvider';
    this.getRegistrationDataUrl = this.commonbaseurl + 'beneficiary/getRegistrationData';

    this.getAllProviderUrl = this.providerAdminBaseUrl + 'getAllProvider';
    this.getProviderInfoUrl = this.providerAdminBaseUrl + 'getProviderStatus';
    this.addProviderStateAndServiceLinesUrl =
      this.providerAdminBaseUrl + 'addProviderStateAndServiceLines';
    this.getAllStatus_URL = this.providerAdminBaseUrl + 'getStatus';


    /*
    * Creation of provider admin URL
    */
    this.getAllProviderAdmin_url = this.providerAdminBaseUrl + 'completeUserDetails';
    this.checkUserAvailabilityUrl = this.providerAdminBaseUrl + 'm/FindEmployeeByName';
    this.createProviderAdminUrl = this.providerAdminBaseUrl + 'createProviderAdmin';
    this.getAllGendersUrl = this.providerAdminBaseUrl + 'm/AllGender';
    this.getAllTitlesUrl = this.providerAdminBaseUrl + 'm/AllTitle';
    this.getAllQualificationsUrl = this.providerAdminBaseUrl + 'm/Qualification';
    this.getAllMaritalStatusUrl = this.commonbaseurl + 'beneficiary/getRegistrationDataV1';
    this.updateProviderAdminUrl = this.providerAdminBaseUrl + 'editProviderAdmin';
    this.delete_toggle_activationUrl = this.providerAdminBaseUrl + 'deleteProviderAdmin';
    this.checkID = this.providerAdminBaseUrl + 'm/FindEmployeeDetails';

    // 	this.updateProviderPersonalDetailsUrl = this.providerAdminBaseUrl + "/updateProvider";

    /* Mapping Provider Admin */
    this.getAllStatesByProviderUrl = this.providerAdminBaseUrl + '/m/role/state';
    this.getAllServiceLinesByProviderUrl = this.providerAdminBaseUrl + '/m/role/service';
    this.getAllProviderAdminUrl = this.providerAdminBaseUrl + '/getProviderAdmin';
    this.getAllProviderAdminMappingsUrl = this.providerAdminBaseUrl + 'getmappingProviderAdmintoProvider';
    this.providerAdminActivateUrl = this.providerAdminBaseUrl + 'deletemappingProviderAdmintoProvider';
    this.providerAdminDeactivateUrl = this.providerAdminBaseUrl + 'deletemappingProviderAdmintoProvider';
    this.providerAdminUpdateUrl = this.providerAdminBaseUrl + 'editmappingProviderAdmintoProvider';
    this.MappingProviderAdminUrl = this.providerAdminBaseUrl + 'mappingProviderAdmintoProvider';
    this.getAllServicesByProviderUrl = this.superadmin_base_url + 'getServiceLinesUsingProvider';
    this.getProvider_ServiceLineLevelStatus_Url = this.providerAdminBaseUrl + 'getProviderStatusByProviderAndServiceId';


    /* new APIs */
    this.createProviderUrl = this.superadmin_base_url + 'createProvider';
    this.providerUpdateUrl = this.superadmin_base_url + 'providerUpdate';
    this.providerDeleteUrl = this.superadmin_base_url + 'providerdelete';

    this.getAllProviderMappingsUrl = this.superadmin_base_url + 'getMappedServiceLinesAndStatetoProvider';
    this.mapProviderServiceStateUrl = this.superadmin_base_url + 'mapServiceLinesAndStatetoProvider';
    this.editMappedProviderServiceStateUrl = this.superadmin_base_url + 'editMappedServiceLinesAndStatetoProvider'
    this.deleteMappedProviderServiceStateUrl = this.superadmin_base_url + 'deleteMappedServiceLinesAndStatetoProvider';
    this.getServicelinesFromProvider_url = this.superadmin_base_url + 'getServiceLinesUsingProvider';
  }

  getServicelinesFromProvider(serviceProviderID) {
    return this._httpInterceptor
      .post(this.getServicelinesFromProvider_url, { 'serviceProviderID': serviceProviderID })
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCommonRegistrationData() {
    return this._http
      .post(this.getRegistrationDataUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  checkProviderNameAvailability(provider_name) {
    return this._http
      .post(this.checkProviderNameAvailabilityUrl, {
        'serviceProviderName': provider_name
      })
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllStates(countryID: any) {
    debugger;
    return this._httpInterceptor
      .get(this.getAllStatesUrl + countryID)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getAllServiceLines() {
    return this._httpInterceptor
      .post(this.getAllServiceLinesUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  // ** Mapping Provider Admin to Provider Added by Krishna Gunti **//
  // getAllServiceLinesByProvider(serviceProviderID: any) {
  //   return this._http
  //     .post(this.getAllServiceLinesByProviderUrl, { "serviceProviderID": serviceProviderID })
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  getAllStatesByProvider(serviceProviderID: any, serviceLineID: any) {
    return this._httpInterceptor
      .post(this.getAllStatesByProviderUrl, { 'serviceProviderID': serviceProviderID, 'serviceID': serviceLineID })
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProviderStates(serviceProviderID) {
    return this._httpInterceptor.post(this.getAllStatesByProviderUrl,
      { 'serviceProviderID': serviceProviderID })
      .map(this.extractData)
      .catch(this.handleError);
  }
  getProviderServices(serviceProviderID) {
    return this._httpInterceptor.post(this.getAllServicesByProviderUrl,
      { 'serviceProviderID': serviceProviderID })
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProviderStatesInService(serviceProviderID, serviceID) {
    return this._httpInterceptor.post(this.getProvider_ServiceLineLevelStatus_Url,
      {
        'serviceProviderID': serviceProviderID,
        'serviceID': serviceID
      }).map(this.extractData)
      .catch(this.handleError);
  }

  getProviderServicesInState(serviceProviderID, stateID) {
    return this._httpInterceptor.post(this.getAllServiceLinesByProviderUrl,
      {
        'serviceProviderID': serviceProviderID,
        'stateID': stateID
      }).map(this.extractData)
      .catch(this.handleError);
  }

  getAllMappedProviders() {
    return this._http
      .post(this.getAllProviderAdminMappingsUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllProviderAdmins() {
    return this._http
      .post(this.getAllProviderAdminUrl, {})
      .map(this.extractData_Provider)
      .catch(this.handleError);
  }
  public activateProviderAdmin(req_obj) {
    return this._httpInterceptor
      .post(this.providerAdminActivateUrl, req_obj)
      .map(this.extractData)
      .catch(this.handleError);
  }
  public deactivateProviderAdmin(req_obj) {
    debugger;
    return this._httpInterceptor
      .post(this.providerAdminDeactivateUrl, req_obj)
      .map(this.extractData)
      .catch(this.handleError);
  }
  public updateProviderAdminDetails(req_obj) {
    return this._httpInterceptor
      .post(this.providerAdminUpdateUrl, req_obj)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }
  public createMappingProviderAdmin(request_array) {

    return this._httpInterceptor
      .post(this.MappingProviderAdminUrl, request_array)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }
  // ** End  **//
  getAllProvider() {
    return this._http
      .post(this.getAllProviderUrl, {})
      .map(this.extractData_Provider)
      .catch(this.handleError);
  }
  getAllProvider_provider() {
    return this._http
      .post(this.getAllProviderUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  getProviderStatus(provider) {
    return this._http
      .post(this.getProviderInfoUrl, {
        serviceProviderID: provider
      })
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllStatus() {
    return this._http
      .post(this.getAllStatus_URL, {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  //  Provider admin related functions
  getAllProviderAdmin() {
    return this._httpInterceptor
      .post(this.getAllProviderAdmin_url, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  checkUserAvailability(admin_username) {
    return this._http
      .post(this.checkUserAvailabilityUrl, {
        'userName': admin_username
      })
      .map(this.extractData)
      .catch(this.handleError)
  }
  createProviderAdmin(reqObject) {
    return this._httpInterceptor
      .post(this.createProviderAdminUrl, reqObject)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllGenders() {
    return this._http
      .post(this.getAllGendersUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllTitles() {
    return this._http
      .post(this.getAllTitlesUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllQualifications() {
    return this._http
      .post(this.getAllQualificationsUrl, {})
      .map(this.extractData)
      .catch(this.handleError)
  }
  getAllMaritalStatus() {
    return this._http
      .post(this.getAllMaritalStatusUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  updateProviderAdmin(update_obj) {
    console.log("update admin", update_obj);
    return this._httpInterceptor
      .post(this.updateProviderAdminUrl, update_obj)
      .map(this.extractData)
      .catch(this.handleError);
  }
  delete_toggle_activation(userID) {
    return this._httpInterceptor
      .post(this.delete_toggle_activationUrl, userID)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAdminDetails(user_obj) {
    return this._http
      .post(this.getAdminDetailsUrl, user_obj)
      .map(this.extractData)
      .catch(this.handleError)
  }
  validateAadhar(idNumber: any) {
    return this._http
      .post(this.checkID, { 'aadhaarNo': idNumber })
      .map(this.extractCustomData)
      .catch(this.handleError);
  }
  validatePan(idNumber: any) {
    return this._http
      .post(this.checkID, { 'pAN': idNumber })
      .map(this.extractCustomData)
      .catch(this.handleError);
  }
  // End of provider admin 

  addProviderStateAndServiceLines(array) {
    console.log(array);
    return this._http
      .post(this.addProviderStateAndServiceLinesUrl, array)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public createServiceProvider = function (serviceProviderRequestObject) {
    return this._httpInterceptor
      .post(this.service_provider_setup_url, serviceProviderRequestObject)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  };

  public createProvider(request_array) {
    return this._httpInterceptor
      .post(this.createProviderUrl, request_array)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  public updateProviderDetails(req_obj) {
    return this._httpInterceptor
      .post(this.providerUpdateUrl, req_obj)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  public deleteProvider(req_obj) {
    return this._httpInterceptor
      .post(this.providerDeleteUrl, req_obj)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllProviderMappings() {
    return this._httpInterceptor
      .post(this.getAllProviderMappingsUrl, {})
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }


  mapProviderServiceState(requestArray) {
    return this._httpInterceptor
      .post(this.mapProviderServiceStateUrl, requestArray)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  editMappedProviderServiceState(request_object) {
    return this._httpInterceptor
      .post(this.editMappedProviderServiceStateUrl, request_object)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  deleteMappedProviderServiceState(request_object) {
    return this._httpInterceptor
      .post(this.deleteMappedProviderServiceStateUrl, request_object)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  private extractCustomData(res: Response) {
    if (res.json().data) {
      console.log('in SA service', res.json().data);
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }
  extractData_Provider(response: Response) {

    console.log(response.json().data, ' service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.deleted == false) {
        return item;
      }
    });
    return result;
  }
  private extractData(res: Response) {
    if (res.json().data) {
      console.log('in SA service', res.json().data);
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }
  private handleCustomError(error: Response | any) {
    return Observable.throw(error);
  }
  private handleError(error: Response | any) {
    return Observable.throw(error);
  }
}
