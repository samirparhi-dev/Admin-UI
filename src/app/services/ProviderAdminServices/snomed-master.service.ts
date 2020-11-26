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
  getmasterList:any;
  saveMappingList:any;
  editMappingList:any;
  updateBlockStatus: any;
  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();
   
    this.getSnomedRecord=this.common_Base_Url+'snomed/getSnomedCTRecordList'
    this.getmasterList=this.providerAdmin_Base_Url+'snomed/fetchSnomedWorklist'
    this.saveMappingList=this.providerAdmin_Base_Url+'snomed/saveSnomedMappingData'
    this.editMappingList=this.providerAdmin_Base_Url+'snomed/editSnomedMappingData'
    this.updateBlockStatus=this.providerAdmin_Base_Url+'snomed/updateStatus'
  }

  
  searchSnomedRecord(searchTerm, pageNo) {
    const body = {
      "term": searchTerm,
      "pageNo":pageNo
    }
   
    return this.http.post(this.getSnomedRecord, body)
      .map(res => res.json());
  }

  getMasterList(masterType){
    const body = {
      "masterType": masterType
    }  
    return this.http.post(this.getmasterList, body)
      .map(res => res.json());
  }

  saveSctMapping(mapping){     
    return this.http.post(this.saveMappingList, mapping)
      .map(res => res.json());
  }
  
  editSctMapping(mapping){     
    return this.http.post(this.editMappingList, mapping)
      .map(res => res.json());
  }
 
  updateBlock(status){
    return this.http.post(this.updateBlockStatus, status)
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
