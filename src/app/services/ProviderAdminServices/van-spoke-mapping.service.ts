import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { ConfigService } from "../config/config.service";

@Injectable()
export class VanSpokeMappingService {

    providerAdmin_Base_Url: any;
    common_Base_Url: any;
    getServiceLines_new_url: any;
    getStates_new_url: any;
    zonesurl: any;
    parkingPlaceUrl: any;
    servicepointUrl: any;
    vanTypesURL: any;
    van_spoke_Url: any;
    saveUrl: any;
    fetchUrl: any;
    activeMappingStatusUrl: any;
    fetchUnmappedVansurl: any;

    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        this.getServiceLines_new_url = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this.getStates_new_url = this.providerAdmin_Base_Url + 'm/role/stateNew';
        this.zonesurl = this.providerAdmin_Base_Url + 'zonemaster/get/zones';
        this.parkingPlaceUrl = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/parkingPlacesbyzoneid';
        this.servicepointUrl = this.providerAdmin_Base_Url + 'servicePointMaster/get/servicePoints';
        this.vanTypesURL = this.providerAdmin_Base_Url + "vanMaster/get/vanTypes";
        this.van_spoke_Url = this.providerAdmin_Base_Url + 'vanMaster/get/vanDetails';
        this.saveUrl = this.providerAdmin_Base_Url + 'mapping/save/vanSpokeMapping';
        this.fetchUrl = this.providerAdmin_Base_Url + 'mapping/get/vanSpokeMapping';
        this.activeMappingStatusUrl = this.providerAdmin_Base_Url + 'mapping/delete/vanSpokeMapping';
        this.fetchUnmappedVansurl = this.providerAdmin_Base_Url + '*';
    }
    getServiceLines(userID) {
        return this.httpIntercept
            .post(this.getServiceLines_new_url, { 'userID': userID })
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    getStates(serviceline) {
        return this.httpIntercept
            .post(this.getStates_new_url, serviceline)
            .map(this.handleSuccess)
            .catch(this.handleError)
           
    }
    getZones(providerServiceMapID) {
        return this.httpIntercept
        .post(this.zonesurl, providerServiceMapID)
        .map(this.handleSuccess)
        .catch(this.handleError)
    }
    getParkingPlace(parkingplaceReqObj) {
        return this.httpIntercept
        .post(this.parkingPlaceUrl, parkingplaceReqObj)
        .map(this.handleSuccess)
        .catch(this.handleError)
    }
    getServicepoints(servicepointObj) {
        return this.httpIntercept
        .post(this.servicepointUrl, servicepointObj)
        .map(this.handleSuccess)
        .catch(this.handleError)
    }
    getVanTypes(providerServiceMapID) {
        return this.httpIntercept
        .post(this.vanTypesURL, providerServiceMapID)
        .map(this.handleSuccess)
        .catch(this.handleError)
    }
    getVansOrspoke(reqObj) {
        return this.httpIntercept
        .post(this.van_spoke_Url, reqObj)
        .map(this.handleSuccess)
        .catch(this.handleError)
    }
    saveMappingData(saveObj) {
        return this.httpIntercept
        .post(this.saveUrl, saveObj)
        .map(this.handleSuccess)
        .catch(this.handleError)

    }
    getVanSpokeMapping(fetchObj) {
        return this.httpIntercept
        .post(this.fetchUrl, fetchObj)
        .map(this.handleSuccess)
        .catch(this.handleError)

    }
    updateMappingStatus(activeStatusReqObj) {
        return this.httpIntercept
        .post(this.activeMappingStatusUrl, activeStatusReqObj)
        .map(this.handleSuccess)
        .catch(this.handleError)

    }
    fetchUnmappedVansToSpoke(unmappedvansObj) {
        return this.httpIntercept
        .post(this.fetchUnmappedVansurl, unmappedvansObj)
        .map(this.handleSuccess)
        .catch(this.handleError)

    }
   handleSuccess(response: Response) {
       if(response.json().statusCode == 200) {
           return response.json().data
       } else {
           console.log("error", response.json().errorMessage);
       }

   }
handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return Observable.throw(errorMessage);
  }
}
