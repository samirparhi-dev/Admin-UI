import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';


@Injectable()
export class Mainstroreandsubstore {
    admin_Base_Url: any;
    common_Base_Url: any;

    get_State_Url: any;
    get_Service_Url: any;
    get_stores_Url: any;
    save_stores_Url: any;
    update_stores_Url: any;
    delete_stores_Url: any;
    get_facilities_Url: any;
    get_itemCategory_Url: any;
    save_itemCategory_Url: any;
    save_expiryAlertConfig_Url: any;

    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        this.get_State_Url = this.admin_Base_Url + 'm/role/stateNew';
        this.get_Service_Url = this.admin_Base_Url + 'm/role/serviceNew';
        this.get_stores_Url = this.admin_Base_Url + '/getAllStore';
        this.save_stores_Url = this.admin_Base_Url + '/createStore';
        this.update_stores_Url = this.admin_Base_Url + '/editStore';
        this.delete_stores_Url = this.admin_Base_Url + '/deleteStore';
        this.get_facilities_Url = this.admin_Base_Url + '/getFacility';
        this.get_itemCategory_Url = this.admin_Base_Url + '/getItemCategory';
        this.save_itemCategory_Url = this.admin_Base_Url + '/configItemIssue';
        this.save_expiryAlertConfig_Url = this.admin_Base_Url + '/configexpiryalert';
    };

    getAllStores(providerServiceMapID) {
        return this.http.post(this.get_stores_Url + '/' + providerServiceMapID, '')
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getAllActiveFacilities(providerServiceMapID) {
        return this.http.post(this.get_facilities_Url, {
            'providerServiceMapID': providerServiceMapID
        }).map(this.handleState_n_FilteredSuccess)
            .catch(this.handleError);
    }

    getStoreType(providerServiceMapID) {
        return this.http.post(this.get_stores_Url + '/' + providerServiceMapID, null
        ).map(this.handleState_n_FilteredstoreTypeSuccess)
            .catch(this.handleError);
    }

    deleteStore(deleteObj) {
        debugger;
        return this.http.post(this.delete_stores_Url, deleteObj
        ).map(this.handleSuccess)
            .catch(this.handleError)
    }

    saveStore(obj) {
        return this.http.post(this.save_stores_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateStore(editobj) {
        return this.http.post(this.update_stores_Url, editobj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }

    getServices(userID) {
        return this.http.post(this.get_Service_Url, {
            'userID': userID
        }).map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }

    getStates(userID, serviceID, isNational) {
        return this.http.post(this.get_State_Url, {
            'userID': userID,
            'serviceID': serviceID,
            'isNational': isNational
        }).map(this.handleSuccess)
            .catch(this.handleError);
    }

    getItemCategory(providerServiceMapID) {
        return this.http.get(this.get_itemCategory_Url + '/' + providerServiceMapID + '/' + 0, {})
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    saveItemIssueConfig(obj) {
        return this.http.post(this.save_itemCategory_Url, obj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    saveExpiryAlertConfig(obj) {
        return this.http.post(this.save_expiryAlertConfig_Url, obj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    handleSuccess(res: Response) {
        debugger;
        console.log(res.json().data, 'Main Stores file success response');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleState_n_ServiceSuccess(response: Response) {
        console.log(response.json().data, 'Main Stores service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID != 1) {
                return item;
            }
        });
        return result;
    }
    handleState_n_FilteredSuccess(response: Response) {
        debugger;
        console.log(response.json().data, 'filtered facility service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (!item.deleted) {
                return item;
            }
        });
        return result;
    }

    handleState_n_FilteredstoreTypeSuccess(response: Response) {
        debugger;
        console.log(response.json().data, 'filtered store Types service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.storeType === "MAIN") {
                return item;
            }
        });
        return result;
    }

    handleError(error: Response | any) {
        debugger;
        return Observable.throw(error.json());
    }


};