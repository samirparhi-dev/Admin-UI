/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
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
