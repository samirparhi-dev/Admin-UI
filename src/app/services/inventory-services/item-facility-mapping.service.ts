import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
@Injectable()
export class ItemFacilityMappingService {

  
  adminBaseUrl: any;
  getAllFacilityItemMappingUrl:any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
};

setFacilityItemMapping(obj) {
  console.log("mapItemtoStrore list", obj);
  this.getAllFacilityItemMappingUrl = this.adminBaseUrl + 'mapItemtoStrore';
  return this.http
      .post(this.getAllFacilityItemMappingUrl, obj)
      .map(this.extractData)
      .catch(this.handleError)

}

getAllFacilityItemMapping(serviceMapId) {
  console.log("pharmacology list", serviceMapId);
  this.getAllFacilityItemMappingUrl = this.adminBaseUrl + 'getAllFacilityMappedData';
  return this.http
      .post(this.getAllFacilityItemMappingUrl, { "providerServiceMapID": serviceMapId })
      .map(this.extractData)
      .catch(this.handleError)

}

getItemsOnCategory(serviceMapId,category) {
  console.log("pharmacology list", serviceMapId);
  this.getAllFacilityItemMappingUrl = this.adminBaseUrl + 'getItem';
  return this.http
      .post(this.getAllFacilityItemMappingUrl, { "providerServiceMapID": serviceMapId ,
      "itemCategoryID":category})
      .map(this.extractData)
      .catch(this.handleError)

}

getItemsForSubStore(serviceMapId,mainID) {
  console.log("pharmacology list", serviceMapId);
  this.getAllFacilityItemMappingUrl = this.adminBaseUrl + 'getSubStoreitem';
  return this.http
      .post(this.getAllFacilityItemMappingUrl, { "providerServiceMapID": serviceMapId ,
      "facilityID":mainID})
      .map(this.extractData)
      .catch(this.handleError)

}

deleteFacilityItemMapping(mapID,bool) {
  console.log("mapid", mapID);
  this.getAllFacilityItemMappingUrl = this.adminBaseUrl + 'deleteItemtoStrore';
  return this.http
      .post(this.getAllFacilityItemMappingUrl, { "itemFacilityMapID":mapID,"deleted":bool})
      .map(this.extractData)
      .catch(this.handleError)

}

private extractData(res: Response) {
  if (res.json().data && res.json().statusCode == 200) {
      console.log('Facility Item Mapping Service', res.json(), res.json().data);
      return res.json().data;
  } else {
      return Observable.throw(res.json());
  }
}
  private handleCustomError(error: Response | any) {
  return Observable.throw(error.json());
}
  private handleError(error: Response | any) {
  return Observable.throw(error.json());
}

}
