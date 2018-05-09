import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class LocationService {
    _commonBaseURL = this._config.getCommonBaseURL();
    _getStateListURL = this._commonBaseURL + "location/states/";
    _getDistrictListURL = this._commonBaseURL + "location/districts/";
    _getTalukListURL = this._commonBaseURL + "location/taluks/";
    _getBlockListURL = this._commonBaseURL + "location/districtblocks/";
    _getBranchListURL = this._commonBaseURL + "location/village/";
    _getInstituteListURL = this._commonBaseURL + "institute/getInstitutesByLocation/";
    _getDesignationListURL = this._commonBaseURL + "institute/getDesignationsByInstitute/";
    _getDirectoriesListURL = this._commonBaseURL + "directory/getDirectory/";
    _getSubDirectoriesListURL = this._commonBaseURL + "directory/getSubDirectory/";
    //test = [];

    constructor(
        private _http: SecurityInterceptedHttp,
        private _config: ConfigService,
        private _httpInterceptor: InterceptedHttp

    ) { }
    getStates(countryId: number) {
        return this._http.get(this._getStateListURL + countryId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getDistricts(stateId: number) {
        return this._http.get(this._getDistrictListURL + stateId)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getTaluks(districtId: number) {
        return this._http.get(this._getTalukListURL + districtId)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getSTBs(talukId: number) {
        return this._http.get(this._getBlockListURL + talukId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getBranches(blockId: number) {
        return this._http.get(this._getBranchListURL + blockId)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getDirectory() {
        let data = {};
        return this._http.post(this._getDistrictListURL, data)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getSubDirectory(directoryId: number) {
        let data = {};
        data = { "instituteDirectoryID": directoryId };
        return this._http.post(this._getSubDirectoriesListURL, data)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getInstituteList(object: any) {
        let data = {
            "stateID": object.stateID,
            "districtID": object.districtID,
            "districtBranchMappingID": object.districtBranchMappingID
        };
        return this._http.post(this._getInstituteListURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    };

    private handleError(error: Response) {
        return Observable.throw(error);

    };
}
