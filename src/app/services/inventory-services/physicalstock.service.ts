import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class PhysicalstockService {
    admin_Base_Url: any;
    common_Base_Url: any;
    getStore_Url:any;
    getSubStore_Url:any;
    getItem_Url:any;
    saveStock_Url:any;

    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();
        this.getStore_Url=this.admin_Base_Url + 'getMainFacility';
        this.getSubStore_Url=this.admin_Base_Url + 'getsubFacility';
        this.getItem_Url=this.admin_Base_Url + 'getSubStoreitem';
        this.saveStock_Url=this.admin_Base_Url + 'physicalStockEntry';
    }

    getMainStore(obj){
        return this.http.post(this.getStore_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    getSubStore(obj){
        return this.http.post(this.getSubStore_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    getItem(obj){
        return this.http.post(this.getItem_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    savePhysicalStock(obj){
        return this.http.post(this.saveStock_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }
    handleSuccess(res: Response) {
        console.log(res.json().data, 'Physical stock entry success response');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }

}
