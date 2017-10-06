import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 10-09-2017
 * Objective: # A service which would handle the mapping of category n subcategory
	 for a subservice of a state,for a service provider
*/

@Injectable()
export class CategorySubcategoryService {

  providerAdmin_Base_Url: any;
  getStates_url: any;
  getServiceLines_url: any;
  get_sub_serviceID_url: any;
  get_category_subcategory_url: any;
  getSubService_url: any;
  getCategoryBySubService_url: any;
  saveCategory_url: any;
  deleteCategory_url: any;
  getCategory_url: any;
  saveExistCategory_url: any;
  editCategory_url: any;
  constructor(private http: Http, public basepaths: ConfigService, private _httpInterceptor: InterceptedHttp) {
    this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.getStates_url = this.providerAdmin_Base_Url + 'm/location/state';
    this.getServiceLines_url = this.providerAdmin_Base_Url + 'm/location/service';
    this.getSubService_url = this.providerAdmin_Base_Url + 'm/getSubSerive';
    this.getCategoryBySubService_url = this.providerAdmin_Base_Url + 'm/getCategoryBySubServiceID';
    this.saveCategory_url = this.providerAdmin_Base_Url + 'm/createCategory';
    this.deleteCategory_url = this.providerAdmin_Base_Url + 'm/deleteCategory1';
    this.getCategory_url = this.providerAdmin_Base_Url + 'm/getCategory';
    this.saveExistCategory_url = this.providerAdmin_Base_Url + 'm/createSubCategory';
    this.editCategory_url = this.providerAdmin_Base_Url + 'm/updateCategory';
  };

  getStates(serviceProviderID) {
    return this.http.post(this.getStates_url, { 'serviceProviderID': serviceProviderID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }


  getServiceLines(serviceProviderID, stateID) {
    return this.http.post(this.getServiceLines_url, { 'serviceProviderID': serviceProviderID, 'stateID': stateID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getSubService(serviceProviderMapID) {
    return this.http.post(this.getSubService_url, { 'providerServiceMapID': serviceProviderMapID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  getCategorybySubService(serviceProviderMapID, subServiceID) {
    return this._httpInterceptor.
      post(this.getCategoryBySubService_url, { 'providerServiceMapID': serviceProviderMapID, 'subServiceID': subServiceID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  saveCategory(categoryObj: any) {
    return this.http.post(this.saveCategory_url, categoryObj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  saveSubCategory(categoryObj: any) {
    return this.http.post(this.saveExistCategory_url, categoryObj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  getCategory(serviceProviderMapID: any, id: any) {
    return this.http.post(this.getCategory_url, { 'providerServiceMapID': serviceProviderMapID, 'subServiceID': id })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  deleteCategory(id: any, isActivate: boolean) {
    return this.http.post(this.deleteCategory_url, { 'categoryID': id, 'deleted': isActivate })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  editCategory(catObj: any) {
    return this.http.post(this.editCategory_url, catObj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  handleSuccess(response: Response) {
    console.log(response.json().data, '--- in location-serviceline-mapping service');
    return response.json().data;
  }

  handleError(error: Response | any) {
    return Observable.throw(error.json());
  }
};



