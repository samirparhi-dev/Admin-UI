import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from "../config/config.service";



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 24-07-2017
 * Objective: # A service which would handle the creation of employees and their
               role provisioning
               */
               @Injectable()
               export class UserRoleAgentID_MappingService {

                admin_Base_Url: any;
                common_Base_Url: any;

                get_State_Url:any;
                get_Service_Url:any;
                get_Roles_Url: any;

                get_Campaigns_Url:any;
                get_AgentIDs_Url:any;

  //  CRUD 
  getEmployeeUrl: any;
  mapAgentID_Url:any;


  constructor(private http: Http, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();

    this.get_State_Url = this.admin_Base_Url + "m/role/state";
    this.get_Service_Url = this.admin_Base_Url + "m/role/service";
    this.get_Roles_Url = this.admin_Base_Url + "m/role/search";

    this.get_Campaigns_Url=this.admin_Base_Url+"getAvailableCampaigns";
    this.get_AgentIDs_Url=this.admin_Base_Url+"getAvailableAgentIds";

    this.getEmployeeUrl = this.admin_Base_Url + "m/SearchEmployeeFilter";
    this.mapAgentID_Url=this.admin_Base_Url+"usrRoleAndCtiMapping";
  };

  getStates(serviceProviderID) {
    return this.http.post(this.get_State_Url, { "serviceProviderID": serviceProviderID })
    .map(this.handleSuccess)
    .catch(this.handleError);
  }

  getServices(serviceProviderID,stateID) {
    return this.http.post(this.get_Service_Url, { "serviceProviderID": serviceProviderID,
                          "stateID": stateID
                        }).map(this.handleSuccess)
    .catch(this.handleError);
  }

  getRoles(serviceProviderID, stateID, serviceID) {
    return this.http.post(this.get_Roles_Url,
    {
      "serviceProviderID": serviceProviderID,
      "stateID": stateID,
      "serviceID": serviceID
    })
    .map(this.handleSuccess)
    .catch(this.handleError);
  }

  getEmployees(requestObject) {
    return this.httpIntercept.post(this.getEmployeeUrl, requestObject)
    .map(this.handleSuccess)
    .catch(this.handleError);
  }

  getAvailableCampaigns(providerServiceMapID)
  {
    return this.http.post(this.get_Campaigns_Url, {"providerServiceMapID":providerServiceMapID})
    .map(this.handleSuccess)
    .catch(this.handleError);
  }

  getAgentIDs(providerServiceMapID,campaign_name)
  {
    return this.http.post(this.get_AgentIDs_Url, 
                          {"providerServiceMapID":providerServiceMapID,
                          "cti_CampaignName":campaign_name
                        })
    .map(this.handleSuccess)
    .catch(this.handleError);
  }

  mapAgentID(data)
  {
    return this.http.post(this.mapAgentID_Url, data)
    .map(this.handleSuccess)
    .catch(this.handleError);
  }
  

  handleSuccess(response: Response) {
    console.log(response.json().data, "--- in User-Role-AgentID-Mapping SERVICE");
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



