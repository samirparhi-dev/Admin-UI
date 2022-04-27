import { Component, OnInit } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { loginService } from '../services/loginService/login.service';
import { Router } from "@angular/router";
import { HttpServices } from "../services/http-services/http_services.service";
import { PlatformLocation } from '@angular/common';
import { ConfigService } from "../services/config/config.service";
import { JsonpModule } from "@angular/http";
import { MdDialog } from '@angular/material';
import { ViewVersionDetailsComponent } from '../view-version-details/view-version-details.component';


declare var jQuery: any;

@Component({
  selector: "app-multi-role-screen",
  templateUrl: "./multi-role-screen.component.html",
  styleUrls: ["./multi-role-screen.component.css"]
})
export class MultiRoleScreenComponent implements OnInit {
  id: any;
  role: any;
  api_versionDetails: any;
  version: any;
  uiVersionDetails: any;

  constructor(
    public getCommonData: dataService,
    public router: Router, location: PlatformLocation,
    public HttpServices: HttpServices,
    public _loginService: loginService,
    public configService: ConfigService,
    private dialog: MdDialog) {
    location.onPopState((e: any) => {
      window.history.forward();

    })
    this.role = this.getCommonData.role;
    this.id = this.getCommonData.uid;
    console.log(this.role, "ROLE NAME AS OF NOW");
  }

  data: any;
  languageFilePath: any = "assets/languages.json";
  selectedlanguage: any = "";
  currentlanguageSet: any = {};
  language_change: any;
  license: any;
  commitDetailsPath: any = "assets/git-version.json";
  commitDetails: any;

  ngOnInit() {
    this.language_change = "english";
    this.data = this.getCommonData.Userdata;
    // this.router.navigate(['/MultiRoleScreenComponent']);
    this.getLanguageObject(this.language_change);
    this.getLicense();
    this.getCommitDetails();
  }
  getCommitDetails() {

    let Data = this.commitDetailsPath;
    this.HttpServices.getCommitDetails(this.commitDetailsPath).subscribe((res) => this.successhandeler1(res), err => this.successhandeler1(err));
  }
  // langauge POC stuff

  getLanguageObject(language) {
    this.selectedlanguage = language;
    console.log("language asked for is:", language);
    this.HttpServices
      .getData(this.languageFilePath)
      .subscribe(response => this.successhandeler(response, language), err => this.successhandeler(err, language));

  }

  successhandeler1(response) {
    this.commitDetails = response;
    this.uiVersionDetails = {
      'Version': this.commitDetails['version'],
      'Commit': this.commitDetails['commit']
    }
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
          sessionStorage.removeItem('authToken');
          this.router.navigate([""]);
        }
      }, err => {
        console.log(err, 'error while ending session both sides');

      });
  }
  getLicense() {
    let getPath = this.configService.getCommonBaseURL();
    this.license = getPath + "license.html";
  }
 
  viewVersionDetails() {
    this._loginService.getApiVersionDetails().subscribe((apiResponse) => {
      console.log("apiResponse", apiResponse);
      if (apiResponse.statusCode == 200) {
        let api_versionDetails = {
          'Version': apiResponse.data['git.build.version'],
          'Commit': apiResponse.data['git.commit.id']
        }
        if (api_versionDetails) {
          this.openVersionDialogComponent(api_versionDetails);
        }
      }
    }), (err) => {
      console.log(err, "error");
    }
  }
  openVersionDialogComponent(api_versionDetails) {
    this.dialog.open(ViewVersionDetailsComponent, {
      width: "80%",
      data: {
        uiversionDetails: this.uiVersionDetails,
        api_versionDetails: api_versionDetails
      }
    })
  }

}
