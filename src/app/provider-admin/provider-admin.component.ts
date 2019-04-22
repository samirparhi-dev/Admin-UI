import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { HttpServices } from "../services/http-services/http_services.service";

@Component({
  selector: 'app-provider-admin',
  templateUrl: './provider-admin.component.html',
  styleUrls: ['./provider-admin.component.css']
})
export class ProviderAdminComponent implements OnInit {

  commitDetailsPath: any = "assets/git-version.json";
  version: any;
  commitDetails: any;

  constructor(public alertService:ConfirmationDialogsService,
    public HttpServices: HttpServices) { }

  ngOnInit() {
    this.getCommitDetails();
  }

  Activity_Number:any="0";

  show(value)
  {
    if(this.Activity_Number!="0" && this.Activity_Number!=value)
    {
      this.alertService.confirm('Confirm',"Do you really want to navigate? Any unsaved data would be lost").subscribe(response=>{
        if(response)
        {
          this.Activity_Number=value;
        }
      }); 
    }
    else
    {
      this.Activity_Number=value;
    }
  }
  getCommitDetails() {
    let Data = this.commitDetailsPath;
    this.HttpServices.getCommitDetails(this.commitDetailsPath).subscribe((res) => this.successhandeler1(res), err => this.successhandeler1(err));
  }
  successhandeler1(response) {
    this.commitDetails = response;
    this.version = this.commitDetails['version']
  }
}
