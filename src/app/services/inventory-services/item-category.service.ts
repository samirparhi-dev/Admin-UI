import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
@Injectable()
export class ItemCategoryService {

  adminBaseUrl: any;
  getAllItemCategoryURL: any;
  setCategoryStatusURL: any;
  createNewCategoryURL: any;
  editCategoryURL: any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
  };

  getAllItemCategory(providerServiceMapID) {
    this.getAllItemCategoryURL = `${this.adminBaseUrl}getItemCategory/${providerServiceMapID}/0`;
    console.log(this.getAllItemCategoryURL);
    return this.http.get(this.getAllItemCategoryURL)
      .map((res) => res.json());
  }

  categoryActivationDeactivation(categoryId, flag) {
    this.setCategoryStatusURL = `${this.adminBaseUrl}blockItemCategory`;
    return this.http.post(this.setCategoryStatusURL, { itemCategoryID: categoryId, deleted: flag })
      .map((res) => res.json());

  }

  saveNewCategory(reqObj) {
    this.createNewCategoryURL = `${this.adminBaseUrl}createItemCategories`;
    return this.http.post(this.createNewCategoryURL, reqObj)
    .map((res) => res.json());
  }

  editItemCategory(reqObj) {
    this.editCategoryURL = `${this.adminBaseUrl}editItemCategory`;
    return this.http.post(this.editCategoryURL, reqObj)
    .map(res => res.json());
  }

}
