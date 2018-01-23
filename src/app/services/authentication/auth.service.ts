import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { loginService } from './../loginService/login.service';



@Injectable()
export class AuthService {

    public getToken(): string {
        let authToken = '';
        if (localStorage.getItem('authToken')) {
            authToken = localStorage.getItem('authToken');
        }
        return authToken;
    }
    public removeToken() {
        localStorage.removeItem('authToken');
    }
    public isAuthenticated(): boolean {
        // get the token
        const token = this.getToken();
        return true;
        // return a boolean reflecting
        // whether or not the token is expired
        // return tokenNotExpired(null, token);
    }
}
