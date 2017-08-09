import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 24-07-2017
 * Objective: # A service which would handle the creation of employees and their
               role provisioning
                */
@Injectable()
    export class EmployeeMasterService {

        providerAdmin_Base_Url: any;
        common_Base_Url: any;

        //  CRUD 
        createEmployeeUrl: any;
        editEmployeeUrl: any;
        deleteEmployeeUrl: any;
        getEmployeeUrl: any;

        // data filling helper-api urls
        getRegistrationDataUrl:any;

        getAllQualificationsUrl: any;  // mbbs,btech,mtech   as of now not there/neither wanted acc to ppl

        getAllDistrictsInStateUrl: any;

        getAllStatesOfServiceProviderUrl: any;
        getAllWorkLocationsInStateUrl: any;
        getAllServiceLinesInWorkLocationUrl: any;
        getAllRolesInServiceLine: any;



        // search ka samaan
        getServicesUrl:any;
    find_Roles_Url:any;

       

         

        constructor(private http: Http,public basepaths:ConfigService) { 
          this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
          this.common_Base_Url = this.basepaths.getCommonBaseURL();

          this.createEmployeeUrl = this.providerAdmin_Base_Url + "m/AddEmployee";
          this.editEmployeeUrl = this.providerAdmin_Base_Url + "m/editEmployee";
          this.deleteEmployeeUrl = this.providerAdmin_Base_Url + "m/deleteEmployee";
          this.getEmployeeUrl = this.providerAdmin_Base_Url + "m/SearchEmployeeFilter";

          this.getRegistrationDataUrl = this.common_Base_Url + "beneficiary/getRegistrationData";
          this.getAllDistrictsInStateUrl = this.common_Base_Url + "location/districts/";
          this.getAllStatesOfServiceProviderUrl = this.providerAdmin_Base_Url + "m/location/state";
          // this.getAllWorkLocationsInStateUrl = "";
          // this.getAllServiceLinesInWorkLocationUrl = "";
          this.getAllRolesInServiceLine = this.providerAdmin_Base_Url + "m/role/search";

          // newcontent for search
          this.getServicesUrl = this.providerAdmin_Base_Url + "m/role/service";
          this.find_Roles_Url = this.providerAdmin_Base_Url + "m/role/search";
                      
        };

        getCommonRegistrationData()
        {
          return this.http.post(this.getRegistrationDataUrl, {})
            .map(this.handleSuccess)
            .catch(this.handleError);
        }

        getDistricts(stateID)
        {
          return this.http.get(this.getAllDistrictsInStateUrl + stateID)
            .map(this.handleSuccess)
            .catch(this.handleError);
        }



        // worklocation specific
        getStatesOfServiceProvider(serviceProviderID)
        {
          return this.http.post(this.getAllStatesOfServiceProviderUrl, { "serviceProviderID": serviceProviderID })
          .map(this.handleSuccess)
          .catch(this.handleError);
        }

        getWorkLocationsInState()
        {
          return this.http.post(this.getAllWorkLocationsInStateUrl, { })
            .map(this.handleSuccess)
            .catch(this.handleError);
        }

        getServiceLinesInWorkLocation()
        {
          return this.http.post(this.getAllServiceLinesInWorkLocationUrl, {})
            .map(this.handleSuccess)
            .catch(this.handleError);
        }

        getRolesInServiceLine(serviceProviderID, stateID, serviceID)
        {
          return this.http.post(this.getAllRolesInServiceLine,
            {
              "serviceProviderID": serviceProviderID,
              "stateID": stateID,
              "serviceID": serviceID
            })
            .map(this.handleSuccess)
            .catch(this.handleError);
        }
    
        getServices(serviceProviderID,stateID)
        {
          return this.http.post(this.getServicesUrl,{
          "serviceProviderID": serviceProviderID,
          "stateID": stateID
        })
        .map(this.handleSuccess)
        .catch(this.handleError);
        }

    getRoles(serviceProviderID, stateID, serviceID) {
      return this.http.post(this.find_Roles_Url,
        {
          "serviceProviderID": serviceProviderID,
          "stateID": stateID,
          "serviceID": serviceID
        })
        .map(this.handleSuccess)
        .catch(this.handleError);

    }



        // CRUD begins
        createEmployee(requestObject)
        {
          console.log(requestObject,"request obj in service")
          return this.http.post(this.createEmployeeUrl, requestObject)
            .map(this.handleSuccess)
            .catch(this.handleError);
        }

        editEmployee(requestObject) {
          return this.http.post(this.editEmployeeUrl, requestObject)
            .map(this.handleSuccess)
            .catch(this.handleError);
        }

        deleteEmployee(userID) {
          return this.http.post(this.deleteEmployeeUrl, { "userID": userID })
            .map(this.handleSuccess)
            .catch(this.handleError);
        }

        getEmployees(requestObject)
        {
      return this.http.post(this.getEmployeeUrl, requestObject)
            .map(this.handleSuccess)
            .catch(this.handleError);
        }     
        // CRUD ends

        handleSuccess(response: Response) {
            console.log(response.json().data, "--- in employee master SERVICE");
            return response.json().data;
        }

        handleError(error: Response | any) {
            let errMsg: string;
            if (error instanceof Response) {
                const body = error.json() || '';
                const err = body.error || JSON.stringify(body);
                errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            } else {
                errMsg = error.message ? error.message : error.toString();
            }
            console.error(errMsg);
            return Observable.throw(errMsg);
        }
};



