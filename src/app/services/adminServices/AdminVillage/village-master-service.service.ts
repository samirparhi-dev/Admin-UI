import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../../config/config.service';
import { InterceptedHttp } from './../../../http.interceptor';
import { SecurityInterceptedHttp } from './../../../http.securityinterceptor';


@Injectable()
export class VillageMasterService {


    admin_base_url: any;
    _commonBaseURL: any;
    getAllStatesOfProvider_Url: any;
    _getStateListURL: any;
    _getDistrictListURL: any;
    _getTalukListURL: any;
    _getBlockListURL: any;
    _getBranchListURL: any;
    storeVillagesURL: any;
    deleteVillageURL: any;
    updateVillageDataURL: any;

    constructor(private _http: SecurityInterceptedHttp,
        public configService: ConfigService,
        private httpInterceptor: InterceptedHttp) {

        this.admin_base_url = this.configService.getAdminBaseUrl();
        this._commonBaseURL = this.configService.getCommonBaseURL();
        this._getStateListURL = this._commonBaseURL + 'location/states/';
        this._getDistrictListURL = this._commonBaseURL + 'location/districts/';
        this._getTalukListURL = this._commonBaseURL + 'location/taluks/';
        this._getBlockListURL = this._commonBaseURL + 'location/districtblocks/';
        this._getBranchListURL = this.admin_base_url + 'villageMaster/get/Villages';
        this.storeVillagesURL = this.admin_base_url + 'villageMaster/save/VillageDetails';
        this.deleteVillageURL = this.admin_base_url + 'villageMaster/remove/village';
        this.updateVillageDataURL = this.admin_base_url + 'villageMaster/update/villageData';
    }

    getStates(countryId: number) {
        return this._http.get(this._getStateListURL + countryId)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getDistricts(stateId: number) {
        return this._http.get(this._getDistrictListURL + stateId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getTaluks(districtId: number) {
        return this._http.get(this._getTalukListURL + districtId)
            .map(this.handleSuccess)
            .catch(this.handleError);

    }

    getBranches(data) {
        return this._http.post(this._getBranchListURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    storeVillages(data) {
        return this._http.post(this.storeVillagesURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateVillageStatus(data) {
        return this._http.post(this.deleteVillageURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateVillageData(data) {
        return this._http.post(this.updateVillageDataURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
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
