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