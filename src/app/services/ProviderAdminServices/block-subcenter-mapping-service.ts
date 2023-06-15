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
import { Injectable } from "@angular/core";
import { InterceptedHttp } from "app/http.interceptor";
import { SecurityInterceptedHttp } from "app/http.securityinterceptor";
import { Observable } from "rxjs";
import { ConfigService } from "../config/config.service";

@Injectable()
export class BlockSubcenterMappingService {
admin_Base_Url: any;
common_Base_Url: any;
getBlockSubcentreDataUploadUrl: any;

constructor(
    private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();

    this.getBlockSubcentreDataUploadUrl = this.admin_Base_Url + 'uptsu/saveFacility';
    }

uploadData(formData) {
    return this.http.post(this.getBlockSubcentreDataUploadUrl, formData)
    .map((res) => res.json());
    }
    
    handleError(error: Response | any) {
    return Observable.throw(error.json());
    }

    onSuccess(response: any) {
    if (response.json().data) {
        return response;
    }
}

}