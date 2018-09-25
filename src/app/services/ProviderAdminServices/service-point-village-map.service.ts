import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class ServicePointVillageMapService {


    updateServicePointVillageMapsURL: string;
    providerAdmin_Base_Url: any;
    common_Base_Url: any;

    getServicePointsURL: any;
    _getBranchListURL: any;

    // CRUD
    saveServicePointVillageMapsURL: any;
    getServicePointVillageMapsURL: any;
    updateServicePointVillageMapStatusURL: any;
    filterMappedVillages_url: any;


    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        this.getServicePointsURL = this.providerAdmin_Base_Url + 'servicePointMaster/get/servicePoints';
        this.getServicePointVillageMapsURL = this.providerAdmin_Base_Url + 'servicePointMaster/get/servicePointVillageMaps';
        this._getBranchListURL = this.common_Base_Url + 'location/village/';


        this.saveServicePointVillageMapsURL = this.providerAdmin_Base_Url + 'servicePointMaster/create/servicePointVillageMaps';
        this.updateServicePointVillageMapsURL = this.providerAdmin_Base_Url + '/servicePointMaster/edit/servicePointVillageMap';
        this.updateServicePointVillageMapStatusURL = this.providerAdmin_Base_Url + 'servicePointMaster/remove/servicePointVillageMap';
        this.filterMappedVillages_url = this.providerAdmin_Base_Url + '/servicePointMaster/get/unmappedvillages';
    }

    getServicePoints(data) {
        return this.http.post(this.getServicePointsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getServicePointVillageMaps(data) {
        return this.http.post(this.getServicePointVillageMapsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getBranches(blockId: number) {
        return this.http.get(this._getBranchListURL + blockId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    filterMappedVillages(unmappedVillage) {
        return this.httpIntercept
            .post(this.filterMappedVillages_url, unmappedVillage)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    saveServicePointVillageMaps(data) {
        return this.http.post(this.saveServicePointVillageMapsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateServicePointVillageMaps(data) {
        return this.http.post(this.updateServicePointVillageMapsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateServicePointVillageMapStatus(data) {
        return this.http.post(this.updateServicePointVillageMapStatusURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    handleState_n_parkingplaces(response: Response) {

        console.log(response.json().data, 'service point village file success response');
        let result = [];
        result = response.json().data.filter(function (item) {
            if (!item.deleted) {
                return item;
            }
        });
        return result;
    }

    handleSuccess(res: Response) {
        console.log(res.json().data, '--- in zone master SERVICE');
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
