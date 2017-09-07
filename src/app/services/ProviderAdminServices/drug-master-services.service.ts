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
export class DrugMasterService {
     providerAdmin_Base_Url: any;

     //CRUD
     saveDrugGroupsURL:any;
     saveDrugsURL:any;
     mapDrugGroupURL:any;
     
     getDrugsListURL:any;
     getDrugGroupsURL:any;

     updateDrugStatusURL:any;

     updateDrugDataURL:any;
     updateDrugGroupURL:any;

     constructor(private http: Http,public basepaths:ConfigService) { 
          this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        // this.providerAdmin_Base_Url = "http://localhost:8080/";
          this.saveDrugGroupsURL = this.providerAdmin_Base_Url + "m/saveDrugGroup";
          this.saveDrugsURL = this.providerAdmin_Base_Url + "m/saveDrug";
          this.mapDrugGroupURL = this.providerAdmin_Base_Url + "m/mapDrugWithGroup";
          this.getDrugsListURL = this.providerAdmin_Base_Url + "m/getDrugData";
          this.getDrugGroupsURL = this.providerAdmin_Base_Url + "m/getDrugGroups";
          this.updateDrugStatusURL = this.providerAdmin_Base_Url + "m/updateDrugStatus";
          this.updateDrugDataURL = this.providerAdmin_Base_Url + "m/updateDrugMaster";
          this.updateDrugGroupURL = this.providerAdmin_Base_Url + "m/updateDrugGroup";
                    
    };

    saveDrugGroups(data)
    {
        return this.http.post(this.saveDrugGroupsURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    saveDrugs(data)
    {
        return this.http.post(this.saveDrugsURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    mapDrugGroups(data){
        return this.http.post(this.mapDrugGroupURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getDrugsList(){
        return this.http.post(this.getDrugsListURL, {})
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getDrugGroups(){
        return this.http.post(this.getDrugGroupsURL, {})
        .map(this.handleSuccess)
        .catch(this.handleError);
    }
    updateDrugStatus(data){
        return this.http.post(this.updateDrugStatusURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    updateDrugGroup(data){
        return this.http.post(this.updateDrugGroupURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    updateDrugData(data){
        return this.http.post(this.updateDrugDataURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

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

}