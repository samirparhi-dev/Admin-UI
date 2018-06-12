import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class StoreMappingService {

  adminBaseUrl: String;

  constructor(
    private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
  }

  getAllStore(serviceMapID) {
    let getStoreUrl = this.adminBaseUrl + 'getMapStore';
    return this.http
      .post(getStoreUrl, { providerServiceMapID: serviceMapID })
      .map(this.extractData)
      .catch(this.handleError)
  }

  getAllParkingPlace(serviceMapID) {
    let getStoreUrl = this.adminBaseUrl + 'parkingPlaceMaster/getParkingPlaces';
    return this.http
      .post(getStoreUrl, { providerServiceMapID: serviceMapID })
      .map(this.extractData)
      .catch(this.handleError)
  }

  getAllVan(facilityID) {
    let getStoreUrl = this.adminBaseUrl + 'vanMaster/getVanFromFacilityID';
    return this.http
      .post(getStoreUrl, { facilityID })
      .map(this.extractData)
      .catch(this.handleError)
  }

  postStoreMapping(storeMapping) {
    let postUOMUrl = this.adminBaseUrl + 'mapStore';
    return this.http
      .post(postUOMUrl, storeMapping)
      .map(this.extractData)
      .catch(this.handleError)
  }

  deleteMapping(store) {
    let toggleDeletedUrl = this.adminBaseUrl + 'deleteMapStore';
    return this.http
      .post(toggleDeletedUrl, store)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(res: Response) {
    if (res.json().data && res.json().statusCode == 200) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  private handleError(error: Response | any) {
    return Observable.throw(error.json());
  }

}
