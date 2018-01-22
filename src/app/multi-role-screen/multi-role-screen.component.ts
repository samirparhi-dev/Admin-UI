import { Component, OnInit } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { Router } from "@angular/router";
import { HttpServices } from "../services/http-services/http_services.service";

declare var jQuery: any;

@Component({
  selector: "app-multi-role-screen",
  templateUrl: "./multi-role-screen.component.html",
  styleUrls: ["./multi-role-screen.component.css"]
})
export class MultiRoleScreenComponent implements OnInit {
  role: any;
  constructor(
    public getCommonData: dataService,
    public router: Router,
    public HttpServices: HttpServices
  ) {
    this.role = this.getCommonData.role;
    console.log(this.role,"ROLE NAME AS OF NOW");
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
      .subscribe(response => this.successhandeler(response, language));
  }

  successhandeler(response, language) {
    this.currentlanguageSet = response[language];

    // var languageEvent = jQuery.Event("changed_language", response[language]);
    // jQuery(window).trigger(languageEvent);
  }

  logOut() {
    this.router.navigate([""]);
    localStorage.removeItem('authToken');
  }
}
