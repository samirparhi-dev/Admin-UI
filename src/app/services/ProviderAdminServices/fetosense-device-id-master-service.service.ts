import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';



/**
 * Author: DE40034072
 * Date: 29-06-2021
 * Objective: # A service which would handle the DEVICE ID MASTER services.
 */

@Injectable()
export class FetosenseDeviceIdMasterService {
  adminBaseUrl: any;

  getStateUrl: any;
  getServiceLineUrl: any;


  fetosenseDeviceMasterServiceUrl: any;
  editFetosenseDeviceIdUrl: any;
  deleteFetosenseDeviceMasterUrl: any;
  getFetosenseDeviceMasterUrl: any;
  getSpokeIdAndDeviceIdUrl: any;
  spokeDeviceIdMappingUrl: any;
  getZonesURL: any;
  getParkingPlacesURL:any;
  getVanTypesURL: any;
  getVanDeviceIdMappingsURL: any;
  deleteSpokeDeviceIdMappingUrl: any;
  editSpokeDeviceIdMappingUrl: any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.adminBaseUrl = this.basepaths.getAdminBaseUrl();

    this.getStateUrl = this.adminBaseUrl + 'm/role/stateNew';
    this.getServiceLineUrl = this.adminBaseUrl + 'm/role/serviceNew';
   /**Device ID Master Urls */
   this.getFetosenseDeviceMasterUrl = this.adminBaseUrl + 'fetosense/fetch/fetosenseDeviceID';
   this.fetosenseDeviceMasterServiceUrl = this.adminBaseUrl + 'fetosense/createFetosenseDeviceID';
    this.editFetosenseDeviceIdUrl = this.adminBaseUrl + 'fetosense/update/fetosenseDeviceID';
    this.deleteFetosenseDeviceMasterUrl = this.adminBaseUrl + 'fetosense/delete/fetosenseDeviceID';
    
    /**Spoke Device ID Mapping Urls */
    this.getSpokeIdAndDeviceIdUrl= this.adminBaseUrl + 'fetosense/fetch/vanIDAndFetosenseDeviceID';
    this.spokeDeviceIdMappingUrl= this.adminBaseUrl + 'fetosense/mapping/vanIDAndDeviceID';
    this.getZonesURL = this.adminBaseUrl + "zonemaster/get/zones";
    this.getParkingPlacesURL = this.adminBaseUrl + 'parkingPlaceMaster/get/parkingPlacesbyzoneid';
    this.getVanTypesURL = this.adminBaseUrl + "vanMaster/get/vanTypes";
    this.getVanDeviceIdMappingsURL = this.adminBaseUrl + "fetosense/fetch/mappingWorklist";
    this.deleteSpokeDeviceIdMappingUrl = this.adminBaseUrl + 'fetosense/delete/vanIDAndFetosenseDeviceIDMapping';
    this.editSpokeDeviceIdMappingUrl = this.adminBaseUrl + 'fetosense/update/vanIDAndFetosenseDeviceIDMapping';
  }



  getServiceLines(userID) {
  
    return this.httpIntercept
      .post(this.getServiceLineUrl, { 'userID': userID })
      .map(response => response.json());
  }

  getStates(userID, serviceID, isNationalFlag) {

    return this.httpIntercept
    .post(this.getStateUrl, {
        'userID': userID,
        'serviceID': serviceID,
        'isNational': isNationalFlag
      })
    .map(response => response.json());
    }
 

/**Device ID Master screen Api's */

  getFetosenseDeviceMaster(providerServiceMapID) {

    return this.httpIntercept
      .post(this.getFetosenseDeviceMasterUrl, { 'providerServiceMapID': providerServiceMapID })
      .map(response => response.json());
  }


  toggle_activate_DeviceMaster(data) {

    return this.httpIntercept
    .post(this.deleteFetosenseDeviceMasterUrl, data)
    .map(response => response.json());

  
  }



  saveFetosenseDeviceMaster(data) {

   return this.httpIntercept
      .post(this.fetosenseDeviceMasterServiceUrl, data)
      .map(response => response.json());
  }



  editFetosenseDeviceMaster(data) {

  return this.httpIntercept
      .post(this.editFetosenseDeviceIdUrl, data)
      .map(response => response.json());
  }

  /**END */

/**Spoke Device ID Mapping screen Api's */

  toggle_activate_SpokeDeviceIdMapping(data) {

    return this.httpIntercept
    .post(this.deleteSpokeDeviceIdMappingUrl, data)
    .map(response => response.json());

  
  }



  saveSpokeDeviceIdMapping(data) {

    return this.httpIntercept
       .post(this.spokeDeviceIdMappingUrl, data)
       .map(response => response.json());
   }

  
  editSpokeDeviceIdMapping(data) {

    return this.httpIntercept
        .post(this.editSpokeDeviceIdMappingUrl, data)
        .map(response => response.json());
    }

  getSpokeIdAndDeviceId(data) {
    return this.httpIntercept
    .post(this.getSpokeIdAndDeviceIdUrl, data)
    .map(response => response.json());
      
  }

  getZones(data) {
    return this.httpIntercept
    .post(this.getZonesURL, data)
    .map(response => response.json());

}
    
getParkingPlaces(data) {
  return this.httpIntercept
  .post(this.getParkingPlacesURL, data)
  .map(response => response.json());

}

getVanTypes(data) {
  return this.httpIntercept
  .post(this.getVanTypesURL, data)
  .map(response => response.json());
  
  
}

getVanDeviceIdMappings(data) {
  return this.httpIntercept
  .post(this.getVanDeviceIdMappingsURL, data)
  .map(response => response.json());


}

  
/**END */

}