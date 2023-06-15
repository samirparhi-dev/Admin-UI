/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
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