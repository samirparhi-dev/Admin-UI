import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
@Injectable()
export class StoreSelfConsumptionServiceService {
  admin_Base_Url: any;
  common_Base_Url: any;
  getStoreItems: any;
  getItemBatchForStoreID:any;

  constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();
    this.getStoreItems = this.admin_Base_Url + 'getItemFromStoreID/';
    this.getItemBatchForStoreID = this.admin_Base_Url + 'getItemBatchForStoreID/';
};
getStoreItemsCall(facID) {
  return this.http.post(this.getStoreItems+facID,{}).map(this.handleSuccess)
      .catch(this.handleError);
}

getItemBatchForStoreIDCall(itemID,facID){
  return this.http.post(this.getItemBatchForStoreID,{"facilityID":facID,
"itemID":itemID}).map(this.handleSuccess)
  .catch(this.handleError);
}
handleSuccess(res: Response) {
  console.log(res.json().data, 'Main Stores file success response');
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
