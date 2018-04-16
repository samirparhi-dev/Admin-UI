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
    get_facilities_Url: any;
    save_facilities_Url: any;
    update_facilities_Url: any;
    delete_facilities_Url: any;


    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

       
    };
    getfacilities(providerServiceMapID) {
        return this.http.post(this.get_facilities_Url,
            {
                'providerServiceMapID': providerServiceMapID

            }).map(this.handleSuccess)
            .catch(this.handleError);
    }
    deleteFacility(deleteObj) {
        return this.http.post(this.delete_facilities_Url, deleteObj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    savefacilities(obj) {
        return this.http.post(this.save_facilities_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateFacility(editobj) {
        return this.http.post(this.update_facilities_Url, editobj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }


    getServices(userID) {
        return this.http.post(this.get_Service_Url,
            {
                'userID': userID

            }).map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }
    getStates(userID, serviceID, isNational) {
        return this.http.post(this.get_State_Url,
            {
                'userID': userID,
                'serviceID': serviceID,
                'isNational': isNational
            })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }


    handleSuccess(res: Response) {
        console.log(res.json().data, 'Facility Type Master file success response');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'Facility Type Master service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID != 1) {
                return item;
            }
        });
        return result;
    }

    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }




};