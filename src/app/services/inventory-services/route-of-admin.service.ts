import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class RouteofAdminService {
    admin_Base_Url: any;
    common_Base_Url: any;
    get_itemroute_Url: any;
    save_itemRoute_Url: any;
    update_itemRoute_Url:any;
    delete_itemRoute_Url:any;

    constructor(private http: SecurityInterceptedHttp, public basepaths: ConfigService, private httpIntercept: InterceptedHttp) {
        this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();
        this.get_itemroute_Url = this.admin_Base_Url + 'getItemRoute';
         this.save_itemRoute_Url=this.admin_Base_Url + 'createRoutes';
         this.update_itemRoute_Url=this.admin_Base_Url + 'editRoute';
         this.delete_itemRoute_Url=this.admin_Base_Url + 'blockRoute';
    };

    getAllItemRoute(providerServiceMapID) {
        return this.http.get(this.get_itemroute_Url + '/' + providerServiceMapID 
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    
    saveItemRoute(obj) {
        return this.http.post(this.save_itemRoute_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    updateItemRoute(obj){
        return this.http.post(this.update_itemRoute_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    deleteItemRoute(obj){
        return this.http.post(this.delete_itemRoute_Url, obj
        ).map(this.handleSuccess)
            .catch(this.handleError);
    }
    handleError(error: Response | any) {
        return Observable.throw(error.json());
    }
    handleSuccess(res: Response) {
        console.log(res.json().data, 'Route of admin success response');
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    }
}