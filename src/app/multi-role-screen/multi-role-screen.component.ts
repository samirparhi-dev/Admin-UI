import { Component, OnInit } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { loginService } from '../services/loginService/login.service';
import { Router } from "@angular/router";
import { HttpServices } from "../services/http-services/http_services.service";
import { PlatformLocation } from '@angular/common';

declare var jQuery: any;

@Component({
  selector: "app-multi-role-screen",
  templateUrl: "./multi-role-screen.component.html",
  styleUrls: ["./multi-role-screen.component.css"]
})
export class MultiRoleScreenComponent implements OnInit {
	id :any;
  role: any;
  constructor(
    public getCommonData: dataService,
    public router: Router, location: PlatformLocation,
    public HttpServices: HttpServices,
    public _loginService: loginService
  ) {
    location.onPopState((e: any) => {
      window.history.forward();

    })
    this.role = this.getCommonData.role;
	this.id= this.getCommonData.uid;
    console.log(this.role, "ROLE NAME AS OF NOW");
  }

  data: any;
  languageFilePath: any = "assets/languages.json";
  selectedlanguage: any = "";
  currentlanguageSet: any = {};
  language_change: any;

  ngOnInit() {
    this.language_change = "english";
    this.data = this.getCommonData.Userdata;
    // this.router.navigate(['/MultiRoleScreenComponent']);
    this.getLanguageObject(this.language_change);
  }

  // langauge POC stuff

  getLanguageObject(language) {
    this.selectedlanguage = language;
    console.log("language asked for is:", language);
    this.HttpServices
      .getData(this.languageFilePath)
      .subscribe(response => this.successhandeler(response, language), err => this.successhandeler(err, language));
  }

  successhandeler(response, language) {
    console.log(response, "language response");
    this.currentlanguageSet = response[language];

    // var languageEvent = jQuery.Event("changed_language", response[language]);
    // jQuery(window).trigger(languageEvent);
  }

  logOut() {
    

    this._loginService.removeTokenFromRedis()
      .subscribe(response => {
        if (response.response.toLowerCase() === 'success'.toLowerCase()) {
          console.log('successfully logged out from CRM and session ended both sides');
          localStorage.removeItem('authToken');
          this.router.navigate([""]);
        }
      }, err => {
        console.log(err, 'error while ending session both sides');

      });
  }
}
