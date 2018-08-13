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

    // CRUD
    saveServicePointVillageMapsURL: any;
    getServicePointVillageMapsURL: any;
    updateServicePointVillageMapStatusURL: any;
    getServicePointsURL: any;
    getParkingPlacesURL: any;

    _getStateListBYServiceIDURL: any;
    _getStateListURL: any;
    _getServiceLineURL: any;
    _getDistrictListURL: any;
    _getTalukListURL: any;
    _getBlockListURL: any;
    _getBranchListURL: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        this.saveServicePointVillageMapsURL = this.providerAdmin_Base_Url + 'servicePointMaster/create/servicePointVillageMaps';
        this.getServicePointVillageMapsURL = this.providerAdmin_Base_Url + 'servicePointMaster/get/servicePointVillageMaps';
        this.updateServicePointVillageMapStatusURL = this.providerAdmin_Base_Url + 'servicePointMaster/remove/servicePointVillageMap';
        this.getServicePointsURL = this.providerAdmin_Base_Url + 'servicePointMaster/get/servicePoints';
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + 'parkingPlaceMaster/get/parkingPlaces';

        this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + 'm/location/getStatesByServiceID';
        this._getStateListURL = this.common_Base_Url + 'location/states/';
        this._getServiceLineURL = this.providerAdmin_Base_Url + 'm/role/service';
        this._getDistrictListURL = this.providerAdmin_Base_Url + "/zonemaster/getdistrictMappedtoZone";
        this._getTalukListURL = this.providerAdmin_Base_Url + "/parkingPlaceMaster/getSubDistrictByParkingPlaceID";
        this._getBlockListURL = this.common_Base_Url + 'location/districtblocks/';
        this._getBranchListURL = this.common_Base_Url + 'location/village/';
        this.updateServicePointVillageMapsURL = this.providerAdmin_Base_Url + '/servicePointMaster/edit/servicePointVillageMap';
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

    getServicePointVillageMaps(data) {
        return this.http.post(this.getServicePointVillageMapsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    updateServicePointVillageMapStatus(data) {
        return this.http.post(this.updateServicePointVillageMapStatusURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getServicePoints(data) {
        return this.http.post(this.getServicePointsURL, data)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }
    getParkingPlaces(data) {
        return this.http.post(this.getParkingPlacesURL, data)
            .map(this.handleState_n_parkingplaces)
            .catch(this.handleError);
    }


    getStatesByServiceID(serviceID, serviceProviderID) {
        return this.http.post(this._getStateListBYServiceIDURL,
            { 'serviceID': serviceID, 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getStates(serviceProviderID) {
        return this.http.post(this._getStateListURL,
            { 'serviceProviderID': serviceProviderID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getServices(serviceProviderID, stateID) {
        return this.http.post(this._getServiceLineURL, {
            'serviceProviderID': serviceProviderID,
            'stateID': stateID
        }).map(this.handleSuccess)
            .catch(this.handleError);
    }

    getDistricts(zoneID) {
        return this.http.post(this._getDistrictListURL, { 'zoneID': zoneID })
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getTaluks(parkingPlaceID: number) {
        return this.http.post(this._getTalukListURL, { 'parkingPlaceID': parkingPlaceID })
            .map(this.handleSuccess)
            .catch(this.handleError);

    }
    getSTBs(talukId: number) {
        return this.http.get(this._getBlockListURL + talukId)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getBranches(blockId: number) {
        return this.http.get(this._getBranchListURL + blockId)
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
