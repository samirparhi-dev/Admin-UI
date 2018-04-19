import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class ItemService {
    adminBaseUrl: any;
    getItemsUrl: any;
    getItemsCategoryUrl: any;
    getDosageUrl: any;
    getAllPharmacologyCategoryUrl: any;
    getAllManufacturersUrl: any;
    getAllUomUrl: any;
    getAllRoutesUrl: any;
    createItemUrl: any;
    updateItemUrl: any;
    itemActivationDeactivationUrl: any;

    constructor(private http: SecurityInterceptedHttp,
        public basepaths: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.adminBaseUrl = this.basepaths.getAdminBaseUrl();
    };
    getAllItems(serviceMapID) {
        console.log("serviceMapID", serviceMapID);
        this.getItemsUrl = this.adminBaseUrl + 'getItemMaster/' + serviceMapID;        
        return this.http
            .get(this.getItemsUrl)
            .map(this.extractData)
            .catch(this.handleError)
    }
    getAllItemsCategory(serviceMapID, flag) {
        console.log("serviceMapID", serviceMapID, flag);       
        this.getItemsCategoryUrl = this.adminBaseUrl + 'getItemCategory/' + serviceMapID + '/' + flag;       
        return this.http
            .get(this.getItemsCategoryUrl)
            .map(this.extractData)
            .catch(this.handleError)
    }
    getAllDosages(serviceMapID) {       
        this.getDosageUrl = this.adminBaseUrl + 'getItemForm' + '/' + serviceMapID;
        return this.http
            .get(this.getDosageUrl)
            .map(this.extractData)
            .catch(this.handleError)

    }
    getAllPharmacologyCategory(serviceMapId) {
        console.log("pharmacology list", serviceMapId);
        this.getAllPharmacologyCategoryUrl = this.adminBaseUrl + 'getPharmacologicalcategory';
        return this.http
            .post(this.getAllPharmacologyCategoryUrl, { "providerServiceMapID": serviceMapId })
            .map(this.extractData)
            .catch(this.handleError)

    }
    getAllManufacturers(serviceMapId) {
        console.log("manufacturer list", serviceMapId);
        this.getAllManufacturersUrl = this.adminBaseUrl + 'getManufacturer';
        return this.http
            .post(this.getAllManufacturersUrl, { "providerServiceMapID": serviceMapId })
            .map(this.extractData)
            .catch(this.handleError)

    }
    getAllUoms(serviceMapId) {
        console.log("uom list", serviceMapId);

        this.getAllUomUrl = this.adminBaseUrl + 'getUom';
        return this.http
            .post(this.getAllUomUrl, { "providerServiceMapID": serviceMapId })
            .map(this.extractData)
            .catch(this.handleError)

    }
    getAllRoutes(serviceMapId) {
        console.log("route list", serviceMapId);
        this.getAllRoutesUrl = this.adminBaseUrl + 'getItemRoute' + '/' + serviceMapId;
        return this.http
            .get(this.getAllRoutesUrl)
            .map(this.extractData)
            .catch(this.handleError)

    }
    createItem(bufferItem) {
        this.createItemUrl = this.adminBaseUrl + 'createItemMaster';
        return this.http
            .post(this.createItemUrl, bufferItem)
            .map(this.extractData)
            .catch(this.handleError)
    }
    updateItem(updateItemObject) {
        this.updateItemUrl = this.adminBaseUrl + 'editItemMaster';
        return this.http
            .post(this.updateItemUrl, updateItemObject)
            .map(this.extractData)
            .catch(this.handleError)

    }
    itemActivationDeactivation(itemID, flag) {
        this.itemActivationDeactivationUrl = this.adminBaseUrl + 'blockItemMaster' + '/'+ itemID + '/' + flag;
        return this.http
            .get(this.itemActivationDeactivationUrl, )
            .map(this.extractData)
            .catch(this.handleError)

    }



    private extractCustomData(res: Response) {
    if (res.json().data) {
        console.log('Item Master Custom Service', res.json().data);
        return res.json().data;
    } else {
        return Observable.throw(res.json());
    }
}
    private extractData(res: Response) {
    if (res.json().data && res.json().statusCode == 200) {
        console.log('Item Master Service', res.json(), res.json().data);
        return res.json().data;
    } else {
        return Observable.throw(res.json());
    }
}
    private handleCustomError(error: Response | any) {
    return Observable.throw(error.json());
}
    private handleError(error: Response | any) {
    return Observable.throw(error.json());
}
}