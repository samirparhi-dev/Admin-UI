import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { ConfigService } from '../config/config.service';

@Injectable()

export class EmployeeMasterNewServices {

    // Base Urls
    providerAdmin_base_url: any
    common_base_url: any;

    // Urls - Fetching dropdown related data
    getAllTitlesUrl: any;
    getAllGendersUrl: any;
    getAllDesignationsUrl: any;
    getAllMaritalStatusesUrl: any;
    getAllQualificationsUrl: any;
    getRegistrationDataUrl: any;
    getAllCommunitiesUrl: any;
    getAllReligionUrl: any;
    getAllStatesUrl: any;
    getAllDistrictsUrl: any;
    checkUserAvailabilityUrl: any;
    checkID: any;

    constructor(private http: InterceptedHttp,
        public basePaths: ConfigService,
        private httpSecurity: SecurityInterceptedHttp) {
        this.providerAdmin_base_url= this.basePaths.getAdminBaseUrl();
        this.common_base_url= this.basePaths.getCommonBaseURL();

        // APIs - For fetching dropdown data
        this.getRegistrationDataUrl= this.common_base_url + 'beneficiary/getRegistrationData';
        // this.getAllTitlesUrl= this.providerAdmin_base_url + '/m/AllTitle';
        // this.getAllGendersUrl= this.providerAdmin_base_url + '/m/AllGender';
        this.getAllDesignationsUrl= this.providerAdmin_base_url + '/m/getDesignation';
        this.getAllMaritalStatusesUrl= this.common_base_url + '/beneficiary/getRegistrationDataV1';
        this.getAllQualificationsUrl= this.providerAdmin_base_url+ '/m/Qualification';
        this.getAllCommunitiesUrl= this.providerAdmin_base_url+ '';
        this.getAllReligionUrl= this.providerAdmin_base_url+ '';
        this.getAllStatesUrl= this.common_base_url+ 'location/states/';
        this.getAllDistrictsUrl= this.common_base_url+ 'location/districts/';
        this.checkID = this.providerAdmin_base_url + 'm/FindEmployeeDetails';
    }
    // User Details related methods for fetching all dropdown data
    getCommonRegistrationData() {
        return this.httpSecurity
          .post(this.getRegistrationDataUrl, {})
          .map(this.extractData)
          .catch(this.handleError);
      }
      checkUserAvailability(name) {
        return this.httpSecurity
        .post(this.checkUserAvailabilityUrl, {
          'userName': name
        })
        .map(this.extractData)
        .catch(this.handleError)
      }
    // getAllTitles() {
    //     return this.httpSecurity
    //     .post(this.getAllTitlesUrl, {})
    //     .map(this.extractData)
    //     .catch(this.handleError)
    // }
    // getAllGenders() {
    //     return this.httpSecurity
    //     .post(this.getAllGendersUrl, {})
    //     .map(this.extractData)
    //     .catch(this.handleError)
    // }
    getAllDesignations() {
        return this.httpSecurity
        .post(this.getAllDesignationsUrl, {})
        .map(this.extractData)
        .catch(this.handleError)
    }
    getAllMaritalStatuses() {
        return this.httpSecurity
        .post(this.getAllMaritalStatusesUrl, {})
        .map(this.extractData)
        .catch(this.handleError)
    }
    getAllQualifications() {
        return this.httpSecurity
        .post(this.getAllQualificationsUrl, {})
        .map(this.extractData)
        .catch(this.handleError)
    }
    getAllCommunities() {
        return this.httpSecurity
        .post(this.getAllCommunitiesUrl, {})
        .map(this.extractData)
        .catch(this.handleError)
    }
    getAllReligion() {
        return this.httpSecurity
        .post(this.getAllReligionUrl, {})
        .map(this.extractData)
        .catch(this.handleError)
    }
    getAllStates(countryId) {
        console.log("inside states");   
        return this.httpSecurity
        .get(this.getAllStatesUrl+ countryId)
        .map(this.extractData)
        .catch(this.handleError)
    }
    getAllDistricts(stateID) {         
        return this.httpSecurity
        .get(this.getAllDistrictsUrl+ stateID)
        .map(this.extractData)
        .catch(this.handleError)
    }
    validateAadhar(idNumber: any) {
        return this.httpSecurity
          .post(this.checkID, { 'aadhaarNo': idNumber })
          .map(this.extractCustomData)
          .catch(this.handleError);
      }
      validatePan(idNumber: any) {
        return this.httpSecurity
        .post(this.checkID, { 'pAN': idNumber })
          .map(this.extractCustomData)
          .catch(this.handleError);
      }








    private extractCustomData(res: Response) {
        if (res.json().data) {
            console.log('Employee Master New Service', res.json().data);
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
    private extractData(res: Response) {
        if (res.json().data) {
            console.log('Employee Master New Service', res.json().data);
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