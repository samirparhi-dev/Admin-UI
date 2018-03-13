import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
/**
 * Author: krishna Gunti ( 378952 )
 * Date: 05-03-2018
 * Objective: # A service which would handle the Language Mapping services.
 */

@Injectable()
export class WorkLocationMapping {
    admin_Base_Url: any;
    commonbaseurl: any;
    get_ProviderName_Url: any;
    getAllRolesUrl: any;
    getAllDistrictsByProviderUrl: any;
    getAllWorkLocationsByProviderUrl: any;
    get_WorkLocationMappedDetails_Url: any;
    get_SaveWorkLocationMappedDetails_Url: any;
    get_UpdateWorkLocationMappedDetails_Url: any;
    get_DeleteWorkLocationMappedDetails_Url;


    getAllServiceLinesByProviderUrl: any;
    getAllStatesByProviderUrl: any;

    getProviderStates_url: any;
    getProviderServicesInState_url: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.commonbaseurl = this.basepaths.getCommonBaseURL();

        this.getAllStatesByProviderUrl = this.admin_Base_Url + 'm/location/getStatesByServiceID';
        this.getAllServiceLinesByProviderUrl = this.admin_Base_Url + 'getServiceLinesUsingProvider';
        this.getAllDistrictsByProviderUrl = this.commonbaseurl + 'location/districts/';
        this.getAllWorkLocationsByProviderUrl = this.admin_Base_Url + 'm/location/getAlllocation';
        this.get_ProviderName_Url = this.admin_Base_Url + 'm/SearchEmployee4';
        this.get_WorkLocationMappedDetails_Url = this.admin_Base_Url + 'getUserRoleMapped';
        this.getAllRolesUrl = this.admin_Base_Url + 'm/role/search1';

        this.get_SaveWorkLocationMappedDetails_Url = this.admin_Base_Url + 'userRoleMapping';
        this.get_UpdateWorkLocationMappedDetails_Url = this.admin_Base_Url + 'updateUserRoleMapping';
        this.get_DeleteWorkLocationMappedDetails_Url = this.admin_Base_Url + 'deleteUserRoleMapping';

        this.getProviderStates_url = this.admin_Base_Url + 'm/role/state';
        this.getProviderServicesInState_url = this.admin_Base_Url + 'm/role/service';
    };

    getProviderStates(serviceProviderID) {
        return this.http.post(this.getProviderStates_url,
            { 'serviceProviderID': serviceProviderID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getProviderServicesInState(serviceProviderID, stateID) {
        return this.http.post(this.getProviderServicesInState_url,
            {
                'serviceProviderID': serviceProviderID,
                'stateID': stateID
            }).map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getMappedWorkLocationList() {
        return this.http.post(this.get_WorkLocationMappedDetails_Url, {})
            .map(this.handleSuccess).catch(this.handleError);
    }

    getUserName(serviceProviderID) {
        // debugger;
        return this.http.post(this.get_ProviderName_Url, { 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess).catch(this.handleError);
    }


    getAllServiceLinesByProvider(serviceProviderID: any) {
        // debugger;
        return this.http
            .post(this.getAllServiceLinesByProviderUrl, { "serviceProviderID": serviceProviderID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getAllStatesByProvider(serviceProviderID: any, serviceLineID: any) {
        // debugger;
        return this.http
            .post(this.getAllStatesByProviderUrl, { 'serviceProviderID': serviceProviderID, 'serviceID': serviceLineID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }
    getAllDistricts(stateID: any) {
        return this.http
            .get(this.getAllDistrictsByProviderUrl + stateID)
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getAllWorkLocations(serviceProviderID: any, stateID: any, serviceID: any) {
        return this.http
            .post(this.getAllWorkLocationsByProviderUrl, { 'serviceProviderID': serviceProviderID, 'serviceID': serviceID, 'stateID': stateID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }
    getAllRoles(serviceProviderID: any, stateID: any, serviceLineID: any) {
        return this.http
            .post(this.getAllRolesUrl, { 'serviceProviderID': serviceProviderID, 'stateID': stateID, 'serviceID': serviceLineID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }


    SaveWorkLocationMapping(data) {
        return this.httpIntercept.post(this.get_SaveWorkLocationMappedDetails_Url, data).map(this.handleSuccess).catch(this.handleError);

    }

    UpdateWorkLocationMapping(data) {
        return this.httpIntercept.post(this.get_UpdateWorkLocationMappedDetails_Url, data).map(this.handleSuccess).catch(this.handleError);

    }

    DeleteWorkLocationMapping(data) {
        return this.httpIntercept.post(this.get_DeleteWorkLocationMappedDetails_Url, data).map(this.handleSuccess).catch(this.handleError);

    }

    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'work location file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.statusID !== 4) {
                return item;
            }
        });
        return result;
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, 'work location mapping transactions file success response');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleError(error: Response | any) {
        return Observable.throw(error.json());

    }




};



