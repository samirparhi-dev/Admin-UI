import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SnomedMasterService {

 
  providerAdmin_Base_Url: any;
  common_Base_Url: any;

 
  getSnomedRecord: any;
  // diagnosisSnomedCTRecordUrl: string;


  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();
   
    this.getSnomedRecord=this.common_Base_Url+'snomed/getSnomedCTRecordList'
    // this.diagnosisSnomedCTRecordUrl = `http://10.208.122.38:8080/tmapi-v1.0/snomed/getSnomedCTRecordList`;
  }

  
  searchSnomedRecord(searchTerm, pageNo) {
    const body = {
      "term": searchTerm,
      "pageNo":pageNo
    }
   
    return this.http.post(this.getSnomedRecord, body)
      .map(res => res.json());
  }

 
 

  

  handleSuccess(res: Response) {
    console.log(res.json(), 'calltype-subtype service file success response');
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
