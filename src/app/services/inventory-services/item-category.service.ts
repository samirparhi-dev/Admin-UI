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

}
