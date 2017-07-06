import {Injectable} from '@angular/core';
import {Http, Response,Headers,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class StateServiceMapp{
    data1:any;
    
    test=[];
     headers = new Headers(
     {'Content-Type': 'application/json'}
    //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
    //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
    //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
    //  ,{'Access-Control-Allow-Methods': '*'}
    );
     options = new RequestOptions({ headers: this.headers });
    //  private _geturl:string="http://10.152.3.152:1040/user/iEMR/User/getData"
    //  private _saveurl:string="http://10.152.3.152:1040/adminAPI2/stateServiceMapping"
    private _saveurl:string="http://10.209.41.97:8080/stateServiceMapping"
    
    constructor(private _http:Http){}
    // getUsers(){
        
    //     return this._http.post(this._geturl,this.options)
    //     .map((response:Response)=> response.json());
        
    // }
    saveUser(data:any){

        console.log(data);
        //console.log(data2);
        return this._http.post(this._saveurl,data ,this.options)
        
        .map((response:Response)=> response.json());
        
    }
}


