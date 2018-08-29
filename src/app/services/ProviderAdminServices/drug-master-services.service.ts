import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DrugMasterService {
    providerAdmin_Base_Url: any;

    // CRUD
    saveDrugGroupsURL: any;
    saveDrugsURL: any;
    mapDrugGroupURL: any;

    getDrugsListURL: any;
    getDrugGroupsURL: any;
    getDrugMappingsURL: any;
    getAllDrugStrengthsUrl: any;

    updateDrugStatusURL: any;

    updateDrugDataURL: any;
    updateDrugGroupURL: any;
    updateDrugMappingsURL: any;

    _getStateListBYServiceIDURL: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.saveDrugGroupsURL = this.providerAdmin_Base_Url + 'm/saveDrugGroup';
        this.saveDrugsURL = this.providerAdmin_Base_Url + 'm/saveDrug';
        this.mapDrugGroupURL = this.providerAdmin_Base_Url + 'm/mapDrugWithGroup';
        this.getDrugsListURL = this.providerAdmin_Base_Url + 'm/getDrugData';
        this.getDrugGroupsURL = this.providerAdmin_Base_Url + 'm/getDrugGroups';
        this.updateDrugStatusURL = this.providerAdmin_Base_Url + 'm/updateDrugStatus';
        this.updateDrugDataURL = this.providerAdmin_Base_Url + 'm/updateDrugMaster';
        this.updateDrugGroupURL = this.providerAdmin_Base_Url + 'm/updateDrugGroup';
        this.getDrugMappingsURL = this.providerAdmin_Base_Url + 'm/getDrugGroupMappings';
        this.updateDrugMappingsURL = this.providerAdmin_Base_Url + 'm/updateDrugMapping';
        this.getAllDrugStrengthsUrl = this.providerAdmin_Base_Url + '/getDrugStrangth';

        this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + 'm/location/getStatesByServiceID';

    };

    saveDrugGroups(data) {
        return this.httpIntercept.post(this.saveDrugGroupsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    saveDrugs(data) {
        return this.httpIntercept.post(this.saveDrugsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    mapDrugGroups(data) {
        return this.httpIntercept.post(this.mapDrugGroupURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getDrugsList(data) {
        return this.httpIntercept.post(this.getDrugsListURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getDrugGroups(data) {
        return this.httpIntercept.post(this.getDrugGroupsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getDrugMappings(data) {
        return this.httpIntercept.post(this.getDrugMappingsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    // getAllDrugStrengths() {
    //     return this.httpIntercept.post(this.getAllDrugStrengthsUrl, {})
    //     .map(this.handleSuccess)
    //     .catch(this.handleError);
    // }
    updateDrugStatus(data) {
        return this.httpIntercept.post(this.updateDrugStatusURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateDrugGroup(data) {
        return this.httpIntercept.post(this.updateDrugGroupURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateDrugData(data) {
        return this.httpIntercept.post(this.updateDrugDataURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateDrugMappings(data) {
        return this.httpIntercept.post(this.updateDrugMappingsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getStatesByServiceID(serviceID, serviceProviderID) {
        return this.httpIntercept.post(this._getStateListBYServiceIDURL,
            { 'serviceID': serviceID, 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in drug master SERVICE');
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
