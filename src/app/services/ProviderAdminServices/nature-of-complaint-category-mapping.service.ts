import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { ConfigService } from '../config/config.service';


@Injectable()
export class NatureOfCompaintCategoryMappingService {

    providerAdmin_Base_Url: any;
    getServiceLines_url: any;
    getStates_url: any;
    getFeedbackTypes_Url: any;
    getFeedbackNatureTypes_url: any;
    getMapping_url: any;
    getCategory_url: any;
    saveComplaintToCategoryMapping_url: any;
    updateComplaintCategoryMapping_url: any;
    unmapCategory_url: any;
    filterMappedCategory_url: any;


    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.getServiceLines_url = this.providerAdmin_Base_Url + 'm/role/serviceNew';
        this.getStates_url = this.providerAdmin_Base_Url + 'm/role/stateNew';
        this.getFeedbackTypes_Url = this.providerAdmin_Base_Url + 'm/getFeedbackType';
        this.getFeedbackNatureTypes_url = this.providerAdmin_Base_Url + 'm/getFeedbackNatureType';
        this.getMapping_url = this.providerAdmin_Base_Url + 'm/getmapedCategorytoFeedbackNatureWithFeedbackNatureID';
        this.getCategory_url = this.providerAdmin_Base_Url + '/m/getCategoryByMapID';
        this.saveComplaintToCategoryMapping_url = this.providerAdmin_Base_Url + '/m/mapCategorytoFeedbackNature';
        this.updateComplaintCategoryMapping_url = this.providerAdmin_Base_Url + '/m/updateCategorytoFeedbackNature';
        this.unmapCategory_url = this.providerAdmin_Base_Url + '/t/unmappCategoryforFeedbackNature';
        this.filterMappedCategory_url = this.providerAdmin_Base_Url + '/m/getunmappedCategoryforFeedbackNature';
    }
    getServiceLines(userID) {
        return this.httpIntercept
            .post(this.getServiceLines_url, { 'userID': userID })
            .map(this.handleState_n_ServiceSuccess)
            .catch(this.handleError);
    }
    getStates(obj) {
        return this.httpIntercept
            .post(this.getStates_url, obj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getFeedbackTypes(providerServiceMapID) {
        return this.httpIntercept
            .post(this.getFeedbackTypes_Url, { 'providerServiceMapID': providerServiceMapID })
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getFeedbackNatureTypes(natureObject) {
        return this.httpIntercept
            .post(this.getFeedbackNatureTypes_url, natureObject)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getMapping(reqObj) {
        return this.httpIntercept
            .post(this.getMapping_url, reqObj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getAllCategory(providerServiceMapID) {
        return this.httpIntercept
            .post(this.getCategory_url, { 'providerServiceMapID': providerServiceMapID })
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    unmapCategory(unmapObj) {
        return this.httpIntercept
            .post(this.unmapCategory_url, unmapObj)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    filterMappedCategory(providerServiceMapID) {
        return this.httpIntercept
            .post(this.filterMappedCategory_url, { 'providerServiceMapID': providerServiceMapID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    saveComplaintToCategoryMapping(mappingObj) {
        return this.httpIntercept
            .post(this.saveComplaintToCategoryMapping_url, mappingObj)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    updateComplaintCategoryMapping(updateObj) {
        return this.httpIntercept
            .post(this.updateComplaintCategoryMapping_url, updateObj)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    handleState_n_ServiceSuccess(response: Response) {

        console.log(response.json().data, 'nature of complaint service file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.serviceID === 3 || item.serviceID === 6) {
                return item;
            }
        });
        return result;
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in nature of complaint service');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }
}
