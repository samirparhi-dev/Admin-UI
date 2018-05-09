import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';


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
  deleteSubCategory_url: any;
  getCategory_url: any;
  saveExistCategory_url: any;
  editCategory_url: any;
  editSubCategory_url: any;

  getServiceLines_new_url: any;
  getStates_new_url: any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private _httpInterceptor: InterceptedHttp) {
    this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.getStates_url = this.providerAdmin_Base_Url + 'm/role/state';
    this.getServiceLines_url = this.providerAdmin_Base_Url + 'm/role/service';
    this.getSubService_url = this.providerAdmin_Base_Url + 'm/getSubSerive';
    this.getCategoryBySubService_url = this.providerAdmin_Base_Url + 'm/getCategoryBySubServiceID';
    this.saveCategory_url = this.providerAdmin_Base_Url + 'm/createCategory';
    this.deleteCategory_url = this.providerAdmin_Base_Url + 'm/deleteCategory1';
    this.deleteSubCategory_url = this.providerAdmin_Base_Url + 'm/deleteSubCategory';
    this.getCategory_url = this.providerAdmin_Base_Url + 'm/getCategory';
    this.saveExistCategory_url = this.providerAdmin_Base_Url + 'm/createSubCategory';
    this.editCategory_url = this.providerAdmin_Base_Url + 'm/updateCategory';
    this.editSubCategory_url = this.providerAdmin_Base_Url + 'm/updateSubCategory';
    this.getServiceLines_new_url = this.providerAdmin_Base_Url + 'm/role/serviceNew';
    this.getStates_new_url = this.providerAdmin_Base_Url + 'm/role/stateNew';
  };

  getStates(serviceProviderID) {
    return this.http.post(this.getStates_url, { 'serviceProviderID': serviceProviderID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getStatesNew(obj) {
    return this._httpInterceptor.post(this.getStates_new_url, obj).map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getServiceLinesNew(userID) {
    return this._httpInterceptor.post(this.getServiceLines_new_url, { 'userID': userID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getServiceLines(serviceProviderID, stateID) {
    return this.http.post(this.getServiceLines_url, { 'serviceProviderID': serviceProviderID, 'stateID': stateID })
      .map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getSubService(serviceProviderMapID) {
    return this.http.post(this.getSubService_url, { 'providerServiceMapID': serviceProviderMapID })
      .map(this.handleState_n_subservice)
      .catch(this.handleError);
  }

  getCategorybySubService(serviceProviderMapID, subServiceID) {
    return this._httpInterceptor.
      post(this.getCategoryBySubService_url, { 'providerServiceMapID': serviceProviderMapID, 'subServiceID': subServiceID })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  saveCategory(categoryObj: any) {
    return this._httpInterceptor.post(this.saveCategory_url, categoryObj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  saveSubCategory(categoryObj: any) {
    return this._httpInterceptor.post(this.saveExistCategory_url, categoryObj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  getCategory(serviceProviderMapID: any, id: any) {
    return this._httpInterceptor.post(this.getCategory_url, { 'providerServiceMapID': serviceProviderMapID, 'subServiceID': id })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  deleteCategory(id: any, isActivate: boolean) {
    return this._httpInterceptor.post(this.deleteCategory_url, { 'categoryID': id, 'deleted': isActivate })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  deleteSubCategory(id, isActivate) {
    return this._httpInterceptor.post(this.deleteSubCategory_url, { 'subCategoryID': id, 'deleted': isActivate })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  editCategory(catObj: any) {
    return this._httpInterceptor.post(this.editCategory_url, catObj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
  editSubCategory(subCatObj) {
    return this._httpInterceptor.post(this.editSubCategory_url, subCatObj)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  handleState_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'role service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.statusID !== 4) {
        return item;
      }
    });
    return result;
  }

  handleSuccess(res: Response) {
    console.log(res.json().data, '--- in location-serviceline-mapping service');
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }
  handleState_n_subservice(response: Response) {

    console.log(response.json().data, 'sub service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.deleted === false) {
        return item;
      }
    });
    return result;
  }

  handleError(error: Response | any) {
    return Observable.throw(error.json());
  }
};



