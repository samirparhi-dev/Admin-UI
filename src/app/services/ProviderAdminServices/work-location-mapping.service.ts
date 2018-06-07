import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
// import { DSVRowAny } from 'd3';
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

    get_State_Url_new: any;
    get_Service_Url_new: any;
    districtID: any;

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
        this.getAllRolesUrl = this.admin_Base_Url + 'm/role/searchV1';

        this.get_SaveWorkLocationMappedDetails_Url = this.admin_Base_Url + 'userRoleMapping';
        this.get_UpdateWorkLocationMappedDetails_Url = this.admin_Base_Url + 'updateUserRoleMapping';
        this.get_DeleteWorkLocationMappedDetails_Url = this.admin_Base_Url + 'deleteUserRoleMapping';

        this.getProviderStates_url = this.admin_Base_Url + 'm/role/state';
        this.getProviderServicesInState_url = this.admin_Base_Url + 'm/role/service';
        this.get_State_Url_new = this.admin_Base_Url + 'm/role/stateNew';
        this.get_Service_Url_new = this.admin_Base_Url + 'm/role/serviceNew';

    };

    getStates(userID, serviceID, isNationalFlag) {
        return this.http.post(this.get_State_Url_new,
            {
                'userID': userID,
                'serviceID': serviceID,
                'isNational': isNationalFlag
            }).map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getServices(userID) {
        return this.httpIntercept.post(this.get_Service_Url_new, { 'userID': userID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getMappedWorkLocationList(serviceProviderID) {
        return this.http.post(this.get_WorkLocationMappedDetails_Url,
            { 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess).catch(this.handleError);
    }

    getUserName(serviceProviderID) {
        // debugger;
        return this.http.post(this.get_ProviderName_Url, { 'serviceProviderID': serviceProviderID })
            .map(this.handleState_n_username).catch(this.handleError);
    }


    getAllDistricts(stateID: any) {
        return this.http
            .get(this.getAllDistrictsByProviderUrl + stateID)
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getAllWorkLocations(serviceProviderID: any, stateID: any, serviceID: any, isNational: any, districtID: any) {
        this.districtID = districtID;
        return this.http
            .post(this.getAllWorkLocationsByProviderUrl,
                {
                    'serviceProviderID': serviceProviderID,
                    'serviceID': serviceID,
                    'stateID': stateID,
                    'isNational': isNational,
                    'districtID': districtID
                })
            .map(this.handleState_n_worklocations)
            .catch(this.handleError);
    }
    getAllRoles(providerServiceMapID) {
        return this.http
            .post(this.getAllRolesUrl, {
                'providerServiceMapID': providerServiceMapID
            })
            .map(this.handleState_n_worklocations)
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
    handleState_n_worklocations(response: Response) {

        console.log(response.json().data, 'all mapped work location file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.deleted === false) {
                return item;
            }
        });
        return result;
    }
    handleState_n_username(response: Response) {

        console.log(response.json().data, 'username work location file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.deleted === false) {
                return item;
            }
        });
        return result;
    }

    handleError(error: Response | any) {
        return Observable.throw(error.json());

    }




};



